const URL='https://fhjutbhyvaamzzsipwaa.supabase.co';
const KEY='sb_publishable_Ytbw_MTkDIhZP1KerZ4bAw_P7XPwFH_';
const db=window.createAtlasClient(URL,KEY);
window.addEventListener('error',e=>{
  const el=document.getElementById('authMessage');
  if(el) el.textContent='Atlas startup error: '+(e.message||'unknown error');
});
const $=id=>document.getElementById(id);
let authMode='signup',user=null,profile=null,subjects=[],concepts=[],states=[],sessions=[],masteries=[],interests=[],prereqs=[],events=[],attempt=null,round=1,qIndex=0,answers=[],roundQs=[],openIndex=0,todayDone=new Set(),frontierConcept=null,currentRoute=null,todayPlan=[],taskOpenedAt=0,sessionActiveSeconds=0,activityBySubject={},activityByConcept={};
const VIEWS=['auth','onboarding','assessmentIntro','assessment','checkpoint','app'];
const EXTRA=['Science','Health & Medicine','Trades & Construction','Business & Leadership','Accounting & Economics','Technology & AI','History & Geopolitics','Psychology & Philosophy','Arts & Culture'];

const A=[
['a_reason','reasoning',2,'A city finds that neighborhoods with more fire trucks have more fire damage. Best interpretation?',['Fire trucks cause damage','Larger fires cause both more trucks and more damage','The data proves nothing','Fire damage is random'],1],
['a_math','mathematics',2,'A $240 bill is reduced by 15%. What is the new total?',['$204','$215','$225','$230'],0],
['a_stats','statistics',2,'A poll samples only volunteers from one news website. Main concern?',['Selection bias','Too much randomization','A larger sample','No opinions can be measured'],0],
['a_phys','physics',2,'A car moves around a circular track at constant speed. Is it accelerating?',['No','Yes, direction changes','Only downhill','Only if engine speed rises'],1],
['a_chem','chemistry',2,'What determines which element an atom is?',['Number of protons','Its size','Temperature','Number of molecules'],0],
['a_bio','biology',2,'Genes are best described as…',['Segments of DNA containing biological instructions','Whole organs','Types of bacteria','Free proteins'],0],
['a_med','medicine',2,'Why do ordinary antibiotics generally not treat viral infections?',['Viruses have no mass','Antibiotics target bacterial processes','Viruses exist only in blood','Antibiotics remove oxygen'],1],
['a_health','health_wellness',2,'Why is regular sleep broadly important?',['It replaces exercise','It supports cognition, metabolism, immunity, and recovery','It guarantees no illness','It permanently lowers heart rate'],1],
['a_hist','history',2,'Which occurred first?',['Industrial Revolution','Ancient Greece','World War I','Cold War'],1],
['a_geo','geography',2,'Why did many early civilizations grow near rivers?',['Water, fertile soil, transport, and trade','Rivers prevented wars','Only religious reasons','Rivers made climates identical'],0],
['a_econ','economics',2,'Demand rises while supply stays fixed. Price normally…',['Falls','Usually rises','Must stay fixed','Becomes zero'],1],
['a_gov','government',2,'The U.S. Congress consists of…',['House and Senate','President and Court','States and counties','Cabinet and Senate'],0],
['a_comp','computing',2,'RAM is mainly used for…',['Permanent archives','Temporary working data for active programs','Internet routing only','Cooling the CPU'],1],
['a_phil','philosophy',2,'Which is an objective claim?',['This painting is beautiful','The room is 72°F','Jazz is better than rock','Summer is nicest'],1],
['a_cult','culture_society',2,'A good first step in studying another culture is to…',['Assume your norms are universal','Understand practices in historical/social context','Treat all members as identical','Judge only by popularity'],1]
];
const HARD={
reasoning:['h_reason','reasoning',6,'A randomized controlled trial strengthens causal inference mainly because…',['Random assignment reduces systematic confounding','The treatment costs money','The sample has opinions','It was published online'],0],
mathematics:['h_math','mathematics',6,'Solve x² − 5x + 6 = 0.',['1 or 6','2 or 3','−2 or −3','5 only'],1],
statistics:['h_stats','statistics',6,'A rare disease test is 95% sensitive and 95% specific. Why can many positive tests still be false positives?',['Base rates matter','Sensitivity becomes zero','Specificity only applies to treatment','Probability cannot model rare events'],0],
physics:['h_phys','physics',6,'Astronauts in orbit appear weightless mainly because…',['Gravity is zero','They and the spacecraft are continuously falling','Air pressure cancels gravity','The Moon blocks gravity'],1],
chemistry:['h_chem','chemistry',6,'In an ordinary chemical reaction, what primarily changes?',['Atomic nuclei split routinely','Electrons and bonding arrangements','Protons become electrons','Matter disappears'],1],
biology:['h_bio','biology',6,'Which sequence is accurate?',['Protein → gene → DNA','DNA contains genes; genes can encode proteins','Genes contain cells','DNA is only protein'],1],
medicine:['h_med','medicine',6,'Why can a highly sensitive screening test still need confirmation?',['False positives can occur, especially when prevalence is low','Sensitivity means all positives are true','All screening measures blood pressure','Confirmation is always legally required'],0],
health_wellness:['h_health','health_wellness',6,'Which bundle most reliably improves cardiovascular risk across populations?',['Activity, smoking reduction, BP control, healthy diet patterns','Supplements instead of movement','Avoiding all dietary fat','Four hours sleep'],0],
history:['h_hist','history',6,'Major long-term causes of World War I included…',['Alliances, militarism, nationalism, imperial rivalry','Only invasion of Poland','Only the Depression','Only Reformation'],0],
geography:['h_geo','geography',6,'Why can a maritime chokepoint matter geopolitically?',['It can constrain trade and military movement','It changes gravity','It guarantees crops','It removes currency risk'],0],
economics:['h_econ','economics',6,'A central bank raises policy rates substantially. Typical effect?',['Credit gets cheaper','Borrowing gets costlier and demand may cool','Money becomes infinite','All wages fall automatically'],1],
government:['h_gov','government',6,'Judicial review means courts can…',['Write budgets','Evaluate government actions against the Constitution','Command the military','Elect senators'],1],
computing:['h_comp','computing',6,'DNS primarily…',['Translates domain names to network addresses','Encrypts every file','Replaces CPUs','Measures speed only'],0],
philosophy:['h_phil','philosophy',6,'Occam’s razor is best understood as…',['Simplest is always true','Prefer fewer unsupported assumptions when evidence is comparable','Complex is always false','Majorities determine truth'],1],
culture_society:['h_cult','culture_society',6,'Studying culture contextually means…',['Understanding practices in their social/historical setting before evaluating them','Assuming all cultures are identical','Ignoring internal diversity','Treating norms as genetic'],0]
};
const EASY=A.map(x=>[x[0]+'_e',x[1],2,x[3],x[4],x[5]]);
const R3=[
['r_fit','physical_health',4,'Progressive overload means…',['Gradually increasing training demand as capacity improves','Doing less each week','Never recovering','Only gaining body weight'],0],
['r_fin','finance',4,'A bond is…',['Ownership in a company','A debt instrument issued to investors','An insurance policy','A checking account'],1],
['r_acct','accounting',4,'The accounting equation is…',['Assets = Liabilities + Equity','Revenue = Assets + Debt','Cash = Profit + Taxes','Equity = Revenue − Customers'],0],
['r_law','law',4,'Burden of proof refers to…',['Responsibility to establish a claim to the required standard','Number of judges','Cost of a lawyer','Popularity of a law'],0],
['r_ai','ai',4,'A machine-learning model mainly learns by…',['Memorizing every page as a perfect answer','Adjusting parameters from data to improve an objective','Becoming conscious','Eliminating algorithms'],1],
['r_eng','engineering',4,'Engineering design usually involves…',['Ignoring constraints','Balancing requirements, constraints, tradeoffs, testing, and iteration','Only drawing blueprints','Avoiding measurement'],1],
['r_trade','trades_mechanical',4,'In a typical house, the building envelope primarily separates…',['Conditioned interior from exterior environment','Plumbing from electricity only','Roof from framing','Owners from contractors'],0],
['r_psych','psychology',4,'Seeking information that supports an existing belief is…',['Confirmation bias','Homeostasis','Natural selection','Opportunity cost'],0],
['r_soc','sociology',4,'Sociology mainly studies…',['Only brain chemistry','Groups, institutions, structures, and relationships','Planetary motion','Chemical bonds'],1],
['r_rel','religion_culture',4,'Comparative religion is best approached by…',['Treating traditions as identical','Studying beliefs, practices, histories, institutions, and internal diversity','Proving one tradition scientifically','Ignoring history'],1],
['r_lit','literature',4,'A literary theme is…',['Only the title','A recurring central idea or concern','Page count','A spelling rule'],1],
['r_art','art_music',4,'Perspective in visual art commonly represents…',['Depth and spatial relationships','Sound frequency','Taxes','pH'],0],
['r_earth','earth_science',4,'Plate tectonics helps explain…',['Earthquakes, mountains, continental movement','Only weather','Moon phases','Genetics'],0],
['r_astro','astronomy',4,'A light-year measures…',['Time','Distance','Brightness','Mass'],1],
['r_energy','energy',4,'Electrical power is commonly measured in…',['Watts','Pascals','Meters','Kelvin'],0]
];
const OPEN=[
['oe1','reasoning','Two explanations fit an event. One requires three evidence-supported assumptions; another requires fifteen, several unsupported. Does that prove the first is true? Explain.'],
['oe2','geopolitics','A country discovers a huge amount of easily accessible oil. Describe several possible economic, political, international, technological, or social consequences.'],
['oe3','statistics','Explain the difference between correlation and causation. Give an example if you can.'],
['oe4','learning','Choose something you understand well from work, life, or a hobby. Explain it to a smart beginner.'],
['oe5','future','If you invest 30 minutes a day in learning for five years, what do you want to understand, do, or discuss by then?']
];

