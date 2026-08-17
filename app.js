const $ = (s)=>document.querySelector(s);
const app = document.getElementById('app');

const TRACKS = [
  ['Math','Practical algebra, functions, geometry, statistics'],
  ['Science','Physics, chemistry, biology, astronomy'],
  ['History','Civilizations through the modern world'],
  ['Geography','Physical geography, countries, geopolitics'],
  ['Economics','Markets, money, finance, accounting'],
  ['Government','Civics, law, institutions'],
  ['Computing','Hardware, internet, programming, AI'],
  ['Reasoning','Logic, evidence, probability, scientific method'],
  ['Business','Management, leadership, project work'],
  ['HVAC','Thermodynamics, refrigeration, airflow, controls'],
  ['Philosophy','Epistemology, ethics, ideas'],
  ['Psychology','Memory, behavior, decision-making']
];

const CURRICULUM = [
  {id:'r1',track:'Reasoning',title:'How We Know Things',minutes:25,level:1,type:'Core',content:`<h3>Claims, evidence, and confidence</h3><p>Knowledge starts with a claim: something that could be true or false. Evidence changes how confident we should be in that claim. Strong reasoning does not demand certainty; it asks whether the available evidence justifies the level of confidence.</p><h3>Three questions</h3><ul><li>What exactly is the claim?</li><li>What evidence would increase or decrease confidence?</li><li>What alternative explanations could fit the same observations?</li></ul><p>A good thinker can say “I don't know yet” while still comparing which explanation is better supported.</p>`},
  {id:'m1',track:'Math',title:'Practical Algebra Foundations',minutes:30,level:1,type:'Core',content:`<h3>Variables are placeholders</h3><p>Algebra is a way to represent unknown quantities and relationships. The goal is not symbolic manipulation for its own sake; it is to model real situations.</p><p>If <b>3x + 7 = 25</b>, subtract 7 from both sides, then divide by 3. The same operation must be applied to both sides to preserve equality.</p><h3>Practical use</h3><p>Pricing, airflow equations, project budgets, electrical relationships, and financial models all use the same idea: isolate the quantity you need.</p>`},
  {id:'s1',track:'Science',title:'Matter, Atoms, and Elements',minutes:30,level:1,type:'Core',content:`<h3>What matter is made of</h3><p>Ordinary matter is built from atoms. An element is defined by the number of protons in its atoms. Hydrogen has 1 proton, carbon has 6, oxygen has 8.</p><p>Chemical reactions mostly rearrange electrons and bonds between atoms. Nuclear reactions can change atomic nuclei and therefore can transform one element into another.</p>`},
  {id:'b1',track:'Science',title:'The Cell: Basic Unit of Life',minutes:25,level:1,type:'Core',content:`<h3>Cells</h3><p>A cell is the smallest structural unit that can carry out the basic processes associated with life. Cells contain organized machinery that uses energy, maintains internal conditions, processes information, and reproduces.</p><p>DNA stores genetic information. Genes are sections of DNA. Many genes contain instructions used to make proteins, which perform much of the cell's structure and work.</p>`},
  {id:'h1',track:'History',title:'Why Civilizations Formed',minutes:25,level:1,type:'Core',content:`<h3>From mobile groups to cities</h3><p>Agriculture allowed some populations to produce food surpluses. Surplus supported specialization: builders, soldiers, administrators, priests, merchants, and craftspeople. Rivers supplied water, transport routes, fertile soils, and trade corridors.</p><p>Early states emerged where populations, resources, authority, and infrastructure became concentrated.</p>`},
  {id:'g1',track:'Geography',title:'Build a Mental Map of Earth',minutes:20,level:1,type:'Core',content:`<h3>Start with structure</h3><p>The seven-continent model commonly used in the United States is North America, South America, Europe, Africa, Asia, Australia, and Antarctica.</p><p>Geography is more than memorizing countries. Mountains, rivers, climate, ports, resources, and distance influence trade, defense, settlement, and political power.</p>`},
  {id:'c1',track:'Computing',title:'What a Computer Actually Does',minutes:30,level:1,type:'Core',content:`<h3>Four basic roles</h3><ul><li><b>CPU:</b> executes instructions.</li><li><b>RAM:</b> temporary working memory.</li><li><b>Storage:</b> keeps data when power is off.</li><li><b>Software:</b> instructions and data that tell hardware what to do.</li></ul><p>Modern computers perform enormous numbers of simple operations very quickly. Complex behavior emerges from layers of instructions, abstractions, and networks.</p>`},
  {id:'e1',track:'Economics',title:'Scarcity, Incentives, and Markets',minutes:25,level:1,type:'Core',content:`<h3>Scarcity</h3><p>Resources are limited while wants are not. Economics studies how people and institutions make choices under those constraints.</p><p>Prices help coordinate decentralized decisions. When demand rises while supply is fixed, upward price pressure usually appears because buyers compete for limited output.</p>`},
  {id:'hv1',track:'HVAC',title:'Heat vs Temperature',minutes:30,level:1,type:'Depth',content:`<h3>Foundation for HVAC engineering</h3><p><b>Temperature</b> describes the thermal state of matter. <b>Heat</b> is energy transferred because of a temperature difference.</p><p>HVAC systems do not “create cold.” They move heat. Refrigeration, airflow, psychrometrics, and building loads all build on this distinction.</p>`},
  {id:'biz1',track:'Business',title:'Projects: Scope, Time, Cost',minutes:25,level:1,type:'Depth',content:`<h3>The project triangle</h3><p>Projects are constrained by scope, time, cost, quality, resources, and risk. Changing one constraint usually affects others.</p><p>Strong project management makes tradeoffs explicit rather than pretending every objective can be maximized simultaneously.</p>`}
];

