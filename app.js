const URL='https://fhjutbhyvaamzzsipwaa.supabase.co';
const KEY='sb_publishable_Ytbw_MTkDIhZP1KerZ4bAw_P7XPwFH_';
const db=window.createAtlasClient(URL,KEY);
const CORE_LESSONS=window.ATLAS_CORE_LESSONS||{};
const ATLAS_VERSION='v0.8.1',ATLAS_BUILD='2026.08.18',ATLAS_DATA_SCHEMA=3;
window.addEventListener('error',e=>{
  const msg='Atlas hit an unexpected screen error. Your saved progress is not erased.';
  const status=document.getElementById('systemStatus'),auth=document.getElementById('authMessage');
  if(status&&!status.classList.contains('hidden')||document.getElementById('app')&&!document.getElementById('app').classList.contains('hidden')){if(status){status.textContent=msg;status.classList.remove('hidden');status.classList.add('status-error')}}else if(auth)auth.textContent=msg;
});
const $=id=>document.getElementById(id);

const ATLAS_VERSION_MANIFEST='version.json';
let atlasUpdateCheckInFlight=false;

function atlasVersionToken(v){
 return String(v||'').replace(/^v/i,'').replace(/[^0-9]+/g,'');
}
function cleanAtlasRefreshParams(){
 try{
  let u=new URL(location.href),changed=false;
  if(u.searchParams.has('v')){u.searchParams.delete('v');changed=true}
  if(u.searchParams.has('atlas_refresh')){u.searchParams.delete('atlas_refresh');changed=true}
  if(changed)history.replaceState({},document.title,u.pathname+(u.searchParams.toString()?`?${u.searchParams}`:'')+u.hash)
 }catch{}
}
async function checkForAtlasUpdate({showStatus=false}={}){
 if(atlasUpdateCheckInFlight)return false;
 atlasUpdateCheckInFlight=true;
 try{
  let stamp=Date.now(),r=await fetch(`${ATLAS_VERSION_MANIFEST}?atlas_check=${stamp}`,{
   cache:'no-store',
   headers:{'Cache-Control':'no-cache','Pragma':'no-cache'}
  });
  if(!r.ok)return false;
  let latest=await r.json(),latestVersion=String(latest?.version||'').trim();
  if(!latestVersion||latestVersion===ATLAS_VERSION)return false;

  try{localStorage.setItem('atlas_latest_version',latestVersion)}catch{}
  if(showStatus&&$('systemStatus')){
   $('systemStatus').textContent=`A newer Atlas build (${latestVersion}) is available. Refreshing…`;
   $('systemStatus').classList.remove('hidden')
  }

  // A unique query forces the browser to request a fresh index.html.
  // The newly loaded build removes these temporary parameters from the address bar.
  let u=new URL(location.href);
  u.searchParams.set('v',atlasVersionToken(latestVersion)||latestVersion);
  u.searchParams.set('atlas_refresh',String(stamp));
  location.replace(u.href);
  return true
 }catch(err){
  console.warn('Atlas update check skipped:',err);
  return false
 }finally{
  atlasUpdateCheckInFlight=false
 }
}

let authMode='signup',user=null,profile=null,subjects=[],concepts=[],states=[],sessions=[],masteries=[],interests=[],prereqs=[],events=[],attempt=null,round=1,qIndex=0,answers=[],roundQs=[],openIndex=0,todayDone=new Set(),frontierConcept=null,currentRoute=null,deepDiveSubjectKey=null,todayPlan=[],dailySessionComplete=false,guidedSessionActive=false,taskOpenedAt=0,sessionActiveSeconds=0,activityBySubject={},activityByConcept={},misconceptions=[],modalityPerf=[],curiosityQueue=[],learningObjects=[],connections=[],milestones=[],curatedMedia=[],activeLearningObject=null,assessmentBusy=false,progressCache={},activeDiscovery=null,discoverySeen=new Set(),prefetchInFlight=new Set(),coreLoadWarning='',sessionArc=null,sessionMode='balanced',activeTutorSessionId=null,activeTutorState=null,openEvaluations=[];
const VIEWS=['auth','onboarding','assessmentIntro','assessment','checkpoint','app'];
const EXTRA=['Science','Health & Medicine','Trades & Construction','Business & Leadership','Accounting & Economics','Technology & AI','History & Geopolitics','Psychology & Philosophy','Arts & Culture'];

