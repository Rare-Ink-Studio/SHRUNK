import {getProgress,WEEK_COIN_TARGET,MIN_DAILY_SESSIONS,PERFECT_WEEK_TARGET} from './progression.mjs';
const $=s=>document.querySelector(s);
const GAME_LABELS={fingerboard:'FINGERBOARD','desk-shot':'DESK SHOT','marble-run':'MARBLE RUN','tabletop-racing':'RACING'};
function render(){
  const p=getProgress();
  const done=p.daily.filter(x=>x.done).length;
  $('#daily-count').textContent=`${done}/3`;
  $('#coin-count').textContent=`${p.weekCoins}/${WEEK_COIN_TARGET}`;
  $('#coin-fill').style.width=`${Math.min(100,p.weekCoins/WEEK_COIN_TARGET*100)}%`;
  $('#daily-list').innerHTML=p.daily.map(ch=>`<li class="${ch.done?'done':''}"><span>${ch.done?'✓':'○'}</span><b>${ch.label}</b><small>${Math.min(ch.progress,ch.count)}/${ch.count}</small></li>`).join('');
  const wg=p.weekly.games||{};
  const wc=Object.values(wg).filter(Boolean).length;
  $('#weekly-status').textContent=p.weekly.done?'WORLD TOUR ✓':`${wc}/4 GAMES`;
  $('#weekly-copy').textContent=p.weekly.label;
  const theme=$('#week-theme'),themeCopy=$('#week-theme-copy'),bossLabel=$('#boss-label'),bossStatus=$('#boss-status');
  if(theme)theme.textContent=p.weekly.theme?.name||'WORLD TOUR';
  if(themeCopy)themeCopy.textContent=p.weekly.theme?.copy||'';
  if(bossLabel)bossLabel.textContent=p.weekly.boss?.label||'BOSS CHALLENGE';
  if(bossStatus){bossStatus.textContent=p.weekly.boss?.done?'BOSS ✓':`${Math.min(p.weekly.boss?.progress||0,p.weekly.boss?.count||1)}/${p.weekly.boss?.count||1}`;bossStatus.classList.toggle('done',Boolean(p.weekly.boss?.done));}
  $('#week-days').textContent=`${p.weekDays}/${MIN_DAILY_SESSIONS} DAYS`;
  $('#streak-count').textContent=`${p.streak} DAY${p.streak===1?'':'S'}`;
  const weekDots=$('#week-dots');
  if(weekDots)weekDots.innerHTML=Array.from({length:7},(_,i)=>`<i class="${i<p.weekDays?'done':''}" title="Day ${i+1}">${i+1}</i>`).join('');
  const world=$('#world-games');
  if(world)world.innerHTML=Object.entries(GAME_LABELS).map(([id,label])=>`<i class="${wg[id]?'done':''}">${wg[id]?'✓ ':''}${label}</i>`).join('');
  const next=$('#next-move');
  if(next){
    const open=p.daily.find(x=>!x.done);
    if(p.ticketReady)next.innerHTML=`<small>THE WEEK IS EARNED</small><strong>TICKET READY</strong><span>One Home handoff is ready for future connection.</span>`;
    else if(p.weekly.perfect)next.innerHTML=`<small>PERFECT WEEK</small><strong>${PERFECT_WEEK_TARGET} COINS</strong><span>Seven days + WORLD TOUR complete.</span>`;
    else if(p.dailyComplete)next.innerHTML=`<small>TODAY COMPLETE</small><strong>COME BACK TOMORROW.</strong><span>Your week is saved. Personal records are always open.</span>`;
    else if(open)next.innerHTML=`<small>NEXT MOVE · ${GAME_LABELS[open.game]||'SHRUNK'}</small><strong>${open.label}</strong><span>${Math.min(open.progress,open.count)}/${open.count} complete · +3 coins when finished</span>`;
  }
  const ticket=$('#ticket-state');
  if(p.ticketReady){
    ticket.classList.add('ready');
    ticket.innerHTML=`<strong>TICKET READY · TEST STATE</strong><span>${p.weekly.perfect?'PERFECT 88 WEEK · ':''}ONE HOME HANDOFF READY</span>`;
  }else{
    ticket.classList.remove('ready');
    const needCoins=Math.max(0,WEEK_COIN_TARGET-p.weekCoins),needDays=Math.max(0,MIN_DAILY_SESSIONS-p.weekDays);
    const needs=[]; if(needCoins)needs.push(`${needCoins} COINS`); if(needDays)needs.push(`${needDays} DAILY SESSION${needDays===1?'':'S'}`); if(!p.weekly.done)needs.push('WORLD TOUR');
    ticket.innerHTML=`<strong>${needs.join(' · ')}</strong><span>EARN THE WEEK · ${PERFECT_WEEK_TARGET} COINS = PERFECT WEEK</span>`;
  }
}
render();
addEventListener('storage',render);
addEventListener('pageshow',render);
