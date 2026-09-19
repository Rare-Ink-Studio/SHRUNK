export const PROGRESSION_VERSION='v8-infinite-loop-4';
export const GENERATOR_VERSION='shrunk-session-generator-v1';
export const PERFECT_WEEK_TARGET=88;
export const WEEK_COIN_TARGET=64;
export const COIN_TARGET=WEEK_COIN_TARGET;
export const MIN_DAILY_SESSIONS=5;
export const DAILY_CHALLENGE_COINS=3;
export const DAILY_COMPLETE_BONUS=3;
export const WEEKLY_COMPLETE_BONUS=4;
const STORE_KEY='shrunk:v8:infinite-loop';

const GAMES=['fingerboard','desk-shot','marble-run','tabletop-racing'];
const GAME_LABELS={fingerboard:'FINGERBOARD','desk-shot':'DESK SHOT','marble-run':'MARBLE RUN','tabletop-racing':'RACING'};

const CHALLENGE_POOL={
  fingerboard:[
    {id:'finger-tricks-3',label:'Land 3 tricks',event:'finger_trick_land',count:3,tier:'easy'},
    {id:'finger-tricks-5',label:'Land 5 tricks',event:'finger_trick_land',count:5,tier:'medium'},
    {id:'finger-grind',label:'Complete a grind',event:'finger_grind_complete',count:1,tier:'easy'},
    {id:'finger-grinds-2',label:'Complete 2 grinds',event:'finger_grind_complete',count:2,tier:'medium'},
    {id:'finger-features-4',label:'Clear 4 features',event:'finger_feature_clear',count:4,tier:'medium'},
    {id:'finger-line',label:'Complete THE TABLE V2 line',event:'finger_line_complete',count:1,tier:'medium'},
    {id:'finger-clean-line',label:'Finish a clean line',event:'finger_line_complete',where:{clean:true},count:1,tier:'hard'},
    {id:'finger-features-6',label:'Clear 6 features in a session',event:'finger_feature_clear',count:6,tier:'hard'},
    {id:'finger-grinds-3',label:'Complete 3 grinds',event:'finger_grind_complete',count:3,tier:'hard'}
  ],
  'desk-shot':[
    {id:'desk-hits-3',label:'Hit 3 targets',event:'desk_target_hit',count:3,tier:'easy'},
    {id:'desk-hits-5',label:'Hit 5 targets',event:'desk_target_hit',count:5,tier:'medium'},
    {id:'desk-bank-2',label:'Make a 2-bank Trick Shot',event:'desk_target_hit',where:{minBanks:2},count:1,tier:'medium'},
    {id:'desk-bank-3',label:'Make a 3-bank hit',event:'desk_target_hit',where:{minBanks:3},count:1,tier:'hard'},
    {id:'desk-round-400',label:'Score 400+ in one round',event:'desk_round_complete',where:{minScore:400},count:1,tier:'medium'},
    {id:'desk-round-600',label:'Score 600+ in one round',event:'desk_round_complete',where:{minScore:600},count:1,tier:'hard'},
    {id:'desk-bank-4',label:'Make a 4-bank hit',event:'desk_target_hit',where:{minBanks:4},count:1,tier:'hard'}
  ],
  'marble-run':[
    {id:'marble-finish',label:'Finish Marble Run',event:'marble_run_complete',count:1,tier:'easy'},
    {id:'marble-finish-2',label:'Finish 2 Marble Runs',event:'marble_run_complete',count:2,tier:'medium'},
    {id:'marble-score-600',label:'Finish with 600+ points',event:'marble_run_complete',where:{minScore:600},count:1,tier:'medium'},
    {id:'marble-score-850',label:'Finish with 850+ points',event:'marble_run_complete',where:{minScore:850},count:1,tier:'hard'},
    {id:'marble-fast-35',label:'Finish under 35 sec',event:'marble_run_complete',where:{maxTime:35},count:1,tier:'medium'},
    {id:'marble-fast-32',label:'Finish under 32 sec',event:'marble_run_complete',where:{maxTime:32},count:1,tier:'hard'},
    {id:'marble-score-1000',label:'Finish with 1000+ points',event:'marble_run_complete',where:{minScore:1000},count:1,tier:'hard'}
  ],
  'tabletop-racing':[
    {id:'race-finish',label:'Finish a 2-lap race',event:'race_complete',count:1,tier:'easy'},
    {id:'race-two-finishes',label:'Finish 2 races',event:'race_complete',count:2,tier:'medium'},
    {id:'race-boosts',label:'Use both boost strips and finish',event:'race_complete',where:{minBoosts:2},count:1,tier:'medium'},
    {id:'race-clean-8',label:'Finish with 8 impacts or fewer',event:'race_complete',where:{maxImpacts:8},count:1,tier:'medium'},
    {id:'race-clean-5',label:'Finish with 5 impacts or fewer',event:'race_complete',where:{maxImpacts:5},count:1,tier:'hard'},
    {id:'race-clean-boost',label:'Hit both boosts with 6 impacts or fewer',event:'race_complete',where:{minBoosts:2,maxImpacts:6},count:1,tier:'hard'},
    {id:'race-boost-tour',label:'Hit all 3 boost zones and finish',event:'race_complete',where:{minBoosts:3},count:1,tier:'hard'}
  ]
};