const QUIZZES = {
  r1:[['Which is strongest evidence for a causal claim?',['A single anecdote','A controlled experiment with good methodology','A popular opinion'],1],['If two variables move together, that means...',['One definitely causes the other','They are correlated; causation still needs evidence','The data is useless'],1],['A rational response to limited evidence can be...',['Certainty','Calibrated confidence','Ignoring alternatives'],1]],
  m1:[['Solve 4x - 8 = 20',['x=3','x=7','x=12'],1],['Why perform the same operation on both sides?',['To preserve equality','To make numbers smaller','Because variables require it'],0]],
  s1:[['What defines an element?',['Number of protons','Weight','Number of molecules'],0],['Chemical reactions usually...',['Rearrange atoms and electron bonds','Destroy matter','Change every nucleus'],0]],
  b1:[['A gene is best described as...',['A type of protein','A section of DNA','A whole cell'],1],['Cells are...',['The basic structural units of life','Only found in animals','Microscopic organisms inside us'],0]],
  h1:[['Why did rivers matter to early civilizations?',['Water, fertile land, transport and trade','They prevented farming','Only religious reasons'],0]],
  g1:[['Which is a continent?',['Middle East','Australia','Greenland'],1]],
  c1:[['What does a CPU primarily do?',['Store files forever','Execute instructions','Provide internet service'],1],['RAM is primarily...',['Temporary working memory','Permanent storage','A programming language'],0]],
  e1:[['If demand rises and supply stays fixed, price usually...',['Falls','Rises','Must stay constant'],1]],
  hv1:[['HVAC systems fundamentally...',['Create cold','Move heat','Remove all humidity'],1]],
  biz1:[['If scope grows but time and resources do not, what usually happens?',['No effect','Pressure on cost/quality/schedule','The project automatically speeds up'],1]]
};

