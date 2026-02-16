
class AudioService {
  private context: AudioContext | null = null;

  init() {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playWoodenFish() {
    if (!this.context) this.init();
    if (!this.context || this.context.state === 'suspended') {
      this.context?.resume();
    }
    if (!this.context) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    const filter = this.context.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.context.currentTime + 0.1);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, this.context.currentTime);

    gain.gain.setValueAtTime(0.4, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.context.destination);

    osc.start();
    osc.stop(this.context.currentTime + 0.3);
  }

  playDing() {
    if (!this.context) this.init();
    if (!this.context) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.context.currentTime + 0.2);

    gain.gain.setValueAtTime(0.2, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.start();
    osc.stop(this.context.currentTime + 0.4);
  }

  playError() {
    if (!this.context) this.init();
    if (!this.context) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, this.context.currentTime);
    
    gain.gain.setValueAtTime(0.05, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.start();
    osc.stop(this.context.currentTime + 0.15);
  }
}

export const audioService = new AudioService();
