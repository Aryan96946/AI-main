const apiBase = "/api";

function el(tag, attrs={}, children=[]){
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k === "class") e.className = v;
    else if(k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k,v);
  })
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if(typeof c === "string") e.appendChild(document.createTextNode(c));
    else if(c) e.appendChild(c);
  })
  return e;
}

const authPanel = document.getElementById("auth-panel");
document.getElementById("btn-show-login").onclick = ()=>renderLogin();
document.getElementById("btn-show-register").onclick = ()=>renderRegister();

let token = localStorage.getItem("token") || null;
let currentUser = JSON.parse(localStorage.getItem("user")||"null");

function setSession(t,u){
  token = t; currentUser = u;
  if(t){ localStorage.setItem("token", t); localStorage.setItem("user", JSON.stringify(u)); }
  else { localStorage.removeItem("token"); localStorage.removeItem("user"); }
  renderDashboard();
}

function api(path, method="GET", body=null){
  const opts = {method, headers: {}}
  if(token) opts.headers["Authorization"] = "Bearer " + token;
  if(body){ opts.headers["Content-Type"]="application/json"; opts.body = JSON.stringify(body);}
  return fetch(apiBase + path, opts).then(r=>r.json().then(j=>({ok:r.ok, status:r.status, body:j})));
}

function renderLogin(){
  authPanel.innerHTML = "";
  const form = el("div", {class:"form"});
  form.appendChild(el("div",{class:"label"},"Login"));
  const email = el("input",{class:"input", placeholder:"Email", id:"email"});
  const pass = el("input",{class:"input", placeholder:"Password", type:"password", id:"pass"});
  const btn = el("button",{class:"btn primary", onclick: async ()=>{
    const res = await api("/auth/login","POST",{email:email.value, password:pass.value});
    if(!res.ok){ alert(res.body.error || JSON.stringify(res.body)); return; }
    setSession(res.body.access_token, res.body.user);
  }},"Sign in");
  form.appendChild(email); form.appendChild(pass); form.appendChild(btn);
  authPanel.appendChild(form);
}

function renderRegister(){
  authPanel.innerHTML = "";
  const form = el("div",{class:"form"});
  form.appendChild(el("div",{class:"label"},"Register"));
  const name = el("input",{class:"input", placeholder:"Full name"});
  const email = el("input",{class:"input", placeholder:"Email"});
  const pass = el("input",{class:"input", placeholder:"Password", type:"password"});
  const role = el("select",{class:"input"},[
    el("option",{value:"student"},"Student"),
    el("option",{value:"teacher"},"Teacher"),
    el("option",{value:"admin"},"Admin")
  ]);
  const btn = el("button",{class:"btn primary", onclick: async ()=>{
    const payload = {fullname:name.value, email:email.value, password:pass.value, role:role.value};
    const r = await api("/auth/register","POST",payload);
    if(!r.ok){ alert(JSON.stringify(r.body)); return; }
    alert("Registered ✔ Please login");
    renderLogin();
  }},"Create account");
  form.appendChild(name); form.appendChild(email); form.appendChild(pass); form.appendChild(role); form.appendChild(btn);
  authPanel.appendChild(form);
}