function seedUser(name='Tyler'){
  return {name, minutesPerDay:30, daysPerWeek:6, interests:['Science','HVAC','Business','Economics'], completed:{}, mastery:{Reasoning:2,Math:1.5,Science:1,History:.8,Geography:.5,Economics:1.5,Government:.8,Computing:.6,Business:1.2,HVAC:.2,Philosophy:.5,Psychology:1}, totalMinutes:0, reviewsDue:3, createdAt:Date.now()};
}
function db(){return JSON.parse(localStorage.getItem('atlas_db')||'{}')}
function saveDB(v){localStorage.setItem('atlas_db',JSON.stringify(v))}
function current(){return localStorage.getItem('atlas_current')}
function setCurrent(id){localStorage.setItem('atlas_current',id)}
function getUser(){const d=db(),id=current();return d[id]}
function updateUser(fn){const d=db(),id=current(); if(!d[id])return; d[id]=fn(d[id])||d[id];saveDB(d)}

function forecast(u){
  const weekly=(u.minutesPerDay*u.daysPerWeek)/60;
  const yearly=weekly*52;
  const coreHours=320; // estimated broad competency core
  const advancedHours=720;
  return {weekly,yearly,coreYears:coreHours/Math.max(yearly,1),advancedYears:advancedHours/Math.max(yearly,1)};
}
function yearsLabel(y){if(y<1)return `${Math.round(y*12)} mo`;return `${y.toFixed(1)} yr`}
function overall(u){const vals=Object.values(u.mastery||{});return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0}
function nextLessons(u){return CURRICULUM.filter(x=>!u.completed[x.id]).slice(0,4)}

function layout(content,tab='home'){
  const u=getUser();
  app.innerHTML=`<div class="shell"><div class="top"><div class="brand"><div class="logo">A</div><div><h1>Atlas Learning</h1><p>Adaptive general education</p></div></div><div class="profile-chip"><div class="avatar">${u.name[0].toUpperCase()}</div><button class="btn small ghost" onclick="route('settings')">${u.name}</button></div></div>${content}</div><div class="nav"><div class="nav-inner"><button class="${tab==='home'?'active':''}" onclick="route('home')">Today</button><button class="${tab==='map'?'active':''}" onclick="route('map')">Knowledge</button><button class="${tab==='curriculum'?'active':''}" onclick="route('curriculum')">Curriculum</button><button class="${tab==='settings'?'active':''}" onclick="route('settings')">Settings</button></div></div>`;
}

function renderLogin(){
  const d=db(); const profiles=Object.entries(d);
  app.innerHTML=`<div class="shell login"><div class="brand" style="margin-bottom:16px"><div class="logo">A</div><div><h1>Atlas Learning</h1><p>Learn broadly. Go deeper where it matters.</p></div></div><div class="card"><h2>Choose a profile</h2><p class="muted">This MVP stores profiles on this device. Cloud accounts can replace this later without changing the curriculum model.</p><div class="stack">${profiles.map(([id,u])=>`<button class="btn" onclick="login('${id}')">Continue as ${u.name}</button>`).join('')||''}<div class="field"><label>Create profile</label><input id="newName" placeholder="Name" /></div><button class="btn primary" onclick="createProfile()">Create profile</button></div></div></div>`;
}
window.login=(id)=>{setCurrent(id);route('home')};
window.createProfile=()=>{const name=($('#newName').value||'Learner').trim();const d=db();const id='u_'+Date.now();d[id]=seedUser(name);saveDB(d);setCurrent(id);route('home')};

