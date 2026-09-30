const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const p = clamp(value); return p * p * (3 - 2 * p); };

/** Pure, reversible scroll choreography. No elapsed-time animations. */
export function journeyProgress(value: number) {
  const progress = clamp(value);
  return {
    progress,
    spread: smooth((progress - 0.28) / 0.5),
    fan: Math.sin(smooth(progress / 0.78) * Math.PI),
    draw: smooth(progress / 0.38),
    labels: smooth((progress - 0.68) / 0.1),
    // Separate caption windows keep overlapping text out of the composition.
    opening: 1 - smooth(progress / 0.2),
    middle: smooth((progress - 0.2) / 0.12) * (1 - smooth((progress - 0.48) / 0.14)),
    closing: smooth((progress - 0.62) / 0.16),
  };
}
