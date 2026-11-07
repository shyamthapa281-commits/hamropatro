/**
 * Haptic feedback utility providing subtle tactile response for native app feel.
 * Gracefully degrades on desktop and unsupported browsers.
 */
export const hapticFeedback = {
  // Ultra-light 10ms tap for navigation tabs and minor toggles
  light: () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }
    } catch {}
  },

  // Medium 20ms tap for key actions (copy, japa bead, bookmark)
  medium: () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(20);
      }
    } catch {}
  },

  // Distinct double pulse for milestone completion (e.g., 108 japa round, download)
  success: () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([20, 40, 25]);
      }
    } catch {}
  },
};