function show(v){VIEWS.forEach(x=>$(x).classList.toggle('hidden',x!==v))}
function mode(m){authMode=m;$('nameRow').classList.toggle('hidden',m==='login');$('authButton').textContent=m==='login'?'Log in':'Create account';$('signupTab').classList.toggle('active',m==='signup');$('loginTab').classList.toggle('active',m==='login')}
$('signupTab').onclick=()=>mode('signup');$('loginTab').onclick=()=>mode('login');
$('authForm').onsubmit=async e=>{e.preventDefault();$('authMessage').textContent='Working…';let r=authMode==='signup'?await db.auth.signUp({email:$('email').value,password:$('password').value,options:{data:{display_name:$('name').value},emailRedirectTo:location.origin+location.pathname}}):await db.auth.signInWithPassword({email:$('email').value,password:$('password').value});if(r.error){$('authMessage').textContent=r.error.message;return}if(!r.data.session){$('authMessage').textContent='Check your email to confirm your account, then return here.';return}$('authMessage').textContent='Signed in.';boot()};
$('logout').onclick=async()=>{await db.auth.signOut();location.reload()};

$('interests').innerHTML=EXTRA.map(x=>`<button type="button" class="chip" data-v="${x}">${x}</button>`).join('');
$('interests').onclick=e=>{if(e.target.classList.contains('chip'))e.target.classList.toggle('active')};
const INTEREST_KEYS={
'Science':['physics','chemistry','biology','earth_science','astronomy'],
'Health & Medicine':['health_wellness','physical_health','medicine'],
'Trades & Construction':['trades_mechanical','engineering','energy'],
'Business & Leadership':['business','leadership'],
'Accounting & Economics':['accounting','economics','finance'],
'Technology & AI':['computing','ai','technology'],
'History & Geopolitics':['history','geography','geopolitics','government'],
'Psychology & Philosophy':['psychology','philosophy','sociology'],
'Arts & Culture':['art_music','literature','culture_society','religion_culture','media']
};
function interestKeys(){let set=new Set();interests.forEach(i=>(INTEREST_KEYS[i.subject_key]||[i.subject_key]).forEach(k=>set.add(k)));return set}
$('onboardingForm').onsubmit=async e=>{e.preventDefault();let chosen=[...document.querySelectorAll('.chip.active')].map(x=>x.dataset.v),keys=[...new Set(chosen.flatMap(s=>INTEREST_KEYS[s]||[]))];let daily=+$('minutes').value,days=+$('days').value;let r=await db.from('profiles').update({daily_minutes:daily,days_per_week:days,weekly_goal_minutes:daily*days,onboarding_complete:true,updated_at:new Date().toISOString()}).eq('user_id',user.id);if(r.error)return alert(r.error.message);if(keys.length)await db.from('user_interests').upsert(keys.map(s=>({user_id:user.id,subject_key:s,depth_preference:'deep'})),{onConflict:'user_id,subject_key'});profile={...profile,daily_minutes:daily,days_per_week:days,weekly_goal_minutes:daily*days,onboarding_complete:true};assessmentLanding()};

async function assessmentLanding(){let r=await db.from('placement_attempts').select('*').eq('user_id',user.id).eq('version','v0.5').eq('status','in_progress').order('started_at',{ascending:false}).limit(1);let saved=r.data?.[0];$('resumeAssessment').classList.toggle('hidden',!saved);$('resumeAssessment').dataset.id=saved?.id||'';show('assessmentIntro')}
$('startAssessment').onclick=()=>startAssessment(false);$('resumeAssessment').onclick=()=>startAssessment(true);

