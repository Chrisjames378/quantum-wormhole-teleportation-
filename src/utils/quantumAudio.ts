/**
 * Quantum Audio Synthesizer utilizing Web Audio API
 * Generates harmonic cosmic chimes, warp resonance, and quantum state clicks
 */

class QuantumAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy initialize on first user gesture
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * High-fidelity teleportation success chord
   * Multi-harmonic pentatonic chime with smooth decay
   */
  public playHighFidelityChime(fidelity = 0.95) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Frequencies for a shimmering celestial major 9th chord (C5, E5, G5, B5, D6)
      const baseFreq = 523.25; // C5
      const ratios = [1, 1.25, 1.5, 1.875, 2.25];

      ratios.forEach((ratio, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = index % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(baseFreq * ratio * (0.98 + fidelity * 0.04), now);

        // Exponential decay envelope
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.06 / (index + 1), now + 0.02 + index * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + index * 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + index * 0.03);
        osc.stop(now + 1.6);
      });
    } catch {
      // Audio playback silently guarded
    }
  }

  /**
   * Fast tab slide / click cue
   */
  public playSlideClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignored
    }
  }

  /**
   * Wormhole negative-energy shockwave pulse sound
   */
  public playWormholeShockwave() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.5);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + 0.5);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch {
      // Ignored
    }
  }
}

export const quantumAudio = new QuantumAudioEngine();
