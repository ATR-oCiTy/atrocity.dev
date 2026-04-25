import { Variants } from 'framer-motion';

/**
 * Centralized Framer Motion animation variants.
 * Import and reuse across any component — no copy-pasting.
 */

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 30 },
  },
};

/**
 * 3D Card Stack transition variants.
 * Cards flip away on Y-axis when navigating, creating a physical "file stack" feel.
 */
export const cardVariants: Variants = {
  enter: (direction: 'up' | 'down') => ({
    rotateX: direction === 'down' ? 15 : -15,
    y: direction === 'down' ? '100%' : '-100%',
    opacity: 0,
    scale: 0.9,
    z: -300,
  }),
  active: {
    rotateX: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    z: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 30,
      mass: 1.2,
    },
  },
  exit: (direction: 'up' | 'down') => ({
    rotateX: direction === 'down' ? -15 : 15,
    y: direction === 'down' ? '-60%' : '60%',
    opacity: 0,
    scale: 0.85,
    z: -500,
    transition: {
      type: 'spring',
      stiffness: 250,
      damping: 30,
    },
  }),
};