async function startAssessment(resume){if(resume){attempt=$('resumeAssessment').dataset.id;let a=await db.from('placement_attempts').select('*').eq('id',attempt).single();round=a.data.current_round||1;let r=await db.from('placement_responses').select('*').eq('attempt_id',attempt).order('answered_at');answers=r.data||[];qIndex=answers.filter(x=>x.round_number===round).length}else{let r=await db.from('placement_attempts').insert({user_id:user.id,version:'v0.5',status:'in_progress',current_round:1}).select().single();if(r.error)return alert(r.error.message);attempt=r.data.id;round=1;qIndex=0;answers=[]}buildRound();show('assessment');renderQ()}
function score(subject){let a=answers.filter(x=>x.subject_key===subject&&x.item_type==='multiple_choice');return a.length?a.filter(x=>x.is_correct).length/a.length:null}
function buildRound(){if(round===1)roundQs=A;else if(round===2)roundQs=A.map(x=>(score(x[1])??0)>=.67?HARD[x[1]]:EASY.find(e=>e[1]===x[1]));else if(round===3)roundQs=R3}
function mcCount(){return answers.filter(x=>x.item_type==='multiple_choice').length}
function renderQ(){if(round>3)return renderOpen();let x=roundQs[qIndex];$('roundLabel').textContent=`ROUND ${round} OF 3`;$('assessmentTitle').textContent='Placement Assessment';$('questionProgress').textContent=`Question ${qIndex+1} of 15`;$('assessmentProgressBar').style.width=`${mcCount()/45*90}%`;$('questionBox').innerHTML=`<div class="eyebrow">${x[1].replaceAll('_',' ')} • difficulty ${x[2]}/10</div><h3>${x[3]}</h3>${x[4].map((o,i)=>`<button class="answer" data-a="${i}">${o}</button>`).join('')}<button class="answer" data-a="-1">I don’t know</button>`}
$('questionBox').onclick=async e=>{if(!e.target.classList.contains('answer'))return;let x=roundQs[qIndex],sel=+e.target.dataset.a,ok=sel===x[5];let row={attempt_id:attempt,user_id:user.id,question_key:x[0],subject_key:x[1],concept_key:null,difficulty:x[2],selected_answer:sel<0?'idk':String(sel),is_correct:sel<0?false:ok,round_number:round,item_type:'multiple_choice'};let r=await db.from('placement_responses').insert(row).select().single();if(r.error)return alert(r.error.message);answers.push(r.data);qIndex++;qIndex<15?renderQ():checkpoint()};
async function checkpoint(){await db.from('placement_attempts').update({current_round:round+1,paused_at:null}).eq('id',attempt);let ra=answers.filter(x=>x.round_number===round&&x.item_type==='multiple_choice'),c=ra.filter(x=>x.is_correct).length;let copy=[['Atlas has a first outline.','The next round will go deeper where you showed strength and keep sampling where Atlas is uncertain.'],['Your map is getting sharper.','One more broad round will test areas outside the basic academic core.'],['The broad scan is complete.','Five final prompts will sample how you reason, explain, and connect systems.']][round-1];$('checkpointHeadline').textContent=copy[0];$('checkpointMessage').textContent=copy[1];$('checkpointStats').innerHTML=`<span class="chip">${c}/15 correct</span><span class="chip">${mcCount()}/45 complete</span><span class="chip">Progress saved</span>`;$('continueAssessment').textContent=round===3?'Continue to reasoning':'Continue';show('checkpoint')}
$('continueAssessment').onclick=()=>{round++;qIndex=0;if(round<=3){buildRound();show('assessment');renderQ()}else{openIndex=answers.filter(x=>x.item_type==='open_ended').length;show('assessment');renderOpen()}};
async function pause(){await db.from('placement_attempts').update({current_round:round,paused_at:new Date().toISOString()}).eq('id',attempt);assessmentLanding()}
$('pauseAssessment').onclick=pause;$('pauseAtCheckpoint').onclick=pause;
function renderOpen(){let x=OPEN[openIndex];$('roundLabel').textContent='REASONING SAMPLE';$('assessmentTitle').textContent='Five open-ended prompts';$('questionProgress').textContent=`Prompt ${openIndex+1} of 5`;$('assessmentProgressBar').style.width=`${90+openIndex*2}%`;$('questionBox').innerHTML=`<h3>${x[2]}</h3><textarea id="openText" placeholder="Answer in your own words."></textarea><button id="saveOpen" class="primary">Save & continue</button><p class="fineprint">Atlas stores this as qualitative reasoning evidence; it is not converted into fake mastery points.</p>`;$('saveOpen').onclick=saveOpen}
async function saveOpen(){let x=OPEN[openIndex],text=$('openText').value.trim();if(text.length<20)return alert('Give Atlas a little more to work with.');let r=await db.from('placement_responses').insert({attempt_id:attempt,user_id:user.id,question_key:x[0],subject_key:x[1],response_text:text,difficulty:5,round_number:4,item_type:'open_ended'}).select().single();if(r.error)return alert(r.error.message);answers.push(r.data);openIndex++;openIndex<5?renderOpen():finishAssessment()}
async function finishAssessment(){let out=[];let keys=[...new Set(answers.filter(x=>x.item_type==='multiple_choice').map(x=>x.subject_key))];for(let k of keys){let a=answers.filter(x=>x.subject_key===k&&x.item_type==='multiple_choice');let weighted=a.reduce((t,x)=>t+(x.is_correct?100:0)*(1+(+x.difficulty/10)),0),w=a.reduce((t,x)=>t+1+(+x.difficulty/10),0),raw=weighted/w,est=Math.max(3,Math.min(88,8+raw*.76)),conf=Math.min(72,10+a.length*19);out.push({user_id:user.id,subject_key:k,estimated_level:est,estimate_confidence:conf,questions_answered:a.length,correct_count:a.filter(x=>x.is_correct).length,last_difficulty:a[a.length-1].difficulty,status:a.length>=3?'provisional':'sampling',updated_at:new Date().toISOString()})}let r=await db.from('assessment_state').upsert(out,{onConflict:'user_id,subject_key'});if(r.error)return alert(r.error.message);await db.from('placement_attempts').update({status:'completed',completed_at:new Date().toISOString(),current_round:4}).eq('id',attempt);await db.from('profiles').update({placement_complete:true,placement_version:'v0.5',updated_at:new Date().toISOString()}).eq('user_id',user.id);profile.placement_version='v0.5';loadApp()}