const WEEK_THEMES=[
  {id:'use-the-world',name:'USE THE WORLD',copy:'Banks, rails, bumpers and boost lines matter.'},
  {id:'stay-clean',name:'STAY CLEAN',copy:'Finish clean. Limit impacts. Make deliberate moves.'},
  {id:'keep-moving',name:'KEEP MOVING',copy:'Speed, flow and completed sessions move the week.'},
  {id:'find-the-line',name:'FIND THE LINE',copy:'Link the tabletop together instead of playing one object at a time.'},
  {id:'world-tour',name:'WORLD TOUR',copy:'Touch every corner of SHRUNK this week.'}
];

const BOSS_POOL=[
  {id:'boss-clean-line',game:'fingerboard',label:'BOSS · Finish a clean THE TABLE line',event:'finger_line_complete',where:{clean:true},count:1},
  {id:'boss-desk-bank',game:'desk-shot',label:'BOSS · Land a 3-bank Desk Shot',event:'desk_target_hit',where:{minBanks:3},count:1},
  {id:'boss-marble-fast',game:'marble-run',label:'BOSS · Finish Marble Run under 32 sec',event:'marble_run_complete',where:{maxTime:32},count:1},
  {id:'boss-race-clean',game:'tabletop-racing',label:'BOSS · Finish with both boosts and 5 impacts or fewer',event:'race_complete',where:{minBoosts:2,maxImpacts:5},count:1}
];

