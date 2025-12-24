
/* ===========================
   localStorage keys & helpers
   =========================== */
const LS = { USERS:'cq_users_v2', QUIZZES:'cq_quizzes_v2', SUBS:'cq_subs_v2', ACTIVE:'cq_active_v2', CUR:'cq_current_v2' };
const uid = ()=> 'id-'+Math.random().toString(36).slice(2,9);
const nowSec = ()=> Math.floor(Date.now()/1000);
const fmtTime = s => { if(s<0)s=0; const m=Math.floor(s/60).toString().padStart(2,'0'); const sec=(s%60).toString().padStart(2,'0'); return `${m}:${sec}`; };
const load = k => JSON.parse(localStorage.getItem(k) || 'null');
const save = (k,v) => localStorage.setItem(k, JSON.stringify(v));

if(!load(LS.USERS)) save(LS.USERS,[]);
if(!load(LS.QUIZZES)) save(LS.QUIZZES,[]);
if(!load(LS.SUBS)) save(LS.SUBS,[]);

/* App state */
let currentUser = load(LS.CUR) || null;
let PLAY = null; // active play state for student
let PLAY_INTERVAL = null;
let GLOBAL_INTERVAL = null;
let leaderAuto = null;

/* ===== Sidebar open/close logic ===== */
const mini = document.getElementById('sidebarMini');
const overlay = document.getElementById('sidebarOverlay');
const closeSidebarBtn = document.getElementById('closeSidebar');
mini.addEventListener('click', ()=> {
  // show overlay
  overlay.classList.add('visible');
  overlay.setAttribute('aria-hidden','false');
});
closeSidebarBtn.addEventListener('click', ()=> {
  overlay.classList.remove('visible');
  overlay.setAttribute('aria-hidden','true');
});
// also close overlay when clicking outside it
document.addEventListener('click', (e) => {
  if (!overlay.classList.contains('visible')) return;
  const inside = overlay.contains(e.target) || mini.contains(e.target);
  if (!inside) {
    overlay.classList.remove('visible');
    overlay.setAttribute('aria-hidden','true');
  }
});

/* ===== AUTH dynamic fields logic ===== */
function updateLoginFields(){
  const role = document.getElementById('loginRole').value;
  const extraWrap = document.getElementById('loginExtraWrap');
  const extraLabel = document.getElementById('loginExtraLabel');
  const extraInput = document.getElementById('loginExtra');
  if(role === 'student'){
    extraWrap.style.display = 'block';
    extraLabel.innerText = 'Enrollment No';
    extraInput.placeholder = 'Enrollment number';
  } else {
    extraWrap.style.display = 'block';
    extraLabel.innerText = 'Faculty ID';
    extraInput.placeholder = 'Faculty ID';
  }
}

function updateSignupFields(){
  const role = document.getElementById('signupRole').value;
  const wrap = document.getElementById('signupExtraWrap');
  const label = document.getElementById('signupExtraLabel');
  const input = document.getElementById('signupExtra');
  if(role === 'student'){
    wrap.style.display = 'block';
    label.innerText = 'Enrollment No';
    input.placeholder = 'Enrollment number (students)';
  } else {
    wrap.style.display = 'block';
    label.innerText = 'Faculty ID';
    input.placeholder = 'Faculty ID (faculty)';
  }
}

function showSignupSection(){ document.getElementById('signupName').focus(); }
function showLoginSection(){ document.getElementById('loginId').focus(); }

/* ===== AUTH actions ===== */
function doSignup(){
  const role = document.getElementById('signupRole').value;
  const name = document.getElementById('signupName').value.trim();
  const extra = document.getElementById('signupExtra').value.trim();
  const pass = document.getElementById('signupPass').value;
  if(!name || !pass) return alert('Name & password required');
  if(role==='student' && !extra) return alert('Enrollment required for students');
  if(role==='faculty' && !extra) return alert('Faculty ID required for faculty');
  const users = load(LS.USERS) || [];
  if(users.find(u => u.name === name || (u.enroll && u.enroll === extra) || (u.facId && u.facId === extra))) return alert('User exists');
  const user = { name, password: pass, role };
  if(role === 'student') user.enroll = extra;
  else user.facId = extra;
  users.push(user);
  save(LS.USERS, users);
  currentUser = { name, enroll: user.enroll, role };
  save(LS.CUR, currentUser);
  openApp();
}