async function loadCore(){let [sub,con,st,se,ma,ui,pr,ev]=await Promise.all([db.from('subjects').select('*').eq('active',true).order('sort_order'),db.from('concepts').select('*').eq('is_core',true).order('subject_key').order('level'),db.from('assessment_state').select('*').eq('user_id',user.id),db.from('study_sessions').select('*').eq('user_id',user.id).order('created_at'),db.from('concept_mastery').select('*').eq('user_id',user.id),db.from('user_interests').select('*').eq('user_id',user.id),db.from('concept_prerequisites').select('*'),db.from('learning_events').select('*').eq('user_id',user.id).order('created_at')]);subjects=sub.data||[];concepts=con.data||[];states=st.data||[];sessions=se.data||[];masteries=ma.data||[];interests=ui.data||[];prereqs=pr.data||[];events=ev.data||[];activityBySubject={};activityByConcept={};events.forEach(e=>{let c=conceptByKey(e.concept_key);if(c){activityBySubject[c.subject_key]=(activityBySubject[c.subject_key]||0)+1;activityByConcept[c.key]=(activityByConcept[c.key]||0)+1}})}
const verified=s=>(+s.estimated_level)*(+s.estimate_confidence)/100;
function getSubject(k){return subjects.find(x=>x.key===k)}
function conceptMastery(k){return masteries.find(m=>m.concept_key===k)}
function conceptByKey(k){return concepts.find(c=>c.key===k)}
function placementState(k){return states.find(x=>x.subject_key===k)}
function globalPlacementAbility(){
 let vals=states.filter(s=>(+s.estimate_confidence)>=45).map(s=>+s.estimated_level).sort((a,b)=>a-b);
 if(!vals.length)return 45;
 let mid=Math.floor(vals.length/2);return vals.length%2?vals[mid]:(vals[mid-1]+vals[mid])/2
}
function placementBoundary(k){
 let st=placementState(k);if(!st)return 0;
 let a=+st.estimated_level,conf=+st.estimate_confidence,q=+st.questions_answered||0,raw=a/10,penalty=(1-conf/100)*1.4,g=globalPlacementAbility(),cap;
 if(q<=1)cap=a>=80?(g>=75?5:3):1.5;
 else if(q<=2)cap=a>=80?(g>=75?8:g>=60?6:5):a>=38?4:1.5;
 else cap=9;
 return Math.max(0,Math.min(cap,raw-penalty))
}
function verifiedConcept(m){return !!(m&&(+m.mastery)>=65&&((+m.confidence)>=42||(+m.evidence_count)>=2))}
function directBoundary(k){
 let levels=masteries.filter(m=>m.subject_key===k&&verifiedConcept(m)).map(m=>+conceptByKey(m.concept_key)?.level||0);
 return levels.length?Math.max(...levels):0
}
function failureCeiling(k){
 let direct=directBoundary(k),levels=masteries.filter(m=>m.subject_key===k&&(+m.mastery)<50&&(+m.evidence_count)>=1).map(m=>+conceptByKey(m.concept_key)?.level||0).filter(l=>l>direct);
 return levels.length?Math.max(direct,Math.min(...levels)-1):10
}
function subjectBoundary(k){let d=directBoundary(k),p=placementBoundary(k),f=failureCeiling(k);return Math.max(d,Math.min(p,f))}
function subjectEvidence(k){
 let st=placementState(k),ms=masteries.filter(m=>m.subject_key===k);
 if(!st&&!ms.length)return {ability:50,confidence:0,verified:null,known:false,source:'unknown',boundary:0};
 let boundary=subjectBoundary(k),evidenceCount=ms.reduce((a,m)=>a+(+m.evidence_count||0),0);
 let conf=Math.max(st?+st.estimate_confidence:0,Math.min(95,20+evidenceCount*5));
 let ability=Math.max(3,Math.min(100,boundary*10));
 let source=ms.length?(st?'combined':'demonstrated'):'placement';
 return {ability,confidence:conf,verified:ability*conf/100,known:true,source,boundary}
}
function provisionalSatisfied(c){
 let st=placementState(c.subject_key);if(!st)return false;
 if(directBoundary(c.subject_key)>=+c.level)return true;
 return (+st.estimate_confidence)>=45&&(+c.level)<=Math.floor(placementBoundary(c.subject_key))
}
function prereqSatisfied(p){
 let pm=conceptMastery(p.prerequisite_key);if(verifiedConcept(pm))return true;
 let pc=conceptByKey(p.prerequisite_key);return !!(pc&&provisionalSatisfied(pc))
}
function recentCount(k,days=3){return events.filter(x=>x.concept_key===k&&Date.now()-new Date(x.created_at).getTime()<days*864e5).length}
function diagnosticTarget(k){
 let g=globalPlacementAbility(),target=Math.max(2,Math.min(7,Math.round(g/10))),fail=failureCeiling(k),direct=directBoundary(k);
 target=Math.min(target,fail);if(direct)target=Math.max(target,Math.min(10,direct+1));return Math.max(1,target)
}
function bridgeSource(c){
 let tags=c.bridge_tags||[],direct=tags.find(t=>{let e=subjectEvidence(t);return e.known&&e.confidence>=35&&e.ability>=60});
 if(direct)return direct;
 let reciprocal=concepts.find(x=>x.subject_key!==c.subject_key&&(x.bridge_tags||[]).includes(c.subject_key)&&subjectEvidence(x.subject_key).confidence>=35&&subjectEvidence(x.subject_key).ability>=60);
 return reciprocal?.subject_key||null
}
function routeScore(c,mode='general'){
 let e=subjectEvidence(c.subject_key),m=conceptMastery(c.key),score=0,reasons=[],level=+c.level||1,lowConfidence=!e.known||e.confidence<35;
 let diagnostic=mode==='gap'&&lowConfidence&&level===diagnosticTarget(c.subject_key);
 let req=prereqs.filter(p=>p.concept_key===c.key),blocked=req.filter(p=>!prereqSatisfied(p));
 if(!diagnostic&&blocked.length)return {c,score:-9999,reasons:['prerequisite blocked'],e,m,diagnostic:false};
 if(lowConfidence){
   if(mode!=='gap'&&level>1&&directBoundary(c.subject_key)===0)return {c,score:-9999,reasons:['needs diagnostic'],e,m,diagnostic:false};
   if(mode==='gap'&&!diagnostic&&level!==1)return {c,score:-9999,reasons:['diagnostic calibration'],e,m,diagnostic:false}
 }else if(level>Math.floor(e.boundary)+1){
   return {c,score:-9999,reasons:['above current frontier'],e,m,diagnostic:false}
 }
 let need=m?Math.max(0,70-(+m.mastery||0)):(provisionalSatisfied(c)?8:35),activity=activityBySubject[c.subject_key]||0,target=Math.max(1,Math.min(10,Math.floor(e.boundary)+1));
 if(mode==='gap'){
   if(diagnostic){score+=65+Math.max(0,20-4*Math.abs(level-diagnosticTarget(c.subject_key)));reasons.push('diagnostic probe')}
   else{let gap=Math.max(0,60-e.ability)*(Math.max(e.confidence,15)/100);score+=gap*.7+need*.55+Math.max(0,30-10*Math.abs(level-target));if(level<=5)score+=8;if(gap>12)reasons.push('breadth gap')}
   score+=Math.max(0,20-activity*.15)
 }else if(mode==='frontier'){
   if(lowConfidence)return {c,score:-9999,reasons:['needs diagnostic'],e,m,diagnostic:false};
   score+=Math.max(0,38-10*Math.abs(level-target))+need*.3;
   if(e.ability>=65){score+=25;reasons.push('strength frontier')}
   if(interestKeys().has(c.subject_key)){score+=18;reasons.push('depth goal')}
 }else if(mode==='bridge'){
   if(lowConfidence)return {c,score:-9999,reasons:['needs diagnostic'],e,m,diagnostic:false};
   score+=Math.max(0,28-8*Math.abs(level-target))+need*.2;
   let source=bridgeSource(c);if(source){score+=55;reasons.push(`bridge from ${getSubject(source)?.name||source}`)}
 }else if(mode==='review'){
   if(m&&m.next_review_at&&new Date(m.next_review_at)<=new Date()){score+=85;reasons.push('retention due')}
   score+=need*.1
 }else score+=need*.25;
 if(m&&m.next_review_at&&new Date(m.next_review_at)<=new Date())score+=mode==='review'?55:20;
 score-=recentCount(c.key,3)*(mode==='review'?4:15);
 score+=(+c.breadth_weight||1)*5;
 return {c,score,reasons,e,m,diagnostic}
}
function pickCandidate(mode,exclude=new Set(),excludedSubjects=new Set(),requireBridge=false){
 let list=concepts.filter(c=>c.subject_key!=='hvac'&&!exclude.has(c.key)&&!excludedSubjects.has(c.subject_key)).map(c=>routeScore(c,mode)).filter(x=>x.score>-9000&&(!requireBridge||x.reasons.some(r=>r.startsWith('bridge from')))).sort((a,b)=>b.score-a.score);
 return list[0]||null
}
function chooseSessionPlan(){
 let used=new Set(),plan=[];
 let review=concepts.map(c=>routeScore(c,'review')).filter(x=>x.m&&x.m.next_review_at&&new Date(x.m.next_review_at)<=new Date()).sort((a,b)=>b.score-a.score)[0];
 if(!review){
   let known=subjects.map(s=>({s,e:subjectEvidence(s.key)})).filter(x=>x.e.confidence>=35).sort((a,b)=>b.e.ability-a.e.ability),strong=known[0]?.s;
   let ready=strong?concepts.filter(c=>c.subject_key===strong.key&&(+c.level)<=Math.max(1,Math.floor(subjectBoundary(strong.key)))&&prereqs.filter(p=>p.concept_key===c.key).every(prereqSatisfied)).sort((a,b)=>(+b.level)-(+a.level)):[];
   let c=ready[0]||concepts.find(c=>c.subject_key===strong?.key&&(+c.level)===1);
   review=c?{c,score:0,reasons:['baseline retrieval'],e:subjectEvidence(c.subject_key),m:conceptMastery(c.key)}:pickCandidate('review',used)
 }
 if(review){plan.push({type:'review',route:review});used.add(review.c.key)}
 let gap=pickCandidate('gap',used);if(gap){plan.push({type:'gap',route:gap});used.add(gap.c.key)}
 let frontier=pickCandidate('frontier',used);if(frontier){plan.push({type:'frontier',route:frontier});used.add(frontier.c.key)}
 let excludedSubjects=new Set(plan.map(x=>x.route.c.subject_key));
 let bridge=pickCandidate('bridge',used,excludedSubjects,true)||pickCandidate('bridge',used);
 if(bridge){plan.push({type:'bridge',route:bridge});used.add(bridge.c.key)}
 while(plan.length<4){let x=pickCandidate('general',used);if(!x)break;plan.push({type:'frontier',route:x});used.add(x.c.key)}
 return plan
}
function getFrontier(){let pick=pickCandidate('frontier')||pickCandidate('general')||{};frontierConcept=pick.c||concepts[0];let subject=getSubject(frontierConcept?.subject_key),state=states.find(x=>x.subject_key===subject?.key);currentRoute=pick;return {subject,state,concept:frontierConcept,reasons:pick.reasons||[],score:pick.score||0}}
async function loadApp(){show('app');$('logout').classList.remove('hidden');$('dailyMinutes').textContent=profile.daily_minutes;await loadCore();renderAll()}
function renderAll(){todayPlan=chooseSessionPlan();renderMap();renderPortfolio();renderForecast();renderToday();renderFrontier();renderWeekly();renderDiscovery()}
function renderMap(){
 $('mapItems').innerHTML=subjects.filter(s=>s.key!=='hvac').map(s=>{
   let e=subjectEvidence(s.key),ms=masteries.filter(m=>m.subject_key===s.key);
   if(!e.known)return `<div class="track"><div class="track-head"><span>${s.name}</span><span>Unknown</span></div><div class="barbg"></div><div class="track-sub">Atlas needs a diagnostic probe here — unknown is not zero.</div></div>`;
   let v=e.verified||0,b=e.boundary||0;
   return `<div class="track"><div class="track-head"><span>${s.name}</span><span>${v.toFixed(0)} verified / 100</span></div><div class="barbg"><div class="bar" style="width:${Math.min(100,v)}%"></div></div><div class="track-sub"><span>Demonstrated frontier L${b.toFixed(1)}/10</span><span class="${e.confidence<35?'confidence-low':'confidence-good'}">Confidence ${e.confidence.toFixed(0)}%</span><span>${ms.reduce((a,m)=>a+(+m.evidence_count||0),0)+(placementState(s.key)?.questions_answered||0)} evidence points</span><span>${e.source}</span></div></div>`
 }).join('')
}
function portfolioMetrics(){
 let es=subjects.map(s=>subjectEvidence(s.key)).filter(e=>e.known),v=es.length?es.reduce((a,e)=>a+(e.verified||0),0)/es.length:0,c=es.length?es.reduce((a,e)=>a+e.confidence,0)/es.length:0;
 return {v,c,count:es.length}
}
function renderPortfolio(){
 let mins=sessions.filter(x=>x.completed).reduce((a,s)=>a+(s.actual_minutes||0),0),pm=portfolioMetrics();
 $('lifetimeHours').textContent=(mins/60).toFixed(1);$('verifiedIndex').textContent=pm.v.toFixed(0);$('overallConfidence').textContent=pm.c.toFixed(0)+'%';$('domainsSampled').textContent=`${pm.count} / ${subjects.length}`;$('portfolioIndex').textContent=`Portfolio ${pm.v.toFixed(0)}/100`;
 let gs={};subjects.forEach(s=>{let g=s.group_key||'other';gs[g]=gs[g]||[];gs[g].push(s.key)});
 $('portfolioGroups').innerHTML=Object.entries(gs).map(([g,keys])=>{let vals=keys.map(k=>subjectEvidence(k)).filter(e=>e.known).map(e=>e.verified||0),gv=vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0;return `<div class="group-row"><div class="group-head"><span>${g.replaceAll('_',' ')}</span><span>${gv.toFixed(0)}</span></div><div class="barbg"><div class="bar" style="width:${Math.min(100,gv)}%"></div></div></div>`}).join('')
}
function renderForecast(){
 let w=profile.daily_minutes*profile.days_per_week/60,y=w*52,f=y*5,cur=portfolioMetrics().v||1,eff=.48+Math.min(.45,w*.055);
 $('weekly').textContent=w.toFixed(1);$('yearly').textContent=Math.round(y);$('fiveYearHours').textContent=Math.round(f);
 let pts=[['Now',cur],['6 mo',Math.min(100,cur+Math.sqrt(y*.5)*eff)],['1 yr',Math.min(100,cur+Math.sqrt(y)*eff*1.4)],['3 yr',Math.min(100,cur+Math.sqrt(y*3)*eff*2.0)],['5 yr',Math.min(100,cur+Math.sqrt(y*5)*eff*2.45)]];
 $('forecastText').textContent=`At your current schedule, Atlas models about ${Math.round(y)} deliberate learning hours per year. Progress is gated by demonstrated mastery, delayed retrieval, and prerequisite readiness — not time alone.`;
 $('forecastChart').innerHTML=pts.map(([l,v])=>`<div class="forecast-col"><b>${v.toFixed(0)}</b><div class="forecast-bar" style="height:${Math.max(4,v)}%"></div><span>${l}</span></div>`).join('');
 $('forecastMilestones').innerHTML=[['6 months','Foundational gaps shrinking while strong areas keep advancing.'],['1 year','Broad literacy with visible interdisciplinary bridges.'],['3 years','A connected generalist base with several deep frontiers.'],['5 years','Potential for unusually broad competence plus advanced depth in selected domains.']].map(([a,b])=>`<div class="milestone"><strong>${a}</strong><span>${b}</span></div>`).join('')
}
function taskLabel(p){
 let c=p.route.c,s=getSubject(c.subject_key)?.name||c.subject_key;
 if(p.type==='review')return ['Retrieval review',`${s}: ${c.name}`,'Retain'];
 if(p.type==='gap'&&p.route.diagnostic)return ['Map probe',`${s}: ${c.name}`,'Probe'];
 if(p.type==='gap')return ['Close a gap',`${s}: ${c.name}`,'Gap'];
 if(p.type==='bridge')return ['Build a bridge',`${s}: ${c.name}`,'Bridge'];
 return ['Push your frontier',`${s}: ${c.name}`,'Frontier']
}
function renderToday(){
 let now=new Date(),m=sessions.filter(s=>s.completed&&new Date(s.completed_at||s.created_at).getMonth()===now.getMonth()&&new Date(s.completed_at||s.created_at).getFullYear()===now.getFullYear()).reduce((a,s)=>a+(s.actual_minutes||0),0);$('monthMinutes').textContent=m;
 if(!todayPlan.length)todayPlan=chooseSessionPlan();
 let gapP=todayPlan.find(x=>x.type==='gap'),frontP=todayPlan.find(x=>x.type==='frontier'),bridgeP=todayPlan.find(x=>x.type==='bridge');
 $('todaySummary').textContent=`Today Atlas is ${gapP?.route.diagnostic?'testing an uncertain part of your map in':'closing'} ${getSubject(gapP?.route.c.subject_key)?.name||'a knowledge gap'}, pushing ${getSubject(frontP?.route.c.subject_key)?.name||'your frontier'}, and building a bridge into ${getSubject(bridgeP?.route.c.subject_key)?.name||'another field'} — while protecting what you already know.`;
 $('todayItems').innerHTML=todayPlan.map((p,i)=>{let [title,sub,badge]=taskLabel(p),key=`${p.type}_${p.route.c.key}`;return `<button class="task ${todayDone.has(key)?'done':''}" data-plan="${i}"><div><strong>${title}</strong><small>${sub} · ${p.route.reasons.slice(0,2).join(', ')||'adaptive priority'}</small></div><span>${todayDone.has(key)?'✓':badge+' ›'}</span></button>`}).join('');
 $('sessionDone').textContent=`${todayDone.size} / ${todayPlan.length} complete`;document.querySelectorAll('.task').forEach(b=>b.onclick=()=>openTask(+b.dataset.plan))
}
function renderFrontier(){
 let top=pickCandidate('frontier')||pickCandidate('general'),f=top?{concept:top.c,subject:getSubject(top.c.subject_key),reasons:top.reasons}:getFrontier(),e=subjectEvidence(f.subject?.key);
 $('frontierCard').innerHTML=`<div class="eyebrow">${f.subject?.name||'Frontier'}</div><strong>${f.concept?.name||'Next concept'}</strong><p>${f.concept?.description||''}</p><div class="track-sub"><span>Demonstrated frontier: L${(e.boundary||0).toFixed(1)}/10</span><span>Confidence: ${e.known?e.confidence.toFixed(0)+'%':'low'}</span><span>Target difficulty: ${conceptDifficulty(f.concept)}/10</span><span>Why now: ${(f.reasons||[]).join(' · ')}</span></div>`
}
function conceptDifficulty(c){if(!c)return 3;let lo=+c.difficulty_min||+c.level||3,hi=+c.difficulty_max||lo;return Math.max(1,Math.min(10,Math.round((lo+hi)/2)))}
function targetDifficulty(st){if(!st)return 3;return Math.max(2,Math.min(9,Math.round((+st.estimated_level)/12)))}
function strongestKnownSubject(){
 let ranked=subjects.map(s=>({s,e:subjectEvidence(s.key)})).filter(x=>x.e.confidence>=35).sort((a,b)=>b.e.ability-a.e.ability);
 return ranked[0]?.s||null
}
function recentAIContext(limit=8){
 return events.slice().sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,limit).map(e=>({type:e.event_type,score:+e.score||0,concept:e.concept_key,subject:conceptByKey(e.concept_key)?.subject_key||''}))
}
function learnerContextFor(concept,routeType){
 let e=subjectEvidence(concept.subject_key),m=conceptMastery(concept.key),strong=strongestKnownSubject(),bridgeFrom=bridgeSource(concept);
 return {route_type:routeType,subject:getSubject(concept.subject_key)?.name||concept.subject_key,concept:concept.name,difficulty:conceptDifficulty(concept),estimated_level:e.ability,estimate_confidence:e.confidence,concept_mastery:m?+m.mastery:null,retention_probability:m?+m.retention_probability:null,interests:[...interestKeys()],strong_subject:strong?.name||null,bridge_from:bridgeFrom?getSubject(bridgeFrom)?.name||bridgeFrom:null,recent_results:recentAIContext(),minutes:Math.max(6,Math.round(profile.daily_minutes/4))}
}

