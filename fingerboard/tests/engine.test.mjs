import test from 'node:test';
import assert from 'node:assert/strict';
import {FingerboardGame,DualThumbInput,PHYSICS,needsLandscape,demoPop,assistDemo,viewScale,obstaclesBetween} from '../dist/engine.mjs';
function step(g,seconds,dt=1/120){for(let t=0;t<seconds-1e-8;t+=dt)g.update(Math.min(dt,seconds-t));}
function playing(){const g=new FingerboardGame();g.start();g.drainEvents();return g;}
function jump(g,charge=.34){g.rearDown();step(g,charge);g.rearUp();}

test('full ollie can be caught, landed, and scored without an accidental second pop',()=>{const g=playing();jump(g);assert.equal(g.phase,'air');step(g,.22);g.rearDown();for(let i=0;i<160&&g.phase==='air';i++)g.update(1/120);assert.equal(g.phase,'roll');assert.equal(g.ollies,1);assert.ok(g.score>=100);assert.equal(g.bails,0);assert.ok(g.drainEvents().some(e=>e.type==='land'&&e.clean));g.rearUp();assert.equal(g.phase,'roll');});
test('load duration changes actual airtime and height',()=>{const low=playing(),high=playing();jump(low,.08);jump(high,.34);assert.ok(high.vy>low.vy+120);step(high,.30);step(low,.30);assert.ok(high.y>low.y+30);});
test('front and rear thumbs retain separate pointer ownership',()=>{const g=playing(),input=new DualThumbInput(g);input.down(0,80,300,844,0);input.down(7,750,300,844,0);assert.equal(input.down(8,780,301,844,2),false);input.move(0,130,335,100);step(g,.34);assert.ok(g.steer>0);assert.ok(g.tilt<0);input.up(0,false,120);assert.equal(g.rear,true);assert.equal(g.front,false);input.up(7,false,350);assert.equal(g.phase,'air');assert.equal(input.pointers.size,0);});
test('cancelled rear touch and pause never manufacture a pop',()=>{const g=playing(),input=new DualThumbInput(g);input.down(11,700,300,844,0);step(g,.2);input.up(11,true,200);assert.equal(g.phase,'roll');assert.equal(g.vy,0);input.down(15,700,300,844,210);step(g,.1);g.pause();input.clear();const before=g.x;step(g,1);assert.equal(g.x,before);g.resume();step(g,.1);assert.equal(g.phase,'roll');assert.equal(g.rear,false);});
test('hitting a ledge bails and resets to a safe approach after 0.62 seconds',()=>{const g=playing();g.x=1358;step(g,.03);assert.equal(g.phase,'bail');step(g,PHYSICS.bailTime);assert.equal(g.phase,'roll');assert.ok(g.x<1390);assert.equal(g.y,0);assert.equal(g.bails,1);});
test('a timed ollie can clear a real obstacle and earn a clearance bonus',()=>{const g=playing();g.x=1110;g.setFront(true,1,0);step(g,.22);jump(g);step(g,.2);g.rearDown();for(let i=0;i<180&&g.phase==='air';i++)g.update(1/120);const events=g.drainEvents();assert.equal(g.bails,0);assert.ok(events.some(e=>e.type==='land'&&e.clears===1),JSON.stringify({x:g.x,y:g.y,events}));assert.ok(g.score>200);});
test('landing at a steep angle bails instead of awarding points',()=>{const g=playing();g.phase='air';g.hasPop=true;g.y=2;g.vy=-150;g.angle=1;g.airPeak=50;step(g,.03);assert.equal(g.phase,'bail');assert.equal(g.score,0);});
test('going off a kicker falls and rolls away without phantom ollie points',()=>{const g=playing();g.x=4980;g.y=48;step(g,.8);assert.equal(g.bails,0);assert.equal(g.phase,'roll');assert.equal(g.y,0);assert.equal(g.score,0);});
test('landscape gating follows real viewport changes both ways',()=>{assert.equal(needsLandscape(390,844),true);assert.equal(needsLandscape(844,390),false);assert.equal(needsLandscape(390,709),true);assert.equal(needsLandscape(1200,800),false);assert.equal(needsLandscape(844,390),false);assert.equal(needsLandscape(390,844),true);});
test('restarting clears the active line, pointers, and session state',()=>{const g=playing(),input=new DualThumbInput(g);input.down(1,100,300,844,0);input.down(2,750,300,844,0);g.score=600;g.combo=4;g.reset();input.clear();assert.equal(g.score,0);assert.equal(g.combo,0);assert.equal(g.x,220);assert.equal(g.rear,false);assert.equal(input.pointers.size,0);});