function doLogin(){
  const role = document.getElementById('loginRole').value;
  const id = document.getElementById('loginId').value.trim();
  const extra = document.getElementById('loginExtra').value.trim();
  const pass = document.getElementById('loginPass').value;
  if(!id || !pass) return alert('Complete credentials');
  const users = load(LS.USERS) || [];
  let found = null;
  if(role === 'student'){
    found = users.find(u => u.role === 'student' && ((u.name === id) || (u.enroll === id) || (u.enroll === extra)) && u.password === pass);
  } else {
    found = users.find(u => u.role === 'faculty' && ((u.name === id) || (u.facId === id) || (u.facId === extra)) && u.password === pass);
  }
  if(!found) return alert('Invalid credentials');
  currentUser = { name: found.name, enroll: found.enroll, role: found.role };
  save(LS.CUR, currentUser);
  openApp();
}

/* Logout */
function logout(){
  if(!confirm('Logout?')) return;
  localStorage.removeItem(LS.CUR);
  currentUser = null;
  location.reload();
}

/* share link */
function copyShareLink(){ navigator.clipboard?.writeText(location.href).then(()=> alert('Link copied')); }
function simulateOpen(){ window.open(location.href,'_blank'); }

/* ===== OPEN APP AFTER LOGIN ===== */
function openApp(){
  document.getElementById('authOverlay').style.display='none';
  document.getElementById('appRoot').style.display='flex';
  // overlay sidebar profile mirrors
  document.getElementById('sbNameOverlay').innerText = currentUser.name;
  document.getElementById('sbRoleOverlay').innerText = currentUser.role;
  document.getElementById('sbAvatarOverlay').innerText = currentUser.name.charAt(0).toUpperCase();
  document.getElementById('welcome').innerText = `Welcome, ${currentUser.name}`;
  document.getElementById('profileName').innerText = currentUser.name;
  document.getElementById('profileRole').innerText = currentUser.role;
  document.getElementById('profileEnroll').innerText = currentUser.enroll || '-';
  setRoleUI();
  refreshAll();
  window.addEventListener('storage', storageHandler);
}

/* ===== Role UI toggles ===== */
function setRoleUI(){
  const role = currentUser.role;
  document.getElementById('nav_quiz_label').innerText = role === 'faculty' ? 'Create Quiz' : 'Take Quiz';
  document.getElementById('facultyCreate').style.display = role === 'faculty' ? 'block' : 'none';
  document.getElementById('studentList').style.display = role === 'student' ? 'block' : 'none';
  document.getElementById('btnPublishLive').style.display = role === 'faculty' ? 'inline-block' : 'none';
}

/* ===== Panels & core functionality (kept intact) ===== */
if(!load(LS.USERS)) save(LS.USERS,[]);
if(!load(LS.QUIZZES)) save(LS.QUIZZES,[]);
if(!load(LS.SUBS)) save(LS.SUBS,[]);

function showPanel(panel){
  // hide auth sidebar overlay (if open) when navigating
  overlay.classList.remove('visible');
  ['panel_dashboard','panel_profile','panel_quiz','panel_leader','panel_analytics'].forEach(id => document.getElementById(id).style.display='none');
  document.getElementById('panel_'+panel).style.display='block';
  // update active nav buttons inside overlay
  document.querySelectorAll('#navListOverlay .nav-btn').forEach(b => b.classList.remove('active'));
  const navBtn = document.getElementById('nav_'+panel);
  if(navBtn) navBtn.classList.add('active');
  document.getElementById('mainTitle').innerText = panel.charAt(0).toUpperCase()+panel.slice(1);
  if(panel==='quiz') loadQuizPanel();
  if(panel==='leader') { renderLeaderboard(); renderLeaderboardGraph(); startLeaderAuto(); }
  else stopLeaderAuto();
  if(panel==='analytics') renderAnalytics();
}

function updateStats(){
  const quizzes = load(LS.QUIZZES) || [];
  const subs = load(LS.SUBS) || [];
  document.getElementById('stat_quizzes').innerText = quizzes.length;
  document.getElementById('stat_submissions').innerText = subs.length;
}