async function ai(mode){let f=getFrontier();$('aiOutput').classList.remove('hidden');$('aiOutput').innerHTML='<p>Building your next learning object…</p>';let ctx=learnerContextFor(f.concept,mode);ctx.mode=mode;ctx.minutes=Math.max(8,Math.round(profile.daily_minutes*.55));let {data,error}=await db.functions.invoke('atlas-ai-content',{body:ctx});if(error||!data){$('aiOutput').innerHTML='<p>Atlas could not generate this object right now. Your daily plan is still available.</p>';return}renderAI(data)}
function renderAI(d){$('aiOutput').innerHTML=`<div class="eyebrow">${d.provider==='atlas_fallback'?'ADAPTIVE ENGINE':'AI-GENERATED'}${d.modality?' · '+String(d.modality).toUpperCase():''}</div><h3>${d.title}</h3>${d.hook?`<div class="notice">${d.hook}</div>`:''}<p><strong>Objective:</strong> ${d.objective||''}</p><div class="ai-section"><p>${d.explanation||''}</p></div><div class="ai-section"><strong>Example</strong><p>${d.example||''}</p></div>${d.connection?`<div class="ai-section"><strong>Connection</strong><p>${d.connection}</p></div>`:''}<div class="ai-section"><strong>Challenge</strong><p>${d.challenge||''}</p></div>${d.media_hint?`<p class="fineprint">Visual aid: ${d.media_hint}</p>`:''}<div class="ai-section"><strong>Quick check</strong><p>${d.quiz?.prompt||''}</p>${(d.quiz?.options||[]).map((x,i)=>`<button class="answer aiQuiz" data-i="${i}" data-correct="${d.quiz.correct_index}">${x}</button>`).join('')}<p id="aiQuizMsg"></p></div>${d.note?`<p class="fineprint">${d.note}</p>`:''}`;document.querySelectorAll('.aiQuiz').forEach(b=>b.onclick=()=>{$('aiQuizMsg').textContent=+b.dataset.i===+b.dataset.correct?'Correct — that is evidence of transfer, not just recognition.':'Not quite. Re-read the mechanism and try again.'})}
document.querySelectorAll('.aiAction').forEach(b=>b.onclick=()=>ai(b.dataset.mode));

