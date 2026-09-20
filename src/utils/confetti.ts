import confetti from 'canvas-confetti';

let lastTriggerTime = 0;
const THROTTLE_MS = 300;

export interface SubtleConfettiOptions {
  origin?: { x?: number; y?: number };
  particleCount?: number;
  spread?: number;
  colors?: string[];
}

/**
 * Triggers a subtle, tasteful confetti animation.
 * Respects prefers-reduced-motion and throttles consecutive rapid invocations.
 */
export const triggerSubtleConfetti = (options: SubtleConfettiOptions = {}): void => {
  if (typeof window === 'undefined') return;

  // Respect user preference for reduced motion
  try {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
  } catch {}

  const now = Date.now();
  if (now - lastTriggerTime < THROTTLE_MS) return;
  lastTriggerTime = now;

  // Traditional festive Nepali colors: Crimson (Simrik), Marigold Gold, Emerald, Azure, Saffron
  const defaultColors = [
    '#DC2626', // Simrik / Crimson
    '#F59E0B', // Marigold / Sayapatri Amber
    '#10B981', // Emerald green
    '#3B82F6', // Clear Himalayan Sky
    '#FBBF24', // Warm gold
    '#8B5CF6', // Royal purple
  ];

  try {
    confetti({
      particleCount: options.particleCount ?? 30,
      spread: options.spread ?? 52,
      origin: options.origin ?? { y: 0.65, x: 0.5 },
      colors: options.colors ?? defaultColors,
      disableForReducedMotion: true,
      scalar: 0.8,
      ticks: 120,
      gravity: 1.1,
      decay: 0.92,
      startVelocity: 24,
    });
  } catch (err) {
    console.debug('Confetti animation suppressed or failed', err);
  }
};

/**
 * Specifically tailored for Date Converter success (BS <-> AD, Age calculator)
 */
export const triggerDateConvertConfetti = (origin?: { x?: number; y?: number }): void => {
  triggerSubtleConfetti({
    particleCount: 28,
    spread: 50,
    origin: origin ?? { y: 0.62, x: 0.5 },
  });
};

/**
 * Specifically tailored for Calculator evaluation (=) & scientific function calculations
 */
export const triggerCalculationConfetti = (origin?: { x?: number; y?: number }): void => {
  triggerSubtleConfetti({
    particleCount: 30,
    spread: 55,
    origin: origin ?? { y: 0.68, x: 0.5 },
  });
};