function renderDashboard(){
  authPanel.innerHTML = "";
  if(!token){
    renderLogin();
    return;
  }
  // Simple dashboard: prediction form for students, teacher functions
  const wrap = el("div");
  const hdr = el("div",{class:"card-compact"},[
    el("div",{},[`Welcome, ${currentUser.fullname || currentUser.email}`]),
    el("div",{style:"margin-left:auto"},[
      el("button",{class:"btn", onclick: ()=>{ setSession(null,null); } },"Sign out")
    ])
  ]);
  wrap.appendChild(hdr);

  // Prediction form
  const predictCard = el("div",{class:"card", style:"margin-top:14px"},[
    el("h3",{},"Dropout Prediction"),
    el("div",{class:"small"},"Enter metrics to get dropout probability"),
  ]);
  const attendance = el("input",{class:"input", placeholder:"Attendance % (e.g. 78)"});
  const gpa = el("input",{class:"input", placeholder:"GPA (e.g. 2.8)"});
  const assignments = el("input",{class:"input", placeholder:"Assignments completed (e.g. 6)"});
  const warnings = el("input",{class:"input", placeholder:"Warnings (e.g. 1)"});
  const age = el("input",{class:"input", placeholder:"Age (e.g. 19)"});
  const runBtn = el("button",{class:"btn primary", onclick: async ()=>{
    const payload = {
      attendance: attendance.value,
      gpa: gpa.value,
      assignments_completed: assignments.value,
      warnings: warnings.value,
      age: age.value,
      student_id: currentUser.id
    };
    const r = await api("/predict/dropout","POST", payload);
    if(!r.ok){ alert(JSON.stringify(r.body)); return; }
    const p = r.body.probability;
    const advice = r.body.advice;
    const elres = el("div",{class:"alert " + (p>0.7 ? "result-high" : (p>0.4?"result-med":"result-low"))},
      `Risk: ${(p*100).toFixed(1)}% — ${advice}`);
    predictCard.appendChild(elres);
  }},"Predict");

  predictCard.appendChild(attendance); predictCard.appendChild(gpa); predictCard.appendChild(assignments);
  predictCard.appendChild(warnings); predictCard.appendChild(age); predictCard.appendChild(runBtn);

  wrap.appendChild(predictCard);

  // If teacher or admin, quick counseling note UI
  if(currentUser.role === "teacher" || currentUser.role === "admin"){
    const counsel = el("div",{class:"card", style:"margin-top:12px"},[
      el("h3",{},"Create Counseling Note"),
    ]);
    const sid = el("input",{class:"input", placeholder:"Student ID (number)"});
    const notes = el("textarea",{class:"input", placeholder:"Notes", rows:4});
    const saveBtn = el("button",{class:"btn primary", onclick: async ()=>{
      const payload = {student_id: parseInt(sid.value), notes: notes.value};
      const r = await api("/counsel/session","POST", payload);
      if(!r.ok){ alert(JSON.stringify(r.body)); return; }
      alert("Saved counseling note.");
    }},"Save note");
    counsel.appendChild(sid); counsel.appendChild(notes); counsel.appendChild(saveBtn);
    wrap.appendChild(counsel);
  }

  // Admin section: list users
  if(currentUser.role === "admin"){
    const adminCard = el("div",{class:"card", style:"margin-top:12px"},[
      el("h3",{},"Admin: Users")
    ]);
    const loadBtn = el("button",{class:"btn", onclick: async ()=>{
      const r = await api("/admin/users");
      if(!r.ok){ alert(JSON.stringify(r.body)); return; }
      const list = r.body;
      const ul = el("div");
      list.forEach(u=>{
        const row = el("div",{style:"display:flex;align-items:center;gap:8px;padding:6px;border-bottom:1px solid rgba(255,255,255,0.03)"},
          [el("div",{},`#${u.id} ${u.fullname || ""} (${u.email}) - ${u.role}`),
           el("button",{class:"btn", onclick: async ()=>{
             const newRole = prompt("Promote to role (admin/teacher/student):", u.role);
             if(!newRole) return;
             const res = await api("/admin/user/"+u.id+"/promote","POST",{role:newRole});
             if(!res.ok) alert(JSON.stringify(res.body)); else alert("Updated");
           }},"Change role")
          ]);
        ul.appendChild(row);
      });
      adminCard.appendChild(ul);
    }},"Load users");
    adminCard.appendChild(loadBtn);
    wrap.appendChild(adminCard);
  }

  authPanel.appendChild(wrap);
}

window.addEventListener("load", ()=>{
  if(token) renderDashboard();
  else renderLogin();
});