async function openTask(planIndex){
 let p=todayPlan[planIndex];if(!p)return;let type=p.type,f={concept:p.route.c,subject:getSubject(p.route.c.subject_key)},st=states.find(s=>s.subject_key===f.subject?.key);
 taskOpenedAt=Date.now();
 if(type==='review'){
   $('modalBody').innerHTML=`<div class="eyebrow">RETRIEVAL · ${f.subject?.name||''}</div><h2>${f.concept?.name}</h2><p>Without looking anything up, explain what you remember. Specific mechanisms, examples, or connections are stronger evidence than recognition.</p><textarea id="retrieveText" placeholder="Write from memory…"></textarea><label class="fineprint">How complete did your recall feel?</label><select id="recallQuality"><option value="uncertain">Uncertain — major gaps</option><option value="partial">Partial — main idea, missing detail</option><option value="clear">Clear — mechanism and detail</option></select><button id="taskDone" class="primary">Save retrieval</button>`;
   $('taskDone').onclick=()=>completeTask(planIndex)
 }else{
   let isProbe=type==='gap'&&p.route.diagnostic,mode=type==='bridge'?'application':isProbe?'question':type==='gap'?'lesson':type==='frontier'?'challenge':'lesson',ctx=learnerContextFor(f.concept,isProbe?'probe':type);ctx.mode=mode;
   let {data,error}=await db.functions.invoke('atlas-ai-content',{body:ctx});
   if(error||!data){
     data={title:f.concept?.name,explanation:f.concept?.description||'Use what you already know to reason through this concept.',challenge:'Explain the central mechanism in your own words, then choose the best statement below.',quiz:{prompt:'Which response best reflects a useful learning strategy when evidence is incomplete?',options:['Guess confidently and move on','State what you know, identify uncertainty, and test the missing piece','Avoid the topic entirely'],correct_index:1}};
   }
   let q=data.quiz||{};if(!Number.isInteger(q.correct_index)||!Array.isArray(q.options)||q.options.length<2){q={prompt:'Which approach best demonstrates understanding?',options:['Restate a term without explaining it','Explain the mechanism and apply it to a new example','Skip the evidence and rely on confidence'],correct_index:1}};let opts=(q.options||[]).map((x,i)=>`<button class="answer taskQuiz" type="button" data-i="${i}">${x}</button>`).join('');
   $('modalBody').innerHTML=isProbe?`<div class="eyebrow">MAP PROBE · ${f.subject?.name||''}</div><h2>${f.concept?.name}</h2><div class="notice">This is a placement probe, not a grade. Atlas is checking whether it should move faster, slower, or stay here.</div><div class="ai-section"><strong>Diagnostic check</strong><p>${q.prompt||'Choose the best answer.'}</p>${opts}<p id="taskQuizMsg" class="fineprint">Your answer calibrates the map. It will not erase prior progress.</p></div><button id="taskDone" class="primary" disabled>Record probe</button>`:`<div class="eyebrow">${type.toUpperCase()} · ${f.subject?.name||''}${data.modality?' · '+String(data.modality).toUpperCase():''}</div><h2>${data.title||f.concept?.name}</h2>${data.hook?`<div class="notice">${data.hook}</div>`:''}<p>${data.explanation||''}</p>${data.connection?`<div class="frontier-card"><strong>Why this connects</strong><p>${data.connection}</p></div>`:''}<div class="frontier-card"><strong>${type==='bridge'?'Cross-domain application':type==='gap'?'Foundation check':'Stretch challenge'}</strong><p>${type==='bridge'?(data.example||data.challenge||'Connect this concept to a system you already understand.'):(data.challenge||data.example||'Apply the idea.')}</p></div>${data.media_hint?`<p class="fineprint">Visual aid: ${data.media_hint}</p>`:''}${type==='bridge'?'<textarea id="applyText" placeholder="Explain the connection or application in your own words…"></textarea>':''}<div class="ai-section"><strong>Quick check</strong><p>${q.prompt||'Which choice best matches the mechanism?'}</p>${opts}<p id="taskQuizMsg" class="fineprint">Choose an answer before completing the block.</p></div><button id="taskDone" class="primary" disabled>Record evidence</button>`;
   $('taskDone').dataset.provider=data.provider||'unknown';
   let selected=null;document.querySelectorAll('.taskQuiz').forEach(b=>b.onclick=()=>{selected=+b.dataset.i;document.querySelectorAll('.taskQuiz').forEach(x=>x.classList.toggle('selected',x===b));$('taskDone').disabled=false;$('taskDone').dataset.selected=selected;$('taskDone').dataset.correct=q.correct_index??-999});
   $('taskDone').onclick=()=>completeTask(planIndex)
 }
 $('modal').classList.remove('hidden')
}
$('closeModal').onclick=()=>$('modal').classList.add('hidden');
async function completeTask(planIndex){
 let p=todayPlan[planIndex];if(!p)return;let type=p.type,concept=p.route.c,key=`${type}_${concept.key}`,difficulty=conceptDifficulty(concept),score=0;
 if(type==='review'){
   let txt=($('retrieveText')?.value||'').trim(),quality=$('recallQuality')?.value;
   if(txt.length<40)return alert('Give Atlas enough recall evidence to work with — about two sentences.');
   $('taskDone').disabled=true;$('taskDone').textContent='Evaluating recall…';
   let ctx=learnerContextFor(concept,'review');ctx.mode='evaluate';ctx.response_text=txt;ctx.self_rating=quality;
   let {data:ev,error:evalError}=await db.functions.invoke('atlas-ai-content',{body:ctx});
   score=Math.max(0,Math.min(100,Number(ev?.score)||30));
   if(evalError)score=Math.min(score,40);
 }else{
   let b=$('taskDone'),provider=b?.dataset.provider||'unknown',sel=+(b?.dataset.selected??-999),correct=+(b?.dataset.correct??-998);
   if(!Number.isInteger(sel)||sel<0)return alert('Complete the quick check first.');
   let bridgeText=type==='bridge'?(($('applyText')?.value||'').trim()):'';
   if(type==='bridge'&&bridgeText.length<30)return alert('Explain the bridge in your own words before recording it.');
   score=sel===correct?(type==='frontier'?90:type==='bridge'?78:84):38;
   if(type==='bridge'){
     $('taskDone').disabled=true;$('taskDone').textContent='Evaluating connection…';
     let ctx=learnerContextFor(concept,'bridge');ctx.mode='evaluate';ctx.response_text=bridgeText;ctx.self_rating='not supplied';
     let {data:ev}=await db.functions.invoke('atlas-ai-content',{body:ctx});let written=Math.max(0,Math.min(100,Number(ev?.score)||35));
     score=Math.round(score*.45+written*.55);if(ev?.provider==='atlas_fallback')score=Math.min(score,50)
   }
   if(provider==='atlas_fallback')score=Math.min(score,50)
 }
 let elapsed=Math.max(20,Math.round((Date.now()-taskOpenedAt)/1000)),perTaskCap=Math.max(120,Math.round((profile.daily_minutes*60/Math.max(1,todayPlan.length))*1.5));
 elapsed=Math.min(elapsed,perTaskCap);sessionActiveSeconds+=elapsed;
 todayDone.add(key);
 let provider=$('taskDone')?.dataset.provider||'unknown',probeFallback=!!(p.route.diagnostic&&provider==='atlas_fallback');
 if(probeFallback)await db.from('learning_events').insert({user_id:user.id,concept_key:concept.key,event_type:'probe_unverified',score:null,difficulty,duration_seconds:elapsed,modality:'probe'});
 else await recordEvidence(concept,type,score,difficulty,elapsed);
 $('modal').classList.add('hidden');renderToday();
 if(todayDone.size===todayPlan.length){
   let actual=Math.max(1,Math.min(profile.daily_minutes,Math.round(sessionActiveSeconds/60)));
   let r=await db.from('study_sessions').insert({user_id:user.id,planned_minutes:profile.daily_minutes,actual_minutes:actual,session_type:'adaptive_v052',completed:true,completed_at:new Date().toISOString()});
   if(!r.error){todayDone.clear();sessionActiveSeconds=0;await loadCore();todayPlan=chooseSessionPlan();renderAll();celebrate(actual)} 
 }
}