function renderLastAttempt(){
  const subs = load(LS.SUBS) || [];
  if(!currentUser) return;
  const my = subs.filter(s=>s.studentEnroll === currentUser.enroll).sort((a,b)=>b.timestamp - a.timestamp)[0];
  const area = document.getElementById('lastAttemptArea');
  if(!my){ area.innerHTML = '<div class="muted">No attempts yet</div>'; return; }
  area.innerHTML = `<div style="font-weight:800">${my.quizTitle}</div><div class="small muted">Score: ${my.score}/${my.total} • ${my.timeTaken}s • ${new Date(my.timestamp*1000).toLocaleString()}</div>`;
  document.getElementById('quickStats').innerHTML = `Last: ${my.score}/${my.total}<br>${new Date(my.timestamp*1000).toLocaleString()}`;
}

/* Quiz creation */
function addQuestion(){
  const idx = document.querySelectorAll('.qb').length + 1;
  const container = document.getElementById('questionBuilder');
  const div = document.createElement('div'); div.className='qb card'; div.style.marginTop='8px';
  div.innerHTML = `
    <label>Question ${idx}</label>
    <input class="qb-text" placeholder="Question text">
    <input class="qb-opt" placeholder="Option A">
    <input class="qb-opt" placeholder="Option B">
    <input class="qb-opt" placeholder="Option C">
    <input class="qb-opt" placeholder="Option D">
    <label>Correct option (A/B/C/D)</label>
    <input class="qb-correct" placeholder="A">
    <div style="text-align:right;margin-top:8px"><button class="btn ghost" onclick="this.closest('.qb').remove()">Remove</button></div>
  `;
  container.appendChild(div);
}

function saveQuiz(){
  const title = document.getElementById('createTitle').value.trim();
  const duration = parseInt(document.getElementById('createDuration').value,10) || 300;
  if(!title) return alert('Enter title');
  const wrappers = Array.from(document.querySelectorAll('.qb'));
  if(!wrappers.length) return alert('Add questions');
  const questions = wrappers.map(w => {
    const text = w.querySelector('.qb-text').value.trim();
    const opts = Array.from(w.querySelectorAll('.qb-opt')).map(i=>i.value.trim());
    const correct = (w.querySelector('.qb-correct').value || 'A').toUpperCase();
    return {text,options:opts,correct};
  });
  for(const q of questions) if(!q.text || q.options.some(o=>!o)) return alert('Fill all fields');
  const quizzes = load(LS.QUIZZES) || [];
  const id = uid();
  quizzes.push({id,title,duration,questions,createdBy:currentUser.name,createdAt:nowSec(),published:false});
  save(LS.QUIZZES, quizzes);
  alert('Quiz saved');
  localStorage.setItem('cq_quizzes_updated_at', Date.now());
  loadQuizPanel();
  updateStats();
}

function saveAndPublish(){ saveQuiz(); publishLatest(); }
function publishLatest(){
  const quizzes = load(LS.QUIZZES) || [];
  const last = quizzes.slice().reverse().find(q=>q.createdBy === currentUser.name);
  if(!last) return alert('No quiz found');
  if(!confirm(`Publish "${last.title}" live for ${last.duration}s?`)) return;
  publishQuiz(last.id);
}

function publishQuiz(quizId){
  const quizzes = load(LS.QUIZZES) || [];
  const q = quizzes.find(x=>x.id===quizId);
  if(!q) return alert('Quiz not found');
  q.published = true;
  save(LS.QUIZZES, quizzes);
  const now = nowSec();
  const active = {quizId:q.id,startedAt:now,endsAt:now + q.duration,publishedBy:currentUser.name};
  save(LS.ACTIVE, active);
  localStorage.setItem('cq_active_updated_at', Date.now());
  alert('Published live');
  loadQuizPanel();
  updateStats();
}

function loadQuizPanel(){
  setRoleUI();
  const quizzes = load(LS.QUIZZES) || [];
  const myList = quizzes.filter(q => q.createdBy === currentUser.name);
  const savedArea = document.getElementById('savedQuizList');
  if(myList.length){
    let html = '<ul style="padding-left:16px">';
    myList.forEach(q => html += `<li style="margin-bottom:8px"><strong>${q.title}</strong> • ${q.questions.length} q • ${q.duration}s • ${q.published ? 'Published' : 'Draft'} <button class="btn ghost" onclick="publishQuiz('${q.id}')">Publish</button></li>`);
    html += '</ul>';
    savedArea.innerHTML = html;
  } else savedArea.innerHTML = '<div class="muted">No quizzes</div>';

  const available = quizzes.filter(q => q.published === true);
  const availArea = document.getElementById('availableQuizzes');
  if(available.length){
    let html = '<ul style="padding-left:16px">';
    available.forEach(q => html += `<li style="margin-bottom:8px"><strong>${q.title}</strong> • ${q.questions.length} q • ${q.duration}s • by ${q.createdBy} <button class="btn" onclick="joinQuiz('${q.id}')">Join</button></li>`);
    html += '</ul>';
    availArea.innerHTML = html;
  } else availArea.innerHTML = '<div class="muted">No published quizzes</div>';

  document.getElementById('btnPublishLive').style.display = currentUser.role === 'faculty' ? 'inline-block' : 'none';
  renderActiveQuizInfo();
}

