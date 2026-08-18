(function(){
class AtlasQuery{
  constructor(client,table){this.c=client;this.t=table;this.method='GET';this.filters=[];this.params=[];this.body=null;this.wantSingle=false;this.returning=false;this.headers={};}
  select(cols='*'){if(this.method==='GET')this.params.push(['select',cols]);else{this.returning=true;this.params.push(['select',cols])}return this}
  insert(body){this.method='POST';this.body=body;this.returning=true;return this}
  update(body){this.method='PATCH';this.body=body;this.returning=true;return this}
  upsert(body,opt={}){this.method='POST';this.body=body;this.returning=true;this.headers['Prefer']='resolution=merge-duplicates,return=representation';if(opt.onConflict)this.params.push(['on_conflict',opt.onConflict]);return this}
  eq(k,v){this.filters.push([k,'eq.'+String(v)]);return this}
  order(k,opt={}){this.params.push(['order',`${k}.${opt.ascending===false?'desc':'asc'}`]);return this}
  limit(n){this.params.push(['limit',String(n)]);return this}
  single(){this.wantSingle=true;return this}
  then(res,rej){return this.exec().then(res,rej)}
  async exec(){
    const q=new URLSearchParams();
    [...this.params,...this.filters].forEach(([k,v])=>q.append(k,v));
    let url=`${this.c.url}/rest/v1/${encodeURIComponent(this.t)}?${q.toString()}`;
    const h=this.c.headers();
    Object.assign(h,this.headers);
    if(this.returning&&!h.Prefer)h.Prefer='return=representation';
    if(this.wantSingle)h.Accept='application/vnd.pgrst.object+json';
    await this.c.ensureSession(); Object.assign(h,this.c.headers()); let r=await fetch(url,{method:this.method,headers:h,body:this.body?JSON.stringify(this.body):undefined});
    let text=await r.text(),data=null;
    try{data=text?JSON.parse(text):null}catch{}
    if(!r.ok)return {data:null,error:{message:data?.message||data?.msg||text||`HTTP ${r.status}`,code:data?.code}};
    return {data,error:null};
  }
}
class AtlasClient{
 constructor(url,key){
  this.url=url;this.key=key;this.storageKey='atlas_supabase_session';
  this.functions={invoke:(name,{body}={})=>this.invoke(name,body)};
  this.auth={
   signUp:(o)=>this.signUp(o),signInWithPassword:(o)=>this.signIn(o),
   signOut:()=>this.signOut(),getUser:()=>this.getUser(),
   resetPasswordForEmail:(email,o={})=>this.resetPasswordForEmail(email,o),
   updateUser:(o)=>this.updateUser(o)
  };
  this.captureRedirect();
 }
 session(){try{return JSON.parse(localStorage.getItem(this.storageKey)||'null')}catch{return null}}
 token(){return this.session()?.access_token||null}
 saveSession(s){if(s?.access_token){let expires_at=s.expires_at||Math.floor(Date.now()/1000)+(+s.expires_in||3600);localStorage.setItem(this.storageKey,JSON.stringify({...s,expires_at}))}}
 clearSession(){localStorage.removeItem(this.storageKey)}
 async refreshSession(){
  let s=this.session(),rt=s?.refresh_token;if(!rt)return false;
  let r=await fetch(`${this.url}/auth/v1/token?grant_type=refresh_token`,{method:'POST',headers:{apikey:this.key,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:rt})});
  let d=await r.json().catch(()=>({}));if(!r.ok||!d.access_token){this.clearSession();return false}this.saveSession(d);return true
 }
 async ensureSession(){
  let s=this.session();if(!s?.access_token)return false;
  if((+s.expires_at||0)-Math.floor(Date.now()/1000)<90)return await this.refreshSession();
  return true
 }
 headers(){let h={'apikey':this.key,'Content-Type':'application/json'};let t=this.token();if(t)h.Authorization='Bearer '+t;return h}
 from(t){return new AtlasQuery(this,t)}
 captureRedirect(){
  const hash=new URLSearchParams(location.hash.replace(/^#/,''));
  const at=hash.get('access_token'),rt=hash.get('refresh_token'),type=hash.get('type');
  if(at){this.saveSession({access_token:at,refresh_token:rt,expires_in:+hash.get('expires_in')||3600,token_type:hash.get('token_type')||'bearer'});if(type==='recovery')localStorage.setItem('atlas_recovery_pending','1');history.replaceState({},document.title,location.pathname+location.search)}
 }
 async signUp({email,password,options={}}){
  let redirect=options.emailRedirectTo||location.origin+location.pathname;
  let r=await fetch(`${this.url}/auth/v1/signup?redirect_to=${encodeURIComponent(redirect)}`,{method:'POST',headers:{apikey:this.key,'Content-Type':'application/json'},body:JSON.stringify({email,password,data:options.data||{}})});
  let d=await r.json().catch(()=>({}));
  if(!r.ok)return {data:{session:null,user:null},error:{message:d.msg||d.message||`Signup failed (${r.status})`}};
  let session=d.access_token?d:null;if(session)this.saveSession(session);
  return {data:{session,user:d.user||null},error:null};
 }
 async signIn({email,password}){
  let r=await fetch(`${this.url}/auth/v1/token?grant_type=password`,{method:'POST',headers:{apikey:this.key,'Content-Type':'application/json'},body:JSON.stringify({email,password})});
  let d=await r.json().catch(()=>({}));
  if(!r.ok)return {data:{session:null,user:null},error:{message:d.error_description||d.msg||d.message||`Login failed (${r.status})`}};
  this.saveSession(d);return {data:{session:d,user:d.user||null},error:null};
 }
 async resetPasswordForEmail(email,{redirectTo}={}){
  const redirect=redirectTo||location.origin+location.pathname;
  let r=await fetch(`${this.url}/auth/v1/recover?redirect_to=${encodeURIComponent(redirect)}`,{method:'POST',headers:{apikey:this.key,'Content-Type':'application/json'},body:JSON.stringify({email})});
  let d=await r.json().catch(()=>({}));if(!r.ok)return {data:null,error:{message:d.msg||d.message||`Recovery request failed (${r.status})`}};
  return {data:d,error:null}
 }
 async updateUser({password}){
  await this.ensureSession();let t=this.token();if(!t)return {data:null,error:{message:'Please sign in again.'}};
  let r=await fetch(`${this.url}/auth/v1/user`,{method:'PUT',headers:{apikey:this.key,Authorization:'Bearer '+t,'Content-Type':'application/json'},body:JSON.stringify({password})});
  let d=await r.json().catch(()=>({}));if(!r.ok)return {data:null,error:{message:d.msg||d.message||`Password update failed (${r.status})`}};
  return {data:{user:d},error:null}
 }
 async getUser(){
  await this.ensureSession();let t=this.token();if(!t)return {data:{user:null},error:null};
  let r=await fetch(`${this.url}/auth/v1/user`,{headers:{apikey:this.key,Authorization:'Bearer '+t}});
  if(!r.ok){if(r.status===401)this.clearSession();return {data:{user:null},error:{message:'Session expired'}}}
  return {data:{user:await r.json()},error:null};
 }
 async signOut(){
  let t=this.token();if(t)await fetch(`${this.url}/auth/v1/logout`,{method:'POST',headers:{apikey:this.key,Authorization:'Bearer '+t}}).catch(()=>{});
  this.clearSession();return {error:null};
 }
 async invoke(name,body){
  await this.ensureSession();let t=this.token();
  let r=await fetch(`${this.url}/functions/v1/${encodeURIComponent(name)}`,{method:'POST',headers:{apikey:this.key,'Content-Type':'application/json',...(t?{Authorization:'Bearer '+t}:{})},body:JSON.stringify(body||{})});
  let text=await r.text(),d=null;try{d=text?JSON.parse(text):null}catch{}
  if(!r.ok)return {data:null,error:{message:d?.error||d?.message||text||`Function failed (${r.status})`}};
  return {data:d,error:null};
 }
}
window.createAtlasClient=(url,key)=>new AtlasClient(url,key);
})();