function weekStart(){let d=new Date(),day=(d.getDay()+6)%7;d.setHours(0,0,0,0);d.setDate(d.getDate()-day);return d}
function renderWeekly(){let ws=weekStart(),weekSessions=sessions.filter(s=>s.completed&&new Date(s.completed_at||s.created_at)>=ws),mins=weekSessions.reduce((a,s)=>a+(s.actual_minutes||0),0),weekEvents=events.filter(e=>new Date(e.created_at)>=ws),conceptCount=new Set(weekEvents.map(e=>e.concept_key).filter(Boolean)).size,retr=weekEvents.filter(e=>e.event_type==='review').length,goal=profile.weekly_goal_minutes||profile.daily_minutes*profile.days_per_week,pct=Math.min(100,Math.round(mins/Math.max(1,goal)*100));$('weeklyPct').textContent=pct+'%';$('weeklyBar').style.width=pct+'%';$('weeklyMinutes').textContent=`${mins} / ${goal}`;$('weeklyConcepts').textContent=conceptCount;$('weeklyRetrievals').textContent=retr;$('weeklyStatement').innerHTML=`<strong>${pct>=100?'Weekly deposit complete.':'Keep compounding.'}</strong><p>${Math.max(0,goal-mins)} active minutes remain. Atlas is prioritizing evidence, not screen time. This week you touched ${conceptCount} concepts and completed ${retr} retrievals.</p>`}
function renderDiscovery(){
 let strong=subjects.map(s=>({s,e:subjectEvidence(s.key)})).filter(x=>x.e.known).sort((a,b)=>b.e.ability-a.e.ability)[0],bridge=pickCandidate('bridge');
 let target=bridge?.c,weak=target?getSubject(target.subject_key):subjects.map(s=>({s,e:subjectEvidence(s.key)})).filter(x=>!x.e.known||x.e.ability<45)[0]?.s;
 $('discoveryCard').innerHTML=`<div class="eyebrow">BRIDGE OPPORTUNITY</div><strong>${strong?.s.name||'What you know'} → ${weak?.name||'a new domain'}</strong><p>Atlas looks for a concept where existing knowledge can become scaffolding for unfamiliar knowledge. One useful connection, then the feed ends.</p>`
}
$('newDiscovery').onclick=()=>{
 let strong=subjects.map(s=>({s,e:subjectEvidence(s.key)})).filter(x=>x.e.known).sort((a,b)=>b.e.ability-a.e.ability)[0],b=pickCandidate('bridge'),c=b?.c,s=getSubject(c?.subject_key);
 $('discoveryCard').innerHTML=`<div class="eyebrow">CONNECTION DISCOVERED</div><strong>${strong?.s.name||'Existing strength'} → ${s?.name||'new territory'}</strong><p>${c?.description||'Atlas found a useful cross-domain bridge.'}</p><p>Ask yourself: <em>what mechanism, constraint, incentive, or physical principle appears in both fields?</em></p><p class="fineprint">Why this surfaced: ${(b?.reasons||[]).join(', ')}. Discovery stops here so curiosity turns into deliberate learning instead of endless scrolling.</p>`
}
async function recordEvidence(concept,type,score,difficulty,durationSeconds=0){
 if(!concept?.key)return;let source=type==='bridge'?'assignment':type==='review'?'review':type==='frontier'?'quiz':type==='gap'?'quiz':'lesson';
 let r=await fetch(`${URL}/rest/v1/rpc/record_learning_evidence`,{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+db.token(),'Content-Type':'application/json'},body:JSON.stringify({p_concept:concept.key,p_type:source,p_score:score,p_difficulty:difficulty,p_source:`v051_${type}_${Date.now()}`})});
 await db.from('learning_events').insert({user_id:user.id,concept_key:concept.key,event_type:source,score,difficulty,duration_seconds:durationSeconds,modality:type});return r.ok
}
function celebrate(actualMinutes=0){
 let total=sessions.filter(x=>x.completed).reduce((a,s)=>a+(s.actual_minutes||0),0)+actualMinutes;
 $('celebrationTitle').textContent=total>=12000?'200 hours invested.':total>=6000?'100 hours invested.':total>=3000?'50 hours invested.':total>=1500?'25 hours invested.':total>=600?'10 hours invested.':'Today’s deposit is complete.';
 $('celebrationText').textContent=`${actualMinutes||'Your'} active minutes produced new evidence across retention, a broad gap, an advancing frontier, and an interdisciplinary bridge. Your map has been recalculated from demonstrated performance.`;
 $('celebration').classList.remove('hidden')
}
$('closeCelebration').onclick=()=>{$('celebration').classList.add('hidden');document.querySelector('[data-page="map"]').click()}

$('sendFeedback').onclick=async()=>{let r=await db.from('tester_feedback').insert({user_id:user.id,page_key:'v0.5.2',feedback_type:$('feedbackType').value,message:$('feedbackText').value});$('feedbackMessage').textContent=r.error?r.error.message:'Thanks — feedback saved.';if(!r.error)$('feedbackText').value=''};
document.querySelectorAll('.main-nav button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.main-nav button').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.page').forEach(x=>x.classList.toggle('hidden',x.id!==b.dataset.page))});

async function boot(){let u=(await db.auth.getUser()).data.user;if(!u){$('logout').classList.add('hidden');show('auth');return}user=u;$('logout').classList.remove('hidden');let r=await db.from('profiles').select('*').eq('user_id',u.id).single();if(r.error){$('authMessage').textContent='Profile load failed: '+r.error.message;show('auth');return}profile=r.data;if(!profile.onboarding_complete){$('minutes').value=profile.daily_minutes;$('days').value=profile.days_per_week;show('onboarding');return}if(!['v0.4','v0.5'].includes(profile.placement_version)){assessmentLanding();return}loadApp()}
mode('signup');boot();