function hashSeed(input){let h=2166136261>>>0;for(let i=0;i<input.length;i++){h^=input.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let x=seed>>>0;return()=>{x=(x+0x6D2B79F5)>>>0;let t=x;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
function shuffled(list,random){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

export function dayKey(date=new Date()){
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function weekKey(date=new Date()){
  const d=new Date(date.getFullYear(),date.getMonth(),date.getDate());
  const day=(d.getDay()+6)%7; d.setDate(d.getDate()-day+3);
  const first=new Date(d.getFullYear(),0,4); const firstDay=(first.getDay()+6)%7;
  const week=1+Math.round(((d-first)/86400000-3+firstDay)/7);
  return `${d.getFullYear()}-W${String(week).padStart(2,'0')}`;
}

function difficultyOrder(date){
  const dow=(date.getDay()+6)%7;
  if(dow<=1)return ['easy','medium','medium'];
  if(dow<=4)return ['medium','medium','hard'];
  return ['medium','hard','hard'];
}

export function buildDailyChallenges(date=new Date(),sessionSeed=''){
  const dk=dayKey(date); const random=rng(hashSeed(`${GENERATOR_VERSION}|daily|${dk}|${sessionSeed}`));
  const selectedGames=shuffled(GAMES,random).slice(0,3); const tiers=difficultyOrder(date);
  return selectedGames.map((game,i)=>{
    const pool=CHALLENGE_POOL[game];
    const preferred=pool.filter(c=>c.tier===tiers[i]);
    const source=preferred.length?preferred:pool;
    const c=source[Math.floor(random()*source.length)];
    return {...c,game,key:`${dk}:${c.id}`,slot:i+1};
  });
}

export function weeklyTheme(date=new Date(),sessionSeed=''){
  const wk=weekKey(date); const random=rng(hashSeed(`${GENERATOR_VERSION}|theme|${wk}|${sessionSeed}`));
  return WEEK_THEMES[Math.floor(random()*WEEK_THEMES.length)];
}
export function weeklyBoss(date=new Date(),sessionSeed=''){
  const wk=weekKey(date); const random=rng(hashSeed(`${GENERATOR_VERSION}|boss|${wk}|${sessionSeed}`));
  const boss=BOSS_POOL[Math.floor(random()*BOSS_POOL.length)];
  return {...boss,key:`${wk}:${boss.id}`};
}
export function weeklyChallenge(date=new Date(),sessionSeed=''){
  return {id:`${weekKey(date)}:world-tour`,label:'WORLD TOUR · Finish one session in all 4 games',games:[...GAMES],theme:weeklyTheme(date,sessionSeed),boss:weeklyBoss(date,sessionSeed)};
}
export function buildSessionDefinition(date=new Date(),sessionSeed=''){
  return {schema:'shrunk.session.v1',generatorVersion:GENERATOR_VERSION,seed:sessionSeed||dayKey(date),day:dayKey(date),week:weekKey(date),daily:buildDailyChallenges(date,sessionSeed),weekly:weeklyChallenge(date,sessionSeed)};
}

export function eventMatches(ch,event){
  if(ch.event!==event.type)return false;
  const w=ch.where||{},p=event.payload||{};
  if(w.minBanks!=null&&(p.banks||0)<w.minBanks)return false;
  if(w.minScore!=null&&(p.score||0)<w.minScore)return false;
  if(w.maxTime!=null&&(p.time==null||p.time>w.maxTime))return false;
  if(w.maxImpacts!=null&&(p.impacts==null||p.impacts>w.maxImpacts))return false;
  if(w.minBoosts!=null&&(p.boostsUsed||0)<w.minBoosts)return false;
  if(w.clean!=null&&Boolean(p.clean)!==w.clean)return false;
  return true;
}
function blank(){return {version:PROGRESSION_VERSION,coins:0,lifetimeCoins:0,ticketReady:false,daily:{},weekly:{},records:{},events:[],outbox:[],ticketHistory:[]};}
function normalize(raw={}){
  const s={...blank(),...raw};
  s.daily??={};s.weekly??={};s.records??={};s.events??=[];s.outbox??=[];s.ticketHistory??=[];
  if(s.lifetimeCoins==null)s.lifetimeCoins=s.coins||0;
  return s;
}
function load(){try{return normalize(JSON.parse(localStorage.getItem(STORE_KEY)||'{}'))}catch{return blank()}}
function save(s){try{localStorage.setItem(STORE_KEY,JSON.stringify(s))}catch{} return s}
function ensureDaily(s,key,date=new Date()){
  const d=s.daily[key]??={progress:{},complete:{},bonus:false};
  d.progress??={};d.complete??={};
  d.challenges??=buildDailyChallenges(date);
  return d;
}
function ensureWeekly(s,key,date=new Date()){
  const w=s.weekly[key]??={games:{},complete:false,bonus:false,coins:0,days:{},ticketReady:false,perfect:false,bossProgress:0,bossComplete:false};
  w.games??={};w.days??={};
  w.theme??=weeklyTheme(date);
  w.boss??=weeklyBoss(date);
  if(w.bossProgress==null)w.bossProgress=0;
  return w;
}
function updateRecords(s,event){const p=event.payload||{};if(event.type==='finger_line_complete')s.records.fingerBest=Math.max(s.records.fingerBest||0,p.score||0);if(event.type==='desk_round_complete')s.records.deskBest=Math.max(s.records.deskBest||0,p.score||0);if(event.type==='marble_run_complete')s.records.marbleBest=Math.max(s.records.marbleBest||0,p.score||0);if(event.type==='race_complete'&&p.time>0)s.records.raceBest=!s.records.raceBest?p.time:Math.min(s.records.raceBest,p.time);}
function completedDayKeysThisWeek(s,wk){return Object.keys(s.daily||{}).filter(k=>k.startsWith(wk.slice(0,4))&&s.daily[k]?.bonus&&weekKey(new Date(`${k}T12:00:00`))===wk);}
function streakDays(s,date=new Date()){let streak=0,d=new Date(date.getFullYear(),date.getMonth(),date.getDate());for(let i=0;i<60;i++){if(!s.daily[dayKey(d)]?.bonus)break;streak++;d.setDate(d.getDate()-1)}return streak;}
function publicEvent(event,date,wk,dk,earned,completed){return {id:`shrunk-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,schema:'one-home.participation.v1',source:'shrunk',progressionVersion:PROGRESSION_VERSION,generatorVersion:GENERATOR_VERSION,type:event.type,game:event.game||'',day:dk,week:wk,timestamp:new Date().toISOString(),payload:event.payload||{},earnedCoins:earned,completed:[...completed]};}
export function applyEventToState(state,event,date=new Date()){
  const s=normalize(JSON.parse(JSON.stringify(state||blank()))); const dk=dayKey(date),wk=weekKey(date),d=ensureDaily(s,dk,date),w=ensureWeekly(s,wk,date); let earned=0; const completed=[];
  for(const ch of d.challenges){
    if(d.complete[ch.id]||!eventMatches(ch,event))continue;
    d.progress[ch.id]=(d.progress[ch.id]||0)+1;
    if(d.progress[ch.id]>=ch.count){d.complete[ch.id]=true;earned+=DAILY_CHALLENGE_COINS;completed.push(ch.id)}
  }
  if(!w.bossComplete&&event.game===w.boss.game&&eventMatches(w.boss,event)){
    w.bossProgress=(w.bossProgress||0)+1;
    if(w.bossProgress>=w.boss.count){w.bossComplete=true;completed.push('weekly:boss')}
  }
  const game=event.game;
  if(['finger_session','desk_round_complete','marble_run_complete','race_complete','finger_line_complete'].includes(event.type)&&game)w.games[game]=true;
  if(!w.complete&&GAMES.every(g=>w.games[g])){w.complete=true;if(!w.bonus){w.bonus=true;earned+=WEEKLY_COMPLETE_BONUS;completed.push('weekly:world-tour')}}
  const dailyDone=d.challenges.every(ch=>d.complete[ch.id]);
  if(dailyDone&&!d.bonus){d.bonus=true;w.days[dk]=true;earned+=DAILY_COMPLETE_BONUS;completed.push('daily:complete')}
  if(d.bonus)w.days[dk]=true;
  w.coins=(w.coins||0)+earned;s.coins=(s.coins||0)+earned;s.lifetimeCoins=(s.lifetimeCoins||0)+earned;
  const dayCount=Object.keys(w.days||{}).length;
  w.perfect=w.coins>=PERFECT_WEEK_TARGET&&dayCount>=7&&w.complete;
  w.ticketReady=w.coins>=WEEK_COIN_TARGET&&dayCount>=MIN_DAILY_SESSIONS&&w.complete;
  s.ticketReady=Boolean(w.ticketReady); updateRecords(s,event);
  const envelope=publicEvent(event,date,wk,dk,earned,completed);
  s.events=[...(s.events||[]),{t:Date.now(),type:event.type,game:event.game,day:dk,week:wk,earned}].slice(-80);
  s.outbox=[...(s.outbox||[]),envelope].slice(-200);
  const celebration=completed.includes('daily:complete')?'daily_complete':completed.includes('weekly:world-tour')?'weekly_complete':completed.includes('weekly:boss')?'boss_complete':s.ticketReady&&!state?.ticketReady?'ticket_ready':w.perfect&&!state?.weekly?.[wk]?.perfect?'perfect_week':completed.length?'challenge_complete':'';
  return {state:s,earned,completed,dailyDone,weeklyDone:w.complete,bossDone:w.bossComplete,ticketReady:s.ticketReady,weekCoins:w.coins,weekDays:dayCount,perfectWeek:w.perfect,envelope,celebration};
}
export function getProgress(date=new Date()){
  const s=load(),dk=dayKey(date),wk=weekKey(date),d=ensureDaily(s,dk,date),w=ensureWeekly(s,wk,date); save(s);
  const days=Object.keys(w.days||{}).length||completedDayKeysThisWeek(s,wk).length;
  return {state:s,dateKey:dk,weekKey:wk,daily:d.challenges.map(ch=>({...ch,progress:d.progress[ch.id]||0,done:Boolean(d.complete[ch.id])})),dailyComplete:Boolean(d.bonus),weekly:{...weeklyChallenge(date),theme:w.theme,boss:{...w.boss,progress:w.bossProgress||0,done:Boolean(w.bossComplete)},games:w.games,done:Boolean(w.complete),coins:w.coins||0,days,ticketReady:Boolean(w.ticketReady),perfect:Boolean(w.perfect)},coins:s.coins||0,lifetimeCoins:s.lifetimeCoins||s.coins||0,weekCoins:w.coins||0,weekDays:days,streak:streakDays(s,date),ticketReady:Boolean(w.ticketReady),records:s.records||{}};
}
export function getOneHomeHandoff(date=new Date()){
  const p=getProgress(date);
  return {schema:'one-home.shrunk-handoff.v1',source:'shrunk',progressionVersion:PROGRESSION_VERSION,generatorVersion:GENERATOR_VERSION,session:buildSessionDefinition(date),week:p.weekKey,summary:{weekCoins:p.weekCoins,weekCoinTarget:WEEK_COIN_TARGET,dailySessions:p.weekDays,minDailySessions:MIN_DAILY_SESSIONS,weeklyComplete:p.weekly.done,bossComplete:p.weekly.boss.done,ticketReady:p.ticketReady,perfectWeek:p.weekly.perfect,lifetimeCoins:p.lifetimeCoins,records:p.records},events:[...(p.state.outbox||[])]};
}
let mounted=null;
export function recordEvent(type,payload={},game=''){
  const s=load(); const result=applyEventToState(s,{type,payload,game},new Date()); save(result.state); if(mounted)renderGameProgress(mounted,result); window.dispatchEvent(new CustomEvent('shrunk-progress',{detail:result})); return result;
}
function styleOnce(){if(document.getElementById('shrunk-progress-style'))return;const st=document.createElement('style');st.id='shrunk-progress-style';st.textContent=`.shrunk-progress-pill{position:fixed;z-index:9998;right:max(8px,env(safe-area-inset-right));bottom:max(8px,env(safe-area-inset-bottom));padding:7px 10px;border:1px solid #c4fb7166;border-radius:999px;background:#0f120fd9;color:#f3f0df;font:800 9px/1 system-ui;letter-spacing:.08em;backdrop-filter:blur(8px)}.shrunk-progress-toast{position:fixed;z-index:10001;left:50%;top:max(10px,env(safe-area-inset-top));transform:translateX(-50%) translateY(-22px) scale(.96);opacity:0;transition:.22s;padding:11px 15px;border-radius:13px;background:#c4fb71;color:#101510;font:900 10px/1.15 system-ui;letter-spacing:.07em;pointer-events:none;text-align:center;box-shadow:0 8px 30px #0008;max-width:min(90vw,420px)}.shrunk-progress-toast b{display:block;font-size:12px;margin-bottom:3px}.shrunk-progress-toast span{font-size:8px;opacity:.72}.shrunk-progress-toast.show{transform:translateX(-50%) translateY(0) scale(1);opacity:1}.shrunk-progress-toast.gold{background:#f3d66b}`;document.head.appendChild(st)}
function celebrationCopy(result){if(result?.celebration==='perfect_week')return ['PERFECT WEEK','88 COINS · EVERY DAY · WORLD TOUR'];if(result?.celebration==='ticket_ready')return ['TICKET READY','THE WEEK WAS EARNED · ONE HOME HANDOFF READY'];if(result?.celebration==='daily_complete')return ["TODAY'S SESSION COMPLETE",`+${result.earned} SHRUNK COINS · COME BACK TOMORROW`];if(result?.celebration==='weekly_complete')return ['WORLD TOUR COMPLETE',`ALL 4 GAMES · +${result.earned} SHRUNK COINS`];if(result?.celebration==='boss_complete')return ['WEEKLY BOSS COMPLETE','BRAGGING RIGHTS EARNED · KEEP BUILDING THE WEEK'];if(result?.completed?.length)return ['DAILY CHALLENGE COMPLETE',`+${result.earned} SHRUNK COINS`];if(result?.earned)return ['COINS EARNED',`+${result.earned} SHRUNK COINS`];return null;}
function renderGameProgress(el,result=null){const p=getProgress();el.textContent=`🪙 ${p.weekCoins}/${WEEK_COIN_TARGET} · TODAY ${p.daily.filter(x=>x.done).length}/3 · ${p.weekDays}/${MIN_DAILY_SESSIONS} DAYS`;const copy=celebrationCopy(result);if(copy){let t=document.querySelector('.shrunk-progress-toast');if(!t){t=document.createElement('div');t.className='shrunk-progress-toast';document.body.appendChild(t)}t.classList.toggle('gold',result?.celebration==='perfect_week'||result?.celebration==='ticket_ready');t.innerHTML=`<b>${copy[0]}</b><span>${copy[1]}</span>`;t.classList.add('show');clearTimeout(t._x);t._x=setTimeout(()=>t.classList.remove('show'),2400)}}
export function mountGameProgress(game){if(typeof document==='undefined')return;styleOnce();mounted=document.createElement('div');mounted.className='shrunk-progress-pill';mounted.dataset.game=game;document.body.appendChild(mounted);renderGameProgress(mounted);window.addEventListener('shrunk-progress',()=>renderGameProgress(mounted));}