test('demo tap pops once and auto catches for a clean landing',()=>{const g=playing();assert.equal(demoPop(g),true);assert.equal(demoPop(g),false);for(let i=0;i<110;i++){assistDemo(g);g.update(1/120);}assert.equal(g.ollies,1);assert.equal(g.bails,0);assert.equal(g.phase,'roll');assert.ok(g.score>0);assert.equal(g.rear,false);});
test('demo clears a ledge with a timed tap and resumes assistance after pause',()=>{const g=playing();g.x=1300;demoPop(g);step(g,.15);g.pause();assert.equal(demoPop(g),false);const x=g.x;assistDemo(g);step(g,.2);assert.equal(g.x,x);g.resume();for(let i=0;i<100;i++){assistDemo(g);g.update(1/120);}assert.equal(g.bails,0);assert.equal(g.ollies,1);assert.ok(g.drainEvents().some(e=>e.type==='land'&&e.clears===1));});
test('view lock holds scale across browser chrome height changes',()=>{assert.equal(viewScale(844,390,true),viewScale(844,320,true));assert.notEqual(viewScale(844,390,false),viewScale(844,320,false));assert.notEqual(viewScale(844,390,true),viewScale(1200,800,true));});


test('front diagonal air flick triggers one kickflip without stealing rear ownership',()=>{const g=playing(),input=new DualThumbInput(g);input.down(1,120,300,844,0);input.down(2,740,300,844,0);step(g,.34);input.up(2,false,350);assert.equal(g.phase,'air');input.move(1,122,298,360);input.move(1,168,275,430);assert.equal(g.trick,'kickflip');assert.notEqual(g.flipVelocity,0);assert.equal(input.roles.rear,null);assert.equal(input.roles.front,1);const first=g.flipVelocity;input.move(1,220,245,470);assert.equal(g.trick,'kickflip');assert.equal(g.flipVelocity,first);});

test('completed kickflip lands, scores a bonus, and resets flip state',()=>{const g=playing();jump(g);assert.equal(g.kickflip(1),true);for(let i=0;i<260&&g.phase==='air';i++){if(g.flipComplete&&!g.catch)g.rearDown();g.update(1/120);}const events=g.drainEvents();const land=events.find(e=>e.type==='land');assert.ok(land,JSON.stringify({phase:g.phase,flip:g.flip,events}));assert.equal(land.trick,'KICKFLIP');assert.equal(g.kickflips,1);assert.ok(g.score>=300);assert.equal(g.trick,null);assert.equal(g.flip,0);});

test('catching a kickflip too early bails instead of awarding a trick',()=>{const g=playing();jump(g);g.kickflip(1);step(g,.08);g.rearDown();for(let i=0;i<220&&g.phase==='air';i++)g.update(1/120);assert.equal(g.phase,'bail');assert.equal(g.kickflips,0);assert.equal(g.score,0);assert.ok(g.drainEvents().some(e=>e.type==='bail'&&e.reason==='CATCH THE FLIP'));});

test('easy demo remains ollie-only',()=>{const g=playing();demoPop(g);for(let i=0;i<120;i++){assistDemo(g);g.update(1/120);}assert.equal(g.kickflips,0);assert.equal(g.trick,null);assert.equal(g.bails,0);});

test('opposite front diagonal air flick triggers heelflip without changing kickflip gesture',()=>{const g=playing(),input=new DualThumbInput(g);input.down(1,180,300,844,0);input.down(2,740,300,844,0);step(g,.34);input.up(2,false,350);input.move(1,178,298,360);input.move(1,132,275,430);assert.equal(g.trick,'heelflip');assert.ok(g.flipVelocity<0);assert.equal(input.roles.front,1);});

test('completed heelflip lands, scores, and tracks separately',()=>{const g=playing();jump(g);assert.equal(g.heelflip(),true);for(let i=0;i<260&&g.phase==='air';i++){if(g.flipComplete&&!g.catch)g.rearDown();g.update(1/120);}const events=g.drainEvents();const land=events.find(e=>e.type==='land');assert.ok(land,JSON.stringify({phase:g.phase,flip:g.flip,events}));assert.equal(land.trick,'HEELFLIP');assert.equal(g.heelflips,1);assert.equal(g.kickflips,0);assert.ok(g.score>=300);assert.equal(g.trick,null);});