function home(){
 const u=getUser(), f=forecast(u), lessons=nextLessons(u), pct=Math.min(100,Math.round(overall(u)/5*100));
 layout(`<div class="grid"><div class="stack"><div class="card hero"><div class="eyebrow">Today's plan</div><h2>${u.minutesPerDay} minutes, built around your actual pace.</h2><p class="muted">Your curriculum adapts to time available, performance, and retention. Extra study accelerates the forecast; busy weeks simply move it back.</p><div class="row"><button class="btn primary" onclick="startLesson('${lessons[0]?.id||CURRICULUM[0].id}')">Start today's lesson</button><button class="btn" onclick="route('curriculum')">Browse curriculum</button></div><div class="kpis"><div class="kpi"><strong>${u.totalMinutes}</strong><span>minutes learned</span></div><div class="kpi"><strong>${u.reviewsDue}</strong><span>reviews due</span></div><div class="kpi"><strong>${pct}%</strong><span>knowledge-map progress</span></div><div class="kpi"><strong>${f.weekly.toFixed(1)}h</strong><span>weekly capacity</span></div></div></div><div class="card"><h3>Today's adaptive session</h3><div class="session">${lessons.slice(0,3).map((x,i)=>`<div class="session-item"><div><b>${x.title}</b><div class="mini muted">${x.track} · ${i===0?Math.min(x.minutes,u.minutesPerDay):'Optional'} min</div></div><span class="tag">${x.type}</span></div>`).join('')}</div></div><div class="card"><h3>Priority depth tracks</h3><p class="muted">These receive more project work and repeated application without replacing broad general education.</p><div class="row"><span class="tag">Science</span><span class="tag">HVAC Engineering</span><span class="tag">Business & Leadership</span><span class="tag">Accounting & Economics</span></div></div></div><div class="stack"><div class="card"><div class="eyebrow">Forecast</div><h3>At your current pace</h3><div class="track"><div class="track-head"><b>Broad working competence</b><span>${yearsLabel(f.coreYears)}</span></div><div class="progress"><i style="width:${Math.min(100,pct)}%"></i></div></div><div class="track"><div class="track-head"><b>Broad + meaningful depth</b><span>${yearsLabel(f.advancedYears)}</span></div><div class="progress"><i style="width:${Math.min(100,pct*.55)}%"></i></div></div><p class="footer-note">Forecasts use estimated deliberate-learning hours and update with actual mastery data.</p></div><div class="card"><h3>How this app measures progress</h3><p class="muted mini">Study time alone is not mastery. Progress combines completed work, quiz performance, delayed review, and concept mastery.</p><div class="notice">Goal: Level 3–4 across a wide knowledge map, with Level 4–5 in selected depth areas.</div></div></div></div>`,'home')
}

function map(){const u=getUser();layout(`<div class="card"><div class="eyebrow">Knowledge map</div><h2>Your current baseline</h2><p class="muted">0 = unknown · 5 = mastered. Scores will update as you complete lessons and delayed reviews.</p>${TRACKS.map(([t,d])=>{const m=u.mastery[t]||0;return `<div class="track"><div class="track-head"><div><b>${t}</b><div class="mini muted">${d}</div></div><span>${m.toFixed(1)} / 5</span></div><div class="progress"><i style="width:${m/5*100}%"></i></div></div>`}).join('')}</div>`,'map')}

function curriculum(){const u=getUser();layout(`<div class="card"><div class="eyebrow">Curriculum</div><h2>First learning units</h2><p class="muted">The content map is not tied to a fixed calendar. Your available time controls pacing.</p><div class="stack">${CURRICULUM.map(x=>`<div class="session-item"><div><b>${x.title}</b><div class="mini muted">${x.track} · ~${x.minutes} min · ${x.type}</div></div><div class="row">${u.completed[x.id]?'<span class="tag">Completed</span>':''}<button class="btn small" onclick="startLesson('${x.id}')">${u.completed[x.id]?'Review':'Open'}</button></div></div>`).join('')}</div></div>`,'curriculum')}