const BASE_ITEMS=[{"key":"a_reason_v2","subject":"reasoning","difficulty":3,"prompt":"A city notices that neighborhoods with more fire trucks also tend to have more fire damage. Which interpretation is strongest?","options":[{"text":"Fire trucks probably cause much of the extra damage.","score":0,"level":"plausible_misconception","id":"a","pattern":"plausible_misconception","code":"a_reason_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"The pattern is suspicious, but observational data like this cannot tell us anything useful.","score":1,"level":"mixed_model","id":"b","pattern":"mixed_model","code":"a_reason_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Larger fires could cause both more trucks to be sent and more damage.","score":2,"level":"near_miss","id":"c","pattern":"near_miss","code":"a_reason_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Fire severity is a plausible common cause, so the association alone does not establish that trucks cause damage.","score":3,"level":"full_model","id":"d","pattern":"full_model","code":"a_reason_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},{"key":"a_math_v2","subject":"mathematics","difficulty":3,"prompt":"A $240 bill is reduced by 15%. Which reasoning best represents the calculation?","options":[{"text":"Subtract 15 from 240 because the discount is 15.","score":0,"level":"plausible_misconception","id":"a","pattern":"plausible_misconception","code":"a_math_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Find 15% of 240, which is 36; that 36 is the new total.","score":1,"level":"mixed_model","id":"b","pattern":"mixed_model","code":"a_math_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Find 15% of 240 (=36), then subtract it: 240 − 36 = 204.","score":2,"level":"near_miss","id":"c","pattern":"near_miss","code":"a_math_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Multiply by the remaining 85%: 240 × 0.85 = 204; this is equivalent to subtracting the 15% discount.","score":3,"level":"full_model","id":"d","pattern":"full_model","code":"a_math_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},{"key":"a_stats_v2","subject":"statistics","difficulty":3,"prompt":"A poll about a national issue is answered only by volunteers from one news website. What is the strongest concern?","options":[{"text":"There is no meaningful concern if thousands of people respond.","score":0,"level":"plausible_misconception","id":"a","pattern":"plausible_misconception","code":"a_stats_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"The main problem is ordinary random sampling error.","score":1,"level":"mixed_model","id":"b","pattern":"mixed_model","code":"a_stats_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"The sample may have selection bias because volunteers from one website may not represent the population.","score":2,"level":"near_miss","id":"c","pattern":"near_miss","code":"a_stats_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Selection and coverage bias can limit generalization because both website readership and willingness to volunteer may be related to the opinion being measured.","score":3,"level":"full_model","id":"d","pattern":"full_model","code":"a_stats_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},{"key":"a_phys_v2","subject":"physics","difficulty":3,"prompt":"A car travels around a circular track at constant speed. Which statement best describes its motion?","options":[{"text":"It is not accelerating because its speed is constant.","score":0,"level":"plausible_misconception","id":"a","pattern":"plausible_misconception","code":"a_phys_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"It accelerates only if the engine is producing more power.","score":1,"level":"mixed_model","id":"b","pattern":"mixed_model","code":"a_phys_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"It is accelerating because its direction is changing even though its speed is constant.","score":2,"level":"near_miss","id":"c","pattern":"near_miss","code":"a_phys_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Its velocity vector changes continuously, so it has inward (centripetal) acceleration even at constant speed.","score":3,"level":"full_model","id":"d","pattern":"full_model","code":"a_phys_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},{"key":"a_chem_v2","subject":"chemistry","difficulty":3,"prompt":"What most fundamentally determines which chemical element an atom is?","options":[{"text":"Its physical size.","score":0,"level":"plausible_misconception","id":"a","pattern":"plausible_misconception","code":"a_chem_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Its number of electrons, because electrons control chemistry.","score":1,"level":"mixed_model","id":"b","pattern":"mixed_model","code":"a_chem_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Its number of protons.","score":2,"level":"near_miss","id":"c","pattern":"near_miss","code":"a_chem_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Its proton count (atomic number); changing electrons makes ions and changing neutrons makes isotopes, but neither changes the element.","score":3,"level":"full_model","id":"d","pattern":"full_model","code":"a_chem_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},{"key":"a_bio_v2","subject":"biology","difficulty":3,"prompt":"Which description of a gene is strongest?","options":[{"text":"A gene is a complete organ that performs one biological job.","score":0,"level":"plausible_misconception","id":"a","pattern":"plausible_misconception","code":"a_bio_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"A gene is the trait itself—for example, 'blue eyes' is a gene.","score":1,"level":"mixed_model","id":"b","pattern":"mixed_model","code":"a_bio_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"A gene is a segment of DNA that contains biological instructions.","score":2,"level":"near_miss","id":"c","pattern":"near_miss","code":"a_bio_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"A gene is a DNA region whose information can contribute to functional products and traits; its effect also depends on regulation and context.","score":3,"level":"full_model","id":"d","pattern":"full_model","code":"a_bio_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},{"key":"a_med_v2","subject":"medicine","difficulty":3,"prompt":"Why do ordinary antibiotics generally not treat viral infections?","options":[{"text":"Viruses are too small for medicines to affect.","score":0,"level":"plausible_misconception","id":"a","pattern":"plausible_misconception","code":"a_med_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Antibiotics work only when an infection is severe enough.","score":1,"level":"mixed_model","id":"b","pattern":"mixed_model","code":"a_med_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Many antibiotics target bacterial structures or processes that viruses do not have.","score":2,"level":"near_miss","id":"c","pattern":"near_miss","code":"a_med_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Antibiotics target bacterial machinery such as cell-wall or ribosomal processes; viruses replicate using host-cell machinery, so different targets and treatments are needed.","score":3,"level":"full_model","id":"d","pattern":"full_model","code":"a_med_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},{"key":"a_health_v2","subject":"health_wellness","difficulty":3,"prompt":"Which statement best captures why regular sleep matters?","options":[{"text":"Sleep mainly rests muscles; most other body systems are unaffected.","score":0,"level":"plausible_misconception","id":"a","pattern":"plausible_misconception","code":"a_health_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Sleep matters mostly because it prevents feeling tired the next morning.","score":1,"level":"mixed_model","id":"b","pattern":"mixed_model","code":"a_health_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Sleep supports cognition, recovery, metabolism, and immune function.","score":2,"level":"near_miss","id":"c","pattern":"near_miss","code":"a_health_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Sleep supports multiple interacting systems—including memory, cognition, metabolic regulation, immune function, and recovery—without guaranteeing health by itself.","score":3,"level":"full_model","id":"d","pattern":"full_model","code":"a_health_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},{"key":"a_hist_v2","subject":"history","difficulty":3,"prompt":"What most clearly distinguishes the Industrial Revolution from earlier agrarian economies?","options":[{"text":"It was mainly a political uprising that replaced monarchies with elected governments.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"a_hist_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Factories and cities grew, mainly because farming largely disappeared and most food began being produced in factories.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"a_hist_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Mechanized factory production expanded and productivity rose, largely because steam power simply replaced human labor.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"a_hist_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Mechanization, new energy sources, factory organization, and capital investment greatly increased production and helped drive urbanization and wider economic change.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"a_hist_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},{"key":"a_geo_v2","subject":"geography","difficulty":3,"prompt":"Why did many early civilizations develop near major rivers?","options":[{"text":"Rivers mainly prevented wars by creating natural borders.","score":0,"level":"plausible_misconception","id":"a","pattern":"plausible_misconception","code":"a_geo_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"The main benefit was simply having drinking water nearby.","score":1,"level":"mixed_model","id":"b","pattern":"mixed_model","code":"a_geo_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Rivers provided water and fertile soils that supported farming and settlement.","score":2,"level":"near_miss","id":"c","pattern":"near_miss","code":"a_geo_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Rivers could combine water, fertile floodplains, irrigation, transportation, and trade—while also creating flood and disease risks societies had to manage.","score":3,"level":"full_model","id":"d","pattern":"full_model","code":"a_geo_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},{"key":"a_econ_v2","subject":"economics","difficulty":3,"prompt":"A popular concert has a fixed number of seats, but demand for tickets suddenly increases. Which explanation is strongest?","options":[{"text":"Prices should fall because more people want the tickets.","score":0,"level":"plausible_misconception","id":"a","pattern":"plausible_misconception","code":"a_econ_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Prices must rise by exactly the same percentage that demand increased.","score":1,"level":"mixed_model","id":"b","pattern":"mixed_model","code":"a_econ_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Prices will generally face upward pressure because more buyers are competing for the same limited supply.","score":2,"level":"near_miss","id":"c","pattern":"near_miss","code":"a_econ_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"With short-run supply constrained and other conditions roughly unchanged, higher demand creates upward price pressure; the exact price change depends on market conditions and responsiveness.","score":3,"level":"full_model","id":"d","pattern":"full_model","code":"a_econ_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},{"key":"a_gov_v2","subject":"government","difficulty":3,"prompt":"Which description of the U.S. Congress is strongest?","options":[{"text":"Congress is the President and the Supreme Court acting together.","score":0,"level":"plausible_misconception","id":"a","pattern":"plausible_misconception","code":"a_gov_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Congress is the federal government's main lawmaking institution.","score":1,"level":"mixed_model","id":"b","pattern":"mixed_model","code":"a_gov_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Congress is a bicameral legislature made up of the House of Representatives and Senate.","score":2,"level":"near_miss","id":"c","pattern":"near_miss","code":"a_gov_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Congress is the bicameral federal legislature: the House represents population by district while the Senate gives each state equal representation, with both chambers participating in federal lawmaking.","score":3,"level":"full_model","id":"d","pattern":"full_model","code":"a_gov_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},{"key":"a_comp_v2","subject":"computing","difficulty":3,"prompt":"What is RAM mainly doing while you use a computer?","options":[{"text":"Keeping files permanently even after the power is turned off.","score":0,"level":"plausible_misconception","id":"a","pattern":"plausible_misconception","code":"a_comp_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Providing the internet connection used by every program.","score":1,"level":"mixed_model","id":"b","pattern":"mixed_model","code":"a_comp_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Holding temporary working data and instructions for active programs.","score":2,"level":"near_miss","id":"c","pattern":"near_miss","code":"a_comp_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Providing fast, volatile working memory close to the CPU for active data/instructions; its contents normally disappear when power is removed.","score":3,"level":"full_model","id":"d","pattern":"full_model","code":"a_comp_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},{"key":"a_phil_v2","subject":"philosophy","difficulty":3,"prompt":"Which statement is the clearest factual claim about a room rather than a value judgment?","options":[{"text":"This room is more comfortable than the room next door.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"a_phil_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"The room is 72°F, so it is objectively comfortable.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"a_phil_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Most people in the room report that 72°F feels comfortable.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"a_phil_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"A calibrated thermometer reads 72°F in the room.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"a_phil_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},{"key":"a_cult_v2","subject":"culture_society","difficulty":3,"prompt":"When studying an unfamiliar culture, which approach is strongest?","options":[{"text":"Start by assuming your own society's norms are the neutral standard.","score":0,"level":"plausible_misconception","id":"a","pattern":"plausible_misconception","code":"a_cult_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Avoid judgment by assuming everyone in that culture believes and behaves the same way.","score":1,"level":"mixed_model","id":"b","pattern":"mixed_model","code":"a_cult_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Understand practices in their historical and social context before evaluating them.","score":2,"level":"near_miss","id":"c","pattern":"near_miss","code":"a_cult_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Study practices in historical/social context while also accounting for internal diversity, disagreement, institutions, and change over time.","score":3,"level":"full_model","id":"d","pattern":"full_model","code":"a_cult_v2_full_model","meaning":"The complete model expected at this question difficulty."}]}];
const FOUNDATION_ITEMS={"reasoning":{"key":"f_reason_v2","subject":"reasoning","difficulty":2,"prompt":"Ice-cream sales and sunburns both rise during summer. What is the best first explanation?","options":[{"text":"Ice cream probably causes sunburn because both increase at the same time.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"f_reason_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Sunny weather likely increases sunburns, but sunburn itself is probably what makes people buy more ice cream.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"f_reason_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Hot, sunny weather could increase both, although seeing the pattern means weather has been proven to be the cause.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"f_reason_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Hot, sunny weather is a plausible common cause that can increase both, so the correlation alone does not show that ice cream causes sunburn.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"f_reason_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},"mathematics":{"key":"f_math_v2","subject":"mathematics","difficulty":2,"prompt":"Which reasoning best explains what 25% of 80 equals?","options":[{"text":"25, because the percentage number itself becomes the answer.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"f_math_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"80 × 0.25 = 20, then subtract 20 from 80 because percentages always represent discounts, giving 60.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"f_math_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"20, because 25% is one quarter of 80, though this does not yet connect the percent to its decimal form.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"f_math_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"20, because 25% = 0.25 = one quarter, and 80 × 0.25 = 20.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"f_math_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},"statistics":{"key":"f_stats_v2","subject":"statistics","difficulty":2,"prompt":"A school wants student opinions. Which sample is most likely to represent the whole school?","options":[{"text":"Use the first 50 volunteers; a sample of 50 is large enough to remove selection bias.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"f_stats_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Randomly choose 50 students, but only from sports teams in each grade; random selection within the teams makes it representative of everyone.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"f_stats_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Randomly choose 50 students from the full student list; that reduces selection bias and guarantees the sample will exactly match the school.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"f_stats_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Randomly choose 50 students from the full student list; this gives students a known chance of selection and reduces selection bias, though sampling error can remain.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"f_stats_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},"physics":{"key":"f_phys_v2","subject":"physics","difficulty":2,"prompt":"A car's velocity changes from 10 m/s east to 20 m/s east. Which statement is strongest?","options":[{"text":"It did not accelerate because it kept moving east.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"f_phys_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"It accelerated because its speed changed, but acceleration exists only while the engine is actively pushing the car.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"f_phys_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"It accelerated because its speed increased while direction stayed east; the missing piece is how quickly that velocity change happened.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"f_phys_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Its velocity changed from 10 m/s east to 20 m/s east, so it accelerated; the acceleration magnitude depends on how quickly that velocity changed.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"f_phys_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},"chemistry":{"key":"f_chem_v2","subject":"chemistry","difficulty":2,"prompt":"A neutral atom has 8 protons. Which statement is strongest?","options":[{"text":"It must have 16 electrons because each proton needs two electrons to become neutral.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"f_chem_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"A neutral atom should have 8 electrons, and it must also have exactly 8 neutrons because neutrons balance electric charge too.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"f_chem_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"It has 8 electrons because neutral atoms balance proton and electron charge, but changing the electron count would change which element it is.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"f_chem_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"It has 8 electrons because total positive and negative charge balance; changing electrons makes an ion, while proton count determines the element.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"f_chem_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},"biology":{"key":"f_bio_v2","subject":"biology","difficulty":2,"prompt":"Which relationship is most accurate?","options":[{"text":"DNA is an organ that contains cells.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"f_bio_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Cells can contain DNA, and DNA contains proteins that directly turn into traits.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"f_bio_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Cells contain DNA, and DNA contains genes that can provide instructions for proteins.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"f_bio_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Cells contain DNA; genes are DNA regions whose information can produce functional RNAs or proteins, with regulation affecting when and how they are expressed.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"f_bio_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},"medicine":{"key":"f_med_v2","subject":"medicine","difficulty":2,"prompt":"Which statement best distinguishes bacteria from viruses?","options":[{"text":"Viruses are simply antibiotic-resistant bacteria.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"f_med_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Bacteria are cellular organisms and viruses are not cells, but viruses reproduce independently once they enter the body.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"f_med_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Bacteria are cells while viruses depend on host cells to reproduce.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"f_med_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Bacteria are cellular organisms; viruses are acellular infectious agents that use host-cell machinery, which is one reason their treatment targets differ.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"f_med_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},"health_wellness":{"key":"f_health_v2","subject":"health_wellness","difficulty":2,"prompt":"Which sleep habit most directly supports a stable sleep-wake rhythm?","options":[{"text":"Use caffeine late in the day so bedtime can be delayed while keeping the same wake time.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"f_health_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Keep wake time consistent but change bedtime by several hours; wake time alone fully stabilizes the sleep-wake rhythm.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"f_health_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Keep sleep and wake times reasonably consistent; this helps circadian timing and by itself guarantees good sleep.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"f_health_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Keep sleep and wake times reasonably consistent; that supports circadian timing, while light exposure, sleep need, health, and other factors also matter.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"f_health_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},"history":{"key":"f_hist_v2","subject":"history","difficulty":2,"prompt":"Why is the Industrial Revolution considered a major historical turning point?","options":[{"text":"It was a single war in which factories replaced farms after one decisive event.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"f_hist_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Factory production and urban growth increased, but agriculture and older work patterns disappeared almost immediately everywhere.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"f_hist_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Mechanization and factories increased production and urbanization, mainly because steam power alone transformed every economy in the same way.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"f_hist_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Mechanization, new energy sources, factories, and changing labor/productivity transformed economies and urban life over time, unevenly across regions.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"f_hist_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},"geography":{"key":"f_geo_v2","subject":"geography","difficulty":2,"prompt":"Which statement best distinguishes weather from climate?","options":[{"text":"Weather describes long-term averages, while climate describes what is happening today.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"f_geo_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Weather is short-term and climate is long-term, but one unusually hot day by itself proves the climate has changed.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"f_geo_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Weather describes short-term atmospheric conditions, while climate describes longer-term averages.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"f_geo_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Weather describes short-term atmospheric conditions; climate describes longer-term patterns and distributions, so a single event alone does not establish a climate trend.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"f_geo_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},"economics":{"key":"f_econ_v2","subject":"economics","difficulty":2,"prompt":"You have $20 and can buy either a book or a meal, but not both. What does the choice illustrate?","options":[{"text":"It illustrates inflation because spending money makes prices rise.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"f_econ_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"It illustrates scarcity because money is limited, but the opportunity cost is simply the $20 that was spent.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"f_econ_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"It illustrates scarcity and opportunity cost: choosing the book means giving up the meal, and the opportunity cost is always the meal's listed price.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"f_econ_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Limited resources create scarcity; the opportunity cost is the value of the next-best forgone alternative, which is not necessarily identical to its price.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"f_econ_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},"government":{"key":"f_gov_v2","subject":"government","difficulty":2,"prompt":"Which branch of the U.S. federal government is primarily responsible for making federal laws?","options":[{"text":"The executive branch makes federal laws because the President signs them.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"f_gov_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Congress makes federal laws, but the Supreme Court must approve each bill before it can take effect.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"f_gov_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"The legislative branch makes federal laws, and once Congress votes the President has no further constitutional role.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"f_gov_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Congress is the primary federal lawmaking branch; the President can sign or veto legislation and courts can later review constitutionality.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"f_gov_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},"computing":{"key":"f_comp_v2","subject":"computing","difficulty":2,"prompt":"Which component mainly performs instructions and calculations while a program runs?","options":[{"text":"The monitor, because it displays the program's work.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"f_comp_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"The CPU executes instructions, but RAM performs the actual arithmetic while the CPU only coordinates it.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"f_comp_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"The CPU executes instructions and calculations, with permanent storage supplying every active instruction directly to the CPU.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"f_comp_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"The CPU executes instructions and calculations, working with RAM for active data/instructions and storage for persistent data.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"f_comp_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},"philosophy":{"key":"f_phil_v2","subject":"philosophy","difficulty":2,"prompt":"Which statement best separates a factual claim from a value judgment?","options":[{"text":"If most people prefer a painting, its beauty becomes an objective fact.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"f_phil_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"'The painting is 2 meters wide' is factual, and therefore 'the painting is beautiful' is factual too.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"f_phil_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"'The painting is 2 meters wide' is factual and 'the painting is beautiful' is a value judgment, but enough agreement can turn the value judgment into fact.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"f_phil_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Width can be measured as a factual claim; beauty expresses evaluation or preference and does not become a factual property merely because many people agree.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"f_phil_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},"culture_society":{"key":"f_cult_v2","subject":"culture_society","difficulty":2,"prompt":"A social norm is best described as…","options":[{"text":"A social norm is a government law that always carries a formal legal penalty.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"f_cult_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"A social norm is a shared expectation, but it is fixed and identical for every member of a society.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"f_cult_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"A social norm is a shared expectation about behavior; unlike laws, it is never reinforced through social approval or disapproval.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"f_cult_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"A social norm is a shared expectation about behavior that can vary by group and context, change over time, and be reinforced informally rather than legally.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"f_cult_v2_full_model","meaning":"The complete model expected at this question difficulty."}]}};
const STRETCH_ITEMS={"reasoning":{"key":"s_reason_v2","subject":"reasoning","difficulty":6,"prompt":"A randomized controlled trial strengthens causal inference mainly because…","options":[{"text":"Random assignment helps balance known and unknown confounders between groups, making treatment the main systematic difference.","score":3,"level":"full_model","id":"a","pattern":"full_model","code":"s_reason_v2_full_model","meaning":"The complete model expected at this question difficulty."},{"text":"Random assignment guarantees the sample represents the entire population.","score":1,"level":"mixed_model","id":"b","pattern":"mixed_model","code":"s_reason_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Publishing the study makes causal conclusions valid.","score":0,"level":"plausible_misconception","id":"c","pattern":"plausible_misconception","code":"s_reason_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Random assignment removes every possible source of error or bias.","score":2,"level":"near_miss","id":"d","pattern":"near_miss","code":"s_reason_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."}]},"mathematics":{"key":"s_math_v2","subject":"mathematics","difficulty":6,"prompt":"For x² − 5x + 6 = 0, which reasoning is strongest?","options":[{"text":"The roots are 2 and 3 because (x−2)(x−3)=0 expands to x²−5x+6.","score":3,"level":"full_model","id":"a","pattern":"full_model","code":"s_math_v2_full_model","meaning":"The complete model expected at this question difficulty."},{"text":"The roots are 2 and 3, but only because 2+3=5.","score":2,"level":"near_miss","id":"b","pattern":"near_miss","code":"s_math_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"The only root is 5 because the middle coefficient is −5.","score":0,"level":"plausible_misconception","id":"c","pattern":"plausible_misconception","code":"s_math_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"The roots are −2 and −3 because the constant is positive.","score":1,"level":"mixed_model","id":"d","pattern":"mixed_model","code":"s_math_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."}]},"statistics":{"key":"s_stats_v2","subject":"statistics","difficulty":6,"prompt":"A rare disease test is 95% sensitive and 95% specific. Why can many positive results still be false positives?","options":[{"text":"When the disease is rare, even a small false-positive rate can act on many more healthy people than diseased people; base rates matter.","score":3,"level":"full_model","id":"a","pattern":"full_model","code":"s_stats_v2_full_model","meaning":"The complete model expected at this question difficulty."},{"text":"Sensitivity and specificity become meaningless for rare diseases.","score":0,"level":"plausible_misconception","id":"b","pattern":"plausible_misconception","code":"s_stats_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"A positive test is always 95% likely to be correct.","score":1,"level":"mixed_model","id":"c","pattern":"mixed_model","code":"s_stats_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"False positives can occur, but prevalence has no effect on how common they are among positive results.","score":2,"level":"near_miss","id":"d","pattern":"near_miss","code":"s_stats_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."}]},"physics":{"key":"s_phys_v2","subject":"physics","difficulty":6,"prompt":"Astronauts in low Earth orbit appear weightless mainly because…","options":[{"text":"Gravity is essentially zero at orbital altitude.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"s_phys_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Astronauts and the spacecraft are falling together, but only because the spacecraft has stopped moving forward.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"s_phys_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"They are continuously falling around Earth together, so gravity and inertia cancel each other exactly and make gravity disappear.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"s_phys_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"They and the spacecraft are in continuous free fall around Earth with nearly the same acceleration, so there is little support force between them even though gravity remains strong.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"s_phys_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},"chemistry":{"key":"s_chem_v2","subject":"chemistry","difficulty":6,"prompt":"In an ordinary chemical reaction, what changes most directly?","options":[{"text":"Atomic nuclei routinely split so one element becomes another.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"s_chem_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Electrons and bonds rearrange, but gaining or losing electrons can also change an atom into a different element.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"s_chem_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Electrons and bonds rearrange while the elements usually stay the same, and the total number of molecules must also stay constant.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"s_chem_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Electrons and bonding arrangements can change while nuclei and element identities usually remain; atoms are conserved even though the number and types of molecules can change.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"s_chem_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},"biology":{"key":"s_bio_v2","subject":"biology","difficulty":6,"prompt":"Which description of the DNA → RNA → protein relationship is strongest?","options":[{"text":"DNA can be transcribed into RNA, and many RNAs can be translated into proteins; regulation and noncoding RNAs make the full system more complex than a one-way slogan.","score":3,"level":"full_model","id":"a","pattern":"full_model","code":"s_bio_v2_full_model","meaning":"The complete model expected at this question difficulty."},{"text":"DNA contains genes, and genes can encode proteins.","score":2,"level":"near_miss","id":"b","pattern":"near_miss","code":"s_bio_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Proteins are copied directly into DNA in normal gene expression.","score":0,"level":"plausible_misconception","id":"c","pattern":"plausible_misconception","code":"s_bio_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Every DNA sequence is always translated into a protein.","score":1,"level":"mixed_model","id":"d","pattern":"mixed_model","code":"s_bio_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."}]},"medicine":{"key":"s_med_v2","subject":"medicine","difficulty":6,"prompt":"Why can a highly sensitive screening test still need a confirmatory test?","options":[{"text":"A test that is 95% sensitive means 95% of positive results are definitely true.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"s_med_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"False positives can occur when disease prevalence is low, but sensitivity by itself determines how trustworthy a positive result is.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"s_med_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"False positives can be common when prevalence is low and confirmation helps, but 95% sensitivity still means 95% of positive tests are true.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"s_med_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Sensitivity describes detection among people who have the disease; the probability a positive is truly positive also depends on specificity and prevalence, so rare diseases can produce many false positives.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"s_med_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},"health_wellness":{"key":"s_health_v2","subject":"health_wellness","difficulty":6,"prompt":"Which statement best reflects population evidence on reducing cardiovascular risk?","options":[{"text":"Supplements can generally replace physical activity, tobacco avoidance, and blood-pressure control.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"s_health_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Physical activity and blood-pressure control matter, but smoking and overall dietary pattern add little if exercise is frequent enough.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"s_health_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Activity, avoiding tobacco, blood-pressure control, and healthy dietary patterns reduce risk and can eliminate cardiovascular risk if all are optimized.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"s_health_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Physical activity, avoiding tobacco, blood-pressure control, and healthy dietary patterns can each reduce risk, but effects vary by person and no combination guarantees prevention.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"s_health_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},"history":{"key":"s_hist_v2","subject":"history","difficulty":6,"prompt":"Which explanation of the outbreak of World War I is strongest?","options":[{"text":"Long-term forces such as alliances, militarism, nationalism, and imperial rivalry created instability; the assassination of Archduke Franz Ferdinand then helped trigger escalation through specific decisions.","score":3,"level":"full_model","id":"a","pattern":"full_model","code":"s_hist_v2_full_model","meaning":"The complete model expected at this question difficulty."},{"text":"The assassination alone explains the war; earlier tensions were not important.","score":1,"level":"mixed_model","id":"b","pattern":"mixed_model","code":"s_hist_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"The Great Depression was the main cause of World War I.","score":0,"level":"plausible_misconception","id":"c","pattern":"plausible_misconception","code":"s_hist_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Alliances and nationalism mattered, but individual political decisions played no role once the assassination occurred.","score":2,"level":"near_miss","id":"d","pattern":"near_miss","code":"s_hist_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."}]},"geography":{"key":"s_geo_v2","subject":"geography","difficulty":6,"prompt":"Why can a maritime chokepoint be geopolitically important?","options":[{"text":"It can concentrate shipping and military movement into a narrow route, so disruption or control can affect trade costs, energy flows, and strategic options.","score":3,"level":"full_model","id":"a","pattern":"full_model","code":"s_geo_v2_full_model","meaning":"The complete model expected at this question difficulty."},{"text":"It matters because narrow water changes Earth's gravity.","score":0,"level":"plausible_misconception","id":"b","pattern":"plausible_misconception","code":"s_geo_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"It guarantees that the country controlling it can stop all global trade.","score":1,"level":"mixed_model","id":"c","pattern":"mixed_model","code":"s_geo_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"It can affect shipping routes, but it has little connection to strategy or prices.","score":2,"level":"near_miss","id":"d","pattern":"near_miss","code":"s_geo_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."}]},"economics":{"key":"s_econ_v2","subject":"economics","difficulty":6,"prompt":"A central bank substantially raises its policy interest rate. Which account of the usual mechanism is strongest?","options":[{"text":"Borrowing generally becomes costlier, which can reduce interest-sensitive spending and investment, cool aggregate demand, and lower inflation pressure over time—though effects are delayed and uncertain.","score":3,"level":"full_model","id":"a","pattern":"full_model","code":"s_econ_v2_full_model","meaning":"The complete model expected at this question difficulty."},{"text":"Higher rates usually make borrowing more expensive and can cool demand.","score":2,"level":"near_miss","id":"b","pattern":"near_miss","code":"s_econ_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Higher rates immediately force all wages and prices to fall.","score":0,"level":"plausible_misconception","id":"c","pattern":"plausible_misconception","code":"s_econ_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Higher rates make credit cheaper because lenders earn more.","score":1,"level":"mixed_model","id":"d","pattern":"mixed_model","code":"s_econ_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."}]},"government":{"key":"s_gov_v2","subject":"government","difficulty":6,"prompt":"What does judicial review mean in the U.S. constitutional system?","options":[{"text":"Judicial review lets judges rewrite any law they dislike without a case.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"s_gov_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Courts can evaluate constitutionality, but they may do so whenever they want even if no actual dispute is before them.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"s_gov_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Courts can invalidate unconstitutional government actions, but only the U.S. Supreme Court can ever exercise judicial review.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"s_gov_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Courts can evaluate government actions against the Constitution in cases properly before them; judicial review is not a free-standing policy veto.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"s_gov_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},"computing":{"key":"s_comp_v2","subject":"computing","difficulty":6,"prompt":"What does DNS primarily do?","options":[{"text":"It maps human-readable domain names to DNS records such as IP addresses through a distributed hierarchical naming system.","score":3,"level":"full_model","id":"a","pattern":"full_model","code":"s_comp_v2_full_model","meaning":"The complete model expected at this question difficulty."},{"text":"It translates domain names into network addresses used to reach services.","score":2,"level":"near_miss","id":"b","pattern":"near_miss","code":"s_comp_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"It encrypts every file transferred across the internet.","score":0,"level":"plausible_misconception","id":"c","pattern":"plausible_misconception","code":"s_comp_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"It replaces routing protocols by deciding the physical path every packet travels.","score":1,"level":"mixed_model","id":"d","pattern":"mixed_model","code":"s_comp_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."}]},"philosophy":{"key":"s_phil_v2","subject":"philosophy","difficulty":6,"prompt":"Which interpretation of Occam's razor is strongest?","options":[{"text":"When explanations fit the evidence comparably, prefer the one requiring fewer unsupported assumptions; simplicity is not proof of truth.","score":3,"level":"full_model","id":"a","pattern":"full_model","code":"s_phil_v2_full_model","meaning":"The complete model expected at this question difficulty."},{"text":"The simplest explanation is always true.","score":0,"level":"plausible_misconception","id":"b","pattern":"plausible_misconception","code":"s_phil_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Prefer fewer assumptions when evidence is comparable.","score":2,"level":"near_miss","id":"c","pattern":"near_miss","code":"s_phil_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Complex explanations are automatically false even when evidence strongly supports them.","score":1,"level":"mixed_model","id":"d","pattern":"mixed_model","code":"s_phil_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."}]},"culture_society":{"key":"s_cult_v2","subject":"culture_society","difficulty":6,"prompt":"What does it mean to study a cultural practice contextually?","options":[{"text":"Examine the practice within its historical, institutional, economic, symbolic, and social setting while recognizing internal diversity and change.","score":3,"level":"full_model","id":"a","pattern":"full_model","code":"s_cult_v2_full_model","meaning":"The complete model expected at this question difficulty."},{"text":"Understand the practice in its social and historical setting before evaluating it.","score":2,"level":"near_miss","id":"b","pattern":"near_miss","code":"s_cult_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Assume every member of the culture interprets the practice the same way.","score":1,"level":"mixed_model","id":"c","pattern":"mixed_model","code":"s_cult_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Avoid context so the practice can be judged by universal first impressions.","score":0,"level":"plausible_misconception","id":"d","pattern":"plausible_misconception","code":"s_cult_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."}]}};
const R3_ITEMS=[{"key":"r_fit_v2","subject":"physical_health","difficulty":4,"prompt":"Which description of progressive overload is strongest?","options":[{"text":"Gradually increasing an appropriate training demand as capacity improves, while allowing recovery.","score":3,"level":"full_model","id":"a","pattern":"full_model","code":"r_fit_v2_full_model","meaning":"The complete model expected at this question difficulty."},{"text":"Doing the maximum possible effort every workout.","score":1,"level":"mixed_model","id":"b","pattern":"mixed_model","code":"r_fit_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Increasing training demand over time.","score":2,"level":"near_miss","id":"c","pattern":"near_miss","code":"r_fit_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Avoiding recovery so adaptation happens faster.","score":0,"level":"plausible_misconception","id":"d","pattern":"plausible_misconception","code":"r_fit_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."}]},{"key":"r_fin_v2","subject":"finance","difficulty":4,"prompt":"Which description of a bond is strongest?","options":[{"text":"A bond is ownership in a company, identical to common stock.","score":0,"level":"plausible_misconception","id":"a","pattern":"plausible_misconception","code":"r_fin_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"A bond is a debt instrument through which an issuer borrows from investors under specified terms.","score":3,"level":"full_model","id":"b","pattern":"full_model","code":"r_fin_v2_full_model","meaning":"The complete model expected at this question difficulty."},{"text":"A bond is basically a checking account with guaranteed returns.","score":1,"level":"mixed_model","id":"c","pattern":"mixed_model","code":"r_fin_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"A bond represents money lent to an issuer.","score":2,"level":"near_miss","id":"d","pattern":"near_miss","code":"r_fin_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."}]},{"key":"r_acct_v2","subject":"accounting","difficulty":4,"prompt":"Which statement best represents the accounting equation?","options":[{"text":"Revenue = Assets + Debt.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"r_acct_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Assets = Liabilities + Equity, but revenue can increase assets without affecting equity.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"r_acct_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Assets = Liabilities + Equity, where equity means only the owner's original cash investment and excludes retained earnings.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"r_acct_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Assets = Liabilities + Equity; liabilities and equity represent claims on assets, and revenues/expenses ultimately affect equity through retained earnings or current-period results.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"r_acct_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},{"key":"r_law_v2","subject":"law","difficulty":4,"prompt":"What does 'burden of proof' refer to?","options":[{"text":"It is the number of judges assigned to a case.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"r_law_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"It is the responsibility to prove a claim, and the same burden and legal standard apply to every issue in every case.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"r_law_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"It is the responsibility to establish a claim to the required standard, and it always belongs to the plaintiff or prosecution and can never shift.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"r_law_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"It is the allocation of responsibility to establish a claim or issue to an applicable standard; who bears it and what standard applies depend on the legal context.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"r_law_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},{"key":"r_ai_v2","subject":"ai","difficulty":4,"prompt":"Which description of machine-learning training is strongest?","options":[{"text":"A model adjusts parameters using data and an objective/loss signal so its behavior improves on the training task, with generalization evaluated separately.","score":3,"level":"full_model","id":"a","pattern":"full_model","code":"r_ai_v2_full_model","meaning":"The complete model expected at this question difficulty."},{"text":"A model adjusts parameters from data to improve an objective.","score":2,"level":"near_miss","id":"b","pattern":"near_miss","code":"r_ai_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"A model becomes conscious by reading enough examples.","score":0,"level":"plausible_misconception","id":"c","pattern":"plausible_misconception","code":"r_ai_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Training means storing every training example as the only possible answer.","score":1,"level":"mixed_model","id":"d","pattern":"mixed_model","code":"r_ai_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."}]},{"key":"r_eng_v2","subject":"engineering","difficulty":4,"prompt":"Which description of engineering design is strongest?","options":[{"text":"Translate needs into requirements, work within constraints, compare tradeoffs, build/test, and iterate based on evidence.","score":3,"level":"full_model","id":"a","pattern":"full_model","code":"r_eng_v2_full_model","meaning":"The complete model expected at this question difficulty."},{"text":"Balance requirements, constraints, tradeoffs, testing, and iteration.","score":2,"level":"near_miss","id":"b","pattern":"near_miss","code":"r_eng_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Choose a solution first and avoid changing it during testing.","score":0,"level":"plausible_misconception","id":"c","pattern":"plausible_misconception","code":"r_eng_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Engineering design is mainly drawing a blueprint after all decisions are already made.","score":1,"level":"mixed_model","id":"d","pattern":"mixed_model","code":"r_eng_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."}]},{"key":"r_trade_v2","subject":"trades_mechanical","difficulty":4,"prompt":"In a typical building, what does the building envelope primarily do?","options":[{"text":"It separates conditioned interior space from the exterior environment and helps control heat, air, and moisture transfer.","score":3,"level":"full_model","id":"a","pattern":"full_model","code":"r_trade_v2_full_model","meaning":"The complete model expected at this question difficulty."},{"text":"It separates the conditioned interior from outdoors.","score":2,"level":"near_miss","id":"b","pattern":"near_miss","code":"r_trade_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"It separates plumbing from electrical wiring only.","score":0,"level":"plausible_misconception","id":"c","pattern":"plausible_misconception","code":"r_trade_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"It refers only to the roof covering.","score":1,"level":"mixed_model","id":"d","pattern":"mixed_model","code":"r_trade_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."}]},{"key":"r_psych_v2","subject":"psychology","difficulty":4,"prompt":"What is confirmation bias?","options":[{"text":"It means changing your mind whenever new evidence appears.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"r_psych_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"It is only the deliberate act of searching for information that supports an existing belief; interpretation and memory are unaffected.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"r_psych_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"It is a tendency to seek and interpret information that supports existing beliefs, but it happens only consciously and intentionally.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"r_psych_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"It is a tendency to seek, interpret, and sometimes remember information in ways that favor existing beliefs, and it can operate without deliberate intent.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"r_psych_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},{"key":"r_soc_v2","subject":"sociology","difficulty":4,"prompt":"Which description of sociology is strongest?","options":[{"text":"The systematic study of social relationships, groups, institutions, cultures, and structures, including how individual action and social systems influence one another.","score":3,"level":"full_model","id":"a","pattern":"full_model","code":"r_soc_v2_full_model","meaning":"The complete model expected at this question difficulty."},{"text":"The study of groups, institutions, structures, and relationships.","score":2,"level":"near_miss","id":"b","pattern":"near_miss","code":"r_soc_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"The study only of individual brain chemistry.","score":0,"level":"plausible_misconception","id":"c","pattern":"plausible_misconception","code":"r_soc_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"A field that studies society but excludes institutions and group behavior.","score":1,"level":"mixed_model","id":"d","pattern":"mixed_model","code":"r_soc_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."}]},{"key":"r_rel_v2","subject":"religion_culture","difficulty":4,"prompt":"Which approach is strongest when comparing religious traditions?","options":[{"text":"Study beliefs, practices, texts, histories, institutions, lived experience, and internal diversity without assuming each tradition is internally uniform.","score":3,"level":"full_model","id":"a","pattern":"full_model","code":"r_rel_v2_full_model","meaning":"The complete model expected at this question difficulty."},{"text":"Study beliefs, practices, histories, and internal diversity.","score":2,"level":"near_miss","id":"b","pattern":"near_miss","code":"r_rel_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Treat all traditions as essentially identical to make comparison easier.","score":1,"level":"mixed_model","id":"c","pattern":"mixed_model","code":"r_rel_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"Ignore historical and cultural context.","score":0,"level":"plausible_misconception","id":"d","pattern":"plausible_misconception","code":"r_rel_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."}]},{"key":"r_lit_v2","subject":"literature","difficulty":4,"prompt":"What is a literary theme?","options":[{"text":"A literary theme is simply the title of the work.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"r_lit_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"A recurring topic such as love is automatically a complete theme even if the work develops no idea or question about it.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"r_lit_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"A theme is a central recurring idea or concern, usually a single message the author wants every reader to accept.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"r_lit_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"A theme is a developed idea, concern, or question explored through patterns such as character, conflict, imagery, or plot, and it can remain complex or ambiguous.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"r_lit_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},{"key":"r_art_v2","subject":"art_music","difficulty":4,"prompt":"In visual art, what does linear perspective primarily help represent?","options":[{"text":"The appearance of depth and spatial relationships on a flat surface using systematic convergence and scale cues.","score":3,"level":"full_model","id":"a","pattern":"full_model","code":"r_art_v2_full_model","meaning":"The complete model expected at this question difficulty."},{"text":"Depth and spatial relationships on a flat surface.","score":2,"level":"near_miss","id":"b","pattern":"near_miss","code":"r_art_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Sound frequency.","score":0,"level":"plausible_misconception","id":"c","pattern":"plausible_misconception","code":"r_art_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Only the brightness of paint colors.","score":1,"level":"mixed_model","id":"d","pattern":"mixed_model","code":"r_art_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."}]},{"key":"r_earth_v2","subject":"earth_science","difficulty":4,"prompt":"Which explanation of plate tectonics is strongest?","options":[{"text":"Motion and interaction of lithospheric plates helps explain patterns of earthquakes, volcanism, mountain building, and continental movement.","score":3,"level":"full_model","id":"a","pattern":"full_model","code":"r_earth_v2_full_model","meaning":"The complete model expected at this question difficulty."},{"text":"Plate movement helps explain earthquakes, mountains, and continental movement.","score":2,"level":"near_miss","id":"b","pattern":"near_miss","code":"r_earth_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Plate tectonics mainly explains day-to-day weather.","score":0,"level":"plausible_misconception","id":"c","pattern":"plausible_misconception","code":"r_earth_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"Continents move, but plate interactions have little connection to earthquakes.","score":1,"level":"mixed_model","id":"d","pattern":"mixed_model","code":"r_earth_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."}]},{"key":"r_astro_v2","subject":"astronomy","difficulty":4,"prompt":"What does a light-year measure?","options":[{"text":"A light-year is a unit of time equal to one year experienced by light.","score":0,"level":"plausible_misconception","pattern":"plausible_misconception","id":"a","code":"r_astro_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"A light-year is the distance light travels in one year, but the distance changes depending on how bright the star is.","score":1,"level":"mixed_model","pattern":"mixed_model","id":"b","code":"r_astro_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."},{"text":"A light-year is the distance light travels in one year, about 9.46 trillion km, and it is used only for distances inside the Milky Way.","score":2,"level":"near_miss","pattern":"near_miss","id":"c","code":"r_astro_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"A light-year is a unit of distance equal to how far light travels through a vacuum in one year; it can describe interstellar or much larger astronomical distances.","score":3,"level":"full_model","pattern":"full_model","id":"d","code":"r_astro_v2_full_model","meaning":"The complete model expected at this question difficulty."}]},{"key":"r_energy_v2","subject":"energy","difficulty":4,"prompt":"Which statement about electrical power is strongest?","options":[{"text":"Power is the rate of energy transfer; it is measured in watts, where one watt equals one joule per second.","score":3,"level":"full_model","id":"a","pattern":"full_model","code":"r_energy_v2_full_model","meaning":"The complete model expected at this question difficulty."},{"text":"Electrical power is measured in watts.","score":2,"level":"near_miss","id":"b","pattern":"near_miss","code":"r_energy_v2_near_miss","meaning":"Very close understanding with one important missing or incorrect distinction."},{"text":"Electrical power is measured in pascals.","score":0,"level":"plausible_misconception","id":"c","pattern":"plausible_misconception","code":"r_energy_v2_plausible_misconception","meaning":"A plausible but fundamentally incorrect model."},{"text":"A watt measures the total amount of energy regardless of time.","score":1,"level":"mixed_model","id":"d","pattern":"mixed_model","code":"r_energy_v2_mixed_model","meaning":"A mixed model with a meaningful correct piece and a meaningful incorrect piece."}]}];
const ASSESSMENT_SUBJECT_KEYS=["reasoning","mathematics","statistics","physics","chemistry","biology","medicine","health_wellness","history","geography","economics","government","computing","philosophy","culture_society","physical_health","finance","accounting","law","ai","engineering","trades_mechanical","psychology","sociology","religion_culture","literature","art_music","earth_science","astronomy","energy","business","leadership","technology","geopolitics","media"];
const OPEN=[
['oe1','reasoning','Two explanations fit an event. One requires three evidence-supported assumptions; another requires fifteen, several unsupported. Does that prove the first is true? Explain.'],
['oe2','geopolitics','A country discovers a huge amount of easily accessible oil. Describe several possible economic, political, international, technological, or social consequences.'],
['oe3','statistics','Explain the difference between correlation and causation. Give an example if you can.'],
['oe4','learning','Choose something you understand well from work, life, or a hobby. Explain it to a smart beginner.'],
['oe5','future','If you invest 30 minutes a day in learning for five years, what do you want to understand, do, or discuss by then?']
];

function show(v){VIEWS.forEach(x=>$(x).classList.toggle('hidden',x!==v))}
function mode(m){authMode=m;$('nameRow').classList.toggle('hidden',m==='login');$('authButton').textContent=m==='login'?'Log in':'Create account';$('signupTab').classList.toggle('active',m==='signup');$('loginTab').classList.toggle('active',m==='login');$('forgotPassword').classList.toggle('hidden',m!=='login')}
$('signupTab').onclick=()=>mode('signup');$('loginTab').onclick=()=>mode('login');
$('authForm').onsubmit=async e=>{e.preventDefault();$('authMessage').textContent='Working…';let r=authMode==='signup'?await db.auth.signUp({email:$('email').value,password:$('password').value,options:{data:{display_name:$('name').value},emailRedirectTo:location.origin+location.pathname}}):await db.auth.signInWithPassword({email:$('email').value,password:$('password').value});if(r.error){$('authMessage').textContent=r.error.message;return}if(!r.data.session){$('authMessage').textContent='Check your email to confirm your account, then return here.';return}$('authMessage').textContent='Signed in.';boot()};
$('logout').onclick=async()=>{await db.auth.signOut();location.reload()};
$('forgotPassword').onclick=async()=>{let email=$('email').value.trim();if(!email){$('authMessage').textContent='Enter your email first.';return}$('authMessage').textContent='Sending recovery link…';let r=await db.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});$('authMessage').textContent=r.error?r.error.message:'Recovery link sent. Check your email.'};


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
$('onboardingForm').onsubmit=async e=>{e.preventDefault();let chosen=[...document.querySelectorAll('.chip.active')].map(x=>x.dataset.v),keys=[...new Set(chosen.flatMap(s=>INTEREST_KEYS[s]||[]))];let daily=+$('minutes').value,days=+$('days').value,goal=($('onboardingGoal')?.value||'').trim();let r=await db.from('profiles').update({daily_minutes:daily,days_per_week:days,weekly_goal_minutes:daily*days,learning_goal:goal||null,onboarding_complete:true,updated_at:new Date().toISOString()}).eq('user_id',user.id);if(r.error)return alert(r.error.message);if(keys.length)await db.from('user_interests').upsert(keys.map(s=>({user_id:user.id,subject_key:s,depth_preference:'deep'})),{onConflict:'user_id,subject_key'});profile={...profile,daily_minutes:daily,days_per_week:days,weekly_goal_minutes:daily*days,learning_goal:goal||null,onboarding_complete:true};assessmentLanding()};


function progressLocalKey(key){return `atlas_progress_${user?.id||'anon'}_${key}`}
async function saveProgressState(key,state){
 progressCache[key]={...(state||{}),saved_at:new Date().toISOString()};
 try{localStorage.setItem(progressLocalKey(key),JSON.stringify(progressCache[key]))}catch{}
 if(user){let r=await db.from('user_progress').upsert({user_id:user.id,progress_key:key,state:progressCache[key],updated_at:new Date().toISOString()},{onConflict:'user_id,progress_key'});if(r.error)coreLoadWarning='Progress is saved on this device, but cloud sync is temporarily unavailable.';return !r.error}
 return true
}
async function getProgressState(key){
 if(progressCache[key])return progressCache[key];
 let local=null;try{local=JSON.parse(localStorage.getItem(progressLocalKey(key))||'null')}catch{}
 if(user){let r=await db.from('user_progress').select('*').eq('user_id',user.id).eq('progress_key',key).single();if(!r.error&&r.data?.state){progressCache[key]=r.data.state;return r.data.state}}
 progressCache[key]=local||null;return progressCache[key]
}
function dailyProgressKey(){return `daily_learning_${localDayKey()}`}
function legacyDailyProgressKeys(){return [`daily_learning_v067_${localDayKey()}`,`daily_learning_v066_${localDayKey()}`]}
async function saveDailyProgress(completed=dailySessionComplete){
 if(!user)return;
 await saveProgressState(dailyProgressKey(),{plan_schema:2,completed:!!completed,guidedSessionActive:!!guidedSessionActive,sessionMode,sessionArc,todayDone:[...todayDone],sessionActiveSeconds,plan:todayPlan.map(p=>({type:p.type,concept_key:p.route.c.key,diagnostic:!!p.route.diagnostic,session_role:p.session_role||null,estimated_minutes:p.estimated_minutes||null}))})
}
async function restoreDailyProgress(){
 let s=await getProgressState(dailyProgressKey());
 if(!s){
   for(let legacyKey of legacyDailyProgressKeys()){
     let legacy=await getProgressState(legacyKey);
     if(legacy){s=legacy;break}
   }
 }
 if(!s)return;
 dailySessionComplete=!!s.completed;guidedSessionActive=!!s.guidedSessionActive;sessionMode=s.sessionMode||'balanced';sessionArc=s.sessionArc||null;todayDone=new Set(s.todayDone||[]);sessionActiveSeconds=+s.sessionActiveSeconds||0;
 if(Array.isArray(s.plan)&&s.plan.length){
  let restored=s.plan.map(x=>{let c=conceptByKey(x.concept_key);if(!c)return null;let mode=x.type==='gap'?'gap':x.type==='bridge'?'bridge':x.type==='review'?'review':x.type==='synthesis'?'general':'frontier',route=routeScore(c,mode);if(x.type==='synthesis'&&route.score<-9000)route={c,score:0,reasons:['session synthesis'],e:subjectEvidence(c.subject_key),m:conceptMastery(c.key),diagnostic:false};route.diagnostic=!!x.diagnostic;return {type:x.type,route,session_role:x.session_role||null,estimated_minutes:+x.estimated_minutes||null}}).filter(Boolean);
  if(restored.length===s.plan.length)todayPlan=restored
 }
}
function sessionSummaryKey(){return `guided:${localDayKey()}`}
async function persistSessionSummary(actual){
 let row={user_id:user.id,session_key:sessionSummaryKey(),session_date:localDayKey(),planned_minutes:+profile.daily_minutes||30,actual_minutes:actual,session_type:'adaptive_v067_coherent',completed:true,completed_at:new Date().toISOString()};
 let r=await db.from('study_sessions').upsert(row,{onConflict:'user_id,session_key'}).select().single();
 if(r.error){await saveProgressState('pending_session_summary',{pending:true,row});return {ok:false,message:r.error.message}}
 await saveProgressState('pending_session_summary',{pending:false,session_key:row.session_key});return {ok:true,data:r.data}
}
async function retryPendingSessionSummary(){
 let p=await getProgressState('pending_session_summary');if(!p?.pending||!p.row)return false;
 let r=await db.from('study_sessions').upsert(p.row,{onConflict:'user_id,session_key'}).select().single();
 if(r.error)return false;
 await saveProgressState('pending_session_summary',{pending:false,session_key:p.row.session_key});return true
}

async function assessmentLanding(){let r=await db.from('placement_attempts').select('*').eq('user_id',user.id).eq('status','in_progress').order('started_at',{ascending:false}).limit(1);let saved=r.data?.[0];$('resumeAssessment').classList.toggle('hidden',!saved);$('resumeAssessment').dataset.id=saved?.id||'';show('assessmentIntro')}
$('startAssessment').onclick=()=>startAssessment(false);$('resumeAssessment').onclick=()=>startAssessment(true);

async function startAssessment(resume){
 let ps=null;
 if(resume){
   attempt=$('resumeAssessment').dataset.id;
   let a=await db.from('placement_attempts').select('*').eq('id',attempt).single();
   let r=await db.from('placement_responses').select('*').eq('attempt_id',attempt).order('answered_at');answers=r.data||[];
   ps=await getProgressState('assessment');round=(ps?.attempt===attempt&&ps.round)?+ps.round:(a.data.current_round||1);openIndex=answers.filter(x=>x.item_type==='open_ended').length;
   qIndex=round<=3?answers.filter(x=>x.round_number===round&&x.item_type==='multiple_choice').length:0;
   if(ps?.attempt===attempt&&Number.isInteger(+ps.qIndex))qIndex=+ps.qIndex;
 }else{
   let r=await db.from('placement_attempts').insert({user_id:user.id,version:'v0.8.1',status:'in_progress',current_round:1}).select().single();if(r.error)return alert(r.error.message);
   attempt=r.data.id;round=1;qIndex=0;openIndex=0;answers=[]
 }
 buildRound();
 if(resume&&ps?.attempt===attempt&&ps.phase==='checkpoint'){show('checkpoint');renderCheckpoint(false);return}
 await saveProgressState('assessment',{attempt,round,qIndex,openIndex,draft:ps?.draft||'',phase:round>3?'open':'questions'});
 show('assessment');renderQ()
}

function assessmentOptionScore(response){
 if(response?.diagnostic_score!==null&&response?.diagnostic_score!==undefined)return +response.diagnostic_score;
 return response?.selected_answer==='idk'?-1:(response?.is_correct?3:0)
}
function roundOneDepth(subject){
 let r=answers.find(x=>x.subject_key===subject&&x.round_number===1&&x.item_type==='multiple_choice');
 return assessmentOptionScore(r)
}
function itemByKey(key){
 return [...BASE_ITEMS,...Object.values(FOUNDATION_ITEMS),...Object.values(STRETCH_ITEMS),...R3_ITEMS].find(x=>x.key===key)
}
function buildRound(){
 if(round===1)roundQs=BASE_ITEMS;
 else if(round===2)roundQs=BASE_ITEMS.map(base=>{
   let depth=roundOneDepth(base.subject);
   return depth>=2?STRETCH_ITEMS[base.subject]:FOUNDATION_ITEMS[base.subject]
 });
 else if(round===3)roundQs=R3_ITEMS;
 validateAssessmentNoRepeats()
}
function validateAssessmentNoRepeats(){
 let asked=answers.filter(x=>x.item_type==='multiple_choice').map(x=>x.question_key),current=roundQs.map(x=>x.key),seen=new Set(),dupes=[];
 for(let key of [...asked,...current]){if(seen.has(key))dupes.push(key);seen.add(key)}
 if(dupes.length)console.error('Atlas assessment duplicate item keys detected',dupes)
}
function stableAssessmentHash(s){
 let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0
}
function orderedAssessmentOptions(item){
 return item.options.slice().sort((a,b)=>stableAssessmentHash(`${attempt}|${item.key}|${a.id}`)-stableAssessmentHash(`${attempt}|${item.key}|${b.id}`))
}
function mcCount(){return answers.filter(x=>x.item_type==='multiple_choice').length}
function savedMCResponse(x){return answers.find(a=>a.question_key===x.key&&a.item_type==='multiple_choice')}
function savedOpenResponse(x){return answers.find(a=>a.question_key===x[0]&&a.item_type==='open_ended')}
function updateAssessmentBack(){if(!$('assessmentBack'))return;$('assessmentBack').disabled=round<=3?qIndex<=0:openIndex<=0}
function renderQ(){
 if(round>3)return renderOpen();
 let x=roundQs[qIndex],saved=savedMCResponse(x),ordered=orderedAssessmentOptions(x),savedSel=saved?.selected_answer||null;
 $('roundLabel').textContent=`ROUND ${round} OF 3`;
 $('assessmentTitle').textContent='Placement Assessment';
 $('questionProgress').textContent=`Question ${qIndex+1} of 15`;
 $('assessmentProgressBar').style.width=`${mcCount()/45*90}%`;
 $('questionBox').innerHTML=`<div class="eyebrow">${x.subject.replaceAll('_',' ')} • adaptive placement</div><h3>${x.prompt}</h3><p class="fineprint">Choose the statement that best matches your understanding. More than one may sound reasonable.</p>${ordered.map(o=>`<button class="answer ${saved&&savedSel===o.id?'selected':''}" data-a="${o.id}">${o.text}</button>`).join('')}<button class="answer ${saved&&savedSel==='idk'?'selected':''}" data-a="idk">I don’t know</button>${saved?'<button id="assessmentNext" class="secondary">Continue without changing</button><p class="fineprint">This response is already saved. Select another choice to change it.</p>':''}`;
 updateAssessmentBack();
 if($('assessmentNext'))$('assessmentNext').onclick=()=>{qIndex++;qIndex<15?renderQ():checkpoint()}
}
$('questionBox').onclick=async e=>{
 let btn=e.target.closest?.('.answer');if(!btn||assessmentBusy)return;
 assessmentBusy=true;document.querySelectorAll('#questionBox .answer').forEach(b=>b.disabled=true);btn.classList.add('selected');
 let status=document.createElement('p');status.className='fineprint';status.textContent='Saving…';$('questionBox').appendChild(status);
 let x=roundQs[qIndex],selectedId=btn.dataset.a,opt=selectedId==='idk'?null:x.options.find(o=>o.id===selectedId),depth=opt?+opt.score:-1,level=opt?.level||'unknown',best=depth===3;
 let existing=savedMCResponse(x);
 let payload={
   subject_key:x.subject,
   difficulty:x.difficulty,
   selected_answer:selectedId,
   is_correct:best,
   diagnostic_score:depth,
   diagnostic_level:level,
   diagnostic_pattern:opt?.pattern||'unknown',
   diagnostic_code:opt?.code||null,
   diagnostic_explanation:opt?.meaning||null,
   max_diagnostic_score:3,
   round_number:round,
   item_type:'multiple_choice'
 };
 let r=existing
   ?await db.from('placement_responses').update(payload).eq('id',existing.id).select().single()
   :await db.from('placement_responses').insert({attempt_id:attempt,user_id:user.id,question_key:x.key,concept_key:null,...payload}).select().single();
 if(r.error){
   assessmentBusy=false;document.querySelectorAll('#questionBox .answer').forEach(b=>b.disabled=false);status.textContent='Could not save. Tap again.';return
 }
 if(existing){let i=answers.findIndex(a=>a.id===existing.id);if(i>=0)answers[i]=r.data}else answers.push(r.data);
 qIndex++;assessmentBusy=false;
 if(qIndex<15){renderQ();saveProgressState('assessment',{attempt,round,qIndex,openIndex,draft:'',phase:'questions'})}else checkpoint()
};
function renderCheckpoint(updateDb=true){
 let ra=answers.filter(x=>x.round_number===round&&x.item_type==='multiple_choice'),idk=ra.filter(x=>x.selected_answer==='idk').length;
 let copy=[
   ['Atlas has a first outline.','The next round will use different questions—easier where your model looks incomplete and harder where your answer showed stronger understanding.'],
   ['Your map is getting sharper.','One more broad round will sample areas outside the basic academic core. No question needs to be “passed.”'],
   ['The broad scan is complete.','Five final prompts will sample how you reason, explain, and connect systems.']
 ][round-1];
 $('checkpointHeadline').textContent=copy[0];$('checkpointMessage').textContent=copy[1];
 $('checkpointStats').innerHTML=`<span class="chip">15 responses recorded</span><span class="chip">${idk} marked “I don’t know”</span><span class="chip">Estimate updated</span>`;
 $('continueAssessment').textContent=round===3?'Continue to reasoning':'Continue';
 $('checkpointMessage').innerHTML+=`<br><span class="fineprint">Review this round now if you want to change an answer. Once the next adaptive round begins, earlier rounds are locked so Atlas keeps the question path consistent.</span>`;
 show('checkpoint')
}
async function checkpoint(){
 await saveProgressState('assessment',{attempt,round,qIndex:15,openIndex,draft:'',phase:'checkpoint'});
 await db.from('placement_attempts').update({current_round:round,paused_at:null}).eq('id',attempt);
 renderCheckpoint()
}
$('continueAssessment').onclick=async()=>{
 round++;qIndex=0;
 if(round<=3){
   await saveProgressState('assessment',{attempt,round,qIndex,openIndex,draft:'',phase:'questions'});
   buildRound();show('assessment');renderQ()
 }else{
   openIndex=answers.filter(x=>x.item_type==='open_ended').length;
   await saveProgressState('assessment',{attempt,round:4,qIndex,openIndex,draft:'',phase:'open'});
   show('assessment');renderOpen()
 }
};
async function pause(){
 let draft=$('openText')?.value||'';
 await saveProgressState('assessment',{attempt,round,qIndex,openIndex,draft,phase:round>3?'open':'questions'});
 await db.from('placement_attempts').update({current_round:round,paused_at:new Date().toISOString()}).eq('id',attempt);
 assessmentLanding()
}
$('assessmentBack').onclick=async()=>{
 if(assessmentBusy)return;
 if(round<=3){
   if(qIndex<=0)return;qIndex--;renderQ();saveProgressState('assessment',{attempt,round,qIndex,openIndex,draft:'',phase:'questions'})
 }else{
   if(openIndex<=0)return;let draft=$('openText')?.value||'';
   await saveProgressState('assessment',{attempt,round:4,qIndex,openIndex,draft});openIndex--;renderOpen()
 }
};
$('reviewRound').onclick=async()=>{
 qIndex=0;await saveProgressState('assessment',{attempt,round,qIndex,openIndex,draft:'',phase:'questions'});
 buildRound();show('assessment');renderQ()
};
$('pauseAssessment').onclick=pause;
$('pauseAtCheckpoint').onclick=async()=>{
 await saveProgressState('assessment',{attempt,round,qIndex:15,openIndex,draft:'',phase:'checkpoint'});
 await db.from('placement_attempts').update({current_round:round,paused_at:new Date().toISOString()}).eq('id',attempt);
 assessmentLanding()
};
async function renderOpen(){
 let x=OPEN[openIndex],existing=savedOpenResponse(x),ps=await getProgressState('assessment'),draft=(ps?.attempt===attempt&&+ps.openIndex===openIndex)?(ps.draft||''):(existing?.response_text||'');
 $('roundLabel').textContent='REASONING SAMPLE';$('assessmentTitle').textContent='Open-ended assessment';$('questionProgress').textContent=`Prompt ${openIndex+1} of 5`;$('assessmentProgressBar').style.width=`${90+openIndex*2}%`;
 $('questionBox').innerHTML=`<h3>${x[2]}</h3><textarea id="openText" placeholder="Answer naturally. Short is fine if that is all you know."></textarea><p id="draftStatus" class="fineprint">${existing?'Saved response loaded — you may edit it':draft?'Draft restored':'Draft autosaves as you type'}</p><button id="saveOpen" class="primary">${existing?'Save changes & continue':'Save & continue'}</button><p class="fineprint">There is no single answer key here. Atlas reads what your explanation demonstrates, including partial knowledge and uncertainty.</p>`;
 $('openText').value=draft;$('saveOpen').onclick=saveOpen;updateAssessmentBack();
 let timer;$('openText').oninput=()=>{clearTimeout(timer);let value=$('openText').value;$('draftStatus').textContent='Saving draft…';try{localStorage.setItem(progressLocalKey('assessment'),JSON.stringify({attempt,round:4,qIndex,openIndex,draft:value,saved_at:new Date().toISOString()}))}catch{}timer=setTimeout(async()=>{await saveProgressState('assessment',{attempt,round:4,qIndex,openIndex,draft:value,phase:'open'});$('draftStatus').textContent='Draft saved'},500)}
}
async function storeOpenEvaluation(responseRow,x,evaluation){
 if(!evaluation?.available)return null;
 let payload={response_id:responseRow.id,attempt_id:attempt||responseRow.attempt_id,user_id:user.id,question_key:x[0],analysis_status:'ready',analysis_version:'v1',overall_reasoning_level:+evaluation.overall_reasoning_level||0,overall_confidence:+evaluation.overall_confidence||0,reasoning_summary:evaluation.reasoning_summary||'',evidence:evaluation.evidence||[],misconceptions:evaluation.misconceptions||[],dimensions:evaluation.dimensions||{},uncertainty:evaluation.uncertainty||[],goal_signals:evaluation.goal_signals||[],raw_evaluation:evaluation,updated_at:new Date().toISOString()};
 let ex=await db.from('assessment_open_evaluations').select('*').eq('response_id',responseRow.id).single();
 let r=ex.error?await db.from('assessment_open_evaluations').insert(payload).select().single():await db.from('assessment_open_evaluations').update(payload).eq('response_id',responseRow.id).select().single();
 if(!r.error){let i=openEvaluations.findIndex(v=>v.response_id===responseRow.id);if(i>=0)openEvaluations[i]=r.data;else openEvaluations.push(r.data);return r.data}
 return null
}
async function analyzeOpenResponse(responseRow,x){
 try{
  let r=await db.functions.invoke('atlas-tutor',{body:{mode:'assessment_open',prompt_label:x[1],prompt:x[2],response:responseRow.response_text||'',allowed_subject_keys:ASSESSMENT_SUBJECT_KEYS}});
  if(r.error||!r.data?.available)return null;
  return await storeOpenEvaluation(responseRow,x,r.data)
 }catch{return null}
}
async function saveOpen(){
 let x=OPEN[openIndex],text=$('openText').value.trim();if(text.length<2)return alert('Write what you know, or simply write “I don’t know.”');
 let save=$('saveOpen');if(save){save.disabled=true;save.textContent='Saving…'}
 let existing=savedOpenResponse(x),payload={subject_key:x[1],response_text:text,difficulty:5,round_number:4,item_type:'open_ended'};
 let r=existing?await db.from('placement_responses').update(payload).eq('id',existing.id).select().single():await db.from('placement_responses').insert({attempt_id:attempt,user_id:user.id,question_key:x[0],...payload}).select().single();
 if(r.error){if(save){save.disabled=false;save.textContent='Save & continue'}return alert(r.error.message)}
 if(existing){let i=answers.findIndex(a=>a.id===existing.id);if(i>=0)answers[i]=r.data}else answers.push(r.data);
 if($('draftStatus'))$('draftStatus').textContent='Atlas is reading what your reasoning demonstrates…';
 await analyzeOpenResponse(r.data,x); // silent knowledge profiling: no right/wrong feedback during placement
 openIndex++;await saveProgressState('assessment',{attempt,round:4,qIndex,openIndex,draft:'',phase:'open'});
 openIndex<5?renderOpen():finishAssessment()
}
function placementEvidencePoint(r){
 let depth=assessmentOptionScore(r);
 if(depth<0)return Math.max(3,(+r.difficulty||3)*5-8);
 return Math.max(3,Math.min(95,(+r.difficulty||3)*10+(depth-1.5)*12))
}
function openEvidenceForSubject(evals,key){
 let rows=[];(evals||[]).forEach(ev=>(Array.isArray(ev.evidence)?ev.evidence:[]).forEach(e=>{if(e?.subject_key===key)rows.push(e)}));return rows
}
function combineAssessmentEvidence(key,responses,evals){
 let mc=responses.filter(x=>x.subject_key===key&&x.item_type==='multiple_choice'),oe=openEvidenceForSubject(evals,key);
 let mcPoints=mc.map(placementEvidencePoint),mcEst=mcPoints.length?mcPoints.reduce((a,b)=>a+b,0)/mcPoints.length:null;
 let known=mc.filter(x=>assessmentOptionScore(x)>=0),avgDepth=known.length?known.reduce((a,x)=>a+assessmentOptionScore(x),0)/known.length:null;
 let spread=mcPoints.length>1?Math.max(...mcPoints)-Math.min(...mcPoints):30;
 let mcConf=mc.length?Math.max(18,Math.min(70,16+mc.length*18+(avgDepth??0)*4-Math.min(12,spread*.18))):0;
 let oeWeight=oe.reduce((a,x)=>a+Math.max(.15,(+x.confidence||0)/100)*(x.prompted===false?1.08:1),0),oeScore=oeWeight?oe.reduce((a,x)=>a+(+x.demonstrated_level||0)*Math.max(.15,(+x.confidence||0)/100)*(x.prompted===false?1.08:1),0)/oeWeight:null;
 let oeConf=oe.length?Math.min(78,oe.reduce((a,x)=>a+(+x.confidence||0),0)/oe.length*.72+oe.length*5):0;
 let mcW=mc.length?Math.max(.35,mcConf/100)*Math.min(2.4,.8+mc.length*.7):0,openW=oe.length?Math.min(2.1,oeWeight*.72):0,totalW=mcW+openW;
 let est=totalW?((mcEst??0)*mcW+(oeScore??0)*openW)/totalW:(mcEst??oeScore??25);
 let conf=Math.min(84,Math.max(mcConf*.78,oeConf*.7,(mcConf+oeConf)*.48)+Math.min(8,(mc.length+oe.length)*1.4));
 let spontaneous=oe.filter(x=>x.prompted===false).length,evidencePoints=mc.length+oe.length;
 let strengthConfidence=Math.min(92,conf+Math.min(10,spontaneous*3));
 let strengthScore=Math.max(0,Math.min(100,est*(.48+.52*strengthConfidence/100)+Math.min(5,spontaneous*1.7)));
 return {key,mc,oe,mcEst,mcConf,avgDepth,oeScore,oeConf,est,conf,strengthScore,strengthConfidence,evidencePoints,spontaneous}
}
async function recalculateAssessmentStateFromAttempt(attemptId,responses=null,evals=null){
 if(!responses){let rr=await db.from('placement_responses').select('*').eq('attempt_id',attemptId);responses=rr.data||[]}
 if(!evals){let er=await db.from('assessment_open_evaluations').select('*').eq('attempt_id',attemptId);evals=er.data||[]}
 let keys=[...new Set([...responses.filter(x=>x.item_type==='multiple_choice').map(x=>x.subject_key),...evals.flatMap(x=>(x.evidence||[]).map(e=>e.subject_key)).filter(k=>ASSESSMENT_SUBJECT_KEYS.includes(k))])],out=[];
 for(let k of keys){
  let x=combineAssessmentEvidence(k,responses,evals),last=x.mc[x.mc.length-1];
  out.push({user_id:user.id,subject_key:k,estimated_level:Math.round(x.est),estimate_confidence:Math.round(x.conf),questions_answered:x.mc.length,correct_count:x.mc.filter(r=>assessmentOptionScore(r)===3).length,last_difficulty:last?.difficulty||null,status:x.evidencePoints>=2?'provisional':'sampling',open_evidence_count:x.oe.length,open_evidence_score:x.oeScore===null?null:Math.round(x.oeScore),open_evidence_confidence:x.oe.length?Math.round(x.oeConf):null,reasoning_evidence_count:x.oe.length,reasoning_depth:x.oeScore===null?null:Math.round(x.oeScore),reasoning_confidence:x.oe.length?Math.round(x.oeConf):null,strength_score:Math.round(x.strengthScore),strength_confidence:Math.round(x.strengthConfidence),strength_components:{mc_questions:x.mc.length,mc_average_depth:x.avgDepth,mc_estimate:x.mcEst,mc_confidence:x.mcConf,open_evidence_count:x.oe.length,open_evidence_score:x.oeScore,open_evidence_confidence:x.oeConf,spontaneous_open_evidence:x.spontaneous},updated_at:new Date().toISOString()})
 }
 if(out.length){let up=await db.from('assessment_state').upsert(out,{onConflict:'user_id,subject_key'});if(up.error)throw new Error(up.error.message)}
 return {out,evals,responses}
}
async function finishAssessment(){
 let er=await db.from('assessment_open_evaluations').select('*').eq('attempt_id',attempt);let evals=er.data||openEvaluations.filter(x=>x.attempt_id===attempt);
 try{await recalculateAssessmentStateFromAttempt(attempt,answers,evals)}catch(err){return alert(err.message||'Atlas could not finalize your learner map.')}
 await db.from('placement_attempts').update({status:'completed',completed_at:new Date().toISOString(),current_round:4,version:'v0.8.1'}).eq('id',attempt);
 await db.from('profiles').update({placement_complete:true,placement_version:'v0.8',updated_at:new Date().toISOString()}).eq('user_id',user.id);
 profile.placement_version='v0.8';
 await saveProgressState('assessment',{completed:true,attempt,round:4,qIndex,openIndex:5,draft:''});
 localStorage.setItem('atlas_show_snapshot','1');loadApp()
}

async function loadCore(){
 let results=await Promise.all([
  db.from('subjects').select('*').eq('active',true).order('sort_order'),
  db.from('concepts').select('*').eq('is_core',true).order('subject_key').order('level'),
  db.from('assessment_state').select('*').eq('user_id',user.id),
  db.from('assessment_open_evaluations').select('*').eq('user_id',user.id).order('created_at',{ascending:false}),
  db.from('study_sessions').select('*').eq('user_id',user.id).order('created_at'),
  db.from('concept_mastery').select('*').eq('user_id',user.id),
  db.from('user_interests').select('*').eq('user_id',user.id),
  db.from('concept_prerequisites').select('*'),
  db.from('learning_events').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(1500),
  db.from('learner_misconceptions').select('*').eq('user_id',user.id),
  db.from('modality_performance').select('*').eq('user_id',user.id),
  db.from('curiosity_queue').select('*').eq('user_id',user.id).order('created_at'),
  db.from('learning_objects').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(250),
  db.from('knowledge_connections').select('*').eq('user_id',user.id).order('formed_at',{ascending:false}).limit(300),
  db.from('user_milestones').select('*').eq('user_id',user.id).order('achieved_at'),
  db.from('curated_media').select('*').eq('active',true)
 ]);
 let names=['subjects','concepts','assessment','open reasoning','sessions','mastery','interests','prerequisites','history','misconceptions','teaching-style history','curiosity','learning objects','connections','milestones','media'];
 let critical=[0,1,2,5,7],criticalErrors=critical.filter(i=>results[i].error).map(i=>`${names[i]}: ${results[i].error.message}`);
 if(criticalErrors.length)throw new Error('Atlas could not load the core learner map. '+criticalErrors.join(' · '));
 let optionalErrors=results.map((r,i)=>r.error?names[i]:null).filter(Boolean).filter((_,i)=>true).filter(n=>!['subjects','concepts','assessment','mastery','prerequisites'].includes(n));
 coreLoadWarning=optionalErrors.length?`Some history features could not sync (${optionalErrors.join(', ')}). Core learning is still available.`:'';
 let [sub,con,st,oev,se,ma,ui,pr,ev,mi,mp,cq,lo,kc,um,cm]=results;
 subjects=sub.data||subjects;concepts=con.data||concepts;states=st.data||states;openEvaluations=oev.error?openEvaluations:(oev.data||[]);sessions=se.error?sessions:(se.data||[]);masteries=ma.data||masteries;interests=ui.error?interests:(ui.data||[]);prereqs=pr.data||prereqs;events=ev.error?events:(ev.data||[]);misconceptions=mi.error?misconceptions:(mi.data||[]);modalityPerf=mp.error?modalityPerf:(mp.data||[]);curiosityQueue=cq.error?curiosityQueue:(cq.data||[]);learningObjects=lo.error?learningObjects:(lo.data||[]);connections=kc.error?connections:(kc.data||[]);milestones=um.error?milestones:(um.data||[]);curatedMedia=cm.error?curatedMedia:(cm.data||[]);
 activityBySubject={};activityByConcept={};events.forEach(e=>{let c=conceptByKey(e.concept_key);if(c){activityBySubject[c.subject_key]=(activityBySubject[c.subject_key]||0)+1;activityByConcept[c.key]=(activityByConcept[c.key]||0)+1}})
}

const verified=s=>(+s.estimated_level)*(+s.estimate_confidence)/100;
function getSubject(k){return subjects.find(x=>x.key===k)}
function conceptMastery(k){return masteries.find(m=>m.concept_key===k)}
function conceptByKey(k){return concepts.find(c=>c.key===k)}
function coreLessonFor(c){let x=c&&CORE_LESSONS[c.key];return x?JSON.parse(JSON.stringify(x)):null}
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
function recentSubjectStats(k,window=48){
 let recent=events.slice(0,window),subjectEvents=recent.filter(e=>conceptByKey(e.concept_key)?.subject_key===k),scored=subjectEvents.filter(e=>e.score!==null&&e.score!==undefined);
 return {share:recent.length?subjectEvents.length/recent.length:0,count:subjectEvents.length,avg:scored.length?scored.reduce((a,e)=>a+(+e.score||0),0)/scored.length:null,failRate:scored.length?scored.filter(e=>(+e.score)<55).length/scored.length:0}
}
function recentConceptSuccessLevel(k,window=24){
 let rows=events.slice(0,window).filter(e=>conceptByKey(e.concept_key)?.subject_key===k&&e.score!==null&&(+e.score)>=65);
 return rows.length?Math.max(...rows.map(e=>+conceptByKey(e.concept_key)?.level||0)):0
}
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

function goalTokens(){return String(profile?.learning_goal||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').split(/\s+/).filter(w=>w.length>=4&&!['want','learn','better','understand','become','knowledge','broadly','about','more'].includes(w))}
function goalBoost(c){let toks=goalTokens();if(!toks.length)return 0;let hay=`${getSubject(c.subject_key)?.name||''} ${c.name||''} ${c.description||''} ${c.learning_objective||''}`.toLowerCase(),hits=toks.filter(t=>hay.includes(t)).length;return Math.min(34,hits*12)}
function weeklyCoverageBoost(c){let since=Date.now()-6*864e5,recent=events.filter(e=>new Date(e.created_at).getTime()>=since),total=recent.length;if(total<4)return 8;let n=recent.filter(e=>conceptByKey(e.concept_key)?.subject_key===c.subject_key).length,share=n/Math.max(1,total);if(n===0)return 18;if(share>.38)return -28;if(share>.28)return -12;return Math.max(0,10-n*2)}

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
 let need=m?Math.max(0,70-(+m.mastery||0)):(provisionalSatisfied(c)?8:35),activity=activityBySubject[c.subject_key]||0,recentStats=recentSubjectStats(c.subject_key),recentSuccess=recentConceptSuccessLevel(c.subject_key),target=Math.max(1,Math.min(10,Math.floor(e.boundary)+1));
 if(recentStats.avg!==null&&recentStats.avg<62)target=Math.max(1,Math.min(target,Math.max(1,Math.floor(e.boundary))));
 if(recentStats.avg!==null&&recentStats.avg<52)target=Math.max(1,Math.min(target,Math.max(1,Math.floor(e.boundary)-1)));
 if(recentSuccess&&level>recentSuccess+1&&recentStats.avg!==null&&recentStats.avg<68)return {c,score:-9999,reasons:['recent performance says slow down'],e,m,diagnostic:false};
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
 let gb=goalBoost(c);if(gb&&mode!=='review'){score+=gb;reasons.push('learning goal')}
 let cq=curiosityQueue.find(q=>q.status==='queued'&&q.related_concept_key===c.key);if(cq&&blocked.length===0&&mode!=='review'){score+=22;reasons.push('saved curiosity')}
 if(mode!=='review'&&recentStats.share>.24){score-=Math.min(42,(recentStats.share-.24)*145);reasons.push('breadth balance')}
 if(mode==='frontier'&&recentStats.failRate>.45)score-=18;
 score-=recentCount(c.key,3)*(mode==='review'?4:15);
 score+=(+c.breadth_weight||1)*5;
 return {c,score,reasons,e,m,diagnostic}
}
function pickCandidate(mode,exclude=new Set(),excludedSubjects=new Set(),requireBridge=false){
 let list=concepts.filter(c=>c.subject_key!=='hvac'&&!exclude.has(c.key)&&!excludedSubjects.has(c.subject_key)).map(c=>{let x=routeScore(c,mode);if(CORE_LESSONS[c.key]&&mode!=='review')x.score+=completedAtlasLessons()<12?28:10;return x}).filter(x=>x.score>-9000&&(!requireBridge||x.reasons.some(r=>r.startsWith('bridge from')))).sort((a,b)=>b.score-a.score);
 return list[0]||null
}
function atlasTaughtConcept(key){
 return learningObjects.some(x=>x.concept_key===key&&x.completed_at&&!['review','probe'].includes(x.route_type)&&x.provider!=='atlas_fallback') || events.some(e=>e.concept_key===key&&e.provider!=='atlas_fallback'&&['lesson','quiz','assignment'].includes(e.event_type));
}
function dueLearnedReviews(){return masteries.filter(m=>m.next_review_at&&new Date(m.next_review_at)<=new Date()&&atlasTaughtConcept(m.concept_key))}
function completedAtlasLessons(){return learningObjects.filter(x=>x.completed_at&&!['review','probe'].includes(x.route_type)&&x.provider!=='atlas_fallback').length}
function foundationTeachingCandidate(exclude=new Set()){
 let list=concepts.filter(c=>!exclude.has(c.key)&&(+c.level||1)<=2&&prereqs.filter(p=>p.concept_key===c.key).every(prereqSatisfied)).map(c=>({c,score:(30-(activityBySubject[c.subject_key]||0)*.25)+(interestKeys().has(c.subject_key)?8:0)+(CORE_LESSONS[c.key]?35:0)+teachingRampBonus(c)-recentCount(c.key,14)*18,reasons:['foundation lesson'],e:subjectEvidence(c.subject_key),m:conceptMastery(c.key),diagnostic:false})).sort((a,b)=>b.score-a.score);
 return list[0]||null
}
function sessionDesign(){
 let m=+profile?.daily_minutes||30,due=dueLearnedReviews().length;
 if(m<=7)return {lessons:1,synthesis:false,review:false,target:m};
 if(m<=20)return {lessons:1,synthesis:true,review:false,target:m};
 if(m<=40)return {lessons:2,synthesis:true,review:false,target:m};
 if(m<=60)return {lessons:3,synthesis:true,review:!!due,target:m};
 return {lessons:4,synthesis:true,review:!!due,target:m}
}
function sessionBlockCount(){let d=sessionDesign();return d.lessons+(d.synthesis?1:0)+(d.review?1:0)}
function teachingRampBonus(c){
 let taught=completedAtlasLessons();if(taught>=8)return 0;let e=subjectEvidence(c.subject_key),level=+c.level||1;
 if(!e.known||e.confidence<35)return level<=2?22:-20;
 let boundary=Math.max(1,+e.boundary||1),ideal=Math.max(1,Math.floor(boundary)-(taught<3?1:0));
 if(taught<3&&level>Math.floor(boundary))return -65;
 if(taught<6&&level>Math.ceil(boundary))return -40;
 return Math.max(-28,32-12*Math.abs(level-ideal))
}
const ARC_PAIRS={
 'accounting|chemistry':{title:'Inside a battery manufacturer',scenario:'A battery plant is trying to increase output without creating unsafe heat or letting production costs get out of control.',roles:{chemistry:'Understand where heat and energy move inside the process.',accounting:'Translate production choices into costs, assets, margins, and financial tradeoffs.'}},
 'ai|chemistry':{title:'Keeping a battery pack safe',scenario:'A battery system produces heat while sensors and software try to identify when normal operation is turning into a safety risk.',roles:{chemistry:'Explain the energy and temperature behavior.',ai:'Use patterns in sensor data to detect and predict risk.'}},
 'ai|biology':{title:'Building a biological diagnostic system',scenario:'A health team wants to use biological signals to help classify risk without confusing correlation with biological mechanism.',roles:{biology:'Explain what the biological signal actually represents.',ai:'Turn measurements into a model while testing its limits.'}},
 'biology|computing':{title:'From cells to data',scenario:'A lab has biological measurements from many samples and needs a digital system that preserves what the biology means while organizing and analyzing the data.',roles:{biology:'Explain the mechanism generating the measurements.',computing:'Represent, process, and check the information reliably.'}},
 'accounting|economics':{title:'A manufacturer facing rising costs',scenario:'A small manufacturer is deciding whether to raise prices, change production, hire, or borrow while its input costs and customer demand are changing.',roles:{economics:'Explain the market forces changing demand, prices, and incentives.',accounting:'Show how those decisions appear in costs, cash, assets, liabilities, and profit.'}},
 'economics|finance':{title:'A borrowing and investment decision',scenario:'A household or business must decide whether a long-term investment is still worthwhile as interest rates, inflation, and expected returns change.',roles:{economics:'Explain the forces moving rates, inflation, and demand.',finance:'Turn those forces into a decision about cash flows, risk, and return.'}},
 'economics|government':{title:'A city responding to a downturn',scenario:'A city is facing weaker hiring and tax revenue and must decide whether spending, taxes, or borrowing should change.',roles:{economics:'Trace demand, employment, inflation, and tradeoffs.',government:'Explain which public institutions can act and what constraints they face.'}},
 'economics|history':{title:'Why an economy changes over time',scenario:'A society is going through a major technological or institutional shift that changes work, production, prices, and political choices.',roles:{history:'Follow the sequence of causes, institutions, and consequences.',economics:'Explain incentives, production, labor markets, and distribution.'}},
 'engineering|physics':{title:'Designing a safer machine',scenario:'An engineering team must make a machine perform reliably while respecting forces, energy, materials, and real design constraints.',roles:{physics:'Explain the governing physical mechanism.',engineering:'Turn that mechanism into a design choice under constraints.'}},
 'physics|trades_mechanical':{title:'Troubleshooting a real building system',scenario:'A building system is not performing as expected, so a technician must connect measured symptoms to the physics of energy, pressure, flow, or electricity.',roles:{physics:'Explain the underlying physical cause.',trades_mechanical:'Use measurements and system knowledge to diagnose and fix the problem.'}},
 'chemistry|energy':{title:'Making an industrial process more efficient',scenario:'A plant wants to reduce wasted energy while maintaining the temperatures and chemical conditions its process requires.',roles:{chemistry:'Explain reaction energy and material behavior.',energy:'Track where energy is supplied, transferred, and wasted.'}},
 'biology|medicine':{title:'From cell mechanism to a health decision',scenario:'A clinician needs to connect what is happening at the cell or system level to symptoms, tests, and a treatment decision.',roles:{biology:'Explain the underlying biological mechanism.',medicine:'Use that mechanism with evidence to reason about diagnosis or treatment.'}},
 'medicine|statistics':{title:'Interpreting a medical test',scenario:'A patient receives a test result, but the right interpretation depends on test accuracy, prevalence, and the biological question being asked.',roles:{medicine:'Define the clinical question and consequences.',statistics:'Translate sensitivity, specificity, uncertainty, and base rates into evidence.'}},
 'business|statistics':{title:'Deciding whether a change actually worked',scenario:'A company tests a new process and must decide whether better results are a real effect or ordinary variation.',roles:{business:'Define the decision and operational stakes.',statistics:'Separate signal from noise and quantify uncertainty.'}},
 'finance|mathematics':{title:'How money grows and obligations compound',scenario:'Someone is comparing a loan, an investment, or a long-term savings plan where small percentage changes accumulate over time.',roles:{mathematics:'Model the rate, growth, and compounding relationship.',finance:'Interpret the model as cash flows, costs, risk, and return.'}},
 'economics|geography':{title:'A supply chain under pressure',scenario:'A company depends on materials moving through ports, roads, and regions, and a disruption changes both availability and price.',roles:{geography:'Explain location, networks, distance, and physical constraints.',economics:'Explain how scarcity and incentives move prices and behavior.'}},
 'economics|geopolitics':{title:'Trade under geopolitical pressure',scenario:'A political conflict changes access to energy, shipping, technology, or markets, forcing governments and firms to adapt.',roles:{geopolitics:'Explain the strategic actors and constraints.',economics:'Trace effects through trade, prices, substitution, and incentives.'}},
 'leadership|psychology':{title:'Why a team behaves the way it does',scenario:'A leader changes goals, incentives, or feedback and needs to predict how real people—not idealized workers—will respond.',roles:{psychology:'Explain motivation, bias, attention, and social behavior.',leadership:'Turn those mechanisms into communication, incentives, and team design.'}}
};
const SUBJECT_ARCS={
 chemistry:{title:'Energy and matter in a real process',scenario:'Follow one physical process from what particles and bonds are doing to what you can measure as temperature, phase, or energy change.'},
 economics:{title:'A real economy making tradeoffs',scenario:'Follow one decision through incentives, prices, production, jobs, and the consequences that appear elsewhere in the economy.'},
 accounting:{title:'Reading the story behind business numbers',scenario:'Follow a real business decision and see how resources, obligations, cash, and performance show up in the accounting.'},
 biology:{title:'How living systems turn information into action',scenario:'Follow a biological system from structure or information to the process that changes what a cell or organism actually does.'},
 ai:{title:'Building a model that works outside the demo',scenario:'Follow a prediction system from data and training through evaluation, failure modes, and real-world use.'},
 computing:{title:'How a reliable digital system works',scenario:'Follow information through a digital system and see how representation, logic, software, and constraints shape the outcome.'},
 physics:{title:'Predicting a real physical system',scenario:'Follow forces, motion, energy, or fields through a system you could actually measure or design.'},
 statistics:{title:'Making a decision from noisy evidence',scenario:'Follow a real question from data collection through uncertainty to a decision that could be wrong.'},
 medicine:{title:'Reasoning from mechanism to decision',scenario:'Follow a health question from underlying mechanism through evidence, uncertainty, and a practical decision.'},
 history:{title:'Following causes through time',scenario:'Trace how institutions, technology, resources, and human decisions combine to produce a historical change.'},
 engineering:{title:'Designing under real constraints',scenario:'Take a real system and connect the underlying science to choices about safety, performance, cost, and reliability.'},
 trades_mechanical:{title:'Diagnosing a system that has to work',scenario:'Follow symptoms, measurements, and system behavior until the physical cause and practical fix line up.'}
};
function pairKey(a,b){return [a,b].sort().join('|')}
function arcTemplateForSubjects(a,b){return a&&b&&a!==b?ARC_PAIRS[pairKey(a,b)]||null:null}
function conceptPairConnected(a,b){if(!a||!b)return false;if(a.subject_key===b.subject_key)return true;return !!arcTemplateForSubjects(a.subject_key,b.subject_key)}
function subjectTeachingCandidate(subjectKey,exclude=new Set(),anchorLevel=null){
 let rows=concepts.filter(c=>c.subject_key===subjectKey&&!exclude.has(c.key)).map(c=>{let mode=subjectEvidence(subjectKey).confidence<35?'gap':'frontier',x=routeScore(c,mode);if(x.diagnostic)x.score=-9999;if(x.score>-9000){x.score+=(CORE_LESSONS[c.key]?45:0)+goalBoost(c)+teachingRampBonus(c);if(anchorLevel!=null)x.score+=Math.max(0,30-10*Math.abs((+c.level||1)-anchorLevel))}return x}).filter(x=>x.score>-9000).sort((a,b)=>b.score-a.score);return rows[0]||null
}
function primaryTeachingCandidate(exclude=new Set()){
 let goalMatches=concepts.map(c=>{let mode=subjectEvidence(c.subject_key).confidence<35?'gap':'frontier',x=routeScore(c,mode);if(x.diagnostic)x.score=-9999;x.score+=goalBoost(c)+(CORE_LESSONS[c.key]?35:0)+teachingRampBonus(c)+weeklyCoverageBoost(c);return x}).filter(x=>!exclude.has(x.c.key)&&x.score>-9000).sort((a,b)=>b.score-a.score);
 return goalMatches[0]||foundationTeachingCandidate(exclude)||pickCandidate('frontier',exclude)||pickCandidate('gap',exclude)
}
function coherentSecondary(primary,exclude=new Set(),deep=false){
 if(!primary)return null;let same=subjectTeachingCandidate(primary.c.subject_key,exclude,+primary.c.level||1);if(deep)return same;
 let cross=concepts.filter(c=>c.subject_key!==primary.c.subject_key&&!exclude.has(c.key)&&arcTemplateForSubjects(primary.c.subject_key,c.subject_key)).map(c=>{let mode=subjectEvidence(c.subject_key).confidence<35?'gap':'frontier',x=routeScore(c,mode);if(x.diagnostic)x.score=-9999;if(x.score>-9000)x.score+=goalBoost(c)+(CORE_LESSONS[c.key]?30:0)+teachingRampBonus(c)+18;return x}).filter(x=>x.score>-9000).sort((a,b)=>b.score-a.score)[0];
 if(cross&&cross.score>(same?.score||-9999)-5)return cross;return same||cross||null
}
function buildSessionArc(plan,mode='balanced'){
 let lessons=plan.filter(p=>p.type==='lesson'),a=lessons[0]?.route.c,b=lessons.find(p=>p.route.c.subject_key!==a?.subject_key)?.route.c||lessons[1]?.route.c||null;if(!a)return null;
 let sa=a.subject_key,sb=b?.subject_key||sa,pair=arcTemplateForSubjects(sa,sb),subject=getSubject(sa)?.name||sa;
 if(pair){let roleA=pair.roles?.[sa]||'',roleB=pair.roles?.[sb]||'';return {mode,title:pair.title,scenario:pair.scenario,subjects:[sa,sb],connection:`${getSubject(sa)?.name}: ${roleA} ${getSubject(sb)?.name}: ${roleB}`,roles:pair.roles||{},concepts:lessons.map(x=>x.route.c.key)}}
 let base=SUBJECT_ARCS[sa]||{title:`Use ${a.name}${b?` to understand ${b.name}`:''}`,scenario:`Stay inside ${subject} long enough to see how the ideas form a pattern instead of isolated facts.`};
 return {mode,title:mode==='deep_dive'?`Deep dive · ${base.title}`:base.title,scenario:base.scenario,subjects:[sa],connection:b?`First build ${a.name}; then use it as scaffolding for ${b.name}.`:`Build one idea thoroughly, then apply it before leaving the subject.`,roles:{[sa]:`Use each concept to make the next one easier to understand.`},concepts:lessons.map(x=>x.route.c.key)}
}
function stageEstimate(type,index,total){let m=+profile.daily_minutes||30;if(type==='synthesis')return m<=20?5:m<=40?8:m<=60?10:12;if(type==='review')return Math.max(5,Math.round(m*.12));let lessonCount=Math.max(1,total-(sessionDesign().synthesis?1:0)-(sessionDesign().review?1:0));let reserved=(sessionDesign().synthesis?(m<=20?5:m<=40?8:m<=60?10:12):0)+(sessionDesign().review?Math.max(5,Math.round(m*.12)):0);return Math.max(5,Math.round((m-reserved)/lessonCount))}
function reviewCandidateForArc(primary,exclude=new Set()){
 let rows=concepts.map(c=>routeScore(c,'review')).filter(x=>x.m&&x.m.next_review_at&&new Date(x.m.next_review_at)<=new Date()&&atlasTaughtConcept(x.c.key)&&!exclude.has(x.c.key)&&(x.c.subject_key===primary.c.subject_key||arcTemplateForSubjects(primary.c.subject_key,x.c.subject_key))).sort((a,b)=>b.score-a.score);return rows[0]||null
}
function chooseSessionPlan(mode='balanced'){
 let used=new Set(),plan=[],design=sessionDesign(),primary=primaryTeachingCandidate(used);if(!primary)return [];
 plan.push({type:'lesson',route:primary,session_role:'anchor'});used.add(primary.c.key);
 for(let i=1;i<design.lessons;i++){let next=coherentSecondary(primary,used,mode==='deep_dive');if(!next)next=subjectTeachingCandidate(primary.c.subject_key,used,+primary.c.level||1)||primaryTeachingCandidate(used);if(!next)break;plan.push({type:'lesson',route:next,session_role:next.c.subject_key===primary.c.subject_key?'deepening':'connected'});used.add(next.c.key)}
 if(design.review){let review=reviewCandidateForArc(primary,used);if(review){plan.push({type:'review',route:review,session_role:'retain'});used.add(review.c.key)}}
 if(design.synthesis){plan.push({type:'synthesis',route:{c:primary.c,score:0,reasons:['integrated application'],e:primary.e,m:primary.m,diagnostic:false},session_role:'synthesis'})}
 plan.forEach((p,i)=>p.estimated_minutes=stageEstimate(p.type,i,plan.length));sessionArc=buildSessionArc(plan,mode);sessionMode=mode;return plan
}
function nextIncompletePlanIndex(){for(let i=0;i<todayPlan.length;i++){let p=todayPlan[i],key=`${p.type}_${p.route.c.key}`;if(!todayDone.has(key))return i}return -1}
async function startOrContinueDailySession(){
 if(dailySessionComplete)return;
 if(!todayPlan.length)todayPlan=chooseSessionPlan(sessionMode||'balanced');guidedSessionActive=true;await saveDailyProgress(false);renderToday();let i=nextIncompletePlanIndex();if(i>=0)openTask(i)
}
function bestDeepDiveConcept(subjectKey){
 let rows=concepts.filter(c=>c.subject_key===subjectKey).map(c=>routeScore(c,'frontier')).filter(x=>x.score>-9000).sort((a,b)=>b.score-a.score);
 return rows[0]||concepts.filter(c=>c.subject_key===subjectKey).map(c=>routeScore(c,'general')).sort((a,b)=>b.score-a.score)[0]||null
}
function openDeepDiveForSubject(subjectKey,conceptKey=null){
 deepDiveSubjectKey=subjectKey||deepDiveSubjectKey||pickCandidate('frontier')?.c?.subject_key||subjects[0]?.key||null;
 let picked=conceptKey?concepts.find(c=>c.key===conceptKey):bestDeepDiveConcept(deepDiveSubjectKey)?.c;
 frontierConcept=picked||bestDeepDiveConcept(deepDiveSubjectKey)?.c||null;
 currentRoute=frontierConcept?routeScore(frontierConcept,'frontier'):null;
 document.querySelector('[data-page="frontier"]').click();
 renderFrontier();
 requestAnimationFrame(()=>$('frontierCard')?.scrollIntoView({behavior:'smooth',block:'center'}))
}
function getFrontier(){
 let pick=null;
 if(frontierConcept&&(!deepDiveSubjectKey||frontierConcept.subject_key===deepDiveSubjectKey))pick=routeScore(frontierConcept,'frontier');
 if(!pick||pick.score<=-9000)pick=deepDiveSubjectKey?bestDeepDiveConcept(deepDiveSubjectKey):(pickCandidate('frontier')||pickCandidate('general'));
 pick=pick||{};
 frontierConcept=pick.c||frontierConcept||concepts[0];deepDiveSubjectKey=frontierConcept?.subject_key||deepDiveSubjectKey;
 let subject=getSubject(frontierConcept?.subject_key),state=states.find(x=>x.subject_key===subject?.key);currentRoute=pick;
 return {subject,state,concept:frontierConcept,reasons:pick.reasons||[],score:pick.score||0}
}
async function backfillOpenAssessmentEvaluations(){
 if(!profile?.placement_complete)return false;
 let progress=await getProgressState('assessment_reasoning_backfill'),last=progress?.last_attempt_at?new Date(progress.last_attempt_at).getTime():0;if(last&&Date.now()-last<864e5&&!progress?.complete)return false;
 let ar=await db.from('placement_attempts').select('*').eq('user_id',user.id).eq('status','completed').order('completed_at',{ascending:false}).limit(1),a=ar.data?.[0];if(!a)return false;
 let rr=await db.from('placement_responses').select('*').eq('attempt_id',a.id),responses=rr.data||[],opens=responses.filter(x=>x.item_type==='open_ended'),existingIds=new Set(openEvaluations.filter(x=>x.attempt_id===a.id).map(x=>x.response_id)),changed=false;
 await saveProgressState('assessment_reasoning_backfill',{last_attempt_at:new Date().toISOString(),complete:false,attempt_id:a.id});
 for(let row of opens){if(existingIds.has(row.id))continue;let x=OPEN.find(q=>q[0]===row.question_key);if(!x)continue;let ev=await analyzeOpenResponse(row,x);if(ev){existingIds.add(row.id);changed=true}}
 let er=await db.from('assessment_open_evaluations').select('*').eq('attempt_id',a.id),evals=er.data||[];
 if(changed||evals.length){try{await recalculateAssessmentStateFromAttempt(a.id,responses,evals)}catch{}}
 await saveProgressState('assessment_reasoning_backfill',{last_attempt_at:new Date().toISOString(),complete:opens.length===0||evals.length>=opens.length,attempt_id:a.id,evaluated:evals.length,total:opens.length});
 if(changed){let st=await db.from('assessment_state').select('*').eq('user_id',user.id);if(!st.error)states=st.data||states;openEvaluations=evals;renderLearnerSnapshot()}
 return changed
}
async function loadApp(){
 show('app');$('logout').classList.remove('hidden');$('dailyMinutes').textContent=profile.daily_minutes;
 try{await loadCore();let retried=await retryPendingSessionSummary();if(retried)await loadCore();await syncStreakFromSessions();await restoreDailyProgress()}catch(err){setSystemStatus(err?.message||'Atlas could not load your learning map.','error');return}
 setSystemStatus(coreLoadWarning,coreLoadWarning?'warn':'');renderAll();
 if(localStorage.getItem('atlas_show_snapshot')==='1'){
  localStorage.removeItem('atlas_show_snapshot');let ranked=strengthEvidenceProfile(),top=ranked[0],second=ranked[1],top3=ranked.filter(x=>x.confidence>=32).slice(0,3),clear=!!(top&&top.confidence>=65&&top.evidencePoints>=4&&(!second||top.score-second.score>=7)),weak=ranked.filter(x=>x.e.confidence>=40).sort((a,b)=>a.e.ability-b.e.ability)[0],uncertain=subjects.map(s=>({s,e:subjectEvidence(s.key)})).filter(x=>x.e.confidence<35).slice(0,5),strengthText=clear?top.s.name:(top3.map(x=>x.s.name).join(' · ')||'still forming');
  $('modalBody').innerHTML=`<div class="eyebrow">YOUR FIRST KNOWLEDGE MAP</div><h2>Here’s what Atlas learned about you.</h2><p><strong>${clear?'Clearest demonstrated strength':'Strongest evidence so far'}:</strong> ${strengthText}.</p><p><strong>Lowest measured area with enough evidence:</strong> ${weak?.s.name||'not enough evidence yet'}.</p><p><strong>Still uncertain:</strong> ${uncertain.map(x=>x.s.name).join(', ')||'very little'}.</p><div class="notice">This is a starting model, not a permanent label. Atlas will keep refining it from what you actually demonstrate.</div><button id="snapshotContinue" class="primary">Start my first adaptive session</button>`;$('modal').classList.remove('hidden');$('snapshotContinue').onclick=()=>$('modal').classList.add('hidden')
 }
 backfillOpenAssessmentEvaluations().catch(()=>{});
}
function renderDiscovery(){
 if(!$('discoveryCard'))return;
 let candidates=discoveryCandidates(),pick=candidates[0];
 if(!pick){
   $('discoveryCard').innerHTML=`<div class="eyebrow">MAP STILL FORMING</div><strong>Atlas needs a little more evidence first.</strong><p>Complete a few learning blocks so Discovery has a real strength to build from. Atlas will not invent a connection just to fill this tab.</p>`;
   $('newDiscovery').disabled=true;$('learnDiscovery').classList.add('hidden');$('saveDiscoveryCuriosity').classList.add('hidden');return
 }
 $('newDiscovery').disabled=false;
 let from=getSubject(pick.source)?.name||pick.source,to=getSubject(pick.c.subject_key)?.name||pick.c.subject_key;
 if(!activeDiscovery){
   $('discoveryCard').innerHTML=`<div class="eyebrow">READY WHEN YOU ARE</div><strong>${from} → ${to}</strong><p>Atlas found a promising bridge from something you already know into <strong>${pick.c.name}</strong>.</p><p class="fineprint">Tap “Show me a connection.” Discovery will give you one finite connection, then stop.</p>`;
 }
}
async function buildDiscovery(){
 let candidates=discoveryCandidates(),pick=candidates[0];if(!pick)return;
 let c=pick.c,from=getSubject(pick.source)?.name||pick.source,to=getSubject(c.subject_key)?.name||c.subject_key;
 $('newDiscovery').disabled=true;$('newDiscovery').textContent='Connecting…';$('discoveryStatus').textContent=`Building a ${from} → ${to} connection…`;
 $('discoveryCard').innerHTML='<div class="skeleton big"></div>';
 try{
   let ctx=learnerContextFor(c,'discovery');ctx.mode='discovery';ctx.bridge_from=from;ctx.minutes=3;
   let {data,error}=await db.functions.invoke('atlas-ai-content',{body:ctx});
   if(error||!data)throw new Error(error?.message||'Discovery unavailable');
   if(data.provider==='atlas_fallback'||data.content_status==='unavailable')throw new Error(data.note||'Atlas does not have a real cross-domain explanation available right now.');
   activeDiscovery={concept:c,source:pick.source,data};discoverySeen.add(c.key);
   await saveLearningObject(c,'discovery',data,conceptDifficulty(c));
   await db.from('learning_events').insert({user_id:user.id,concept_key:c.key,event_type:'discovery_view',score:null,difficulty:conceptDifficulty(c),duration_seconds:0,modality:data.modality||'discovery',route_type:'discovery',provider:data.provider||'unknown',bridge_source:pick.source,metadata:{version:ATLAS_VERSION,non_mastery:true}});
   $('discoveryCard').innerHTML=`<div class="eyebrow">CONNECTION DISCOVERED · ${from} → ${to}</div><h3>${data.title||c.name}</h3>${data.hook?`<div class="notice">${data.hook}</div>`:''}${renderTextBlock(data.explanation||'')}${renderVisual(data)}${renderConnection(data)}<div class="ai-section"><strong>Why Atlas showed you this</strong><p>You have demonstrated strength in ${from}. Atlas is using that as scaffolding to make ${to} easier to enter without pretending you already know it.</p></div><p class="fineprint">This discovery created no mastery credit. Learning it deeply requires a lesson and later retrieval.</p>`;
   $('learnDiscovery').classList.remove('hidden');$('saveDiscoveryCuriosity').classList.remove('hidden');
   $('discoveryStatus').textContent='One connection, then stop. Choose whether to learn it, save it, or move on.'
 }catch(err){
   activeDiscovery=null;$('discoveryCard').innerHTML=`<p>Atlas could not build this discovery right now.</p><p class="fineprint">${err?.message||'Please try again.'}</p>`;
   $('discoveryStatus').textContent=''
 }finally{
   $('newDiscovery').disabled=false;$('newDiscovery').textContent='Show me another connection'
 }
}

function predictedRetention(m){if(!m)return null;let base=+m.retention_probability||0,fr=+m.forgetting_rate||.08,last=m.last_assessed_at?new Date(m.last_assessed_at):new Date(),days=Math.max(0,(Date.now()-last.getTime())/864e5);return Math.max(0,Math.min(1,base*Math.exp(-fr*days)))}
function conceptStatus(c){
 let m=conceptMastery(c.key),e=subjectEvidence(c.subject_key),ret=predictedRetention(m),due=m?.next_review_at&&new Date(m.next_review_at)<=new Date();
 if(due)return ['due','Due for retrieval'];if(ret!==null&&ret<.55)return ['due',`Retention ${Math.round(ret*100)}% · fading`];if(verifiedConcept(m))return ['mastered','Verified'];if(m&&+m.evidence_count>0)return ['shaky',+m.mastery>=50?'Developing':'Needs repair'];if((+c.level)<=Math.floor(e.boundary||0))return ['frontier','Provisionally placed'];return ['unknown','Unknown']
}
function subjectMapInsight(subjectKey){
 let s=getSubject(subjectKey),list=concepts.filter(c=>c.subject_key===subjectKey).sort((a,b)=>(+a.level)-(+b.level)),e=subjectEvidence(subjectKey);
 let statuses=list.map(c=>({c,status:conceptStatus(c),m:conceptMastery(c.key),blocked:prereqs.filter(p=>p.concept_key===c.key&&!prereqSatisfied(p))}));
 let verifiedRows=statuses.filter(x=>verifiedConcept(x.m)),due=statuses.filter(x=>x.status[0]==='due'),shaky=statuses.filter(x=>x.status[0]==='shaky'),unknown=statuses.filter(x=>x.status[0]==='unknown'),blocked=statuses.filter(x=>x.blocked.length);
 let direct=statuses.filter(x=>x.m&&(+x.m.evidence_count||0)>0),highest=verifiedRows.slice().sort((a,b)=>(+b.c.level)-(+a.c.level))[0]?.c||null;
 let recommendation=null,kind='learn',reason='';
 if(e.confidence<35){
   let level=diagnosticTarget(subjectKey),candidate=list.find(c=>+c.level===level)||list[0];recommendation=candidate;kind='calibrate';
   reason=`Atlas has low-confidence evidence in ${s?.name||subjectKey}. The frontier estimate is provisional, so the next need is a small amount of better evidence before Atlas accelerates.`
 }else if(due.length){
   recommendation=due[0].c;kind='review';
   reason=`${recommendation.name} was previously demonstrated, but its retention signal says it is due for retrieval. Strengthening it now is more valuable than simply moving forward.`
 }else if(shaky.length){
   recommendation=shaky.slice().sort((a,b)=>(+a.c.level)-(+b.c.level))[0].c;kind='repair';
   reason=`You have direct evidence for ${recommendation.name}, but it is not verified yet. Atlas should repair this weak point before treating the subject as stronger than the evidence supports.`
 }else{
   let ready=list.filter(c=>!verifiedConcept(conceptMastery(c.key))&&prereqs.filter(p=>p.concept_key===c.key).every(prereqSatisfied))
     .map(c=>({c,r:routeScore(c,'frontier')})).filter(x=>x.r.score>-9000).sort((a,b)=>b.r.score-a.r.score)[0];
   recommendation=ready?.c||list.find(c=>!verifiedConcept(conceptMastery(c.key)))||list[list.length-1];kind='learn';
   reason=recommendation?`Your prerequisites and current evidence make ${recommendation.name} the clearest next learning move in ${s?.name||subjectKey}.`:`Atlas has no obvious gap in this subject right now; transfer and delayed retrieval are the next useful tests.`
 }
 return {s,list,e,statuses,verifiedRows,due,shaky,unknown,blocked,direct,highest,recommendation,kind,reason}
}
function renderMap(){
 $('mapItems').innerHTML=subjects.filter(s=>s.key!=='hvac').map(s=>{
   let e=subjectEvidence(s.key),ms=masteries.filter(m=>m.subject_key===s.key),count=concepts.filter(c=>c.subject_key===s.key).length,verifiedN=ms.filter(verifiedConcept).length,verifiedPct=count?Math.round(verifiedN/count*100):0;
   return `<button class="track mapSubject" data-subject="${s.key}" aria-label="Explore ${s.name} knowledge insights" style="width:100%;text-align:left;background:transparent;color:inherit;border:0;padding:0"><div class="track-head"><span><strong>${s.name}</strong></span><span><strong>${verifiedN}/${count}</strong> verified · ${verifiedPct}%</span></div><div class="barbg" title="Verified knowledge progress"><div class="bar" style="width:${verifiedPct}%"></div></div><div class="track-sub"><span>Estimated frontier L${(e.boundary||0).toFixed(1)}/10</span><span class="${e.confidence<35?'confidence-low':'confidence-good'}">Estimate confidence ${e.confidence.toFixed(0)}%</span><span class="map-explore-link">Explore your insights →</span></div></button>`
 }).join('');
 document.querySelectorAll('.mapSubject').forEach(b=>b.addEventListener('click',()=>renderMapDetail(b.dataset.subject)))
}
async function openMapRecommendedLesson(concept){
 if(!concept)return;
 openDeepDiveForSubject(concept.subject_key,concept.key);
 $('frontierCard').innerHTML=`<div class="eyebrow">FROM YOUR KNOWLEDGE MAP · ${getSubject(concept.subject_key)?.name||''}</div><strong>${concept.name}</strong><p>${concept.description||concept.learning_objective||''}</p><div class="notice">Atlas selected this Deep Dive from your current evidence, prerequisite state, confidence, and retention needs.</div>`;
 $('aiOutput').classList.remove('hidden');$('aiOutput').innerHTML='<div class="skeleton big"></div><div class="skeleton"></div>';
 let core=coreLessonFor(concept);if(core){renderAI(core);return}
 let difficulty=conceptDifficulty(concept),cached=learningObjects.find(x=>x.concept_key===concept.key&&x.route_type==='lesson'&&+x.difficulty===difficulty&&Date.now()-new Date(x.created_at).getTime()<3*864e5);
 if(cached?.payload&&Object.keys(cached.payload).length){activeLearningObject=cached;renderAI(cached.payload);return}
 let ctx=learnerContextFor(concept,'frontier');ctx.mode='lesson';let {data,error}=await db.functions.invoke('atlas-ai-content',{body:ctx});
 if(error||!data){$('aiOutput').innerHTML='<div class="notice">Atlas could not build this Deep Dive right now. Your map has not been changed.</div>';return}
 await saveLearningObject(concept,'lesson',data,difficulty);renderAI(data)
}
function renderMapDetail(subjectKey){
 let x=subjectMapInsight(subjectKey),{s,list,e,verifiedRows,due,shaky,unknown,blocked,direct,highest,recommendation,kind,reason}=x,el=$('mapDetail'),count=list.length,verifiedN=verifiedRows.length,verifiedPct=count?Math.round(verifiedN/count*100):0;
 let needs=[];
 if(due.length)needs.push(`${due.length} due for retrieval`);
 if(shaky.length)needs.push(`${shaky.length} developing / needs repair`);
 if(blocked.length)needs.push(`${blocked.length} prerequisite-blocked`);
 if(unknown.length)needs.push(`${unknown.length} still unknown`);
 if(!needs.length)needs.push('No immediate weak point detected');
 let evidenceText=e.confidence<35?`Atlas is uncertain here. The L${(e.boundary||0).toFixed(1)} frontier is an estimate, not demonstrated mastery.`:direct.length?`Atlas has direct learning evidence on ${direct.length} of ${count} concepts. ${highest?`Your highest verified concept is ${highest.name} (Level ${highest.level}).`:''}`:`The current frontier comes mostly from placement evidence. Atlas still needs learning evidence before calling concepts verified.`;
 let actionLabel=kind==='review'?`Review ${recommendation?.name||'this subject'}`:kind==='repair'?`Strengthen ${recommendation?.name||'this subject'}`:kind==='calibrate'?`Build evidence in ${s?.name||'this subject'}`:`Learn ${recommendation?.name||'next concept'}`;
 el.classList.remove('hidden');
 el.innerHTML=`<div class="section-title"><div><div class="eyebrow">${s?.name||subjectKey} · PERSONAL INSIGHTS</div><h3>${verifiedN}/${count} concepts verified · ${verifiedPct}%</h3></div><button id="closeMapDetail" class="ghost">Close</button></div>
 <div class="map-insight-grid">
   <div class="metric-card"><span>Verified knowledge</span><strong>${verifiedN}/${count}</strong><small>The bar above reflects this exact number.</small></div>
   <div class="metric-card"><span>Estimated frontier</span><strong>L${(e.boundary||0).toFixed(1)}</strong><small>${e.confidence.toFixed(0)}% confidence · not the same as verified progress.</small></div>
   <div class="metric-card"><span>Direct evidence</span><strong>${direct.length}</strong><small>Concepts with actual learning evidence.</small></div>
   <div class="metric-card"><span>Needs attention</span><strong>${due.length+shaky.length}</strong><small>${needs.join(' · ')}</small></div>
 </div>
 <div class="notice map-next-move"><div class="eyebrow">NEXT BEST MOVE</div><h3>${recommendation?.name||'Keep building transfer'}</h3><p>${reason}</p>${recommendation?`<button id="mapLearnNext" class="primary">${actionLabel}</button>`:''}</div>
 <div class="ai-section"><strong>What this means for you</strong><p>${evidenceText}</p></div>
 <div class="ai-section"><strong>Concept-level map</strong><div class="concept-grid">${list.map(c=>{let [cls,label]=conceptStatus(c),m=conceptMastery(c.key),req=prereqs.filter(p=>p.concept_key===c.key),blockedReq=req.filter(p=>!prereqSatisfied(p));return `<div class="concept-node ${cls}"><small>Level ${c.level} · ${label}${blockedReq.length?' · prerequisite blocked':''}</small><strong>${c.name}</strong><small>${c.learning_objective||c.description||''}</small><div class="track-sub"><span>${m?`Mastery ${(+m.mastery).toFixed(0)} · confidence ${(+m.confidence).toFixed(0)}% · ${+m.evidence_count||0} evidence`:'No direct learning evidence yet'}</span>${blockedReq.length?`<span>Blocked by: ${blockedReq.map(p=>conceptByKey(p.prerequisite_key)?.name||p.prerequisite_key).join(', ')}</span>`:req.length?`<span>Prerequisites ready</span>`:''}</div></div>`}).join('')}</div></div>`;
 $('closeMapDetail').onclick=()=>el.classList.add('hidden');
 if($('mapLearnNext'))$('mapLearnNext').onclick=()=>openMapRecommendedLesson(recommendation);
 requestAnimationFrame(()=>el.scrollIntoView({behavior:'smooth',block:'start'}))
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
 $('forecastWeeklyHours').textContent=w.toFixed(1);$('yearly').textContent=Math.round(y);$('fiveYearHours').textContent=Math.round(f);
 let pts=[['Now',cur],['6 mo',Math.min(100,cur+Math.sqrt(y*.5)*eff)],['1 yr',Math.min(100,cur+Math.sqrt(y)*eff*1.4)],['3 yr',Math.min(100,cur+Math.sqrt(y*3)*eff*2.0)],['5 yr',Math.min(100,cur+Math.sqrt(y*5)*eff*2.45)]];
 $('forecastText').textContent=`At your current schedule, Atlas models about ${Math.round(y)} deliberate learning hours per year. Progress is gated by demonstrated mastery, delayed retrieval, and prerequisite readiness — not time alone.`;
 $('forecastChart').innerHTML=pts.map(([l,v])=>`<div class="forecast-col"><b>${v.toFixed(0)}</b><div class="forecast-bar" style="height:${Math.max(4,v)}%"></div><span>${l}</span></div>`).join('');
 $('forecastMilestones').innerHTML=[['6 months','Foundational gaps shrinking while strong areas keep advancing.'],['1 year','Broad literacy with visible interdisciplinary bridges.'],['3 years','A connected generalist base with several deep frontiers.'],['5 years','Potential for unusually broad competence plus advanced depth in selected domains.']].map(([a,b])=>`<div class="milestone"><strong>${a}</strong><span>${b}</span></div>`).join('')
}
function taskLabel(p){if(p.type==='lesson')return ['Micro-lesson',`${getSubject(p.route.c.subject_key)?.name}: ${p.route.c.name}`,'Learn'];
 let c=p.route.c,s=getSubject(c.subject_key)?.name||c.subject_key;
 if(p.type==='review')return ['Review something you learned',`${s}: ${c.name}`,'Review'];
 if(p.type==='gap'&&p.route.diagnostic)return ['Quick calibration',`${s}: ${c.name}`,'Calibrate'];
 if(p.type==='gap')return ['Learn a foundation',`${s}: ${c.name}`,'Learn'];
 if(p.type==='bridge')return ['Connection lesson',`${s}: ${c.name}`,'Learn'];
 return ['Learn the next concept',`${s}: ${c.name}`,'Learn']
}
function renderToday(){
 let now=new Date(),m=sessions.filter(s=>s.completed&&new Date(s.completed_at||s.created_at).getMonth()===now.getMonth()&&new Date(s.completed_at||s.created_at).getFullYear()===now.getFullYear()).reduce((a,s)=>a+(s.actual_minutes||0),0);$('monthMinutes').textContent=m;
 if(!todayPlan.length&&!dailySessionComplete)todayPlan=chooseSessionPlan(sessionMode||'balanced');if(!sessionArc&&todayPlan.length)sessionArc=buildSessionArc(todayPlan,sessionMode||'balanced');
 let streak=+profile.current_streak||0,last=profile.last_active_on?String(profile.last_active_on).slice(0,10):null,today=localDayKey(),streakDone=last===today;
 $('todayStreak').innerHTML=`<div><span class="streak-flame">🔥</span><strong>${streak} day${streak===1?'':'s'}</strong><span> current streak</span></div><small>${streakDone?'Today is already protected.':streak?`Complete today’s guided session to extend it to ${streak+1}.`:'Complete today’s guided session to start your streak.'} Longest: ${+profile.longest_streak||0}.</small>`;
 let goal=String(profile.learning_goal||'').trim();$('sessionGoalLine').textContent=goal?`Your goal influences today’s route: “${goal}”`:'Atlas balances your goals, gaps, frontier, interests, retention, and long-term breadth across the week.';
 if(sessionArc){$('sessionArcTitle').textContent=sessionArc.title;$('sessionArcScenario').textContent=sessionArc.scenario;$('sessionArcConnection').textContent=sessionArc.connection||'Today’s concepts were selected because one should make the next easier to understand.'}
 if(dailySessionComplete){$('todaySummary').textContent='Today’s guided learning session is complete. Atlas will not start another daily plan until the next study day.';$('startDailySession').textContent='Session complete';$('startDailySession').disabled=true;$('deepDiveDaily').classList.add('hidden');$('todayItems').innerHTML=todayPlan.map((p,i)=>{let c=p.route.c;return `<div class="task done"><div><strong>${i+1}. ${p.type==='synthesis'?'Connect & apply':p.type==='review'?'Short retrieval':getSubject(c.subject_key)?.name+' · '+c.name}</strong><small>${p.type==='synthesis'?'Integrated real-world application':p.type==='review'?'Retrieval from prior teaching':'Lesson completed'}</small></div><span>✓</span></div>`}).join('')+`<div class="notice"><strong>Done for today.</strong> Optional Deep Dive, Discovery, or Explore do not restart the daily session.</div>`;$('allocationSummary').innerHTML='<span class="allocation-chip">Guided session complete</span>';$('sessionDone').textContent=`${todayPlan.length} / ${todayPlan.length} complete`;return}
 let lessonSubjects=[...new Set(todayPlan.filter(p=>p.type==='lesson').map(p=>getSubject(p.route.c.subject_key)?.name).filter(Boolean))],target=+profile.daily_minutes||30;
 $('todaySummary').textContent=`One connected learning arc built for about ${target} minutes of active study. ${lessonSubjects.length>1?`Atlas uses ${lessonSubjects.join(' + ')} only because today’s real-world situation gives them a meaningful connection.`:`Today stays focused in ${lessonSubjects[0]||'one area'} long enough for the ideas to form a pattern.`}`;
 let next=nextIncompletePlanIndex();$('startDailySession').disabled=false;$('startDailySession').textContent=todayDone.size?`Continue session · step ${next+1} of ${todayPlan.length}`:`Start ${target}-minute guided session`;
 $('deepDiveDaily').classList.toggle('hidden',todayDone.size>0||guidedSessionActive);let primary=todayPlan.find(p=>p.type==='lesson')?.route.c;$('deepDiveDaily').textContent=primary?`Deep Dive in ${getSubject(primary.subject_key)?.name||'this subject'}`:'Open Deep Dive';$('deepDiveDaily').onclick=()=>openDeepDiveForSubject(primary?.subject_key||null,primary?.key||null);
 $('todayItems').innerHTML=todayPlan.map((p,i)=>{let c=p.route.c,key=`${p.type}_${c.key}`,done=todayDone.has(key),current=i===next,label=p.type==='synthesis'?'Connect & apply':p.type==='review'?'Short retrieval':p.session_role==='connected'?'Connected micro-lesson':'Micro-lesson',sub=p.type==='synthesis'?(sessionArc?.title||'Apply the session as one pattern'):p.type==='review'?`${getSubject(c.subject_key)?.name} · ${c.name}`:`${getSubject(c.subject_key)?.name} · ${c.name}`;return `<div class="task session-preview ${done?'done':''} ${current?'current':''}"><div><strong>${i+1}. ${label} · ~${p.estimated_minutes||stageEstimate(p.type,i,todayPlan.length)} min</strong><small>${sub}</small></div><span>${done?'✓':current?'Next':'Later'}</span></div>`}).join('');
 $('allocationSummary').innerHTML=`<span class="allocation-chip">Target: ${target} min</span><span class="allocation-chip">${todayPlan.filter(p=>p.type==='lesson').length} lesson${todayPlan.filter(p=>p.type==='lesson').length===1?'':'s'}</span>${todayPlan.some(p=>p.type==='synthesis')?'<span class="allocation-chip">1 integrated application</span>':''}${todayPlan.some(p=>p.type==='review')?'<span class="allocation-chip">1 related review</span>':''}<span class="allocation-chip">Balanced daily arc</span>`;$('sessionDone').textContent=`${todayDone.size} / ${todayPlan.length} complete`;setTimeout(prefetchLearningObject,250)
}
$('startDailySession').onclick=startOrContinueDailySession;

function renderFrontier(){
 if(!$('deepDiveSubject'))return;
 if(!deepDiveSubjectKey)deepDiveSubjectKey=frontierConcept?.subject_key||pickCandidate('frontier')?.c?.subject_key||subjects[0]?.key||null;
 $('deepDiveSubject').innerHTML=subjects.filter(s=>s.key!=='hvac').map(s=>`<option value="${s.key}" ${s.key===deepDiveSubjectKey?'selected':''}>${s.name}</option>`).join('');
 let pick=bestDeepDiveConcept(deepDiveSubjectKey)||pickCandidate('frontier')||pickCandidate('general'),f=pick?{concept:pick.c,subject:getSubject(pick.c.subject_key),reasons:pick.reasons}:getFrontier();
 if(frontierConcept&&frontierConcept.subject_key===deepDiveSubjectKey)f={concept:frontierConcept,subject:getSubject(frontierConcept.subject_key),reasons:currentRoute?.reasons||pick?.reasons||[]};
 frontierConcept=f.concept;currentRoute=routeScore(frontierConcept,'frontier');let e=subjectEvidence(f.subject?.key);
 $('frontierCard').innerHTML=`<div class="eyebrow">${f.subject?.name||'Deep Dive'} · YOUR CURRENT EDGE</div><strong>${f.concept?.name||'Next concept'}</strong><p>${f.concept?.description||f.concept?.learning_objective||''}</p><div class="track-sub"><span>Estimated frontier: L${(e.boundary||0).toFixed(1)}/10</span><span>Confidence: ${e.known?e.confidence.toFixed(0)+'%':'low'}</span><span>Target difficulty: ${conceptDifficulty(f.concept)}/10</span><span>Why this concept: ${(f.reasons||[]).join(' · ')||'best next concept in this subject'}</span></div>`;
 $('deepDiveSubject').onchange=()=>{deepDiveSubjectKey=$('deepDiveSubject').value;frontierConcept=null;currentRoute=null;$('aiOutput').classList.add('hidden');renderFrontier()}
}
function conceptDifficulty(c){if(!c)return 3;let lo=+c.difficulty_min||+c.level||3,hi=+c.difficulty_max||lo;return Math.max(1,Math.min(10,Math.round((lo+hi)/2)))}
function targetDifficulty(st){if(!st)return 3;return Math.max(2,Math.min(9,Math.round((+st.estimated_level)/12)))}
function strengthEvidenceProfile(){
 return subjects.map(s=>{
  let e=subjectEvidence(s.key),st=placementState(s.key),ms=masteries.filter(m=>m.subject_key===s.key),direct=ms.reduce((a,m)=>a+(+m.evidence_count||0),0),verifiedN=ms.filter(verifiedConcept).length,oe=openEvidenceForSubject(openEvaluations,s.key),questions=+st?.questions_answered||0;
  let baseStrength=st?.strength_score!==null&&st?.strength_score!==undefined?+st.strength_score:e.ability*(.48+.52*e.confidence/100);
  let baseConf=Math.max(e.confidence,+st?.strength_confidence||0),confidence=Math.min(98,baseConf+Math.min(18,direct*1.8)+Math.min(10,oe.length*2));
  let score=Math.min(100,baseStrength+Math.min(10,verifiedN*2.2)+Math.min(5,direct*.45));
  return {s,e,st,score,confidence,evidencePoints:questions+oe.length+direct,verifiedN,direct,openCount:oe.length}
 }).filter(x=>x.e.known||x.evidencePoints>0).sort((a,b)=>b.score-a.score||b.confidence-a.confidence)
}
function strongestKnownSubject(){
 let ranked=strengthEvidenceProfile().filter(x=>x.confidence>=45&&x.evidencePoints>=2);
 return ranked[0]?.s||null
}
function recentAIContext(limit=8){
 return events.slice(0,limit).map(e=>({type:e.event_type,score:+e.score||0,concept:e.concept_key,subject:conceptByKey(e.concept_key)?.subject_key||''}))
}
function learnerContextFor(concept,routeType){
 let e=subjectEvidence(concept.subject_key),m=conceptMastery(concept.key),strong=strongestKnownSubject(),bridgeFrom=bridgeSource(concept);if(bridgeFrom===concept.subject_key)bridgeFrom=null;let mods=modalityPerf.slice().sort((a,b)=>(+b.avg_score+ +b.transfer_score+ +b.delayed_retention)-(+a.avg_score+ +a.transfer_score+ +a.delayed_retention)),activeMis=misconceptions.filter(x=>x.concept_key===concept.key&&!x.resolved_at).slice(0,4);
 return {route_type:routeType,subject:getSubject(concept.subject_key)?.name||concept.subject_key,concept:concept.name,concept_key:concept.key,difficulty:conceptDifficulty(concept),estimated_level:e.ability,estimate_confidence:e.confidence,concept_mastery:m?+m.mastery:null,retention_probability:m?+m.retention_probability:null,forgetting_rate:m?+m.forgetting_rate:null,transfer_score:m?+m.transfer_score:null,interests:[...interestKeys()],strong_subject:strong?.key!==concept.subject_key?(strong?.name||null):null,bridge_from:bridgeFrom?getSubject(bridgeFrom)?.name||bridgeFrom:null,prerequisite_path:prereqs.filter(p=>p.concept_key===concept.key).map(p=>conceptByKey(p.prerequisite_key)?.name).filter(Boolean),recent_results:recentAIContext(),preferred_modalities:mods.slice(0,3).map(x=>({modality:x.modality,score:+x.avg_score,retention:+x.delayed_retention,transfer:+x.transfer_score})),misconceptions:activeMis.map(x=>({code:x.code,description:x.description,severity:+x.severity})),minutes:Math.max(5,Math.round(profile.daily_minutes/Math.max(1,sessionDesign().lessons)))}
}


function renderBuild(){if($('buildBadge'))$('buildBadge').textContent=`${ATLAS_VERSION} · ${ATLAS_BUILD}`;if($('footerBuild'))$('footerBuild').textContent=`${ATLAS_VERSION} · Build ${ATLAS_BUILD}`}
function renderLearnerSnapshot(){
 let ranked=strengthEvidenceProfile(),top=ranked[0],second=ranked[1],top3=ranked.filter(x=>x.confidence>=32).slice(0,3),clear=!!(top&&top.confidence>=65&&top.evidencePoints>=4&&(!second||top.score-second.score>=7)),weak=ranked.filter(x=>x.e.confidence>=40).sort((a,b)=>a.e.ability-b.e.ability)[0],uncertain=subjects.map(s=>({s,e:subjectEvidence(s.key)})).filter(x=>x.e.confidence<35).slice(0,3),front=pickCandidate('frontier');
 let strengthTitle=clear?`Clearest demonstrated strength: ${top.s.name}`:top3.length?`Strongest evidence so far: ${top3.map(x=>x.s.name).join(' · ')}`:'Your map is still forming';
 $('learnerSnapshot').innerHTML=`<div class="section-title"><div><div class="eyebrow">WHAT ATLAS CURRENTLY BELIEVES</div><h3>${strengthTitle}</h3></div><span class="streak-pill">🔥 ${profile.current_streak||0} day streak</span></div><p>${weak?`Lowest measured area with enough evidence: <strong>${weak.s.name}</strong>. `:''}${front?`Current frontier: <strong>${getSubject(front.c.subject_key)?.name} · ${front.c.name}</strong>.`:''}</p><p class="fineprint">${clear?'This strength has enough repeated evidence to stand out.':'Atlas does not have enough separation to crown one subject confidently yet.'} Placement is provisional; lessons, retrieval, and open reasoning continue refining the map.</p>${uncertain.length?`<p class="fineprint">Still uncertain: ${uncertain.map(x=>x.s.name).join(', ')}. Unknown is not treated as weak.</p>`:''}`
}
function monthStart(){let d=new Date();return new Date(d.getFullYear(),d.getMonth(),1)}
function modalityWinner(){let rows=modalityPerf.filter(x=>+x.attempts>=2).sort((a,b)=>((+b.avg_score)+(+b.delayed_retention)+(+b.transfer_score))-((+a.avg_score)+(+a.delayed_retention)+(+a.transfer_score)));return rows[0]?.modality||profile.preferred_modality||'Still learning'}
function renderInsights(){
 $('streakNow').textContent=profile.current_streak||0;$('connectionCount').textContent=connections.length;$('misconceptionCount').textContent=misconceptions.filter(x=>!x.resolved_at).length;$('preferredStyle').textContent=modalityWinner();
 $('modalityStats').innerHTML=modalityPerf.length?modalityPerf.slice().sort((a,b)=>(+b.avg_score)-(+a.avg_score)).map(m=>`<div class="mini-row"><span><strong>${m.modality}</strong><small>${m.attempts} evidence points</small></span><span>${(+m.avg_score).toFixed(0)}% immediate · ${(+m.delayed_retention).toFixed(0)}% retained · ${(+m.transfer_score).toFixed(0)}% transfer</span></div>`).join(''):'<p>Atlas needs more completed learning objects before it can favor one teaching style.</p>';
 $('misconceptionList').innerHTML=misconceptions.filter(x=>!x.resolved_at).slice(0,8).map(m=>`<div class="mini-row"><span><strong>${conceptByKey(m.concept_key)?.name||m.concept_key}</strong><small>${m.description||m.code}</small></span><span>${m.evidence_count}× observed</span></div>`).join('')||'<p>No persistent misconception pattern has been identified yet.</p>';
 $('connectionList').innerHTML=connections.slice(0,8).map(k=>`<div class="mini-row"><span><strong>${conceptByKey(k.from_concept_key)?.name||k.from_concept_key}</strong> → <strong>${conceptByKey(k.to_concept_key)?.name||k.to_concept_key}</strong></span><span>${(+k.evidence_score).toFixed(0)}% evidence</span></div>`).join('')||'<p>No verified cross-domain connection yet.</p>';$('milestoneList').innerHTML=milestones.slice(-8).reverse().map(m=>`<div class="milestone"><strong>${m.title}</strong><span>${new Date(m.achieved_at).toLocaleDateString()}</span></div>`).join('')||'<p>Your first evidence-based milestone will appear here.</p>';
 let ms=monthStart(),me=events.filter(e=>new Date(e.created_at)>=ms),mins=sessions.filter(s=>s.completed&&new Date(s.completed_at||s.created_at)>=ms).reduce((a,s)=>a+(s.actual_minutes||0),0),newVerified=new Set(me.filter(e=>+e.score>=70).map(e=>e.concept_key)).size,bridges=me.filter(e=>e.route_type==='bridge'||e.modality==='bridge').length,retr=me.filter(e=>e.event_type==='review').length;
 $('monthlyStatement').innerHTML=`<h3>${mins} active minutes invested</h3><p>You produced evidence across ${new Set(me.map(e=>conceptByKey(e.concept_key)?.subject_key).filter(Boolean)).size} domains, strengthened about ${newVerified} concepts, completed ${retr} retrievals, and attempted ${bridges} cross-domain bridges. Atlas currently favors <strong>${modalityWinner()}</strong> when enough outcome data supports it.</p>`
}
async function loadAdminAnalytics(){
 await db.ensureSession();
 let r=await fetch(`${URL}/rest/v1/rpc/get_tester_analytics`,{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+db.token(),'Content-Type':'application/json'},body:'{}'});
 if(!r.ok)return;let d=await r.json().catch(()=>null);if(!d||d.authorized===false)return;$('adminAnalytics').classList.remove('hidden');$('adminAnalyticsBody').innerHTML=`<div class="stats3"><div><strong>${d.users||0}</strong><span>testers</span></div><div><strong>${d.completed_sessions||0}</strong><span>sessions</span></div><div><strong>${d.active_minutes||0}</strong><span>active minutes</span></div></div><div class="mini-row"><span>Average evidence score</span><strong>${d.avg_score??'—'}</strong></div><div class="mini-row"><span>Fallback content rate</span><strong>${d.fallback_rate??0}%</strong></div><div class="mini-row"><span>Too easy / too hard / boring / broken</span><strong>${d.too_easy||0} / ${d.too_hard||0} / ${d.boring||0} / ${d.broken||0}</strong></div>`
}
function renderExplore(){renderCuriosity()}
function renderCuriosity(){if(!$('curiosityList'))return;$('curiosityList').innerHTML=curiosityQueue.filter(q=>q.status!=='done').slice().reverse().map(q=>`<div class="mini-row"><span>${q.question}</span><button class="ghost curiosityDone" data-id="${q.id}">Done</button></div>`).join('')||'<p>No saved questions yet.</p>';document.querySelectorAll('.curiosityDone').forEach(b=>b.onclick=async()=>{await db.from('curiosity_queue').update({status:'done'}).eq('id',b.dataset.id);await loadCore();renderCuriosity()})}
function prerequisitePath(c){let seen=new Set(),out=[];function walk(k,depth=0){if(seen.has(k)||depth>5)return;seen.add(k);prereqs.filter(p=>p.concept_key===k).forEach(p=>{let pc=conceptByKey(p.prerequisite_key);if(pc){walk(pc.key,depth+1);out.push(pc)}})}walk(c.key);return [...new Map(out.map(x=>[x.key,x])).values()]}
const SEARCH_ALIASES={
 'physics_kinematics':['velocity','speed','motion','distance over time'],
 'physics_newton_s_laws':['force','newton','f=ma','acceleration'],
 'physics_work_and_energy':['work','kinetic energy','potential energy'],
 'physics_thermodynamics':['heat','temperature','entropy','thermal'],
 'physics_electricity_and_circuits':['electricity','circuit','voltage','current','ohms law'],
 'physics_fluids':['pressure','fluid','hydraulics'],
 'mathematics_linear_equations':['algebra','equation','solve for x'],
 'mathematics_fractions_and_ratios':['fraction','ratio','rate'],
 'mathematics_percentages_and_proportions':['percent','percentage','proportion'],
 'mathematics_functions_and_graphs':['function','graph','slope'],
 'mathematics_calculus_intuition':['calculus','derivative','integral','rate of change'],
 'statistics_probability_foundations':['probability','chance','odds'],
 'statistics_regression':['regression','trend line','correlation model'],
 'statistics_sampling_and_bias':['sampling','survey bias','sample bias'],
 'economics_inflation_and_unemployment':['inflation','unemployment','cpi'],
 'economics_supply_and_demand':['supply','demand','prices'],
 'economics_money_and_banking':['banking','money supply','banks'],
 'finance_time_value_of_money':['compound interest','interest','present value','future value'],
 'accounting_income_statement':['profit and loss','p&l','income statement'],
 'accounting_balance_sheet':['balance sheet','assets liabilities equity'],
 'business_business_models':['business model','revenue model'],
 'leadership_project_planning':['project management','project plan','schedule project'],
 'computing_programming_foundations':['coding','programming','code'],
 'computing_computer_networks':['networking','internet','tcp ip'],
 'computing_databases':['database','sql'],
 'ai_transformers_and_language_models':['llm','language model','chatgpt','transformer'],
 'trades_mechanical_heating_and_cooling_systems':['hvac','air conditioning','heating','cooling','furnace','heat pump'],
 'trades_mechanical_refrigeration_cycle':['refrigeration','refrigerant','compressor','evaporator','condenser'],
 'trades_mechanical_controls_and_automation':['building controls','thermostat','automation controls'],
 'history_world_war_i':['ww1','world war 1','first world war'],
 'history_world_war_ii':['ww2','world war 2','second world war'],
 'government_constitutional_principles':['constitution','constitutional government'],
 'media_misinformation':['fake news','misinformation','false information'],
 'reasoning_correlation_vs_causation':['correlation causation','correlation','causation'],
 'reasoning_claims_and_evidence':['evidence','claims','proof','source quality']
};
function normalizeSearch(s){return String(s||'').toLowerCase().replace(/[^a-z0-9%]+/g,' ').trim()}
function knowledgeSearch(q){
 let nq=normalizeSearch(q),words=nq.split(/\s+/).filter(Boolean);if(!words.length)return [];
 return concepts.map(c=>{let name=normalizeSearch(c.name),desc=normalizeSearch(c.description),obj=normalizeSearch(c.learning_objective),subject=normalizeSearch(getSubject(c.subject_key)?.name),aliases=(SEARCH_ALIASES[c.key]||[]).map(normalizeSearch),score=0;
   if(name===nq)score+=20;if(aliases.includes(nq))score+=18;if(name.includes(nq)||nq.includes(name))score+=10;if(aliases.some(a=>a.includes(nq)||nq.includes(a)))score+=9;
   for(let w of words){if(w.length<2)continue;if(name.includes(w))score+=4;if(aliases.some(a=>a.includes(w)))score+=4;if(desc.includes(w)||obj.includes(w))score+=1.5;if(subject.includes(w))score+=1}
   return {c,score}
 }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||(+a.c.level)-(+b.c.level)).slice(0,10)
}
async function saveLearningObject(concept,route,data,difficulty){let row={user_id:user.id,concept_key:concept?.key||null,route_type:route,provider:data?.provider||'unknown',modality:data?.modality||route,difficulty,payload:data||{}};let r=await db.from('learning_objects').insert(row).select().single();if(!r.error){activeLearningObject=r.data;learningObjects.unshift(r.data)}return r}
async function updateModality(modality,score,transfer=0,retained=0){if(!modality)return;let old=modalityPerf.find(x=>x.modality===modality),n=(+old?.attempts||0)+1,avg=((+old?.avg_score||0)*(n-1)+score)/n,tr=((+old?.transfer_score||0)*(n-1)+transfer)/n,dr=((+old?.delayed_retention||0)*(n-1)+retained)/n;await db.from('modality_performance').upsert({user_id:user.id,modality,attempts:n,avg_score:avg,transfer_score:tr,delayed_retention:dr,updated_at:new Date().toISOString()},{onConflict:'user_id,modality'});if(n>=3&&avg>=70&&profile.preferred_modality!==modality){await db.from('profiles').update({preferred_modality:modality,updated_at:new Date().toISOString()}).eq('user_id',user.id);profile.preferred_modality=modality}}
async function recordMisconception(conceptKey,code,description,severity=.5){if(!code)return;let old=misconceptions.find(x=>x.concept_key===conceptKey&&x.code===code&&!x.resolved_at);await db.from('learner_misconceptions').upsert({user_id:user.id,concept_key:conceptKey,code,description,severity,evidence_count:(+old?.evidence_count||0)+1,last_seen_at:new Date().toISOString(),resolved_at:null},{onConflict:'user_id,concept_key,code'})}
async function formConnection(fromKey,toKey,score){if(!fromKey||!toKey||fromKey===toKey||score<60)return;await db.from('knowledge_connections').upsert({user_id:user.id,from_concept_key:fromKey,to_concept_key:toKey,connection_type:'bridge',evidence_score:score,formed_at:new Date().toISOString()},{onConflict:'user_id,from_concept_key,to_concept_key,connection_type'})}
function localDayKey(v=new Date()){let d=v instanceof Date?v:new Date(v);let y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`}
function derivedStreak(){
 let dates=[...new Set(sessions.filter(s=>s.completed).map(s=>localDayKey(s.completed_at||s.created_at)))].sort().reverse(),grace=+profile?.streak_grace_days||1;if(!dates.length)return {current:0,longest:Math.max(0,+profile?.longest_streak||0),last:null};
 let today=localDayKey(),gapToday=Math.floor((new Date(today)-new Date(dates[0]))/86400000);if(gapToday>grace+1)return {current:0,longest:Math.max(0,+profile?.longest_streak||0),last:dates[0]};
 let current=1;for(let i=1;i<dates.length;i++){let gap=Math.floor((new Date(dates[i-1])-new Date(dates[i]))/86400000);if(gap<=grace+1)current++;else break}
 return {current,longest:Math.max(+profile?.longest_streak||0,current),last:dates[0]}
}
async function syncStreakFromSessions(){let d=derivedStreak(),last=profile.last_active_on?String(profile.last_active_on).slice(0,10):null;if(+profile.current_streak!==d.current||+profile.longest_streak!==d.longest||last!==d.last){let r=await db.from('profiles').update({current_streak:d.current,longest_streak:d.longest,last_active_on:d.last,build_seen:ATLAS_VERSION,updated_at:new Date().toISOString()}).eq('user_id',user.id);if(!r.error){profile.current_streak=d.current;profile.longest_streak=d.longest;profile.last_active_on=d.last}}return d}
async function updateStreak(){return syncStreakFromSessions()}



function curatedMediaFor(conceptKey){return curatedMedia.filter(x=>x.concept_key===conceptKey).slice(0,3)}
function renderTextBlock(v){if(!v)return '';if(Array.isArray(v))return `<ul>${v.map(x=>`<li>${typeof x==='string'?x:(x.text||x.detail||'')}</li>`).join('')}</ul>`;return String(v).split(/\n{2,}/).map(x=>`<p>${x}</p>`).join('')}

function splitTeachingParagraphs(text){
 return String(text||'').split(/\n{2,}/).map(x=>x.trim()).filter(Boolean)
}
function trustedSourcesFor(subjectKey){
 let reg=window.ATLAS_SOURCE_REGISTRY||{},ids=reg.bySubject?.[subjectKey]||[];
 return ids.map(id=>({id,...(reg.sources?.[id]||{})})).filter(x=>x.name&&x.url)
}
function sourceBadge(s){
 let k=String(s.kind||'reference').replaceAll('_',' ');
 return `<span class="source-badge">${k}</span>`
}
function renderResearchShelf(concept,d){
 let used=Array.isArray(d?.sources)?d.sources.filter(x=>x&&x.url):[],trusted=trustedSourcesFor(concept?.subject_key).slice(0,4);
 let usedHtml=used.length?`<div class="source-group"><strong>Sources used for this lesson</strong>${used.map(x=>`<div class="source-row"><div><a href="${x.url}" target="_blank" rel="noopener">${x.title||x.publisher||x.url}</a>${x.publisher?`<small>${x.publisher}</small>`:''}</div><span class="source-badge">lesson source</span></div>`).join('')}</div>`:'';
 let shelfHtml=trusted.length?`<div class="source-group"><strong>Trusted reference shelf</strong><p class="fineprint">These are high-quality places Atlas uses or prioritizes for this subject. They are not automatically claimed as the exact source of every sentence above.</p>${trusted.map(s=>`<div class="source-row"><div><a href="${s.url}" target="_blank" rel="noopener">${s.name}</a><small>${s.region||''} · ${s.reuse||'Check source terms'}</small></div>${sourceBadge(s)}</div>`).join('')}</div>`:'';
 return `<div class="research-shelf">${usedHtml}${shelfHtml}<p class="fineprint"><strong>Source policy:</strong> Atlas writes teaching in its own words. It does not copy proprietary course content or protected source prose merely because the facts are useful.</p></div>`
}
function lessonDraftKey(c){return `atlas_lesson_${user?.id||'anon'}_${new Date().toISOString().slice(0,10)}_${c?.key||'lesson'}`}
function legacyLessonDraftKey(c){return `atlas_lesson_v070_${user?.id||'anon'}_${new Date().toISOString().slice(0,10)}_${c?.key||'lesson'}`}
function loadLessonDraft(c){
 try{
  let x=JSON.parse(localStorage.getItem(lessonDraftKey(c))||'null');
  if(x)return x;
  return JSON.parse(localStorage.getItem(legacyLessonDraftKey(c))||'null')||{}
 }catch{return {}}
}
function saveLessonDraft(c,patch={}){
 try{let cur=loadLessonDraft(c);localStorage.setItem(lessonDraftKey(c),JSON.stringify({...cur,...patch,saved_at:new Date().toISOString()}))}catch{}
}
function clearLessonDraft(c){try{localStorage.removeItem(lessonDraftKey(c));localStorage.removeItem(legacyLessonDraftKey(c))}catch{}}
function lessonStageEstimate(totalMinutes,stageCount){return Math.max(1,Math.round((+totalMinutes||8)/Math.max(1,stageCount)))}

function tutorSentenceChunks(text){
 let raw=String(text||'').replace(/\s+/g,' ').trim();if(!raw)return [];
 let sentences=raw.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[raw],out=[];
 sentences.forEach(s=>{
   s=s.trim();let words=s.split(/\s+/);
   if(words.length<=28){out.push(s);return}
   let parts=s.split(/(?<=,|;|:)\s+/).map(x=>x.trim()).filter(Boolean);
   if(parts.length===1){
     for(let i=0;i<words.length;i+=22)out.push(words.slice(i,i+22).join(' ')+(i+22<words.length?'…':''))
   }else parts.forEach(p=>out.push(p))
 });
 return out.filter(x=>x.length>8)
}
function tutorBand(c){
 let m=conceptMastery(c.key),e=subjectEvidence(c.subject_key);
 if(verifiedConcept(m)||(+m?.mastery||0)>=70)return 3;
 if((+m?.evidence_count||0)>=1||(+e.confidence||0)>=55&&(+e.boundary||0)>=Math.max(1,(+c.level||1)-1))return 2;
 if((+e.confidence||0)>=30)return 1;
 return 0
}
function tutorTermBeats(data,max=3){
 let terms=Array.isArray(data?.key_terms)?data.key_terms:[];
 return terms.slice(0,max).map(x=>typeof x==='string'?{kind:'term',title:'One useful word',text:x}:{kind:'term',title:`One useful word: ${x.term||'term'}`,text:x.definition||''})
}
function buildTutorBeats(data,c){
 let band=tutorBand(c),worked=data.worked_example||data.example||null,ex=tutorSentenceChunks(data.explanation||data.core_idea||''),beats=[];
 let setup=typeof worked==='object'&&worked?.setup?worked.setup:(data.hook||ex[0]||`Let’s build ${c.name} from one small idea.`);
 beats.push({kind:'intro',title:'Start with this',text:setup});
 let teachCount=band===0?Math.min(5,ex.length):band===1?Math.min(4,ex.length):band===2?Math.min(3,ex.length):Math.min(2,ex.length);
 ex.slice(0,teachCount).forEach((t,i)=>beats.push({kind:'teach',title:i===0?'The first idea':'Add one piece',text:t}));
 if(band<=1)beats.push(...tutorTermBeats(data,Math.min(3,Math.max(1,(data.key_terms||[]).length))));
 else if(band===2)beats.push(...tutorTermBeats(data,2));
 if(worked){
   if(typeof worked==='string')beats.push({kind:'example',title:'See it happen',text:worked});
   else{
     if(worked.setup&&worked.setup!==setup)beats.push({kind:'example',title:'Now an example',text:worked.setup});
     (worked.steps||[]).slice(0,7).forEach((s,i)=>beats.push({kind:'example',title:`Example · next step`,text:typeof s==='string'?s:(s.text||s.detail||'')}));
     if(worked.result)beats.push({kind:'example',title:'What that gives us',text:worked.result});
   }
 }
 if(band>=1&&data.challenge)beats.push({kind:'practice',title:'Your turn',text:String(data.challenge),reference:data.takeaway||data.objective||''});
 if(data.quiz&&Array.isArray(data.quiz.options)&&Number.isInteger(data.quiz.correct_index)){
   beats.push({kind:'check',title:'Check the idea',text:data.quiz.prompt,quiz:data.quiz})
 }else beats.push({kind:'finish',title:'Stop here for today',text:'You have built the first layer of this idea. Atlas will verify it with retrieval later.'});
 return {band,beats}
}
function localTutorRepair(beat,data,signal='not_yet'){
 let term=(data.key_terms||[]).find(x=>typeof x==='object'&&x.definition),worked=data.worked_example||data.example;
 if(signal==='no_clue'&&term)return {explanation:`Let’s make it smaller. For now, only remember this: ${term.term} means ${term.definition}`,example:typeof worked==='object'?worked.setup||'':''};
 if(beat.kind==='term')return {explanation:`Only focus on this definition for now: ${beat.text}`,example:typeof worked==='object'?worked.setup||'':''};
 if(typeof worked==='object'&&worked?.setup)return {explanation:`Forget the formal wording for a moment. Look only at this situation: ${worked.setup}`,example:(worked.steps||[])[0]||''};
 return {explanation:`Focus on just this piece: ${String(beat.text||'').split(/[;:]/)[0]}.`,example:data.takeaway||''}
}
async function requestTutorRepair(beat,data,f,signal){
 let ctx=learnerContextFor(f.concept,'tutor_repair');
 let body={mode:'repair',subject:f.subject?.name||f.concept.subject_key,concept:f.concept.name,learner_band:['beginner','forming','developing','advanced'][tutorBand(f.concept)]||'beginner',current_text:beat.text||'',signal,prerequisites:ctx.prerequisite_path||[]};
 try{
  let {data:r,error}=await db.functions.invoke('atlas-tutor',{body});
  if(!error&&r?.available&&r.explanation)return r
 }catch{}
 return localTutorRepair(beat,data,signal)
}
async function evaluateTutorAnswer(beat,response,data,f){
 let body={mode:'evaluate',subject:f.subject?.name||f.concept.subject_key,concept:f.concept.name,prompt:beat.text||'',reference:beat.reference||data.takeaway||data.objective||'',response};
 try{
  let {data:r,error}=await db.functions.invoke('atlas-tutor',{body});
  if(!error&&r?.available)return r
 }catch{}
 return {available:false,classification:'unknown',score:0,feedback:'Atlas cannot reliably grade this written response right now. We’ll use a concrete check instead.',next_action:'advance'}
}
function renderHumanTutor(data,f,type,p,media){
 let c=f.concept,sourcesPanel=`<div id="lessonSourcesPanel" class="lesson-sources-panel hidden"><div class="lesson-sources-head"><strong>Sources & further reading</strong><button id="closeLessonSources" class="ghost">Close</button></div>${renderResearchShelf(c,data)}${media.length?`<div class="source-group"><strong>Curated media</strong>${media.map(m=>`<div class="source-row"><div><a href="${m.url}" target="_blank" rel="noopener">${m.title}</a><small>${m.provider}</small></div><span class="source-badge">media</span></div>`).join('')}</div>`:''}</div>`;
 return `<div class="human-tutor" data-concept="${c.key}">
   <div class="tutor-head"><div><small>${f.subject?.name||''}</small><strong>${c.name}</strong></div><button id="lessonSourcesBtn" class="ghost compact">Sources</button></div>
   <div class="tutor-track"><div id="tutorTrackFill"></div></div>
   <main id="tutorCard" class="tutor-card" aria-live="polite"></main>
   <div id="tutorControls" class="tutor-controls"></div>
   <button id="taskDone" class="primary hidden">Finish</button>
   ${sourcesPanel}
 </div>`
}
async function findOrCreateTutorSession(f,planIndex,planState){
 activeTutorSessionId=null;activeTutorState=null;
 try{
   let r=await db.from('tutor_sessions').select('*').eq('user_id',user.id).eq('concept_key',f.concept.key).eq('status','active').order('updated_at',{ascending:false}).limit(1);
   let existing=r.data?.[0];
   if(existing){
     activeTutorSessionId=existing.id;activeTutorState=existing.state||{};
     return existing
   }
   let ins=await db.from('tutor_sessions').insert({user_id:user.id,concept_key:f.concept.key,subject_key:f.concept.subject_key,status:'active',comprehension_stage:'starting_point',state:{index:0,turn_count:0,band:planState.band,plan_index:planIndex},app_version:ATLAS_VERSION}).select().single();
   if(!ins.error){activeTutorSessionId=ins.data.id;activeTutorState=ins.data.state||{};return ins.data}
 }catch{}
 return null
}
async function saveTutorState(patch={}){
 if(!activeTutorSessionId)return;
 activeTutorState={...(activeTutorState||{}),...patch,updated_at:new Date().toISOString()};
 try{await db.from('tutor_sessions').update({state:activeTutorState,comprehension_stage:activeTutorState.stage||'learning',updated_at:new Date().toISOString(),app_version:ATLAS_VERSION}).eq('id',activeTutorSessionId)}catch{}
}
async function logTutorTurn(role,kind,content,responseValue=null,evaluation=null){
 if(!activeTutorSessionId)return;
 let n=(+activeTutorState?.turn_count||0)+1;activeTutorState={...(activeTutorState||{}),turn_count:n};
 try{await db.from('tutor_turns').insert({session_id:activeTutorSessionId,user_id:user.id,turn_number:n,role,turn_kind:kind,content:String(content||'').slice(0,4000),response_value:responseValue?String(responseValue).slice(0,4000):null,evaluation:evaluation||null})}catch{}
}
async function finishTutorSession(){
 if(!activeTutorSessionId)return;
 try{await db.from('tutor_sessions').update({status:'completed',comprehension_stage:'completed',state:{...(activeTutorState||{}),completed:true},updated_at:new Date().toISOString(),completed_at:new Date().toISOString(),app_version:ATLAS_VERSION}).eq('id',activeTutorSessionId)}catch{}
 activeTutorSessionId=null;activeTutorState=null
}
async function wireHumanTutor(data,f,type,p,planIndex,hasCheck){
 let plan=buildTutorBeats(data,f.concept),session=await findOrCreateTutorSession(f,planIndex,plan),idx=Math.max(0,Math.min(plan.beats.length-1,+activeTutorState?.index||0)),repairCount=+activeTutorState?.repair_count||0;
 let card=$('tutorCard'),controls=$('tutorControls'),done=$('taskDone');
 if($('lessonSourcesBtn'))$('lessonSourcesBtn').onclick=()=>{$('lessonSourcesPanel').classList.remove('hidden')};
 if($('closeLessonSources'))$('closeLessonSources').onclick=()=>{$('lessonSourcesPanel').classList.add('hidden')};
 function progress(){let pct=Math.max(4,Math.min(100,((idx+1)/Math.max(1,plan.beats.length))*100));$('tutorTrackFill').style.width=pct+'%'}
 async function showBeat(){
   let beat=plan.beats[idx];progress();done.classList.add('hidden');controls.innerHTML='';
   card.innerHTML=`<div class="tutor-kicker">${beat.title||''}</div><div class="tutor-thought">${renderTextBlock(beat.text||'')}</div>`;
   await saveTutorState({index:idx,stage:beat.kind,repair_count:repairCount,band:plan.band});
   if(beat.kind==='intro'){
     controls.innerHTML=`<button class="primary" id="tutorContinue">Start here</button>`;
     $('tutorContinue').onclick=async()=>{await logTutorTurn('learner','continue',beat.text,'continue');idx++;showBeat()}
   }else if(['teach','term','example'].includes(beat.kind)){
     controls.innerHTML=`<button class="primary" id="tutorUnderstood">That makes sense</button><button class="ghost" id="tutorNotYet">Not yet</button><button class="ghost subtle" id="tutorNoClue">I have no idea</button>`;
     $('tutorUnderstood').onclick=async()=>{await logTutorTurn('learner','understood',beat.text,'understood');idx++;showBeat()};
     $('tutorNotYet').onclick=()=>showRepair(beat,'not_yet');
     $('tutorNoClue').onclick=()=>showRepair(beat,'no_clue')
   }else if(beat.kind==='practice'){
     card.innerHTML+=`<textarea id="tutorPractice" placeholder="Work it out in your own words. A short answer is enough."></textarea><div id="tutorFeedback" class="tutor-feedback hidden"></div>`;
     controls.innerHTML=`<button class="primary" id="tutorCheckPractice">Check my thinking</button><button class="ghost" id="tutorPracticeIdk">I don’t know yet</button>`;
     $('tutorPracticeIdk').onclick=()=>showRepair(beat,'no_clue');
     $('tutorCheckPractice').onclick=async()=>{
       let txt=($('tutorPractice').value||'').trim();if(txt.length<8)return alert('Give Atlas one thought to work with—or choose “I don’t know yet.”');
       $('tutorCheckPractice').disabled=true;$('tutorCheckPractice').textContent='Checking…';
       let ev=await evaluateTutorAnswer(beat,txt,data,f);await logTutorTurn('learner','practice',beat.text,txt,ev);
       let box=$('tutorFeedback');box.classList.remove('hidden');box.innerHTML=`<strong>${ev.classification==='understands'?'You have the idea.':ev.classification==='partial'?'You have part of it.':ev.classification==='misconception'?'There’s one piece to repair.':'We’ll verify this another way.'}</strong><p>${ev.feedback||''}</p>`;
       if(ev.classification==='understands'||ev.next_action==='advance'||!ev.available){
         controls.innerHTML=`<button class="primary" id="tutorAfterFeedback">Continue</button>`;$('tutorAfterFeedback').onclick=()=>{idx++;showBeat()}
       }else{
         controls.innerHTML=`<button class="primary" id="tutorRepairPractice">Teach the missing piece</button>`;$('tutorRepairPractice').onclick=()=>showRepair(beat,ev.classification==='misconception'?'misconception':'not_yet')
       }
     }
   }else if(beat.kind==='check'){
     let q=beat.quiz;
     card.innerHTML+=`<div id="tutorQuizFeedback" class="tutor-feedback hidden"></div>`;
     controls.innerHTML=q.options.map((o,i)=>`<button class="answer tutorQuiz" data-i="${i}">${o}</button>`).join('')+`<button class="answer tutorQuiz idk-answer" data-i="-1">I don’t know yet</button>`;
     document.querySelectorAll('.tutorQuiz').forEach(b=>b.onclick=async()=>{
       let selected=+b.dataset.i;document.querySelectorAll('.tutorQuiz').forEach(x=>x.disabled=true);
       await logTutorTurn('learner','quick_check',q.prompt,selected<0?'idk':q.options[selected]);
       if(selected===q.correct_index){
         $('tutorQuizFeedback').classList.remove('hidden');$('tutorQuizFeedback').innerHTML=`<strong>Yes.</strong><p>${q.rationale||''}</p>`;
         done.dataset.selected=selected;done.dataset.correct=q.correct_index;done.classList.remove('hidden');controls.innerHTML='';
       }else{
         let feedback=selected<0?'Good. Don’t guess—we’ll build the missing piece first.':Array.isArray(q.feedback)?q.feedback[selected]||q.rationale:q.rationale;
         $('tutorQuizFeedback').classList.remove('hidden');$('tutorQuizFeedback').innerHTML=`<strong>Not yet.</strong><p>${feedback||''}</p>`;
         if(selected>=0&&Array.isArray(q.misconceptions))done.dataset.misconception=q.misconceptions[selected]||'';
         controls.innerHTML=`<button class="primary" id="tutorRepairCheck">Show me the missing piece</button>`;
         $('tutorRepairCheck').onclick=()=>showRepair({kind:'check',title:'Repair the idea',text:q.prompt},selected<0?'no_clue':'misconception',()=>showBeat())
       }
     })
   }else{
     done.classList.remove('hidden');controls.innerHTML=''
   }
 }
 async function showRepair(beat,signal,after=null){
   repairCount++;await saveTutorState({repair_count:repairCount,stage:'repair'});
   card.innerHTML=`<div class="tutor-kicker">Let’s slow it down</div><div class="tutor-thinking">Atlas is finding a smaller way to explain this…</div>`;controls.innerHTML='';
   let r=await requestTutorRepair(beat,data,f,signal);await logTutorTurn('tutor','repair',r.explanation||'',signal,r);
   card.innerHTML=`<div class="tutor-kicker">Just one piece</div><div class="tutor-thought">${renderTextBlock(r.explanation||'')}</div>${r.example?`<div class="tutor-example"><small>Example</small>${renderTextBlock(String(r.example))}</div>`:''}`;
   controls.innerHTML=`<button class="primary" id="repairHelped">That helps</button><button class="ghost" id="repairStillLost">Still not clear</button>`;
   $('repairHelped').onclick=async()=>{await logTutorTurn('learner','repair_signal',beat.text,'helped');if(after)return after();showBeat()};
   $('repairStillLost').onclick=async()=>{
     await logTutorTurn('learner','repair_signal',beat.text,'still_not_clear');
     let r2=await requestTutorRepair(beat,data,f,'no_clue');
     card.innerHTML=`<div class="tutor-kicker">Go one level simpler</div><div class="tutor-thought">${renderTextBlock(r2.explanation||localTutorRepair(beat,data,'no_clue').explanation)}</div>${r2.example?`<div class="tutor-example"><small>Example</small>${renderTextBlock(String(r2.example))}</div>`:''}`;
     controls.innerHTML=`<button class="primary" id="repairRetry">Try this idea again</button>`;
     $('repairRetry').onclick=()=>{if(after)return after();showBeat()}
   }
 }
 showBeat()
}

function renderKeyTerms(d){let a=d?.key_terms||[];if(!Array.isArray(a)||!a.length)return '';return `<div class="ai-section"><strong>Key terms</strong>${a.map(x=>typeof x==='string'?`<p><b>${x}</b></p>`:`<p><b>${x.term||''}</b>${x.definition?`: ${x.definition}`:''}</p>`).join('')}</div>`}
function renderWorked(d){let w=d?.worked_example||d?.example;if(!w)return '';if(typeof w==='string')return `<div class="ai-section"><strong>Worked example</strong>${renderTextBlock(w)}</div>`;let steps=Array.isArray(w.steps)?`<ol>${w.steps.map(x=>`<li>${typeof x==='string'?x:(x.text||x.detail||'')}</li>`).join('')}</ol>`:'';return `<div class="ai-section"><strong>Worked example</strong>${w.setup?`<p>${w.setup}</p>`:''}${steps}${w.result?`<p><strong>Result:</strong> ${w.result}</p>`:''}${w.why_it_matters?`<p><strong>Why it matters:</strong> ${w.why_it_matters}</p>`:''}</div>`}
function renderConnection(d){let c=d?.connection;if(!c)return '';if(typeof c==='string')return `<div class="ai-section"><strong>Why this connects</strong>${renderTextBlock(c)}</div>`;return `<div class="ai-section"><strong>Why this connects</strong>${c.shared_mechanism?`<p><strong>Shared mechanism:</strong> ${c.shared_mechanism}</p>`:''}${c.explanation?`<p>${c.explanation}</p>`:''}${c.difference?`<p><strong>Where the analogy breaks:</strong> ${c.difference}</p>`:''}${c.why_useful?`<p><strong>Why the connection helps:</strong> ${c.why_useful}</p>`:''}</div>`}
function renderSources(d){let a=d?.sources||[];if(!Array.isArray(a)||!a.length)return '';return `<div class="ai-section"><strong>Source / further reading</strong>${a.map(x=>`<p class="fineprint">${x.url?`<a href="${x.url}" target="_blank" rel="noopener">${x.title||x.url}</a>`:(x.title||x)}</p>`).join('')}</div>`}
function teachingProviderLabel(d){if(d?.provider==='atlas_core')return 'ATLAS CORE LESSON';if(d?.provider==='atlas_oer')return 'OPEN EDUCATIONAL RESOURCE';if(d?.provider==='atlas_fallback')return 'CONTENT UNAVAILABLE';return 'PERSONALIZED LESSON'}
function renderTeachingBody(d){return `${d.hook?`<div class="notice">${d.hook}</div>`:''}${d.objective?`<p><strong>By the end of this lesson:</strong> ${d.objective}</p>`:''}${renderKeyTerms(d)}<div class="ai-section learn-section"><strong>Learn</strong>${renderTextBlock(d.explanation||d.core_idea||'')}</div>${renderVisual(d)}${renderWorked(d)}${renderConnection(d)}${Array.isArray(d.common_mistakes)&&d.common_mistakes.length?`<div class="ai-section"><strong>Common mistakes</strong><ul>${d.common_mistakes.map(x=>`<li>${x}</li>`).join('')}</ul></div>`:''}${d.takeaway?`<div class="notice"><strong>Takeaway:</strong> ${d.takeaway}</div>`:''}${renderSources(d)}`}
function renderVisual(d){let steps=d?.visual_steps||d?.diagram_steps||[];if(!Array.isArray(steps)||!steps.length)return '';return `<div class="learning-visual">${steps.slice(0,6).map((s,i)=>`<div class="visual-step"><strong>${i+1}. ${typeof s==='string'?s:(s.title||'Step')}</strong>${typeof s==='object'&&s.detail?`<div>${s.detail}</div>`:''}</div>`).join('')}</div>`}
async function checkMilestones(){
 let total=sessions.filter(s=>s.completed).reduce((a,s)=>a+(+s.actual_minutes||0),0),verifiedN=masteries.filter(verifiedConcept).length,defs=[[600,'hours_10','10 hours invested'],[1500,'hours_25','25 hours invested'],[3000,'hours_50','50 hours invested'],[6000,'hours_100','100 hours invested'],[12000,'hours_200','200 hours invested']],wanted=defs.filter(([m])=>total>=m).map(x=>[x[1],x[2]]);
 if(verifiedN>=1)wanted.push(['first_verified','First concept verified']);if(verifiedN>=50)wanted.push(['verified_50','50 concepts verified']);if(verifiedN>=100)wanted.push(['verified_100','100 concepts verified']);if(connections.length>=1)wanted.push(['first_bridge','First verified knowledge bridge']);if(connections.length>=10)wanted.push(['bridges_10','10 cross-domain bridges formed']);
 let intermediateSubjects=subjects.filter(s=>subjectBoundary(s.key)>=5).length;if(intermediateSubjects>=5)wanted.push(['five_intermediate','Five domains reached intermediate frontier']);
 let advancedStem=['mathematics','physics','chemistry','biology','computing','engineering'].some(k=>subjectBoundary(k)>=8);if(advancedStem)wanted.push(['advanced_stem','First advanced STEM frontier']);
 for(let [key,title] of wanted)if(!milestones.some(m=>m.milestone_key===key)){let r=await db.from('user_milestones').insert({user_id:user.id,milestone_key:key,title,metadata:{minutes:total,verified:verifiedN,connections:connections.length}}).select().single();if(!r.error)milestones.push(r.data)}
}
async function prefetchLearningObject(){
 let p=todayPlan.find(x=>x.type!=='review'),c=p?.route.c;if(!c||coreLessonFor(c))return;let route=p.route.diagnostic?'probe':p.type,d=conceptDifficulty(c),key=`${c.key}:${route}:${d}`;
 let cached=learningObjects.some(x=>x.concept_key===c.key&&x.route_type===route&&+x.difficulty===d&&!x.completed_at&&Date.now()-new Date(x.created_at).getTime()<3*864e5);if(cached||prefetchInFlight.has(key))return;
 prefetchInFlight.add(key);
 try{let ctx=learnerContextFor(c,route);ctx.mode=route==='bridge'?'application':route==='probe'?'question':route==='frontier'?'challenge':'lesson';ctx.prefetch=true;ctx.preferred_modality=modalityWinner();let {data,error}=await db.functions.invoke('atlas-ai-content',{body:ctx});if(!error&&data)await saveLearningObject(c,route,data,d)}finally{prefetchInFlight.delete(key)}
}

async function ai(mode){
 let f=getFrontier(),difficulty=conceptDifficulty(f.concept);$('aiOutput').classList.remove('hidden');$('aiOutput').innerHTML='<div class="skeleton big"></div><div class="skeleton"></div>';
 let core=mode==='lesson'?coreLessonFor(f.concept):null;if(core){renderAI(core);return}
 let cached=learningObjects.find(x=>x.concept_key===f.concept.key&&x.route_type===mode&&+x.difficulty===difficulty&&Date.now()-new Date(x.created_at).getTime()<3*864e5);
 if(cached?.payload&&Object.keys(cached.payload).length){activeLearningObject=cached;renderAI(cached.payload);return}
 let ctx=learnerContextFor(f.concept,mode);ctx.mode=mode;ctx.minutes=Math.max(6,Math.min(30,Math.round(profile.daily_minutes*.55)));ctx.lesson_minutes=ctx.minutes;ctx.depth_profile='human_tutor';ctx.require_sources=true;ctx.trusted_source_domains=trustedSourcesFor(f.concept.subject_key).map(s=>{try{return new URL(s.url).hostname}catch{return ''}}).filter(Boolean);let {data,error}=await db.functions.invoke('atlas-ai-content',{body:ctx});
 if(error||!data){$('aiOutput').innerHTML='<p>Atlas could not generate this object right now. Your daily plan is still available.</p>';return}
 await saveLearningObject(f.concept,mode,data,difficulty);renderAI(data)
}
function renderAI(d){
 if(d.provider==='atlas_fallback'||d.content_status==='unavailable'){$('aiOutput').innerHTML=`<div class="eyebrow">CONTENT UNAVAILABLE</div><h3>${d.title||'Lesson unavailable'}</h3><div class="notice">Atlas does not have real teaching content for this request right now, so it will not pretend a generic prompt is a lesson or quiz you on material it did not teach.</div><p>${d.note||'The personalized lesson provider is unavailable. Use another Atlas lesson or try again after the teaching provider is restored.'}</p>`;return}
 let q=d.quiz||null,opts=q?.options?.map((x,i)=>`<button class="answer aiQuiz" data-i="${i}" data-correct="${q.correct_index}">${x}</button>`).join('')||'';
 $('aiOutput').innerHTML=`<div class="eyebrow">${teachingProviderLabel(d)}${d.modality?' · '+String(d.modality).toUpperCase():''}</div><h3>${d.title||'Lesson'}</h3>${renderTeachingBody(d)}${d.challenge?`<div class="ai-section"><strong>Try it yourself</strong>${renderTextBlock(d.challenge)}</div>`:''}${q?`<button id="revealFrontierCheck" class="primary">Check my understanding</button><div id="frontierCheck" class="ai-section hidden"><strong>Quick check</strong><p>${q.prompt||''}</p>${opts}<button class="answer aiQuiz idk-answer" data-i="-1" data-correct="${q.correct_index}">I don’t know yet</button><p id="aiQuizMsg"></p></div>`:''}${d.note?`<p class="fineprint">${d.note}</p>`:''}`;
 if(q){$('revealFrontierCheck').onclick=()=>{$('frontierCheck').classList.remove('hidden');$('revealFrontierCheck').classList.add('hidden')};document.querySelectorAll('.aiQuiz').forEach(b=>b.onclick=()=>{let i=+b.dataset.i,msg=i<0?'Good choice. Review the lesson instead of guessing.':i===+b.dataset.correct?`Correct. ${q.rationale||''}`:`Not yet. ${Array.isArray(q.feedback)?(q.feedback[i]||q.rationale||'Re-read the mechanism above.'):(q.rationale||'Re-read the mechanism above.')}`;$('aiQuizMsg').textContent=msg})}
}
function arcRoleForConcept(c){if(!sessionArc||!c)return '';return sessionArc.roles?.[c.subject_key]||sessionArc.connection||''}
function makeItStickPrompt(c){
 let role=arcRoleForConcept(c),m=+profile.daily_minutes||30;
 if(m>=60)return `Teach the idea back in your own words, then explain how it changes the decision in today’s situation. ${role}`;
 return `In one or two sentences, explain how ${c.name} helps you make sense of today’s situation. ${role}`
}

async function openTask(planIndex){
 let p=todayPlan[planIndex];if(!p||dailySessionComplete)return;activeLearningObject=null;let type=p.type,f={concept:p.route.c,subject:getSubject(p.route.c.subject_key)};
 taskOpenedAt=Date.now();saveDailyProgress(false);
 if(type==='synthesis'){
   let lessons=todayPlan.filter(x=>x.type==='lesson'),names=lessons.map(x=>`${getSubject(x.route.c.subject_key)?.name}: ${x.route.c.name}`),cross=new Set(lessons.map(x=>x.route.c.subject_key)).size>1;
   $('modalBody').innerHTML=`<div class="eyebrow">CONNECT & APPLY · ${sessionArc?.title||'TODAY’S ARC'}</div><h2>Use the ideas together</h2><div class="notice"><strong>Situation:</strong> ${sessionArc?.scenario||'Use today’s concepts in one real situation.'}</div><div class="ai-section"><strong>What you just learned</strong><p>${names.join(' · ')}</p></div><div class="ai-section"><strong>Walk the situation through</strong><ol><li>What is the first mechanism or fact from today that matters?</li><li>${cross?'What does the second field add that the first one cannot explain by itself?':'How does the second concept change or deepen the first?'}</li><li>What decision, prediction, or conclusion would you make because of those ideas?</li></ol></div><textarea id="synthesisText" placeholder="A few sentences is enough. Focus on the causal chain, not perfect wording."></textarea><button id="taskDone" class="primary">Complete today’s application</button>`;
   $('taskDone').dataset.provider='atlas_session';$('taskDone').dataset.modality='integrated_application';$('taskDone').onclick=()=>completeTask(planIndex)
 }else if(type==='review'){
   if(!atlasTaughtConcept(f.concept.key))return setSystemStatus('Atlas will only use retrieval for concepts it has actually taught you. This block has been replaced on your next plan.','warn');
   let origin=learningObjects.filter(x=>x.concept_key===f.concept.key&&x.completed_at&&!['review','probe'].includes(x.route_type)&&x.provider!=='atlas_fallback').sort((a,b)=>new Date(b.completed_at)-new Date(a.completed_at))[0];
   $('modalBody').innerHTML=`<div class="eyebrow">SHORT REVIEW · ${f.subject?.name||''}</div><h2>${f.concept?.name}</h2><div class="notice">This review comes after a prior Atlas lesson. It is not new teaching.</div>${origin?.payload?.takeaway?`<p class="fineprint">Do not open the old lesson yet. First recall the key idea from memory.</p>`:''}<textarea id="retrieveText" placeholder="What do you remember about the mechanism? Give one concrete example if you can."></textarea><label class="fineprint">How complete did your recall feel?</label><select id="recallQuality"><option value="uncertain">Uncertain — major gaps</option><option value="partial">Partial — main idea, missing detail</option><option value="clear">Clear — mechanism and detail</option></select><button id="taskDone" class="primary">Evaluate retrieval</button>`;
   $('taskDone').dataset.provider='openai_evaluator';$('taskDone').dataset.modality='retrieval';$('taskDone').onclick=()=>completeTask(planIndex)
 }else{
   let isProbe=type==='gap'&&p.route.diagnostic,routeKey=isProbe?'probe':type,mode=type==='bridge'?'application':isProbe?'question':'lesson',ctx=learnerContextFor(f.concept,routeKey);ctx.mode=mode;ctx.preferred_modality=modalityWinner();ctx.lesson_minutes=Math.max(6,+p.estimated_minutes||8);ctx.depth_profile='guided_deep';ctx.require_sources=!isProbe;ctx.trusted_source_domains=trustedSourcesFor(f.concept.subject_key).map(s=>{try{return new URL(s.url).hostname}catch{return ''}}).filter(Boolean);
   let cached=learningObjects.find(x=>x.concept_key===f.concept.key&&x.route_type===routeKey&&+x.difficulty===conceptDifficulty(f.concept)&&!x.completed_at&&Date.now()-new Date(x.created_at).getTime()<3*864e5),core=!isProbe&&type!=='bridge'?coreLessonFor(f.concept):null,data=core||cached?.payload||null,error=null;
   if(cached)activeLearningObject=cached;
   if(core&&!cached)await saveLearningObject(f.concept,routeKey,core,conceptDifficulty(f.concept));
   if(!data){let response=await db.functions.invoke('atlas-ai-content',{body:ctx});data=response.data;error=response.error;if(!error&&data)await saveLearningObject(f.concept,routeKey,data,conceptDifficulty(f.concept))}
   if(error||!data||data.provider==='atlas_fallback'||data.content_status==='unavailable'){
     $('modalBody').innerHTML=`<div class="eyebrow">LESSON NOT AVAILABLE</div><h2>${f.concept?.name}</h2><div class="notice">Atlas could not load real instructional content for this concept. It will not replace teaching with a generic quiz.</div><p>${data?.note||'Try another lesson while the content provider is restored.'}</p><button id="taskCancelUnavailable" class="primary">Return to Today</button>`;$('taskCancelUnavailable').onclick=()=>$('modal').classList.add('hidden');$('modal').classList.remove('hidden');return
   }
   let q=data.quiz||null,hasCheck=!!(q&&Number.isInteger(q.correct_index)&&Array.isArray(q.options)&&q.options.length>=2),opts=hasCheck?q.options.map((x,i)=>`<button class="answer taskQuiz" type="button" data-i="${i}">${x}</button>`).join('')+`<button class="answer taskQuiz idk-answer" type="button" data-i="-1">I don’t know yet</button>`:'',media=curatedMediaFor(f.concept.key);
   $('modalBody').innerHTML=isProbe?`<div class="eyebrow">Quick check · ${f.subject?.name||''}</div><h2>${f.concept?.name}</h2><p>${q?.prompt||'Choose the best answer.'}</p>${opts}<button id="taskDone" class="primary" disabled>Continue</button>`:`${renderHumanTutor(data,f,type,p,media)}`;
   if(!isProbe)await wireHumanTutor(data,f,type,p,planIndex,hasCheck);
   $('taskDone').dataset.provider=data.provider||'unknown';$('taskDone').dataset.modality=data.modality||type;$('taskDone').dataset.objectId=activeLearningObject?.id||'';$('taskDone').dataset.noCheck=hasCheck?'0':'1';$('taskDone').dataset.bridgeHasConnection=data.connection?'1':'0';
   document.querySelectorAll('.taskQuiz').forEach(b=>b.onclick=()=>{let selected=+b.dataset.i;document.querySelectorAll('.taskQuiz').forEach(x=>x.classList.toggle('selected',x===b));$('taskDone').disabled=false;$('taskDone').dataset.selected=selected;$('taskDone').dataset.correct=q.correct_index??-999;let msg=selected<0?'Good choice. Review the lesson instead of guessing.':selected===q.correct_index?`Correct. ${q.rationale||''}`:`Not yet. ${Array.isArray(q.feedback)?(q.feedback[selected]||q.rationale||'Re-read the explanation above.'):(q.rationale||'Re-read the explanation above.')}`;if($('taskQuizMsg'))$('taskQuizMsg').textContent=msg;if(selected!==q.correct_index&&Array.isArray(q.misconceptions))$('taskDone').dataset.misconception=q.misconceptions[selected]||''});
   $('taskDone').onclick=()=>completeTask(planIndex)
 }
 $('modal').classList.remove('hidden')
}

$('closeModal').onclick=()=>$('modal').classList.add('hidden');
async function completeTask(planIndex){
 let p=todayPlan[planIndex];if(!p)return;let type=p.type,concept=p.route.c,key=`${type}_${concept.key}`,difficulty=conceptDifficulty(concept),score=0,evalMeta=null;let doneBtn=$('taskDone');if(doneBtn){doneBtn.disabled=true;doneBtn.textContent=type==='review'?'Evaluating recall…':'Saving progress…'}
 if(type==='synthesis'){
   let txt=($('synthesisText')?.value||'').trim();if(txt.length<12){if(doneBtn){doneBtn.disabled=false;doneBtn.textContent='Complete today’s application'}return alert('Give Atlas one thought to work with. A short answer is enough.');}
   let elapsed=Math.max(45,Math.round((Date.now()-taskOpenedAt)/1000));elapsed=Math.min(elapsed,Math.max(600,Math.round((+profile.daily_minutes||30)*60*.45)));
   let er=await db.from('learning_events').insert({user_id:user.id,concept_key:concept.key,event_type:'synthesis_application',score:null,difficulty:conceptDifficulty(concept),duration_seconds:elapsed,modality:'integrated_application',route_type:'synthesis',provider:'atlas_session',metadata:{version:ATLAS_VERSION,session_arc:sessionArc?.title||null,subjects:sessionArc?.subjects||[],response_length:txt.length}});
   if(er.error){if(doneBtn){doneBtn.disabled=false;doneBtn.textContent='Retry saving'}setSystemStatus('Atlas could not save today’s integrated application yet. Please retry.','error');return}
   sessionActiveSeconds+=elapsed;todayDone.add(key);await saveDailyProgress();$('modal').classList.add('hidden');renderToday();
   if(todayDone.size===todayPlan.length)await finishGuidedSession();return
 }else if(type==='review'){
   let txt=($('retrieveText')?.value||'').trim(),quality=$('recallQuality')?.value;
   if(txt.length<40){if(doneBtn){doneBtn.disabled=false;doneBtn.textContent='Evaluate retrieval'}return alert('Give Atlas enough recall evidence to work with — about two sentences.');}

   let ctx=learnerContextFor(concept,'review');ctx.mode='evaluate';ctx.response_text=txt;ctx.self_rating=quality;
   let {data:ev,error:evalError}=await db.functions.invoke('atlas-ai-content',{body:ctx});evalMeta=ev||null;
   score=Math.max(0,Math.min(100,Number(ev?.score)||30));
   if(evalError)score=Math.min(score,40);
 }else{
   let b=$('taskDone'),provider=b?.dataset.provider||'unknown',noCheck=b?.dataset.noCheck==='1',sel=+(b?.dataset.selected??-999),correct=+(b?.dataset.correct??-998);
   if(!noCheck&&!Number.isInteger(sel)){if(doneBtn){doneBtn.disabled=false;doneBtn.textContent='Finish'}return alert('Complete the quick check first.');}
   let bridgeHasConnection=b?.dataset.bridgeHasConnection==='1',bridgeText=type==='bridge'&&bridgeHasConnection?(($('applyText')?.value||'').trim()):'';
   if(type==='bridge'&&bridgeHasConnection&&bridgeText.length<30){if(doneBtn){doneBtn.disabled=false;doneBtn.textContent='Finish'}return alert('Explain the connection in your own words before finishing the lesson.');}
   score=noCheck?55:(sel<0?20:sel===correct?(type==='frontier'?90:type==='bridge'?78:84):38);
   if(type==='bridge'&&bridgeHasConnection){
     $('taskDone').disabled=true;$('taskDone').textContent='Evaluating connection…';
     let ctx=learnerContextFor(concept,'bridge');ctx.mode='evaluate';ctx.response_text=bridgeText;ctx.self_rating='not supplied';
     let {data:ev}=await db.functions.invoke('atlas-ai-content',{body:ctx});evalMeta=ev||null;let written=Math.max(0,Math.min(100,Number(ev?.score)||35));
     score=Math.round(score*.45+written*.55);if(ev?.provider==='atlas_fallback')score=Math.min(score,50)
   }
   if(provider==='atlas_fallback')score=Math.min(score,50);if(score<60&&b?.dataset.misconception)evalMeta={...(evalMeta||{}),misconception:b.dataset.misconception,misconception_code:'quick_check_distractor'}
 }
 let elapsed=Math.max(20,Math.round((Date.now()-taskOpenedAt)/1000)),perTaskCap=Math.max(120,Math.round((profile.daily_minutes*60/Math.max(1,todayPlan.length))*1.5));
 elapsed=Math.min(elapsed,perTaskCap);
 let provider=$('taskDone')?.dataset.provider||'unknown',probeFallback=!!(p.route.diagnostic&&provider==='atlas_fallback'),instructionOnly=$('taskDone')?.dataset.noCheck==='1';
 let modality=$('taskDone')?.dataset.modality||type,objectId=$('taskDone')?.dataset.objectId||null,bridgeFrom=bridgeSource(concept),saveResult={ok:true};
 if(probeFallback){let pr=await db.from('learning_events').insert({user_id:user.id,concept_key:concept.key,event_type:'probe_unverified',score:null,difficulty,duration_seconds:elapsed,modality:'probe',route_type:'probe',provider,learning_object_id:objectId||null,bridge_source:bridgeFrom});saveResult={ok:!pr.error,message:pr.error?.message}}
 else saveResult=await recordEvidence(concept,type,score,difficulty,elapsed,{provider,modality,learning_object_id:objectId,bridge_source:bridgeFrom,instruction_only:$('taskDone')?.dataset.noCheck==='1'});
 if(!saveResult.ok){if(doneBtn){doneBtn.disabled=false;doneBtn.textContent='Retry saving'}let msg=$('taskQuizMsg')||$('reviewEval');if(msg)msg.textContent='Atlas could not save this evidence yet. Your work is still on screen—please retry.';setSystemStatus('Learning evidence did not sync. Atlas did not count this block as complete.','error');return}
 sessionActiveSeconds+=elapsed;todayDone.add(key);clearLessonDraft(concept);if(!p.route.diagnostic)await finishTutorSession();saveDailyProgress();setSystemStatus(coreLoadWarning,coreLoadWarning?'warn':'');
 let outcomeModality=modality;
 if(type==='review'){let origin=learningObjects.filter(x=>x.concept_key===concept.key&&x.completed_at&&x.route_type!=='review').sort((a,b)=>new Date(b.completed_at)-new Date(a.completed_at))[0];outcomeModality=origin?.modality||modality}
 let enrichment=[];
 enrichment.push(updateModality(outcomeModality,score,(type==='bridge'&&!instructionOnly)?score:0,type==='review'?score:0));
 if(evalMeta?.misconception)enrichment.push(recordMisconception(concept.key,String(evalMeta.misconception_code||'model_misconception'),String(evalMeta.misconception),Math.max(.2,Math.min(1,(100-score)/100))));
 if(type==='bridge'&&bridgeFrom&&!instructionOnly){let from=concepts.filter(c=>c.subject_key===bridgeFrom).sort((a,b)=>(+b.level)-(+a.level))[0];if(from)enrichment.push(formConnection(from.key,concept.key,score))}
 if(objectId)enrichment.push(db.from('learning_objects').update({completed_at:new Date().toISOString(),quality_score:score}).eq('id',objectId));
 Promise.allSettled(enrichment).then(()=>{});
 $('modal').classList.add('hidden');renderToday();
 if(todayDone.size===todayPlan.length)await finishGuidedSession()
}
async function finishGuidedSession(){
 let actual=Math.max(1,Math.round(sessionActiveSeconds/60));dailySessionComplete=true;guidedSessionActive=false;await saveDailyProgress(true);
 let r=await persistSessionSummary(actual);
 if(r.ok){await loadCore();await syncStreakFromSessions();setSystemStatus(coreLoadWarning,coreLoadWarning?'warn':'');renderAll();celebrate(actual)}
 else{setSystemStatus('Your learning is saved and today is complete. Atlas could not update the streak/minute totals yet, so it will retry automatically.','warn');renderToday()}
}


function weekStart(){let d=new Date(),day=(d.getDay()+6)%7;d.setHours(0,0,0,0);d.setDate(d.getDate()-day);return d}
function renderWeekly(){
 let ws=weekStart(),weekSessions=sessions.filter(s=>s.completed&&new Date(s.completed_at||s.created_at)>=ws),mins=weekSessions.reduce((a,s)=>a+(s.actual_minutes||0),0),weekEvents=events.filter(e=>new Date(e.created_at)>=ws),conceptCount=new Set(weekEvents.map(e=>e.concept_key).filter(Boolean)).size,retr=weekEvents.filter(e=>e.event_type==='review').length,bridges=weekEvents.filter(e=>e.route_type==='bridge').length,goal=profile.weekly_goal_minutes||profile.daily_minutes*profile.days_per_week,pct=Math.min(100,Math.round(mins/Math.max(1,goal)*100)),best=[...weekEvents].filter(e=>e.score!=null).sort((a,b)=>(+b.score)-(+a.score))[0],weak=[...weekEvents].filter(e=>e.score!=null).sort((a,b)=>(+a.score)-(+b.score))[0];
 $('weeklyPct').textContent=pct+'%';$('weeklyBar').style.width=pct+'%';$('weeklyMinutes').textContent=`${mins} / ${goal}`;$('weeklyConcepts').textContent=conceptCount;$('weeklyRetrievals').textContent=retr;
 $('weeklyStatement').innerHTML=`<strong>${pct>=100?'Weekly deposit complete.':'Your knowledge statement'}</strong><p>${mins} active minutes · ${conceptCount} concepts · ${retr} retrievals · ${bridges} bridge attempts.</p><p>${best?`Strongest evidence: <strong>${conceptByKey(best.concept_key)?.name||best.concept_key}</strong> (${(+best.score).toFixed(0)}%). `:''}${weak&&+weak.score<60?`Needs attention: <strong>${conceptByKey(weak.concept_key)?.name||weak.concept_key}</strong>. `:''}Atlas currently believes <strong>${modalityWinner()}</strong> is your most promising teaching format based on outcomes. Next week it will rebalance retention, gaps, frontier work, and uncertainty probes from this evidence.</p>`
}

document.querySelectorAll('.aiAction').forEach(b=>b.onclick=async()=>{
 if(b.disabled)return;let label=b.textContent;document.querySelectorAll('.aiAction').forEach(x=>x.disabled=true);b.textContent='Building…';
 try{await ai(b.dataset.mode)}catch(err){$('aiOutput').classList.remove('hidden');$('aiOutput').innerHTML=`<p>Deep Dive error: ${err?.message||'Please try again.'}</p>`}
 finally{document.querySelectorAll('.aiAction').forEach(x=>x.disabled=false);b.textContent=label}
});

$('newDiscovery').onclick=buildDiscovery;

$('learnDiscovery').onclick=async()=>{
 if(!activeDiscovery)return;
 let c=activeDiscovery.concept;
 openDeepDiveForSubject(c.subject_key,c.key);
 $('frontierCard').innerHTML=`<div class="eyebrow">FROM DISCOVERY TO LEARNING</div><strong>${c.name}</strong><p>${c.description||''}</p><div class="notice">Discovery sparked the connection. Deep Dive will now teach the concept properly and let you go further.</div>`;
 $('aiOutput').classList.remove('hidden');$('aiOutput').innerHTML='<p>Building the full lesson…</p>';
 let ctx=learnerContextFor(c,'frontier');ctx.mode='lesson';ctx.bridge_from=getSubject(activeDiscovery.source)?.name||activeDiscovery.source;
 let {data,error}=await db.functions.invoke('atlas-ai-content',{body:ctx});
 if(error||!data){$('aiOutput').innerHTML='<p>Atlas could not build the lesson right now.</p>';return}
 await saveLearningObject(c,'discovery_to_lesson',data,conceptDifficulty(c));renderAI(data)
};
$('saveDiscoveryCuriosity').onclick=async()=>{
 if(!activeDiscovery)return;
 let c=activeDiscovery.concept,from=getSubject(activeDiscovery.source)?.name||activeDiscovery.source;
 let q=`How does ${c.name} connect to ${from}, and where does the analogy break?`;
 let r=await db.from('curiosity_queue').insert({user_id:user.id,question:q,related_subject_key:c.subject_key,related_concept_key:c.key,status:'queued',priority:1});
 $('discoveryStatus').textContent=r.error?r.error.message:'Saved to your Curiosity Queue.'
};

async function recordEvidence(concept,type,score,difficulty,durationSeconds=0,meta={}){
 if(!concept?.key)return {ok:false,message:'Missing concept.'};let source=meta.instruction_only?'lesson':['bridge','real_world','teach_back'].includes(type)?'assignment':type==='review'?'review':type==='frontier'?'quiz':type==='gap'?'quiz':'lesson',evidenceId=meta.evidence_id||`v06_${type}_${concept.key}_${Date.now()}`;
 await db.ensureSession();let token=db.token();if(!token)return {ok:false,message:'Your session expired. Please log in again.'};
 let r=await fetch(`${URL}/rest/v1/rpc/record_learning_evidence`,{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({p_concept:concept.key,p_type:source,p_score:score,p_difficulty:difficulty,p_source:evidenceId})});
 if(!r.ok){let msg=await r.text().catch(()=>`HTTP ${r.status}`);return {ok:false,message:msg||`Mastery save failed (${r.status})`}}
 db.from('learning_events').insert({user_id:user.id,concept_key:concept.key,event_type:source,score,difficulty,duration_seconds:durationSeconds,modality:meta.modality||type,route_type:type,provider:meta.provider||'unknown',learning_object_id:meta.learning_object_id||null,bridge_source:meta.bridge_source||null,response_ms:durationSeconds*1000,correct:score>=70,metadata:{version:ATLAS_VERSION,evidence_id:evidenceId,instruction_only:!!meta.instruction_only}}).then(x=>{if(x.error){coreLoadWarning='Learning was saved, but activity history did not sync yet.';setSystemStatus(coreLoadWarning,'warn')}});
 if(['bridge','real_world','teach_back'].includes(type)&&score>=40){let m=conceptMastery(concept.key),old=+m?.transfer_score||0,next=Math.round((old*.7+score*.3)*10)/10;db.from('concept_mastery').update({transfer_score:next,updated_at:new Date().toISOString()}).eq('user_id',user.id).eq('concept_key',concept.key)}
 if(score>=82)for(let mis of misconceptions.filter(x=>x.concept_key===concept.key&&!x.resolved_at))db.from('learner_misconceptions').update({resolved_at:new Date().toISOString()}).eq('id',mis.id);
 return {ok:true,evidenceId}
}

function celebrate(actualMinutes=0){
 let total=sessions.filter(x=>x.completed).reduce((a,s)=>a+(s.actual_minutes||0),0)+actualMinutes,verifiedN=masteries.filter(verifiedConcept).length,title='Today’s deposit is complete.',detail=`${actualMinutes||'Your'} active minutes produced new evidence.`;
 if(total>=12000)title='200 hours invested.';else if(total>=6000)title='100 hours invested.';else if(total>=3000)title='50 hours invested.';else if(total>=1500)title='25 hours invested.';else if(total>=600)title='10 hours invested.';
 else if(connections.length===1)title='Your first knowledge bridge formed.';else if(verifiedN===1)title='Your first concept is verified.';
 $('celebrationTitle').textContent=title;$('celebrationText').textContent=`${detail} Atlas recalculated retention, gaps, frontier readiness, teaching-format outcomes, and cross-domain connections from demonstrated performance.`;$('celebration').classList.remove('hidden')
}
$('closeCelebration').onclick=()=>{$('celebration').classList.add('hidden');document.querySelector('[data-page="map"]').click()}


$('saveCuriosity').onclick=async()=>{
 let q=$('curiosityInput').value.trim();if(q.length<5)return;let match=knowledgeSearch(q)[0]?.c||null,r=await db.from('curiosity_queue').insert({user_id:user.id,question:q,related_subject_key:match?.subject_key||null,related_concept_key:match?.key||null,status:'queued',priority:3});if(!r.error){$('curiosityInput').value='';await loadCore();renderCuriosity()}
};
$('runKnowledgeSearch').onclick=()=>{
 let q=$('knowledgeSearch').value.trim(),matches=knowledgeSearch(q),el=$('exploreOutput');el.classList.remove('hidden');
 el.innerHTML=matches.length?`<div class="eyebrow">YOUR MAP</div><h3>What Atlas found</h3>${matches.map(({c})=>{let [cls,status]=conceptStatus(c),e=subjectEvidence(c.subject_key),m=conceptMastery(c.key),path=prerequisitePath(c);return `<div class="mini-row"><span><strong>${c.name}</strong><small>${getSubject(c.subject_key)?.name} · ${status} · Level ${c.level}</small>${path.length?`<small>Prerequisite path: ${path.slice(-4).map(x=>x.name).join(' → ')}</small>`:''}</span><span>${m?`${(+m.mastery).toFixed(0)}% mastery`:`frontier L${(e.boundary||0).toFixed(1)}`}</span></div>`}).join('')}`:'<p>No close concept match yet. Save the question to your curiosity queue and Atlas can route it later.</p>'
};
$('askAtlasButton').onclick=async()=>{
 let q=$('askAtlasText').value.trim();if(q.length<5)return;let el=$('exploreOutput');el.classList.remove('hidden');el.innerHTML='<div class="skeleton big"></div><div class="skeleton"></div>';
 let match=knowledgeSearch(q)[0]?.c||pickCandidate('frontier')?.c,ctx=learnerContextFor(match,'ask');ctx.mode=/(\b(today|current|latest|now|recent|this week|this month|2026)\b|\b(price|rate|president|prime minister|ceo|election|war|conflict|stock|market|weather|schedule|score|standings|law in effect|who currently)\b)/i.test(q)?'current_world':'ask';ctx.question=q;ctx.prerequisite_path=prerequisitePath(match).map(x=>x.name);
 let {data,error}=await db.functions.invoke('atlas-ai-content',{body:ctx});if(error||!data){el.innerHTML='<p>Atlas could not answer that right now.</p>';return}
 if(data.provider==='atlas_fallback'||data.content_status==='unavailable'){el.innerHTML=`<div class="eyebrow">ANSWER UNAVAILABLE</div><h3>${data.title||q}</h3><div class="notice">${data.note||'Atlas does not have grounded content for this answer right now.'}</div>`;return}
 await saveLearningObject(match,ctx.mode,data,conceptDifficulty(match));el.innerHTML=`<div class="eyebrow">${ctx.mode==='current_world'?'FOUNDATION + CURRENT WORLD':'ASK ATLAS'}</div><h3>${data.title||q}</h3>${renderTeachingBody(data)}<div class="ai-section"><strong>Prerequisite path</strong><p>${ctx.prerequisite_path.length?ctx.prerequisite_path.join(' → '):'No blocking prerequisite is evident from your current map.'}</p></div>`
};
$('teachAtlasButton').onclick=async()=>{
 let name=$('teachConcept').value.trim(),text=$('teachText').value.trim();if(name.length<2||text.length<40)return alert('Choose a concept and explain it in enough detail for Atlas to evaluate.');
 let match=knowledgeSearch(name)[0]?.c;if(!match)return alert('Atlas could not match that concept to the knowledge map yet.');
 let el=$('exploreOutput');el.classList.remove('hidden');el.innerHTML='<div class="skeleton big"></div>';
 let ctx=learnerContextFor(match,'teach_back');ctx.mode='teach_evaluate';ctx.response_text=text;let {data,error}=await db.functions.invoke('atlas-ai-content',{body:ctx});if(error||!data){el.innerHTML='<p>Evaluation unavailable right now.</p>';return}
 let score=Math.max(0,Math.min(100,+data.score||0));el.innerHTML=`<div class="eyebrow">TEACH ATLAS EVALUATION</div><h3>${score.toFixed(0)} / 100</h3><p>${data.feedback||''}</p>${data.omissions?`<p><strong>Missing:</strong> ${Array.isArray(data.omissions)?data.omissions.join(', '):data.omissions}</p>`:''}${data.misconception?`<div class="notice"><strong>Misconception to repair:</strong> ${data.misconception}</div>`:''}`;
 if(data.provider!=='atlas_fallback'&&score>=40)await recordEvidence(match,'teach_back',score,conceptDifficulty(match),Math.max(30,Math.round(text.length/5)),{provider:data.provider,modality:'teach_back'});
 await updateModality('teach_back',score,score,0);if(data.misconception)await recordMisconception(match.key,String(data.misconception_code||'teach_back'),String(data.misconception),(100-score)/100)
};
$('realWorldButton').onclick=async()=>{
 let route=pickCandidate('bridge')||pickCandidate('frontier'),c=route?.c;if(!c)return;let el=$('exploreOutput');el.classList.remove('hidden');el.innerHTML='<div class="skeleton big"></div>';
 let ctx=learnerContextFor(c,'real_world');ctx.mode='real_world';let {data,error}=await db.functions.invoke('atlas-ai-content',{body:ctx});if(error||!data||data.provider==='atlas_fallback'||data.content_status==='unavailable'){el.innerHTML=`<p>${data?.note||'Challenge unavailable right now.'}</p>`;return}
 await saveLearningObject(c,'real_world',data,conceptDifficulty(c));el.innerHTML=`<div class="eyebrow">REAL-WORLD TRANSFER</div><h3>${data.title||'Solve the situation'}</h3><p>${data.challenge||data.explanation||''}</p>${renderVisual(data)}<textarea id="realWorldResponse" placeholder="What knowledge applies, and how would you reason through it?"></textarea><button id="submitRealWorld" class="primary">Evaluate my reasoning</button>`;
 $('submitRealWorld').onclick=async()=>{let text=$('realWorldResponse').value.trim();if(text.length<40)return;let ec=learnerContextFor(c,'real_world');ec.mode='evaluate';ec.response_text=text;let {data:ev}=await db.functions.invoke('atlas-ai-content',{body:ec});let score=Math.max(0,Math.min(100,+ev?.score||30));el.innerHTML+=`<div class="notice"><strong>${score.toFixed(0)}/100 transfer evidence.</strong> ${ev?.feedback||''}</div>`;if(ev?.provider!=='atlas_fallback')await recordEvidence(c,'real_world',score,conceptDifficulty(c),Math.max(30,Math.round(text.length/5)),{provider:ev?.provider,modality:'real_world'});await updateModality('real_world',score,score,0);if(ev?.misconception)await recordMisconception(c.key,String(ev.misconception_code||'transfer'),String(ev.misconception),(100-score)/100)}
};

$('sendFeedback').onclick=async()=>{let activePage=document.querySelector('.main-nav button.active')?.dataset.page||'unknown',r=await db.from('tester_feedback').insert({user_id:user.id,page_key:`${ATLAS_VERSION}:${activePage}`,concept_key:activeLearningObject?.concept_key||currentRoute?.c?.key||null,feedback_type:$('feedbackType').value,message:$('feedbackText').value,route_type:activeLearningObject?.route_type||null,provider:activeLearningObject?.provider||null,difficulty:activeLearningObject?.difficulty||null,learning_object_id:activeLearningObject?.id||null});$('feedbackMessage').textContent=r.error?r.error.message:'Thanks — feedback saved with the exact learning context.';if(!r.error)$('feedbackText').value=''};
document.querySelectorAll('.main-nav button').forEach(b=>b.onclick=()=>openPage(b.dataset.page));


function setSystemStatus(message='',kind=''){
 let el=$('systemStatus');if(!el)return;el.textContent=message||'';el.classList.toggle('hidden',!message);el.classList.toggle('status-error',kind==='error');el.classList.toggle('status-warn',kind==='warn')
}
function openPage(page){
 document.querySelectorAll('.main-nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
 document.querySelectorAll('.page').forEach(p=>p.classList.toggle('hidden',p.id!==page));
 if(page==='account')renderAccount();if(page==='insights')loadAdminAnalytics()
}
function renderAccount(){
 if(!$('accountName')||!profile)return;$('accountName').textContent=profile.display_name||user?.user_metadata?.display_name||'Atlas learner';$('accountEmail').textContent=user?.email||'—';$('accountBuild').textContent=ATLAS_VERSION;$('accountMinutes').value=String(profile.daily_minutes||30);$('accountDays').value=String(profile.days_per_week||5);if($('accountGoal'))$('accountGoal').value=profile.learning_goal||''
}

$('saveLearningGoal').onclick=async()=>{let goal=($('accountGoal')?.value||'').trim(),r=await db.from('profiles').update({learning_goal:goal||null,updated_at:new Date().toISOString()}).eq('user_id',user.id);if(r.error){$('accountMessage').textContent=r.error.message;return}profile.learning_goal=goal||null;if(todayDone.size===0&&!dailySessionComplete){todayPlan=[];sessionArc=null;sessionMode='balanced';guidedSessionActive=false;renderAll()}$('accountMessage').textContent=goal?'Learning goal saved. Atlas rebuilt today’s route around it.':'Learning goal cleared. Atlas will balance breadth, gaps, interests, and frontier.'};
$('saveAccountSchedule').onclick=async()=>{let daily=+$('accountMinutes').value,days=+$('accountDays').value,r=await db.from('profiles').update({daily_minutes:daily,days_per_week:days,weekly_goal_minutes:daily*days,updated_at:new Date().toISOString()}).eq('user_id',user.id);if(r.error){$('accountMessage').textContent=r.error.message;return}profile.daily_minutes=daily;profile.days_per_week=days;profile.weekly_goal_minutes=daily*days;$('dailyMinutes').textContent=daily;if(todayDone.size===0&&!dailySessionComplete){todayPlan=[];renderAll();$('accountMessage').textContent='Learning schedule saved. Today’s plan has been resized to fit it.'}else $('accountMessage').textContent='Learning schedule saved. Your current in-progress session stays intact; the new timing applies to the next session.'};
$('sendRecovery').onclick=async()=>{$('accountMessage').textContent='Sending recovery link…';let r=await db.auth.resetPasswordForEmail(user.email,{redirectTo:location.origin+location.pathname});$('accountMessage').textContent=r.error?r.error.message:'Recovery link sent to '+user.email+'.'};
$('changePassword').onclick=async()=>{let a=$('newPassword').value,b=$('confirmPassword').value;if(a.length<8){$('accountMessage').textContent='Use at least 8 characters.';return}if(a!==b){$('accountMessage').textContent='Passwords do not match.';return}$('accountMessage').textContent='Updating password…';let r=await db.auth.updateUser({password:a});$('accountMessage').textContent=r.error?r.error.message:'Password updated.';if(!r.error){$('newPassword').value='';$('confirmPassword').value='';localStorage.removeItem('atlas_recovery_pending')}};


async function preserveLearnerDataAcrossUpgrade(){
 if(!user||!profile)return true;
 let previous=profile.last_seen_app_version||profile.build_seen||'legacy',schema=+profile.data_schema_version||1;
 if(previous===ATLAS_VERSION&&schema===ATLAS_DATA_SCHEMA)return true;
 try{
   let snap=await db.rpc('snapshot_current_user_state',{p_reason:`before_upgrade_from_${previous}`,p_app_version:previous,p_data_schema_version:schema});
   if(snap.error){coreLoadWarning='Atlas loaded your account, but could not create the automatic upgrade snapshot. Existing cloud records were not deleted.';return false}
   let up=await db.from('profiles').update({last_seen_app_version:ATLAS_VERSION,data_schema_version:ATLAS_DATA_SCHEMA,build_seen:ATLAS_VERSION,updated_at:new Date().toISOString()}).eq('user_id',user.id).select().single();
   if(!up.error)profile=up.data;
   return !up.error
 }catch{
   coreLoadWarning='Atlas could not create an upgrade snapshot. Existing cloud records were left untouched.';
   return false
 }
}

async function boot(){
 let updated=await checkForAtlasUpdate();if(updated)return;
 cleanAtlasRefreshParams();
 let u=(await db.auth.getUser()).data.user;
 if(!u){$('logout').classList.add('hidden');show('auth');return}
 user=u;$('logout').classList.remove('hidden');
 let r=await db.from('profiles').select('*').eq('user_id',u.id).single();
 if(r.error){$('authMessage').textContent='Profile load failed: '+r.error.message;show('auth');return}
 profile=r.data;
 await preserveLearnerDataAcrossUpgrade();
 if(!profile.onboarding_complete){$('minutes').value=profile.daily_minutes;$('days').value=profile.days_per_week;if($('onboardingGoal'))$('onboardingGoal').value=profile.learning_goal||'';show('onboarding');return}
 // App releases never force an existing learner to retake placement. Completion is durable user data; placement_version is descriptive metadata only.
 if(!profile.placement_complete){assessmentLanding();return}
 loadApp()
}
mode('signup');boot();

document.addEventListener('visibilitychange',()=>{
 if(document.visibilityState==='visible')checkForAtlasUpdate({showStatus:true})
});
setInterval(()=>checkForAtlasUpdate({showStatus:true}),5*60*1000);
window.addEventListener('pagehide',()=>{try{if(user&&attempt){let phase=!$('checkpoint').classList.contains('hidden')?'checkpoint':round>3?'open':'questions';localStorage.setItem(progressLocalKey('assessment'),JSON.stringify({attempt,round,qIndex,openIndex,draft:$('openText')?.value||'',phase,saved_at:new Date().toISOString()}))}if(user){let existing=progressCache[dailyProgressKey()]||{};localStorage.setItem(progressLocalKey(dailyProgressKey()),JSON.stringify({...existing,plan_schema:2,completed:dailySessionComplete||existing.completed||false,guidedSessionActive:!!guidedSessionActive,sessionMode,sessionArc,todayDone:[...todayDone],sessionActiveSeconds,plan:todayPlan.map(p=>({type:p.type,concept_key:p.route.c.key,diagnostic:!!p.route.diagnostic,session_role:p.session_role||null,estimated_minutes:p.estimated_minutes||null})),saved_at:new Date().toISOString()}))}}catch{}});