test('catching a heelflip too early bails just like a kickflip',()=>{const g=playing();jump(g);g.heelflip();step(g,.08);g.rearDown();for(let i=0;i<220&&g.phase==='air';i++)g.update(1/120);assert.equal(g.phase,'bail');assert.equal(g.heelflips,0);assert.equal(g.score,0);assert.ok(g.drainEvents().some(e=>e.type==='bail'&&e.reason==='CATCH THE FLIP'));});

test('rear sideways scoop on pop triggers pop shuvit without changing front ownership',()=>{const g=playing(),input=new DualThumbInput(g);input.down(1,120,300,844,0);input.down(2,700,300,844,0);step(g,.34);input.move(2,748,294,330);input.up(2,false,350);assert.equal(g.phase,'air');assert.equal(g.trick,'popshuvit');assert.notEqual(g.shuvVelocity,0);assert.equal(input.roles.front,1);assert.equal(input.roles.rear,null);});

test('completed pop shuvit lands, scores, and tracks separately',()=>{const g=playing();jump(g);assert.equal(g.popShuvit(1),true);for(let i=0;i<260&&g.phase==='air';i++){if(g.shuvComplete&&!g.catch)g.rearDown();g.update(1/120);}const events=g.drainEvents();const land=events.find(e=>e.type==='land');assert.ok(land,JSON.stringify({phase:g.phase,shuv:g.shuv,events}));assert.equal(land.trick,'POP SHUVIT');assert.equal(g.popShuvits,1);assert.equal(g.kickflips,0);assert.equal(g.heelflips,0);assert.ok(g.score>=260);assert.equal(g.trick,null);assert.equal(g.shuv,0);});

test('catching a pop shuvit too early bails instead of awarding the trick',()=>{const g=playing();jump(g);g.popShuvit(1);step(g,.06);g.rearDown();for(let i=0;i<220&&g.phase==='air';i++)g.update(1/120);assert.equal(g.phase,'bail');assert.equal(g.popShuvits,0);assert.equal(g.score,0);assert.ok(g.drainEvents().some(e=>e.type==='bail'&&e.reason==='CATCH THE SHUV'));});


test('airborne horizontal front sweep triggers 180 without stealing rear ownership',()=>{const g=playing(),input=new DualThumbInput(g);input.down(1,120,300,844,0);input.down(2,740,300,844,0);step(g,.34);input.up(2,false,350);assert.equal(g.phase,'air');input.move(1,122,300,360);input.move(1,180,306,450);assert.equal(g.trick,'180');assert.notEqual(g.bodySpinVelocity,0);assert.equal(input.roles.front,1);assert.equal(input.roles.rear,null);});

test('completed 180 lands, scores, and tracks separately',()=>{const g=playing();jump(g);assert.equal(g.oneEighty(1),true);for(let i=0;i<260&&g.phase==='air';i++){if(g.bodySpinComplete&&!g.catch)g.rearDown();g.update(1/120);}const events=g.drainEvents();const land=events.find(e=>e.type==='land');assert.ok(land,JSON.stringify({phase:g.phase,spin:g.bodySpin,events}));assert.equal(land.trick,'180');assert.equal(g.oneEighties,1);assert.equal(g.popShuvits,0);assert.ok(g.score>=240);assert.equal(g.trick,null);assert.equal(g.bodySpin,0);});

test('incomplete 180 bails instead of awarding the trick',()=>{const g=playing();jump(g);g.oneEighty(1);step(g,.07);g.rearDown();for(let i=0;i<220&&g.phase==='air';i++)g.update(1/120);assert.equal(g.phase,'bail');assert.equal(g.oneEighties,0);assert.equal(g.score,0);assert.ok(g.drainEvents().some(e=>e.type==='bail'&&e.reason==='FINISH THE 180'));});


test('stronger rear sideways scoop triggers 360 shuvit while normal scoop remains pop shuvit',()=>{const g=playing(),input=new DualThumbInput(g);input.down(1,120,300,844,0);input.down(2,700,300,844,0);step(g,.34);input.move(2,784,294,330);input.up(2,false,350);assert.equal(g.phase,'air');assert.equal(g.trick,'360shuvit');assert.notEqual(g.shuvVelocity,0);assert.equal(input.roles.front,1);});

