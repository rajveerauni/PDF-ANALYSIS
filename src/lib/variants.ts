import type { Variants, Transition } from 'framer-motion';

// Premium easing curves
const EASE_ENTER = [0.25, 0.46, 0.45, 0.94] as const;
const EASE_EXIT  = [0.55, 0,    1,    0.45] as const;

// ─── Page-level state transitions ──────────────────────────────────────────
export const pageVariants: Variants = {
  initial: { opacity: 0, scale: 1 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: EASE_ENTER },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.28, ease: EASE_EXIT },
  },
};

// ─── Lottie: floating + scale breathing (loop) ─────────────────────────────
export const lottieFloat = {
  y: [0, -8, 0],
  scale: [1, 1.02, 1],
  transition: {
    duration: 2.4,
    repeat: Infinity,
    ease: 'easeInOut',
  } satisfies Transition,
};

// ─── Terminal log container (stagger) ──────────────────────────────────────
export const terminalContainer: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

// ─── Individual terminal log line ──────────────────────────────────────────
export const terminalLine: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: EASE_ENTER },
  },
};

// ─── Dashboard wrapper ─────────────────────────────────────────────────────
export const dashboardContainer: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASE_ENTER,
      staggerChildren: 0.09,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.28, ease: EASE_EXIT },
  },
};

// ─── Dashboard card / section ──────────────────────────────────────────────
export const cardVariant: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: EASE_ENTER },
  },
};

// ─── Button interactions ───────────────────────────────────────────────────
export const btnHover  = { scale: 1.04 };
export const btnTap    = { scale: 0.96 };
export const btnSpring: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 28,
};

// ─── Header / Sidebar entrance ─────────────────────────────────────────────
export const slideDown: Variants = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: EASE_ENTER } },
};

export const slideRight: Variants = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.5, ease: EASE_ENTER } },
};
