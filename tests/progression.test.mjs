import test from 'node:test';
import assert from 'node:assert/strict';
import {buildDailyChallenges,buildSessionDefinition,weeklyTheme,weeklyBoss,applyEventToState,WEEK_COIN_TARGET,MIN_DAILY_SESSIONS,PERFECT_WEEK_TARGET,dayKey,weekKey,eventMatches} from '../dist/progression.mjs';

test('daily challenge set is deterministic and has three challenges',()=>{
  const d=new Date(2026,8,14,12);
  const a=buildDailyChallenges(d),b=buildDailyChallenges(d);
  assert.equal(a.length,3); assert.deepEqual(a,b); assert.equal(dayKey(d),'2026-09-14');
});

test('repeating a completed daily challenge does not farm coins',()=>{
  const d=new Date(2026,8,14,12); let state={};
  const ch=buildDailyChallenges(d)[0];
  const payload={};
  if(ch.where?.minBanks)payload.banks=ch.where.minBanks;
  if(ch.where?.minScore)payload.score=ch.where.minScore;
  if(ch.where?.maxTime!=null)payload.time=ch.where.maxTime;
  if(ch.where?.maxImpacts!=null)payload.impacts=ch.where.maxImpacts;
  if(ch.where?.minBoosts)payload.boostsUsed=ch.where.minBoosts;
  if(ch.where?.clean!=null)payload.clean=ch.where.clean;
  const e={type:ch.event,payload,game:ch.game};
  for(let i=0;i<ch.count;i++) state=applyEventToState(state,e,d).state;
  const coins=state.coins;
  state=applyEventToState(state,e,d).state;
  assert.equal(coins,3); assert.equal(state.coins,coins);
});

test('weekly world tour completes only after all four games produce qualifying completion events',()=>{
  const d=new Date(2026,8,14,12); let state={};
  const events=[
    {type:'finger_line_complete',payload:{},game:'fingerboard'},
    {type:'desk_round_complete',payload:{score:100},game:'desk-shot'},
    {type:'marble_run_complete',payload:{score:100,time:40},game:'marble-run'},
    {type:'race_complete',payload:{time:40,impacts:20,boostsUsed:0},game:'tabletop-racing'}
  ];
  for(const e of events) state=applyEventToState(state,e,d).state;
  assert.equal(state.weekly[weekKey(d)].complete,true);
  assert.ok(state.weekly[weekKey(d)].coins>=4);
});

test('ticket readiness requires weekly coins, qualifying days, and world tour',()=>{
  const monday=new Date(2026,8,14,12); const wk=weekKey(monday);
  let state={coins:100,lifetimeCoins:100,daily:{},weekly:{[wk]:{games:{fingerboard:true,'desk-shot':true,'marble-run':true,'tabletop-racing':true},complete:true,bonus:true,coins:WEEK_COIN_TARGET,days:{}}},records:{},events:[],outbox:[]};
  let r=applyEventToState(state,{type:'finger_trick_land',payload:{},game:'fingerboard'},monday);
  assert.equal(r.ticketReady,false);
  state=r.state;
  for(let i=0;i<MIN_DAILY_SESSIONS;i++) state.weekly[wk].days[`2026-09-${14+i}`]=true;
  r=applyEventToState(state,{type:'finger_trick_land',payload:{},game:'fingerboard'},monday);
  assert.equal(r.ticketReady,true);
});

test('perfect week marker requires 88 coins, seven days and world tour',()=>{
  const d=new Date(2026,8,14,12),wk=weekKey(d);
  let state={weekly:{[wk]:{games:{fingerboard:true,'desk-shot':true,'marble-run':true,'tabletop-racing':true},complete:true,bonus:true,coins:PERFECT_WEEK_TARGET,days:{a:true,b:true,c:true,d:true,e:true,f:true,g:true}}},daily:{},records:{},events:[],outbox:[],coins:PERFECT_WEEK_TARGET,lifetimeCoins:PERFECT_WEEK_TARGET};
  const r=applyEventToState(state,{type:'noop',payload:{},game:''},d);
  assert.equal(r.perfectWeek,true);
});

