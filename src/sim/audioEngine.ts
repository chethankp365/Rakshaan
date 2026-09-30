// Synthesized Web Audio API Sound Engine (100% Code Generated)
class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private rotorOsc1: OscillatorNode | null = null;
  private rotorOsc2: OscillatorNode | null = null;
  private masterGain: GainNode | null = null;
  private windGain: GainNode | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.15;
      this.masterGain.connect(this.ctx.destination);

      // --- ROTOR HUM SYNTHESIZER ---
      this.rotorOsc1 = this.ctx.createOscillator();
      this.rotorOsc2 = this.ctx.createOscillator();

      this.rotorOsc1.type = 'sawtooth';
      this.rotorOsc2.type = 'sine';

      this.rotorOsc1.frequency.value = 140; // 140Hz quadcopter rotor hum
      this.rotorOsc2.frequency.value = 70;  // Sub-harmonic bass

      const rotorGain = this.ctx.createGain();
      rotorGain.gain.value = 0.08;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 450;

      this.rotorOsc1.connect(rotorGain);
      this.rotorOsc2.connect(rotorGain);
      rotorGain.connect(filter);
      filter.connect(this.masterGain);

      this.rotorOsc1.start();
      this.rotorOsc2.start();

      // --- NOISE GENERATOR FOR WIND & RAIN ---
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Wind Filter
      const windFilter = this.ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.value = 320;
      windFilter.Q.value = 3.0;

      this.windGain = this.ctx.createGain();
      this.windGain.gain.value = 0.04;

      whiteNoise.connect(windFilter);
      windFilter.connect(this.windGain);
      this.windGain.connect(this.masterGain);

      whiteNoise.start();
    } catch (e) {
      console.warn('AudioContext initialization deferred until user interaction', e);
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      if (this.ctx.state === 'suspended' && !muted) {
        this.ctx.resume();
      }
      this.masterGain.gain.value = muted ? 0 : 0.15;
    }
  }

  public updateRotorSpeed(speedRatio: number) {
    if (!this.rotorOsc1 || !this.rotorOsc2) return;
    const baseFreq = 120 + speedRatio * 80;
    this.rotorOsc1.frequency.setTargetAtTime(baseFreq, this.ctx?.currentTime || 0, 0.1);
    this.rotorOsc2.frequency.setTargetAtTime(baseFreq / 2, this.ctx?.currentTime || 0, 0.1);
  }

  public playBlip(freq = 880, duration = 0.08) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // ignore blip error
    }
  }

  public playSirenAlert() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.3);
      osc.frequency.linearRampToValueAtTime(440, now + 0.6);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(now + 0.6);
    } catch (e) {
      // ignore alert error
    }
  }
}

export const audioEngine = new AudioEngine();