function joinQuiz(quizId){ startPlay(quizId); }

function renderActiveQuizInfo(){
  const active = load(LS.ACTIVE);
  const area = document.getElementById('activeQuizArea');
  if(!active){ area.innerHTML = '<div class="muted">No live quiz</div>'; document.getElementById('liveBadge').style.display='none'; document.getElementById('globalTimer').style.display='none'; return; }
  const quizzes = load(LS.QUIZZES) || [];
  const q = quizzes.find(x=>x.id===active.quizId);
  if(!q){ area.innerHTML = '<div class="muted">No live quiz</div>'; return; }
  const left = Math.max(0, active.endsAt - nowSec());
  area.innerHTML = `<div style="font-weight:800">${q.title}</div><div class="small muted">by ${active.publishedBy} • ends in ${left}s</div><div style="margin-top:8px"><button class="btn" onclick="startPlay('${q.id}')">Join Live</button></div>`;
  document.getElementById('liveBadge').style.display='inline-block';
  document.getElementById('globalTimer').style.display='inline-block';
  updateGlobalTimer();
}

function updateGlobalTimer(){
  clearInterval(GLOBAL_INTERVAL);
  const active = load(LS.ACTIVE);
  if(!active){ document.getElementById('globalTimer').style.display='none'; return; }
  GLOBAL_INTERVAL = setInterval(()=>{
    const left = Math.max(0, active.endsAt - nowSec());
    document.getElementById('globalTimerText').innerText = fmtTime(left);
    if(left <= 0){ clearInterval(GLOBAL_INTERVAL); localStorage.removeItem(LS.ACTIVE); localStorage.setItem('cq_active_updated_at', Date.now()); renderActiveQuizInfo(); }
  },1000);
}

/* Play state */
function startPlay(quizId){
  const quizzes = load(LS.QUIZZES) || [];
  const q = quizzes.find(x=>x.id===quizId);
  if(!q) return alert('Quiz not found');
  PLAY = { quizId: q.id, quizTitle:q.title, questions:q.questions, answers:Array(q.questions.length).fill(null), index:0, remaining:q.duration, total:q.duration, startedAt:nowSec() };
  showPanel('quiz'); document.getElementById('facultyCreate').style.display='none'; document.getElementById('studentList').style.display='none'; document.getElementById('playArea').style.display='block';
  renderPlayQuestion(); startPlayTimer();
}

function renderPlayQuestion(){
  if(!PLAY) return;
  const idx = PLAY.index;
  const q = PLAY.questions[idx];
  document.getElementById('playTitle').innerText = PLAY.quizTitle;
  document.getElementById('playMeta').innerText = `Q${idx+1} / ${PLAY.questions.length}`;
  document.getElementById('questionIndex').innerText = `Q${idx+1} / ${PLAY.questions.length}`;
  document.getElementById('questionText').innerText = q.text;
  const opts = document.getElementById('questionOptions'); opts.innerHTML='';
  q.options.forEach((opt,i)=>{
    const label = String.fromCharCode(65+i);
    const div = document.createElement('div');
    div.className = 'option' + (PLAY.answers[idx] === label ? ' selected' : '');
    div.innerHTML = `<div>${label}. ${opt}</div><div class="small">${PLAY.answers[idx] === label ? 'Selected':''}</div>`;
    div.onclick = ()=> { PLAY.answers[idx] = label; renderPlayQuestion(); };
    opts.appendChild(div);
  });
  const percent = Math.round(((idx+1)/PLAY.questions.length)*100);
  document.getElementById('progressBar').style.width = percent + '%';
}

function nextQuestion(){ if(!PLAY) return; if(PLAY.index < PLAY.questions.length -1){ PLAY.index++; renderPlayQuestion(); } }
function prevQuestion(){ if(!PLAY) return; if(PLAY.index > 0){ PLAY.index--; renderPlayQuestion(); } }

