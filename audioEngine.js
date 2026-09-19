/* ==========================================================================
   RAKSHAAN — PROCEDURAL WEB AUDIO SYNTHESIZER ENGINE
   ========================================================================== */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true; // Default muted until user interacts / toggles
    this.isInitialized = false;

    // Drone rotor sound oscillators
    this.rotorOsc1 = null;
    this.rotorOsc2 = null;
    this.rotorGain = null;

    // Wind noise buffer source
    this.windGain = null;

    this.initOnInteraction();
  }

  initOnInteraction() {
    const enableAudio = () => {
      if (!this.isInitialized) {
        this.initAudioContext();
        window.removeEventListener('click', enableAudio);
        window.removeEventListener('keydown', enableAudio);
      }
    };
    window.addEventListener('click', enableAudio);
    window.addEventListener('keydown', enableAudio);
  }

  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.isInitialized = true;
      this.setupRotorHum();
      this.setupWindNoise();
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  setupRotorHum() {
    if (!this.ctx) return;
    try {
      // Dual oscillator hum simulating quadcopter motor rotation (approx 75-130 Hz base)
      this.rotorOsc1 = this.ctx.createOscillator();
      this.rotorOsc2 = this.ctx.createOscillator();
      this.rotorGain = this.ctx.createGain();

      this.rotorOsc1.type = 'sawtooth';
      this.rotorOsc2.type = 'sine';

      this.rotorOsc1.frequency.setValueAtTime(85, this.ctx.currentTime);
      this.rotorOsc2.frequency.setValueAtTime(170, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      this.rotorOsc1.connect(filter);
      this.rotorOsc2.connect(filter);
      filter.connect(this.rotorGain);

      this.rotorGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.ctx.currentTime);
      this.rotorGain.connect(this.ctx.destination);

      this.rotorOsc1.start();
      this.rotorOsc2.start();
    } catch (e) {
      console.warn('Rotor audio setup error:', e);
    }
  }

  setupWindNoise() {
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(250, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      this.windGain = this.ctx.createGain();
      this.windGain.gain.setValueAtTime(this.isMuted ? 0 : 0.03, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.windGain);
      this.windGain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch (e) {
      console.warn('Wind audio setup error:', e);
    }
  }

  updateDroneSpeed(speedKmH) {
    if (!this.ctx || !this.isInitialized || this.isMuted) return;
    const speedRatio = Math.min(1.8, Math.max(0.5, speedKmH / 15));
    const targetFreq1 = 85 * speedRatio;
    const targetFreq2 = 170 * speedRatio;

    if (this.rotorOsc1 && this.rotorOsc2) {
      this.rotorOsc1.frequency.setTargetAtTime(targetFreq1, this.ctx.currentTime, 0.1);
      this.rotorOsc2.frequency.setTargetAtTime(targetFreq2, this.ctx.currentTime, 0.1);
    }
  }

  playAlertTone() {
    if (!this.ctx || this.isMuted) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.25); // A4

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {
      console.warn('Audio alert tone error:', e);
    }
  }

  playTargetLockChime() {
    if (!this.ctx || this.isMuted) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.1); // A5
      osc.frequency.setValueAtTime(1174.66, this.ctx.currentTime + 0.2); // D6

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch (e) {
      console.warn('Audio target lock chime error:', e);
    }
  }

  playClick() {
    if (!this.ctx || this.isMuted) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    const rotorVolume = this.isMuted ? 0 : 0.08;
    const windVolume = this.isMuted ? 0 : 0.03;

    if (this.rotorGain && this.ctx) {
      this.rotorGain.gain.setTargetAtTime(rotorVolume, this.ctx.currentTime, 0.05);
    }
    if (this.windGain && this.ctx) {
      this.windGain.gain.setTargetAtTime(windVolume, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }
}

window.audioEngine = new AudioEngine();
