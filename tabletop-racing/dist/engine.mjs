export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function stepCar(s,input,dt){
  const gas=clamp(input.gas||0,0,1), steer=clamp(input.steer||0,-1,1);
  const boost=input.boost&&s.boost>0;
  const accel=gas*(boost?300:190); s.speed=clamp(s.speed+accel*dt-(gas?18:70)*dt,0,boost?420:290);
  s.heading+=steer*(1.8+Math.min(s.speed/180,1))*dt;
  s.x+=Math.cos(s.heading)*s.speed*dt; s.y+=Math.sin(s.heading)*s.speed*dt;
  if(boost)s.boost=clamp(s.boost-34*dt,0,100); else s.boost=clamp(s.boost+8*dt,0,100);
  return s;
}
export function checkpointHit(car,c){return Math.hypot(car.x-c.x,car.y-c.y)<c.r}
export function offTable(car,w,h,m=30){return car.x<-m||car.y<-m||car.x>w+m||car.y>h+m}

export function collideCarRect(car,rect){const dx=car.x-rect.x,dy=car.y-rect.y,hx=rect.w/2+14,hy=rect.h/2+10;if(Math.abs(dx)>=hx||Math.abs(dy)>=hy)return false;const px=hx-Math.abs(dx),py=hy-Math.abs(dy);if(px<py){car.x=rect.x+(dx<0?-hx:hx);car.heading=Math.PI-car.heading}else{car.y=rect.y+(dy<0?-hy:hy);car.heading=-car.heading}car.speed*=.52;return true}
export function onBoostStrip(car,strip){return Math.abs(car.x-strip.x)<strip.w/2&&Math.abs(car.y-strip.y)<strip.h/2}