function startPlayTimer(){
  if(!PLAY) return;
  clearInterval(PLAY_INTERVAL);
  document.getElementById('playTimerText').innerText = fmtTime(PLAY.remaining);
  PLAY_INTERVAL = setInterval(()=>{
    PLAY.remaining--;
    document.getElementById('playTimerText').innerText = fmtTime(PLAY.remaining);
    if(PLAY.remaining <= 0){ clearInterval(PLAY_INTERVAL); autoSubmit(); }
  },1000);
}

function autoSubmit(){ alert('Time up — auto-submitting'); finalizeAttempt(); }
function submitAttempt(){ if(!PLAY) return; if(!confirm('Submit now?')) return; finalizeAttempt(); }

function finalizeAttempt(){
  clearInterval(PLAY_INTERVAL);
  const qcount = PLAY.questions.length;
  let score = 0;
  PLAY.questions.forEach((qq,i)=> { if(PLAY.answers[i] === qq.correct) score++; });
  const timeTaken = PLAY.total - PLAY.remaining;
  const subs = load(LS.SUBS) || [];
  subs.push({ id:uid(), quizId:PLAY.quizId, quizTitle:PLAY.quizTitle, studentName:currentUser.name, studentEnroll:currentUser.enroll, answers:PLAY.answers, score, total:qcount, timeTaken, timestamp:nowSec() });
  save(LS.SUBS, subs);
  localStorage.setItem('cq_subs_updated_at', Date.now());
  // update leaderboard graph/table immediately
  renderLeaderboard();
  renderLeaderboardGraph();
  alert(`Submitted: ${score} / ${qcount}`);
  PLAY = null;
  showPanel('dashboard');
  refreshAll();
}

/* Leaderboard functions */
function populateLeaderSelect(){
  const sel = document.getElementById('leaderSelect');
  const quizzes = load(LS.QUIZZES) || [];
  sel.innerHTML = '<option value="__overall">Overall</option>';
  quizzes.forEach(q => sel.innerHTML += `<option value="${q.id}">${q.title}</option>`);
}

function renderLeaderboard(){
  populateLeaderSelect();
  const subs = load(LS.SUBS) || [];
  const sel = document.getElementById('leaderSelect').value;
  const table = document.getElementById('leaderTable'); table.innerHTML='';
  if(!subs.length) return table.innerHTML = '<tr><td colspan=5 class="muted">No submissions</td></tr>';
  if(sel === '__overall'){
    const agg = {};
    subs.forEach(s => {
      if(!agg[s.studentEnroll]) agg[s.studentEnroll] = {name:s.studentName,enroll:s.studentEnroll,total:0,time:0,last:s.timestamp};
      agg[s.studentEnroll].total += s.score;
      agg[s.studentEnroll].time += s.timeTaken;
      if(s.timestamp > agg[s.studentEnroll].last) agg[s.studentEnroll].last = s.timestamp;
    });
    const arr = Object.values(agg).sort((a,b)=> b.total - a.total || a.time - b.time);
    arr.forEach((r,i) => { table.innerHTML += `<tr><td>${i+1}</td><td>${r.name}</td><td>${r.total}</td><td>${r.time}</td><td class="small">${new Date(r.last*1000).toLocaleString()}</td></tr>`; });
  } else {
    const qsubs = subs.filter(s => s.quizId === sel).sort((a,b)=> b.score - a.score || a.timeTaken - b.timeTaken);
    if(!qsubs.length) return table.innerHTML = '<tr><td colspan=5 class="muted">No submissions for this quiz</td></tr>';
    qsubs.forEach((s,i) => table.innerHTML += `<tr><td>${i+1}</td><td>${s.studentName}</td><td>${s.score}/${s.total}</td><td>${s.timeTaken}s</td><td class="small">${new Date(s.timestamp*1000).toLocaleString()}</td></tr>`);
  }
}