function settings(){const u=getUser(),f=forecast(u);layout(`<div class="stack"><div class="card"><h2>Study settings</h2><div class="form-grid"><div class="field"><label>Minutes per study day</label><select id="mins">${[10,15,20,30,45,60,90,120].map(v=>`<option ${u.minutesPerDay===v?'selected':''}>${v}</option>`).join('')}</select></div><div class="field"><label>Study days per week</label><select id="days">${[1,2,3,4,5,6,7].map(v=>`<option ${u.daysPerWeek===v?'selected':''}>${v}</option>`).join('')}</select></div><div class="wide"><button class="btn primary" onclick="saveSettings()">Update forecast</button></div></div></div><div class="card"><h3>Forecast model</h3><div class="kpis"><div class="kpi"><strong>${f.weekly.toFixed(1)}h</strong><span>weekly</span></div><div class="kpi"><strong>${Math.round(f.yearly)}h</strong><span>annual</span></div><div class="kpi"><strong>${yearsLabel(f.coreYears)}</strong><span>broad competence</span></div><div class="kpi"><strong>${yearsLabel(f.advancedYears)}</strong><span>breadth + depth</span></div></div><p class="footer-note">These are planning estimates, not guarantees. As assessment data accumulates, the forecast should increasingly use measured learning velocity and retention.</p></div><div class="card"><h3>Profile data</h3><div class="row"><button class="btn" onclick="exportData()">Export progress JSON</button><button class="btn" onclick="logout()">Switch profile</button></div></div></div>`,'settings')}
window.saveSettings=()=>{const mins=+$('#mins').value,days=+$('#days').value;updateUser(u=>({...u,minutesPerDay:mins,daysPerWeek:days}));settings()};
window.logout=()=>{localStorage.removeItem('atlas_current');renderLogin()};
window.exportData=()=>{const data=JSON.stringify(getUser(),null,2);const blob=new Blob([data],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='atlas-progress.json';a.click();URL.revokeObjectURL(a.href)};

window.startLesson=(id)=>{const x=CURRICULUM.find(z=>z.id===id); const qs=QUIZZES[id]||[];layout(`<div class="stack"><div class="card"><div class="eyebrow">${x.track} · ${x.type}</div><h2>${x.title}</h2><div class="lesson-body">${x.content}</div><div class="notice" style="margin-top:16px">Estimated focused time: ${x.minutes} minutes. If you only have ${getUser().minutesPerDay} minutes today, stopping after the quiz is still a complete session.</div></div><div class="card"><h3>Retrieval quiz</h3><form id="quiz">${qs.map((q,idx)=>`<div class="quiz-q"><b>${idx+1}. ${q[0]}</b>${q[1].map((o,j)=>`<label class="option"><input type="radio" name="q${idx}" value="${j}">${o}</label>`).join('')}</div>`).join('')}<button type="button" class="btn primary" onclick="gradeQuiz('${id}')">Submit & record</button></form></div></div>`,'curriculum')};
window.gradeQuiz=(id)=>{const qs=QUIZZES[id]||[];let correct=0;qs.forEach((q,i)=>{const el=document.querySelector(`input[name=q${i}]:checked`);if(el&&+el.value===q[2])correct++});const score=qs.length?correct/qs.length:1;const x=CURRICULUM.find(z=>z.id===id);updateUser(u=>{const m={...u.mastery};m[x.track]=Math.min(5,(m[x.track]||0)+(score>=.8?.25:score>=.5?.12:.03));return {...u,totalMinutes:u.totalMinutes+x.minutes,completed:{...u.completed,[id]:{score,at:Date.now()}},mastery:m,reviewsDue:u.reviewsDue+1}});layout(`<div class="card"><div class="${score>=.8?'success':'warn'} notice"><b>Quiz score: ${Math.round(score*100)}%</b><br>${score>=.8?'Strong first-pass understanding. A delayed review has been added.':'This concept needs reinforcement. It stays active in your review queue.'}</div><div class="row" style="margin-top:16px"><button class="btn primary" onclick="route('home')">Back to Today</button><button class="btn" onclick="route('map')">View knowledge map</button></div></div>`,'home')};

window.route=(r)=>{if(!current()||!getUser())return renderLogin();({home,map,curriculum,settings}[r]||home)()};

(function init(){const d=db();if(Object.keys(d).length===0){d.tyler=seedUser('Tyler');saveDB(d)}if(!current())renderLogin();else route('home')})();
