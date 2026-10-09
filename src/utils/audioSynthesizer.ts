/**
 * Authentic Himalayan Singing Bowl & Sacred Sound Synthesizer
 * Uses the Web Audio API to acoustically recreate the resonance of hand-hammered
 * bronze Tibetan singing bowls, meditation bells, and harmonic drones.
 */

class SoundSynthesizer {
  private audioCtx: AudioContext | null = null;
  private continuousOscs: OscillatorNode[] = [];
  private continuousGain: GainNode | null = null;
  private isContinuousPlaying: boolean = false;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Play an authentic Himalayan Singing Bowl strike.
   * Fundamental Shiva healing pitch at 216 Hz or 272.2 Hz (Om frequency).
   * Overtones at 2.76x, 5.4x, and 8.9x with subtle 1.4 Hz acoustic beating.
   */
  public playSingingBowl(fundamental: number = 216, duration: number = 4.5): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.35, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      masterGain.connect(ctx.destination);

      // 1. Mallet impact transient (soft wooden striker contact)
      const strikerOsc = ctx.createOscillator();
      const strikerGain = ctx.createGain();
      strikerOsc.type = 'triangle';
      strikerOsc.frequency.setValueAtTime(fundamental * 0.8, now);
      strikerGain.gain.setValueAtTime(0.2, now);
      strikerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      strikerOsc.connect(strikerGain);
      strikerGain.connect(masterGain);
      strikerOsc.start(now);
      strikerOsc.stop(now + 0.08);

      // 2. Dual fundamental oscillators with 1.4 Hz detune for bronze beating
      const f1 = ctx.createOscillator();
      f1.type = 'sine';
      f1.frequency.setValueAtTime(fundamental, now);
      const g1 = ctx.createGain();
      g1.gain.setValueAtTime(0.25, now);
      g1.gain.exponentialRampToValueAtTime(0.001, now + duration);
      f1.connect(g1);
      g1.connect(masterGain);
      f1.start(now);
      f1.stop(now + duration);

      const f2 = ctx.createOscillator();
      f2.type = 'sine';
      f2.frequency.setValueAtTime(fundamental + 1.4, now);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.22, now);
      g2.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.95);
      f2.connect(g2);
      g2.connect(masterGain);
      f2.start(now);
      f2.stop(now + duration);

      // 3. Second harmonic overtone (2.76x) - characteristic singing bowl ring
      const h2 = ctx.createOscillator();
      h2.type = 'sine';
      h2.frequency.setValueAtTime(fundamental * 2.76, now);
      const gh2 = ctx.createGain();
      gh2.gain.setValueAtTime(0.12, now);
      gh2.gain.exponentialRampToValueAtTime(0.0005, now + duration * 0.8);
      h2.connect(gh2);
      gh2.connect(masterGain);
      h2.start(now);
      h2.stop(now + duration * 0.8);

      // 4. Shimmering high harmonic (5.4x) - metallic silver resonance
      const h3 = ctx.createOscillator();
      h3.type = 'sine';
      h3.frequency.setValueAtTime(fundamental * 5.4, now);
      const gh3 = ctx.createGain();
      gh3.gain.setValueAtTime(0.06, now);
      gh3.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.6);
      h3.connect(gh3);
      gh3.connect(masterGain);
      h3.start(now);
      h3.stop(now + duration * 0.6);
    } catch (e) {
      console.warn('Audio synthesis error:', e);
    }
  }

  /**
   * Soft temple bell chime for generic Japa counter taps
   */
  public playTempleBell(frequency: number = 528): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {}
  }

  /**
   * Start or toggle continuous soothing singing bowl drone for meditation
   */
  public toggleContinuousSingingBowl(onStateChange?: (playing: boolean) => void): boolean {
    const ctx = this.getAudioContext();
    if (!ctx) return false;

    if (this.isContinuousPlaying) {
      this.stopContinuousSingingBowl();
      if (onStateChange) onStateChange(false);
      return false;
    }

    try {
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(0.15, now + 1.2);
      masterGain.connect(ctx.destination);
      this.continuousGain = masterGain;

      // Base Om drone (136.1 Hz Cosmic Om & 272.2 Hz)
      const baseFreq = 216; // Maha Mrityunjaya healing pitch
      const freqs = [baseFreq, baseFreq + 1.2, baseFreq * 2.76];

      this.continuousOscs = freqs.map((f, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(idx === 0 ? 0.12 : idx === 1 ? 0.1 : 0.04, now);
        osc.connect(subGain);
        subGain.connect(masterGain);

        osc.start(now);
        return osc;
      });

      this.isContinuousPlaying = true;
      if (onStateChange) onStateChange(true);
      return true;
    } catch {
      return false;
    }
  }

  public stopContinuousSingingBowl(): void {
    if (!this.isContinuousPlaying || !this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      if (this.continuousGain) {
        this.continuousGain.gain.linearRampToValueAtTime(0.001, now + 0.8);
      }
      setTimeout(() => {
        this.continuousOscs.forEach(o => {
          try { o.stop(); } catch {}
        });
        this.continuousOscs = [];
        this.isContinuousPlaying = false;
      }, 850);
    } catch {
      this.isContinuousPlaying = false;
    }
  }

  public isBowlPlaying(): boolean {
    return this.isContinuousPlaying;
  }
}

export const soundSynthesizer = new SoundSynthesizer();
