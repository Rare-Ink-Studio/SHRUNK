export const CHECKPOINTS=[.22,.43,.64,.82];
export const MAX_RUN_TIME=45;
export function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
export function steerVelocity(vx,input,dt){return clamp(vx+input*560*dt,-235,235)}
export function checkpointScore(index,speed){return 100+(index*50)+Math.round(clamp(speed,0,500)/25)}
export function finishScore(time,checkpoints){return Math.max(0,1000-Math.round(time*12))+checkpoints*100}
export function isFinished(y,h){return y>h*.91}