test('completed 360 shuvit lands, scores, and tracks separately',()=>{const g=playing();jump(g);assert.equal(g.threeSixtyShuvit(1),true);for(let i=0;i<300&&g.phase==='air';i++){if(g.shuvComplete&&!g.catch)g.rearDown();g.update(1/120);}const events=g.drainEvents();const land=events.find(e=>e.type==='land');assert.ok(land,JSON.stringify({phase:g.phase,shuv:g.shuv,events}));assert.equal(land.trick,'360 SHUVIT');assert.equal(g.threeSixtyShuvits,1);assert.equal(g.popShuvits,0);assert.ok(g.score>=360);assert.equal(g.trick,null);assert.equal(g.shuv,0);});

test('catching a 360 shuvit too early bails instead of awarding the trick',()=>{const g=playing();jump(g);g.threeSixtyShuvit(1);step(g,.08);g.rearDown();for(let i=0;i<260&&g.phase==='air';i++)g.update(1/120);assert.equal(g.phase,'bail');assert.equal(g.threeSixtyShuvits,0);assert.equal(g.score,0);assert.ok(g.drainEvents().some(e=>e.type==='bail'&&e.reason==='CATCH THE SHUV'));});


test('pop shuvit plus front kick flick combines into varial kickflip',()=>{const g=playing();jump(g);assert.equal(g.popShuvit(1),true);assert.equal(g.kickflip(),true);assert.equal(g.trick,'varialkickflip');assert.notEqual(g.flipVelocity,0);assert.notEqual(g.shuvVelocity,0);});

test('completed varial kickflip requires both rotations and scores combo trick',()=>{const g=playing();jump(g);g.popShuvit(1);g.kickflip();for(let i=0;i<300&&g.phase==='air';i++){if(g.flipComplete&&g.shuvComplete&&!g.catch)g.rearDown();g.update(1/120);}const events=g.drainEvents();const land=events.find(e=>e.type==='land');assert.ok(land,JSON.stringify({phase:g.phase,flip:g.flip,shuv:g.shuv,events}));assert.equal(land.trick,'VARIAL KICKFLIP');assert.equal(g.varialKickflips,1);assert.ok(g.score>=400);});

test('varial kickflip early catch bails instead of awarding combo',()=>{const g=playing();jump(g);g.popShuvit(1);g.kickflip();step(g,.06);g.rearDown();for(let i=0;i<260&&g.phase==='air';i++)g.update(1/120);assert.equal(g.phase,'bail');assert.equal(g.varialKickflips,0);});


test('pop shuvit plus front heel flick combines into varial heelflip',()=>{const g=playing();jump(g);assert.equal(g.popShuvit(1),true);assert.equal(g.heelflip(),true);assert.equal(g.trick,'varialheelflip');assert.ok(g.flipVelocity<0);assert.notEqual(g.shuvVelocity,0);});

test('completed varial heelflip requires both rotations and scores combo trick',()=>{const g=playing();jump(g);g.popShuvit(1);g.heelflip();for(let i=0;i<300&&g.phase==='air';i++){if(g.flipComplete&&g.shuvComplete&&!g.catch)g.rearDown();g.update(1/120);}const events=g.drainEvents();const land=events.find(e=>e.type==='land');assert.ok(land,JSON.stringify({phase:g.phase,flip:g.flip,shuv:g.shuv,events}));assert.equal(land.trick,'VARIAL HEELFLIP');assert.equal(g.varialHeelflips,1);assert.ok(g.score>=400);});

test('varial heelflip early catch bails instead of awarding combo',()=>{const g=playing();jump(g);g.popShuvit(1);g.heelflip();step(g,.06);g.rearDown();for(let i=0;i<260&&g.phase==='air';i++)g.update(1/120);assert.equal(g.phase,'bail');assert.equal(g.varialHeelflips,0);});


test('360 shuvit plus front kick flick combines into 360 flip',()=>{const g=playing();jump(g);assert.equal(g.threeSixtyShuvit(1),true);assert.equal(g.kickflip(),true);assert.equal(g.trick,'treflip');assert.notEqual(g.flipVelocity,0);assert.notEqual(g.shuvVelocity,0);});

test('completed 360 flip requires full shuv and flip rotations and scores combo trick',()=>{const g=playing();jump(g);g.threeSixtyShuvit(1);g.kickflip();for(let i=0;i<340&&g.phase==='air';i++){if(g.flipComplete&&g.shuvComplete&&!g.catch)g.rearDown();g.update(1/120);}const events=g.drainEvents();const land=events.find(e=>e.type==='land');assert.ok(land,JSON.stringify({phase:g.phase,flip:g.flip,shuv:g.shuv,events}));assert.equal(land.trick,'360 FLIP');assert.equal(g.treFlips,1);assert.ok(g.score>=540);});

