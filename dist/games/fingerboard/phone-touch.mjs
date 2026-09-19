// Cancel iOS touch-end default zoom before it happens, while retaining
// button activation. Pointer events still own the two-thumb game controls.
export function installPhoneTouchGuard(root) {
  const touches = new Map();
  const options = {capture:true, passive:false};
  const inDialog = target => target?.closest?.('dialog');
  const action = target => target?.closest?.('button,a');
  root.addEventListener('touchstart', event => {
    for (const touch of event.changedTouches) {
      touches.set(touch.identifier, {target:touch.target, x:touch.clientX, y:touch.clientY, moved:false});
    }
  }, options);
  root.addEventListener('touchmove', event => {
    for (const touch of event.changedTouches) {
      const start = touches.get(touch.identifier);
      if (start && Math.hypot(touch.clientX-start.x,touch.clientY-start.y)>12) start.moved=true;
    }
    if (!inDialog(event.target) && event.cancelable) event.preventDefault();
  }, options);
  root.addEventListener('touchend', event => {
    const guarded = !inDialog(event.target);
    if (guarded && event.cancelable) event.preventDefault();
    for (const touch of event.changedTouches) {
      const start = touches.get(touch.identifier);
      touches.delete(touch.identifier);
      const button = action(start?.target);
      if (guarded && event.cancelable && start && !start.moved &&
          Math.hypot(touch.clientX-start.x,touch.clientY-start.y)<=12 &&
          button && !button.disabled && button.getAttribute('aria-disabled')!=='true') button.click();
    }
  }, options);
  root.addEventListener('touchcancel', event => {
    for (const touch of event.changedTouches) touches.delete(touch.identifier);
  }, options);
  for (const type of ['gesturestart','gesturechange','gestureend','dblclick']) {
    root.addEventListener(type, event => {
      if (!inDialog(event.target) && event.cancelable) event.preventDefault();
    }, options);
  }
  return () => touches.clear();
}