test('challenge filters enforce banks, score and impacts',()=>{
  assert.equal(eventMatches({event:'desk_target_hit',where:{minBanks:2}},{type:'desk_target_hit',payload:{banks:1}}),false);
  assert.equal(eventMatches({event:'desk_target_hit',where:{minBanks:2}},{type:'desk_target_hit',payload:{banks:2}}),true);
  assert.equal(eventMatches({event:'race_complete',where:{maxImpacts:5}},{type:'race_complete',payload:{impacts:6}}),false);
});

test('one home outbox envelope is produced for each event',()=>{
  const d=new Date(2026,8,14,12);
  const r=applyEventToState({}, {type:'finger_trick_land',payload:{trick:'kickflip'},game:'fingerboard'}, d);
  assert.equal(r.envelope.schema,'one-home.participation.v1');
  assert.equal(r.envelope.source,'shrunk');
  assert.equal(r.envelope.game,'fingerboard');
  assert.equal(r.state.outbox.length,1);
});


test('daily rotation changes across dates beyond a seven-day weekday loop',()=>{
  const a=buildDailyChallenges(new Date(2026,8,14,12)).map(x=>x.id);
  const b=buildDailyChallenges(new Date(2026,8,21,12)).map(x=>x.id);
  assert.notDeepEqual(a,b);
});

test('completion result exposes celebration state for UI',()=>{
  const d=new Date(2026,8,14,12); let state={};
  const ch=buildDailyChallenges(d)[0];
  const payload={};
  if(ch.where?.minBanks)payload.banks=ch.where.minBanks;
  if(ch.where?.minScore)payload.score=ch.where.minScore;
  if(ch.where?.maxTime!=null)payload.time=ch.where.maxTime;
  if(ch.where?.maxImpacts!=null)payload.impacts=ch.where.maxImpacts;
  if(ch.where?.minBoosts)payload.boostsUsed=ch.where.minBoosts;
  if(ch.where?.clean!=null)payload.clean=ch.where.clean;
  let r;
  for(let i=0;i<ch.count;i++){r=applyEventToState(state,{type:ch.event,payload,game:ch.game},d);state=r.state;}
  assert.equal(r.celebration,'challenge_complete');
});


test('procedural daily generator chooses three different games',()=>{
  for(let i=0;i<21;i++){
    const d=new Date(2026,8,1+i,12);
    const daily=buildDailyChallenges(d);
    assert.equal(daily.length,3);
    assert.equal(new Set(daily.map(x=>x.game)).size,3);
  }
});

test('weekly theme and boss are deterministic for the same week',()=>{
  const a=new Date(2026,8,14,12),b=new Date(2026,8,16,12);
  assert.deepEqual(weeklyTheme(a),weeklyTheme(b));
  assert.deepEqual(weeklyBoss(a),weeklyBoss(b));
});

test('One Home seed can deterministically alter generated session definition',()=>{
  const d=new Date(2026,8,14,12);
  const a=buildSessionDefinition(d,'one-home-alpha');
  const b=buildSessionDefinition(d,'one-home-alpha');
  const c=buildSessionDefinition(d,'one-home-beta');
  assert.deepEqual(a,b);
  assert.equal(a.schema,'shrunk.session.v1');
  assert.notDeepEqual(a.daily.map(x=>x.id),c.daily.map(x=>x.id));
});

test('weekly boss can complete without minting extra test coins',()=>{
  const d=new Date(2026,8,14,12); const boss=weeklyBoss(d); let state={};
  const payload={};
  if(boss.where?.minBanks)payload.banks=boss.where.minBanks;
  if(boss.where?.minScore)payload.score=boss.where.minScore;
  if(boss.where?.maxTime!=null)payload.time=boss.where.maxTime;
  if(boss.where?.maxImpacts!=null)payload.impacts=boss.where.maxImpacts;
  if(boss.where?.minBoosts)payload.boostsUsed=boss.where.minBoosts;
  if(boss.where?.clean!=null)payload.clean=boss.where.clean;
  let before=0,r;
  for(let i=0;i<boss.count;i++){
    before=state.coins||0;
    r=applyEventToState(state,{type:boss.event,payload,game:boss.game},d);
    state=r.state;
  }
  assert.equal(state.weekly[weekKey(d)].bossComplete,true);
  // Boss itself is recognition-only; any coins may only come from a coincident Daily challenge.
  assert.ok((state.coins||0)-before<=3);
});
