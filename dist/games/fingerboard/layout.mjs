export function visibleSize(innerWidth,innerHeight,viewport){
  // Pinch magnification must never resize the game world.
  const usable=viewport&&Math.abs((viewport.scale||1)-1)<.02;
  return {width:Math.round(usable?Math.min(innerWidth,viewport.width):innerWidth),height:Math.round(usable?Math.min(innerHeight,viewport.height):innerHeight)};
}
export function gameLayout(width,height,bottomInset=0,topInset=0){
  const compact=height<540;
  const header=(height<330?52:compact?58:86)+topInset;
  const controls=height<330?60:compact?72:104;
  const bottom=Math.max(bottomInset,compact?18:20);
  const ground=Math.min(height*.72,height-bottom-controls-12);
  // Reserve room for fingers, a full ollie, and the highest kicker.
  const scale=Math.max(.2,Math.min(width/1080,(ground-header-14)/310,1.5));
  return {header,controls,bottom,ground,scale,compact};
}
