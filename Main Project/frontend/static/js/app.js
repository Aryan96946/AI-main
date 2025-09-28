// frontend/static/js/app.js
const API_BASE = '/api';
let state = {
  access_token: null,
  refresh_token: null,
  role: null,
  user_id: null
};

function $(s){ return document.querySelector(s) }
function showModal(html){
  $('#modal-body').innerHTML = html;
  $('#modal').style.display = 'flex';
}
function hideModal(){ $('#modal').style.display = 'none'; }

document.addEventListener('DOMContentLoaded', () => {
  $('#show-login').addEventListener('click', () => openLogin());
  $('#show-register').addEventListener('click', () => openRegister());
  $('#close-modal').addEventListener('click', hideModal);
  $('#logout').addEventListener('click', doLogout);
  loadState();
});

function openLogin(){
  showModal(`
    <h3>Login</h3>
    <div class="field"><label>Email</label><input id="login-email"/></div>
    <div class="field"><label>Password</label><input id="login-pass" type="password"/></div>
    <button id="login-btn">Login</button>
  `);
  $('#login-btn').addEventListener('click', async () => {
    const email = $('#login-email').value;
    const password = $('#login-pass').value;
    const res = await fetch(API_BASE + '/auth/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({email,password})
    });
    const j = await res.json();
    if (res.ok){
      state.access_token = j.access_token;
      state.refresh_token = j.refresh_token;
      state.role = j.role;
      state.user_id = j.user_id;
      saveState();
      hideModal();
      renderDashboard();
    } else {
      alert(j.msg || JSON.stringify(j));
    }
  });
}

function openRegister(){
  showModal(`
    <h3>Register</h3>
    <div class="field"><label>Email</label><input id="reg-email"/></div>
    <div class="field"><label>Password</label><input id="reg-pass" type="password"/></div>
    <div class="field"><label>Role</label>
      <select id="reg-role"><option value="student">student</option><option value="counselor">counselor</option></select>
    </div>
    <button id="reg-btn">Register</button>
  `);
  $('#reg-btn').addEventListener('click', async () => {
    const email = $('#reg-email').value;
    const password = $('#reg-pass').value;
    const role = $('#reg-role').value;
    const res = await fetch(API_BASE + '/auth/register', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({email,password,role})
    });
    const j = await res.json();
    if (res.ok){
      alert('Registered. You can now login.');
      hideModal();
    } else {
      alert(j.msg || JSON.stringify(j));
    }
  });
}

function doLogout(){
  state = {access_token:null, refresh_token:null, role:null, user_id:null};
  saveState();
  renderLoggedOut();
}

function saveState(){
  localStorage.setItem('ai_dropout_state', JSON.stringify(state));
  renderLoggedIn();
}
function loadState(){
  const s = localStorage.getItem('ai_dropout_state');
  if (s) state = JSON.parse(s);
  if (state.access_token) renderLoggedIn(); else renderLoggedOut();
}

function renderLoggedIn(){
  $('#show-login').style.display = 'none';
  $('#show-register').style.display = 'none';
  $('#logout').style.display = 'inline-block';
  $('#dashboard').style.display = 'block';
  renderDashboard();
}

function renderLoggedOut(){
  $('#show-login').style.display = 'inline-block';
  $('#show-register').style.display = 'inline-block';
  $('#logout').style.display = 'none';
  $('#dashboard').style.display = 'none';
}

async function renderDashboard(){
  $('#role-area').innerHTML = '<div class="card"><strong>Loading...</strong></div>';
  const r = state.role;
  if (r === 'admin') return renderAdmin();
  if (r === 'counselor') return renderCounselor();
  if (r === 'student') return renderStudent();
  $('#role-area').innerHTML = '<div class="card">Unknown role</div>';
}

async function renderAdmin(){
  $('#dash-title').textContent = 'Admin Dashboard';
  try {
    const res = await fetch(API_BASE + '/admin/users', { headers: authHeader() });
    const users = await res.json();
    $('#role-area').innerHTML = `<div class="card"><h3>Users</h3>${users.map(u => `<div>${u.email} — ${u.role}</div>`).join('')}</div>`;
  } catch (e){
    $('#role-area').innerHTML = `<div class="card">Error loading: ${e}</div>`;
  }
}

async function renderCounselor(){
  $('#dash-title').textContent = 'Counselor Dashboard';
  try {
    let html = '<div class="card"><h3>High risk students</h3><div id="high-risk-list">Loading...</div></div>';
    html += `<div class="card"><h3>Create Counseling Note</h3>
      <div class="field"><label>Student ID</label><input id="note-student-id"/></div>
      <div class="field"><label>Notes</label><textarea id="note-text"></textarea></div>
      <button id="create-note">Save Note</button></div>`;
    $('#role-area').innerHTML = html;

    const hr = await fetch(API_BASE + '/counsel/high-risk', { headers: authHeader() });
    const arr = await hr.json();
    $('#high-risk-list').innerHTML = arr.length ? arr.map(s => `<div>${s.student_id} — ${s.student_name} — ${Number(s.risk_score).toFixed(2)}</div>`).join('') : '<div>None</div>';

    $('#create-note').addEventListener('click', async () => {
      const student_id = Number($('#note-student-id').value);
      const notes = $('#note-text').value;
      const res = await fetch(API_BASE + '/counsel/session', {
        method: 'POST',
        headers: {...authHeader(),'Content-Type':'application/json'},
        body: JSON.stringify({student_id, notes})
      });
      const j = await res.json();
      if (res.ok) { alert('Saved'); } else { alert(j.msg || JSON.stringify(j)); }
    });
  } catch (e){
    $('#role-area').innerHTML = `<div class="card">Error: ${e}</div>`;
  }
}

async function renderStudent(){
  $('#dash-title').textContent = 'Student Dashboard';
  $('#role-area').innerHTML = `<div class="card"><h3>Your Profile</h3><div id="profile">Loading...</div></div>`;
  // simple fetch to list students (admin endpoint is restricted so this is lightweight)
  // In real app we would have /api/student/me endpoint
  $('#profile').innerHTML = `<div class="small">Student panel - contact counselor for risk details.</div>`;
}

function authHeader(){
  return state.access_token ? {'Authorization': 'Bearer ' + state.access_token} : {};
}
