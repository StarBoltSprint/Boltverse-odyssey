let frozenUntil = 0;

export function freezeTaps(ms: number) {
  frozenUntil = performance.now() + ms;
}

export function tapsFrozen() {
  return performance.now() < frozenUntil;
}

/** Arm after the incoming tap is fully dead — never on that tap's own lift/click. */
export function armAfterLift(fn: () => void) {
  let done = false;
  const fire = () => {
    if (done) return;
    done = true;
    window.clearTimeout(t);
    window.removeEventListener("pointerdown", onDown, true);
    fn();
  };
  const onDown = () => fire();
  window.addEventListener("pointerdown", onDown, true);
  const t = window.setTimeout(fire, 260);
  return () => {
    done = true;
    window.clearTimeout(t);
    window.removeEventListener("pointerdown", onDown, true);
  };
}
