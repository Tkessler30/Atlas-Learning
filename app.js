const SUPABASE_URL='https://fhjutbhyvaamzzsipwaa.supabase.co';
const SUPABASE_KEY='sb_publishable_Ytbw_MTkDIhZP1KerZ4bAw_P7XPwFH_';

let db = null;
window.addEventListener('error', (event) => {
  const el = document.getElementById('authMessage');
  if (el) el.textContent = 'Atlas error: ' + (event.message || 'unknown browser error');
});

try {
  if (!window.supabase || !window.supabase.createClient) {
    throw new Error('Supabase browser library did not load.');
  }
  db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession:true, autoRefreshToken:true, detectSessionInUrl:true }
  });
} catch (err) {
  document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('authMessage');
    if (el) el.textContent = 'Atlas authentication failed to initialize: ' + err.message;
  });
}

let authMode='signup',user=null,profile=null,attempt=null,index=0,results={};
const $=id=>document.getElementById(id);
const views=['auth','onboarding','placement','app'];
const subjects=['Logic & Scientific Reasoning','Mathematics','Physics','Chemistry','Biology & Medicine','History','Geography & Geopolitics','Economics & Finance','Government & Law','Computing & Technology','Philosophy & Psychology','Probability & Statistics'];
const qs=[
['logic1',subjects[0],'evidence','A study finds that people carrying lighters have higher lung-cancer rates. Best conclusion?',['Lighters cause cancer','Smoking or another factor may explain the relationship','The study proves data is useless','Everyone with a lighter gets cancer'],1],
['math1',subjects[1],'proportions','5 identical items cost $20. What should 8 cost?',['$25','$28','$30','$32'],3],
['phys1',subjects[2],'force','Which equation describes force in basic mechanics?',['F = m × a','F = m ÷ a','F = distance × time','F = mass × volume'],0],
['chem1',subjects[3],'atomic_structure','Which particles are found in an atomic nucleus?',['Electrons only','Protons and neutrons','Protons and electrons','Molecules'],1],
['bio1',subjects[4],'genetics','Which statement is most accurate?',['DNA is made from genes only','Genes are segments of DNA containing biological instructions','Proteins are chromosomes','Cells are made only of DNA'],1],
['hist1',subjects[5],'ww2','What directly triggered Britain and France to declare war on Germany in 1939?',['Pearl Harbor','German invasion of Poland','Russian Revolution','Fall of Rome'],1],
['geo1',subjects[6],'world_map','India is primarily in which region?',['South Asia','South America','Eastern Europe','North Africa'],0],
['econ1',subjects[7],'supply_demand','Demand rises sharply while supply stays fixed. Price normally…',['Falls','Usually rises','Must stay identical','Becomes zero'],1],
['gov1',subjects[8],'branches','The three U.S. federal branches are…',['Federal, state, local','House, Senate, President','Legislative, executive, judicial','Police, military, courts'],2],
['comp1',subjects[9],'cpu','The CPU is primarily responsible for…',['Executing instructions and processing operations','Long-term file storage','Providing internet service','Displaying pixels alone'],0],
['phil1',subjects[10],'objective_subjective','Which is an objective claim?',['Chocolate is better than vanilla','The room temperature is 72°F','This song is beautiful','Blue is the nicest color'],1],
['stat1',subjects[11],'sampling','A Facebook poll estimates every city resident’s opinion. Major concern?',['Facebook cannot display polls','The sample may not represent all residents','Polls are always exact','Opinions cannot be measured'],1]
];
function show(v){views.forEach(x=>$(x).classList.toggle('hidden',x!==v))}
function setAuthMode(m){authMode=m;$('nameRow').classList.toggle('hidden',m==='login');$('authButton').textContent=m==='login'?'Log in':'Create account';$('signupTab').classList.toggle('active',m==='signup');$('loginTab').classList.toggle('active',m==='login')}
$('signupTab').onclick=()=>setAuthMode('signup');$('loginTab').onclick=()=>setAuthMode('login');
$('authForm').onsubmit=async e=>{e.preventDefault();$('authMessage').textContent='Working…';let r;if(authMode==='signup')r=await db.auth.signUp({
  email:$('email').value,
  password:$('password').value,
  options:{
    data:{display_name:$('name').value},
    emailRedirectTo: location.origin + location.pathname
  }
});else r=await db.auth.signInWithPassword({email:$('email').value,password:$('password').value});if(r.error){$('authMessage').textContent=r.error.message;return}
if(!r.data.session){
  $('authMessage').textContent='Account created. Check your email for the confirmation link. If it does not arrive within a few minutes, we need to update the Supabase email redirect settings.';
  return;
}
$('authMessage').textContent='Signed in.';
boot()};
$('logout').onclick=async()=>{await db.auth.signOut();location.reload()};
const interestNames=['Science','HVAC Engineering','Business & Leadership','Accounting & Economics','History','Technology','Psychology','Government'];
$('interests').innerHTML=interestNames.map(x=>`<button type="button" class="chip" data-v="${x}">${x}</button>`).join('');
$('interests').onclick=e=>{if(e.target.classList.contains('chip'))e.target.classList.toggle('active')};
$('onboardingForm').onsubmit=async e=>{e.preventDefault();let r=await db.from('profiles').update({daily_minutes:+$('minutes').value,days_per_week:+$('days').value,onboarding_complete:true,updated_at:new Date().toISOString()}).eq('user_id',user.id);if(r.error)return alert(r.error.message);let ints=[...document.querySelectorAll('.chip.active')].map(x=>x.dataset.v);if(ints.length)await db.from('user_interests').upsert(ints.map(s=>({user_id:user.id,subject_key:s,depth_preference:'deep'})),{onConflict:'user_id,subject_key'});profile={...profile,daily_minutes:+$('minutes').value,days_per_week:+$('days').value,onboarding_complete:true};startPlacement()};
async function startPlacement(){show('placement');let r=await db.from('placement_attempts').insert({user_id:user.id}).select().single();if(r.error)return alert(r.error.message);attempt=r.data.id;index=0;results={};renderQuestion()}
function renderQuestion(){let q=qs[index];$('progress').textContent=`Question ${index+1} of ${qs.length} • ${q[1]}`;$('question').innerHTML=`<h3>${q[3]}</h3>${q[4].map((a,i)=>`<button class="answer" data-a="${i}">${a}</button>`).join('')}<button class="answer" data-a="-1">I don't know</button>`}
$('question').onclick=async e=>{if(!e.target.classList.contains('answer'))return;let q=qs[index],sel=+e.target.dataset.a,ok=sel===q[5];await db.from('placement_responses').insert({attempt_id:attempt,user_id:user.id,question_key:q[0],subject_key:q[1],concept_key:q[2],difficulty:1,selected_answer:sel<0?'idk':String(sel),is_correct:ok});results[q[1]]=ok?2.5:.75;index++;index<qs.length?renderQuestion():finishPlacement()};
async function finishPlacement(){await db.from('placement_attempts').update({status:'completed',completed_at:new Date().toISOString()}).eq('id',attempt);let rows=Object.entries(results).map(([s,m])=>({user_id:user.id,subject_key:s,concept_key:'baseline_'+s.toLowerCase().replace(/[^a-z0-9]+/g,'_'),mastery:m,confidence:55,source:'placement',last_assessed_at:new Date().toISOString()}));await db.from('concept_mastery').upsert(rows,{onConflict:'user_id,concept_key'});await db.from('profiles').update({placement_complete:true}).eq('user_id',user.id);profile.placement_complete=true;loadApp()}
async function loadApp(){show('app');$('logout').classList.remove('hidden');$('dailyMinutes').textContent=profile.daily_minutes;$('todayItems').innerHTML=['Review due concepts','One weak-area concept','Practical application','Short retrieval quiz'].map(x=>`<div class="item">${x}</div>`).join('');let r=await db.from('concept_mastery').select('*').eq('user_id',user.id);renderMap(r.data||[]);let w=profile.daily_minutes*profile.days_per_week/60,y=w*52;$('weekly').textContent=w.toFixed(1);$('yearly').textContent=Math.round(y);$('forecastText').textContent='This forecast will become more accurate as Atlas learns your actual pace, retention and assessment performance.'}
function renderMap(rows){$('mapItems').innerHTML=subjects.map(s=>{let r=rows.find(x=>x.subject_key===s);if(!r)return `<div class="track"><div class="trackHead"><span>${s}</span><span>Not assessed</span></div><div class="barbg"></div></div>`;let m=+r.mastery;return `<div class="track"><div class="trackHead"><span>${s}</span><span>${m.toFixed(1)} / 5</span></div><div class="barbg"><div class="bar" style="width:${m/5*100}%"></div></div></div>`}).join('')}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.page').forEach(x=>x.classList.toggle('hidden',x.id!==b.dataset.page))});
$('saveDemo').onclick=async()=>{let r=await db.from('study_sessions').insert({user_id:user.id,planned_minutes:profile.daily_minutes,actual_minutes:profile.daily_minutes,session_type:'mixed',completed:true,completed_at:new Date().toISOString()});alert(r.error?r.error.message:'Session saved to your account.')};
$('sendFeedback').onclick=async()=>{let r=await db.from('tester_feedback').insert({user_id:user.id,page_key:'v0.2',feedback_type:$('feedbackType').value,message:$('feedbackText').value});$('feedbackMessage').textContent=r.error?r.error.message:'Thanks — feedback saved.';if(!r.error)$('feedbackText').value=''};
async function boot(){let u=(await db.auth.getUser()).data.user;if(!u){$('logout').classList.add('hidden');show('auth');return}user=u;$('logout').classList.remove('hidden');let r=await db.from('profiles').select('*').eq('user_id',u.id).single();if(r.error){setTimeout(boot,500);return}profile=r.data;if(!profile.onboarding_complete){$('minutes').value=profile.daily_minutes;$('days').value=profile.days_per_week;show('onboarding')}else if(!profile.placement_complete)startPlacement();else loadApp()}
setAuthMode('signup');boot();