test('360 flip early catch bails instead of awarding combo',()=>{const g=playing();jump(g);g.threeSixtyShuvit(1);g.kickflip();step(g,.06);g.rearDown();for(let i=0;i<300&&g.phase==='air';i++)g.update(1/120);assert.equal(g.phase,'bail');assert.equal(g.treFlips,0);});


test('360 shuvit plus front heel flick combines into inward heelflip',()=>{const g=playing();jump(g);assert.equal(g.threeSixtyShuvit(-1),true);assert.equal(g.heelflip(),true);assert.equal(g.trick,'inwardheelflip');assert.ok(g.flipVelocity<0);assert.notEqual(g.shuvVelocity,0);});

test('completed inward heelflip requires full shuv and heel rotations and scores combo trick',()=>{const g=playing();jump(g);g.threeSixtyShuvit(-1);g.heelflip();for(let i=0;i<340&&g.phase==='air';i++){if(g.flipComplete&&g.shuvComplete&&!g.catch)g.rearDown();g.update(1/120);}const events=g.drainEvents();const land=events.find(e=>e.type==='land');assert.ok(land,JSON.stringify({phase:g.phase,flip:g.flip,shuv:g.shuv,events}));assert.equal(land.trick,'INWARD HEELFLIP');assert.equal(g.inwardHeelflips,1);assert.ok(g.score>=540);});

test('inward heelflip early catch bails instead of awarding combo',()=>{const g=playing();jump(g);g.threeSixtyShuvit(-1);g.heelflip();step(g,.06);g.rearDown();for(let i=0;i<300&&g.phase==='air';i++)g.update(1/120);assert.equal(g.phase,'bail');assert.equal(g.inwardHeelflips,0);});

test('The Table line exposes curb, ledge, gap, rail and run-out in order',()=>{const features=obstaclesBetween(0,5200);assert.deepEqual(features.map(o=>o.name),['START CURB','TABLE LEDGE','TABLE GAP','LOW RAIL','LANDING BLOCK','RUN OUT']);});

test('rolling into The Table gap bails but an ollie can clear and register it',()=>{const roll=playing();roll.x=2140;roll.vx=248;step(roll,.2);assert.equal(roll.phase,'bail');assert.ok(roll.drainEvents().some(e=>e.type==='bail'&&e.reason==='OLLIE THE GAP'));const air=playing();air.x=2160;demoPop(air);for(let i=0;i<260&&air.phase!=='bail';i++){assistDemo(air);air.update(1/120);if(air.x>2360)break;}assert.equal(air.bails,0);assert.ok(air.clearedFeatures.has('0:2180'));assert.ok(air.drainEvents().some(e=>e.type==='featureclear'&&e.name==='TABLE GAP'));});

test('low rail is a real collision feature and can be cleared in the air',()=>{const roll=playing();roll.x=2980;step(roll,.3);assert.equal(roll.phase,'bail');assert.ok(roll.drainEvents().some(e=>e.type==='bail'&&e.reason==='POP THE RAIL'));const air=playing();air.x=3010;demoPop(air);for(let i=0;i<300&&air.phase!=='bail';i++){assistDemo(air);air.update(1/120);if(air.x>3190)break;}assert.equal(air.bails,0);assert.ok(air.clearedFeatures.has('0:3030'));});

test('line scoring grows from feature clears and clean consecutive landings',()=>{const g=playing();g.x=1110;g.setFront(true,1,0);step(g,.22);jump(g);step(g,.2);g.rearDown();for(let i=0;i<180&&g.phase==='air';i++)g.update(1/120);assert.ok(g.lineScore>0);assert.equal(g.lineStreak,1);const first=g.lineScore;g.x=1800;jump(g);for(let i=0;i<180&&g.phase==='air';i++){if(!g.catch)g.rearDown();g.update(1/120);}assert.ok(g.lineScore>first);assert.ok(g.lineStreak>=2);});

test('a bail breaks the clean line streak but preserves the session line score',()=>{const g=playing();g.lineScore=420;g.lineStreak=3;g.bail('TEST BAIL');assert.equal(g.lineStreak,0);assert.equal(g.lineScore,420);assert.equal(g.lineBailed,true);});

