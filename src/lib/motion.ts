/**
 * Shared framer-motion (motion/react) variants and viewport config.
 *
 * `fadeInUp` is the site-wide reveal: fade in while rising a little. Use the
 * `whileInView` form for on-scroll reveals, or spread `fadeInUpMount` for
 * mount-time animation (hero content that's above the fold).
 */
export const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
} as const;

export const fadeInUpMount = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
} as const;
