/* ==========================================================================
   RAKSHAAN — 4D TIME-BASED MISSION REPLAY ENGINE
   ========================================================================== */

class Replay4D {
  constructor(simState, scene3D) {
    this.simState = simState;
    this.scene3D = scene3D;
    this.isPlaying = false;
    this.timer = null;

    this.slider = document.getElementById('timeline-slider');
    this.currentTimeEl = document.getElementById('timeline-current-time');
    this.playBtn = document.getElementById('replay-play-btn');

    this.bindEvents();
  }

  bindEvents() {
    if (this.slider) {
      this.slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.seekTo(val);
      });
    }

    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => {
        if (this.isPlaying) this.pause();
        else this.play();
      });
    }

    const speedBtns = document.querySelectorAll('.speed-btn');
    speedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        speedBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.simState.replaySpeed = parseInt(btn.dataset.speed, 10);
      });
    });
  }

  seekTo(seconds) {
    this.simState.replayTime = seconds;
    this.simState.missionTime = seconds;
    this.currentTimeEl.textContent = this.simState.formatTime(seconds);

    // Re-evaluate target detection flags according to timeline
    this.simState.survivors[0].detected = seconds >= 12;
    this.simState.survivors[0].status = seconds >= 12 ? 'CONFIRMED' : 'UNKNOWN';

    this.simState.survivors[1].detected = seconds >= 28;
    this.simState.survivors[1].status = seconds >= 28 ? 'CONFIRMED' : 'UNKNOWN';

    this.simState.survivors[2].detected = seconds >= 50;
    this.simState.survivors[2].status = seconds >= 50 ? 'CONFIRMED' : 'UNKNOWN';

    // Reconstruct snapshot if available
    const snapshot = this.simState.historySnapshots.find(s => s.time === Math.floor(seconds));
    if (snapshot) {
      this.simState.drone = { ...snapshot.drone };
      if (snapshot.droneBeta) this.simState.droneBeta = { ...snapshot.droneBeta };
      this.simState.status = snapshot.status;
      this.simState.searchedPercent = snapshot.searchedPercent;
    }

    this.simState.notify();
  }

  play() {
    this.isPlaying = true;
    this.playBtn.innerHTML = '<i data-lucide="pause"></i>';
    if (window.lucide) lucide.createIcons();

    clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.simState.missionTime >= 120) {
        this.pause();
        return;
      }
      const nextTime = Math.min(120, this.simState.missionTime + 1 * this.simState.replaySpeed);
      this.seekTo(nextTime);
      this.slider.value = nextTime;
    }, 1000);
  }

  pause() {
    this.isPlaying = false;
    clearInterval(this.timer);
    this.playBtn.innerHTML = '<i data-lucide="play"></i>';
    if (window.lucide) lucide.createIcons();
  }
}

window.Replay4D = Replay4D;