/* Graph rendering for leaderboard (SVG bar chart) */
function renderLeaderboardGraph(){
  const svg = document.getElementById('leaderGraphSVG');
  svg.innerHTML = '';
  const subs = load(LS.SUBS) || [];
  if(!subs.length){
    // show empty state
    svg.innerHTML = `<g><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8">No submissions yet</text></g>`;
    return;
  }
  // aggregate totals per student (overall)
  const agg = {};
  subs.forEach(s => {
    if(!agg[s.studentEnroll]) agg[s.studentEnroll] = {name:s.studentName, total:0};
    agg[s.studentEnroll].total += s.score;
  });
  let arr = Object.values(agg).sort((a,b)=> b.total - a.total);
  // show top 6
  arr = arr.slice(0,6);
  const max = Math.max(...arr.map(a=>a.total), 1);
  // svg viewBox width 600 height 220
  const vw = 600, vh = 220;
  const gap = 12;
  const barW = (vw - (arr.length+1)*gap) / Math.max(1, arr.length);
  // draw bars and labels
  let x = gap;
  arr.forEach((item, idx) => {
    const h = Math.round((item.total / max) * (vh - 60)); // leave space for labels
    const y = vh - 40 - h;
    // bar
    const colorA = ['#60a5fa','#4f46e5','#06b6d4','#7c3aed','#0ea5a0','#ef4444'][idx % 6];
    svg.innerHTML += `<rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="6" fill="${colorA}"></rect>`;
    // value text above bar
    svg.innerHTML += `<text x="${x + barW/2}" y="${y - 6}" font-size="12" text-anchor="middle" fill="#0b1220">${item.total}</text>`;
    // name label
    const short = item.name.length > 10 ? item.name.slice(0,10)+'…' : item.name;
    svg.innerHTML += `<text x="${x + barW/2}" y="${vh - 18}" font-size="12" text-anchor="middle" fill="#475569">${short}</text>`;
    x += barW + gap;
  });
}

/* Auto refresh leaderboard while visible */
function startLeaderAuto(){ if(leaderAuto) clearInterval(leaderAuto); leaderAuto = setInterval(()=> { renderLeaderboard(); renderLeaderboardGraph(); }, 4000); }
function stopLeaderAuto(){ if(leaderAuto) clearInterval(leaderAuto); leaderAuto = null; }

/* Analytics */
function renderAnalytics(){
  const subs = load(LS.SUBS) || [];
  const my = subs.filter(s=> s.studentEnroll === currentUser.enroll).sort((a,b)=>b.timestamp-a.timestamp);
  const last30 = my.filter(s => s.timestamp >= nowSec() - 30*24*3600);
  let html = '<ul style="padding-left:16px">';
  last30.forEach(s => html += `<li>${s.quizTitle} — ${s.score}/${s.total} — ${new Date(s.timestamp*1000).toLocaleString()}</li>`);
  html += '</ul>';
  document.getElementById('analyticsAttempts').innerHTML = last30.length ? html : '<div class="muted">No attempts</div>';
  const correct = my.reduce((a,b)=> a + b.score, 0);
  const tot = my.reduce((a,b)=> a + b.total, 0);
  const acc = tot ? Math.round((correct/tot)*100) : 0;
  let streak = 0;
  const daySet = [...new Set(my.map(s => new Date(s.timestamp*1000).toDateString()))];
  let d = new Date(); d.setHours(0,0,0,0);
  while(daySet.includes(d.toDateString())){ streak++; d.setDate(d.getDate()-1); }
  document.getElementById('analyticsMetrics').innerHTML = `Accuracy: <strong>${acc}%</strong><br>Attempts: <strong>${my.length}</strong><br>Streak: <strong>${streak}</strong>`;
}

/* Storage handler to reflect cross-tab updates */
function storageHandler(e){
  if(!e.key) return;
  if(e.key === 'cq_active_updated_at') renderActiveQuizInfo();
  if(e.key === 'cq_subs_updated_at') { updateStats(); renderLastAttempt(); renderLeaderboard(); renderLeaderboardGraph(); renderActiveQuizInfo(); }
  if(e.key === 'cq_quizzes_updated_at') { loadQuizPanel(); updateStats(); renderActiveQuizInfo(); populateLeaderSelect(); }
}

/* Refresh helpers */
function refreshAll(){ updateStats(); renderLastAttempt(); loadQuizPanel(); renderLeaderboard(); renderLeaderboardGraph(); renderAnalytics(); }

/* Init on load */
(function init(){
  const saved = load(LS.CUR);
  updateLoginFields(); updateSignupFields();
  // start with overlay hidden and only mini icon visible (prevents overlapping)
  if(saved){ currentUser = saved; openApp(); } else { document.getElementById('appRoot').style.display='none'; document.getElementById('authOverlay').style.display='flex'; }
  updateStats(); renderActiveQuizInfo(); populateLeaderSelect(); renderLeaderboardGraph();
})();