test('crossing The Table finish completes a line, awards a finish bonus, and starts a fresh line',()=>{const g=playing();g.x=5058;g.lineScore=900;g.lineStreak=2;g.vx=248;step(g,.05);const event=g.drainEvents().find(e=>e.type==='linecomplete');assert.ok(event);assert.equal(event.name,'THE TABLE');assert.equal(event.clean,true);assert.equal(event.lineScore,1400);assert.equal(g.bestLine,1400);assert.equal(g.completedLines,1);assert.equal(g.lineScore,0);assert.equal(g.lineStreak,0);});

test('natural two-thumb landing on the rail locks into a 50-50 even if FRONT is released at contact',()=>{const g=playing();g.x=3070;g.y=42;g.vy=-28;g.phase='air';g.hasPop=true;g.angle=.12;g.setFront(false);for(let i=0;i<30&&g.phase==='air';i++)g.update(1/120);assert.equal(g.phase,'grind');assert.equal(g.grind,'5050');assert.ok(g.drainEvents().some(e=>e.type==='grindstart'&&e.grind==='50-50'));});

test('front-assisted rail contact locks into a 50-50 and rides to a scored exit',()=>{const g=playing();g.x=3010;g.y=40;g.vy=-20;g.phase='air';g.hasPop=true;g.setFront(true,0,0);g.update(1/120);assert.equal(g.phase,'grind');assert.equal(g.grind,'5050');assert.ok(g.drainEvents().some(e=>e.type==='grindstart'&&e.grind==='50-50'));for(let i=0;i<180&&g.phase==='grind';i++)g.update(1/120);const events=g.drainEvents();assert.notEqual(g.phase,'grind');assert.equal(g.fiftyFifties,1);assert.ok(events.some(e=>e.type==='grindcomplete'&&e.grind==='50-50'&&e.points===240));assert.ok(g.lineScore>=240);});

test('compact horizontal front sweep near the rail arms a boardslide without stealing the 180 gesture',()=>{const g=playing(),input=new DualThumbInput(g);g.x=2960;g.y=55;g.vy=10;g.phase='air';g.hasPop=true;input.down(1,120,300,844,0);input.move(1,121,300,20);input.move(1,154,304,120);assert.equal(g.grindIntent,'boardslide');assert.equal(g.trick,null);assert.equal(input.roles.front,1);});

test('boardslide intent turns rail contact sideways and scores separately from 50-50',()=>{const g=playing();g.x=3010;g.y=40;g.vy=-20;g.phase='air';g.hasPop=true;g.grindIntent='boardslide';g.grindYaw=Math.PI/2;g.update(1/120);assert.equal(g.phase,'grind');assert.equal(g.grind,'boardslide');assert.ok(Math.abs(g.grindYaw-Math.PI/2)<.001);for(let i=0;i<180&&g.phase==='grind';i++)g.update(1/120);const events=g.drainEvents();assert.equal(g.boardslides,1);assert.equal(g.fiftyFifties,0);assert.ok(events.some(e=>e.type==='grindcomplete'&&e.grind==='BOARDSLIDE'&&e.points===320));});

test('physical full-load ollie has comfortable clearance over the second TABLE LEDGE',()=>{const g=playing();g.x=1240;const input=new DualThumbInput(g);input.down(1,720,300,844,0);step(g,.34);input.up(1,false,340);for(let i=0;i<260&&g.phase!=='bail'&&g.x<1660;i++)g.update(1/120);assert.equal(g.bails,0,JSON.stringify({x:g.x,y:g.y,phase:g.phase,events:g.drainEvents()}));assert.ok(g.clearedFeatures.has('0:1390'));});

test('easy demo rail contact locks onto and rides the LOW RAIL instead of passing through it',()=>{const g=playing();g.x=2860;demoPop(g);let entered=false;for(let i=0;i<300&&g.phase!=='bail';i++){assistDemo(g);g.update(1/120);if(g.phase==='grind'){entered=true;break;}}assert.equal(g.bails,0);assert.equal(entered,true,JSON.stringify({x:g.x,y:g.y,phase:g.phase,events:g.drainEvents()}));assert.equal(g.grind,'5050');for(let i=0;i<220&&g.phase==='grind';i++){assistDemo(g);g.update(1/120);}assert.notEqual(g.phase,'grind');assert.equal(g.fiftyFifties,1);});
