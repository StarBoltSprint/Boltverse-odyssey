/** Ignore leftover Enter/Land presses across a page change. */
let frozenUntil = 0;

export function freezeTaps(ms = 1600) {
  frozenUntil = Math.max(frozenUntil, performance.now() + ms);
}

export function tapsFrozen() {
  return performance.now() < frozenUntil;
}

/** Arm only after the finger that opened this page lifts. */
export function armAfterLift(onArm: () => void, fallbackMs = 1800) {
  let done = false;
  let t = 0;
  const arm = () => {
    if (done) return;
    done = true;
    window.clearTimeout(t);
    freezeTaps(500);
    t = window.setTimeout(onArm, 280);
  };
  window.addEventListener("pointerup", arm, { once: true });
  window.addEventListener("pointercancel", arm, { once: true });
  t = window.setTimeout(arm, fallbackMs);
  return () => {
    done = true;
    window.clearTimeout(t);
    window.removeEventListener("pointerup", arm);
    window.removeEventListener("pointercancel", arm);
  };
}
