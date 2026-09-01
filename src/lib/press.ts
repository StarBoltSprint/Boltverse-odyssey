/** Samsung + iframe tap: click and touchend. No preventDefault on pointer. */
export function press(fn: () => void) {
  let last = 0;
  const run = () => {
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    if (now - last < 400) return;
    last = now;
    fn();
  };
  return {
    onClick: () => run(),
    onTouchEnd: (e: { preventDefault?: () => void }) => {
      e.preventDefault?.();
      run();
    },
  };
}
