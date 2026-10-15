const C='vt-v2',F=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim()).then(checkReminders)));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||!e.request.url.startsWith(self.location.origin))return;
 e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request).then(m=>m||caches.match('index.html'))));
 e.waitUntil(maybeCheck())});
self.addEventListener('periodicsync',e=>{if(e.tag==='vt-remind')e.waitUntil(checkReminders())});
self.addEventListener('sync',e=>{if(e.tag==='vt-remind')e.waitUntil(checkReminders())});
self.addEventListener('message',e=>{
 const d=e.data||{};
 e.waitUntil((async()=>{
  if(d.type==='sync-res'){await putAll(d.res||[],d.cfg||{});await checkReminders()}
  else if(d.type==='check')await checkReminders();
  else if(d.type==='snooze'){await snoozeId(d.id,d.ms||600000);await checkReminders()}
 })());
});
self.addEventListener('notificationclick',e=>{
 const data=e.notification.data||{},id=data.id||'',act=e.action||'open';
 e.notification.close();
 e.waitUntil((async()=>{
  if(act==='snooze'&&id){await snoozeId(id,600000);await checkReminders()}
  const url=new URL('./index.html',self.registration.scope);
  if(id)url.hash='res='+encodeURIComponent(id)+(act==='start'?'&act=start':'');
  const all=await clients.matchAll({type:'window',includeUncontrolled:true});
  for(const c of all){if(c.url.includes(self.registration.scope.replace(/\/$/,''))){c.focus();c.postMessage({type:'vt-open',id,act});return}}
  await clients.openWindow(url.href);
 })());
});

let lastChk=0;
function maybeCheck(){if(Date.now()-lastChk<20000)return Promise.resolve();return checkReminders()}

function dbp(){return new Promise((res,rej)=>{const r=indexedDB.open('vt_sw',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function kvGet(k,d){try{const db=await dbp();return await new Promise((res,rej)=>{const q=db.transaction('kv').objectStore('kv').get(k);q.onsuccess=()=>res(q.result===undefined?d:q.result);q.onerror=()=>rej(q.error)})}catch(e){return d}}
async function kvSet(k,v){const db=await dbp();return new Promise((res,rej)=>{const q=db.transaction('kv','readwrite').objectStore('kv').put(v,k);q.onsuccess=()=>res();q.onerror=()=>rej(q.error)})}
async function putAll(list,cfg){await kvSet('res',list);await kvSet('cfg',cfg)}
async function snoozeId(id,ms){const list=await kvGet('res',[]);const r=list.find(x=>x.id===id);if(!r)return;r.snoozeUntil=Date.now()+ms;await kvSet('res',list);const all=await clients.matchAll({includeUncontrolled:true});all.forEach(c=>c.postMessage({type:'vt-snooze',id,until:r.snoozeUntil}))}

function travelMs(route){const n=(route||'').toLowerCase();if(n.includes('aerodrom'))return 90*6e4;if(n.includes('beograd')||n.includes('divčibare')||n.includes('divcibare'))return 80*6e4;return 25*6e4}
function fmtWhen(dt){try{return new Date(dt).toLocaleString('sr-RS',{weekday:'short',day:'numeric',month:'numeric',hour:'2-digit',minute:'2-digit'})}catch(e){return dt}}
function urgentStage(r,now,remMin){
 if(r.done||!r.dt)return null;
 const t=new Date(r.dt).getTime();if(!t)return null;
 const left=t-now;
 if(r.snoozeUntil&&now<r.snoozeUntil&&left>0)return null;
 if(left<=-12*36e5)return null;
 if(left<=0)return 'overdue';
 if(left<=15*6e4)return 'm15';
 if(left<=remMin*6e4)return 'rem';
 if(left<=3*36e5)return 'h3';
 if(left<=24*36e5)return 'd24';
 return null;
}
const MSG={
 overdue:r=>'KASNIŠ: '+r.name+' · '+r.route+' · trebalo '+fmtWhen(r.dt),
 m15:r=>'Za 15 min ili manje: '+r.name+' · '+r.route+' · '+fmtWhen(r.dt),
 rem:r=>'Podsetnik: '+r.name+' · '+r.route+' · '+fmtWhen(r.dt),
 h3:r=>'Za 3 sata: '+r.name+' · '+r.route+' · '+fmtWhen(r.dt),
 d24:r=>'Sutra/danas: '+r.name+' · '+r.route+' · '+fmtWhen(r.dt)
};

async function checkReminders(){
 lastChk=Date.now();
 const list=await kvGet('res',[]);
 const cfg=await kvGet('cfg',{remMin:60,persistNext:true});
 const remMin=cfg.remMin||60, now=Date.now();
 const open=list.filter(r=>!r.done).sort((a,b)=>(a.dt||'').localeCompare(b.dt||''));
 let dirty=false;
 for(const r of open){
  const st=urgentStage(r,now,remMin);
  if(!st)continue;
  r.fired=r.fired||{};
  if(r.fired[st])continue;
  r.fired[st]=now;dirty=true;
  const body=(MSG[st]||MSG.rem)(r);
  const hot=st==='overdue'||st==='m15'||st==='rem';
  try{
   await self.registration.showNotification('VALJEVO TAXI',{
    body, icon:'icon-192.png', badge:'icon-192.png', tag:'vt-'+st+'-'+r.id,
    renotify:true, requireInteraction:hot, vibrate:hot?[400,200,400,200,400]:[200,100,200],
    data:{id:r.id,st},
    actions:[{action:'start',title:'Započni'},{action:'snooze',title:'Odloži 10 min'}]
   });
  }catch(e){}
 }
 try{
  if(cfg.persistNext!==false&&open[0]){
   const n=open[0], t=new Date(n.dt).getTime(), left=t-now;
   const leave=new Date(t-travelMs(n.route));
   const body=left<=0
    ?('KASNI: '+n.name+' · '+n.route+' · '+fmtWhen(n.dt))
    :('Sledeća: '+fmtWhen(n.dt)+' · '+n.name+' · '+n.route+' · kreni do '+leave.toLocaleTimeString('sr-RS',{hour:'2-digit',minute:'2-digit'}));
   await self.registration.showNotification('VALJEVO TAXI – plan vožnji',{
    body, icon:'icon-192.png', badge:'icon-192.png', tag:'vt-next', silent:left>remMin*6e4,
    renotify:left<=remMin*6e4, requireInteraction:left<=15*6e4,
    data:{id:n.id,st:'next'},
    actions:[{action:'start',title:'Započni'},{action:'open',title:'Otvori'}]
   });
  }else{
   const shown=await self.registration.getNotifications({tag:'vt-next'});
   shown.forEach(x=>x.close());
  }
 }catch(e){}
 if(dirty){await kvSet('res',list);const all=await clients.matchAll({includeUncontrolled:true});all.forEach(c=>c.postMessage({type:'vt-fired',res:list}))}
}
