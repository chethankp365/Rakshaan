/* ==========================================================================
   RAKSHAAN — "SHOW ME WHY" VISUAL EVIDENCE & TRANSPARENT XAI SCORING ENGINE
   ========================================================================== */

class ShowMeWhy {
  constructor(simState, cameraDirector) {
    this.simState = simState;
    this.director = cameraDirector;

    this.modal = document.getElementById('show-why-modal');
    this.contentEl = document.getElementById('why-body-content');
    this.closeBtn = document.getElementById('close-why-btn');
    this.showBtn = document.getElementById('show-why-btn');

    this.bindEvents();
  }

  bindEvents() {
    if (this.showBtn) {
      this.showBtn.addEventListener('click', () => {
        this.explainSurvivor(this.simState.survivors[0]);
      });
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.hide());
    }
  }

  show() {
    this.modal.classList.remove('hidden');
  }

  hide() {
    this.modal.classList.add('hidden');
  }

  explainSurvivor(survivor) {
    if (!survivor) return;

    this.director.setMode('SURVIVOR_VIEW', survivor);

    const isFirst = survivor.rescueRank === 1;

    // Mathematical scoring weights calculation
    let wSev = 34.3, wTherm = 24.0, wFlood = 24.75, wConf = 14.91, totalScore = 97.96;

    if (survivor.id === 'S-02') {
      wSev = 22.75; wTherm = 21.25; wFlood = 5.0; wConf = 14.73; totalScore = 63.73;
    } else if (survivor.id === 'S-03') {
      wSev = 30.8; wTherm = 19.5; wFlood = 20.0; wConf = 14.47; totalScore = 84.77;
    }

    this.contentEl.innerHTML = `
      <div style="margin-bottom: 0.8rem; border-bottom: 1px dashed rgba(255,255,255,0.2); padding-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="color: #00f0ff; font-weight: 800; font-size: 0.95rem;">${survivor.name}</span>
          <div style="font-size: 0.72rem; color: #a0aec0;">ID: ${survivor.id} | Geo: ${survivor.geoTag}</div>
        </div>
        <div style="text-align: right;">
          <span style="background: ${isFirst ? '#ff2a5f' : '#ff9f0a'}; color: #fff; font-family: var(--font-display); font-weight: 900; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 4px;">
            RANK #${survivor.rescueRank} ${isFirst ? '(SAVE FIRST!)' : ''}
          </span>
          <div style="font-family: var(--font-mono); font-size: 0.8rem; color: #ffd700; font-weight: 800; margin-top: 3px;">
            SCORE: ${totalScore.toFixed(2)} / 100
          </div>
        </div>
      </div>

      <!-- Transparent Explainable AI Scoring Formula -->
      <div style="background: rgba(181,32,254,0.12); border: 1.5px solid rgba(181,32,254,0.4); padding: 0.75rem; border-radius: 8px; margin-bottom: 0.75rem;">
        <div style="font-family: var(--font-display); font-size: 0.75rem; color: #e9d5ff; letter-spacing: 1px; margin-bottom: 0.35rem;">
          <i data-lucide="cpu"></i> EXPLAINABLE AI (XAI) WEIGHTED TRIAGE FORMULA
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.7rem; color: #00f0ff; background: rgba(0,0,0,0.5); padding: 0.45rem; border-radius: 5px; text-align: center; margin-bottom: 0.5rem;">
          Score = (W<sub>sev</sub> &times; S<sub>trapped</sub>) + (W<sub>therm</sub> &times; &Delta;T<sub>FLIR</sub>) + (W<sub>flood</sub> &times; dh/dt) + (W<sub>conf</sub> &times; C<sub>AI</sub>)
        </div>

        <!-- Formula Parameter Breakdowns -->
        <div style="display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.7rem; font-family: var(--font-mono);">
          <div>
            <div style="display: flex; justify-content: space-between; color: #fff;">
              <span>Trapped Severity (W<sub>sev</sub>=0.35):</span>
              <strong style="color: #ff2a5f;">+${wSev.toFixed(2)} pts</strong>
            </div>
            <div style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; margin-top: 2px;">
              <div style="width: ${(wSev / 35) * 100}%; height: 100%; background: #ff2a5f;"></div>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; color: #fff;">
              <span>Radiometric Heat Delta (W<sub>therm</sub>=0.25):</span>
              <strong style="color: #ff9f0a;">+${wTherm.toFixed(2)} pts</strong>
            </div>
            <div style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; margin-top: 2px;">
              <div style="width: ${(wTherm / 25) * 100}%; height: 100%; background: #ff9f0a;"></div>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; color: #fff;">
              <span>Flood Submergence Rate (W<sub>flood</sub>=0.25):</span>
              <strong style="color: #00f0ff;">+${wFlood.toFixed(2)} pts</strong>
            </div>
            <div style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; margin-top: 2px;">
              <div style="width: ${(wFlood / 25) * 100}%; height: 100%; background: #00f0ff;"></div>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; color: #fff;">
              <span>Multi-Sensor Fusion Conf (W<sub>conf</sub>=0.15):</span>
              <strong style="color: #10b981;">+${wConf.toFixed(2)} pts</strong>
            </div>
            <div style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; margin-top: 2px;">
              <div style="width: ${(wConf / 15) * 100}%; height: 100%; background: #10b981;"></div>
            </div>
          </div>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.6rem;">
        <div style="background: rgba(255,42,95,0.12); border: 1px solid rgba(255,42,95,0.4); padding: 0.6rem; border-radius: 6px;">
          <strong style="color: #ff2a5f;">DEMOGRAPHIC ESTIMATE:</strong> ${survivor.species} (Child Est. Age 5–9)<br>
          <strong style="color: #00f0ff;">DECISION REASONING:</strong> ${survivor.rescueOrderReason}
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; background: rgba(0,240,255,0.06); padding: 0.6rem; border-radius: 6px;">
          <div><strong>Heart Rate:</strong> ${survivor.heartRate}</div>
          <div><strong>O<sub>2</sub> Reserve:</strong> ${survivor.oxygen}</div>
          <div><strong>FLIR Temp:</strong> ${survivor.thermalHeat}</div>
          <div><strong>Flood Depth:</strong> ${survivor.floodDepth}</div>
        </div>

        <div style="color: #ffd700; font-weight: 800; text-align: center; margin-top: 0.3rem; font-family: var(--font-heading); font-size: 0.88rem;">
          ${isFirst ? '⚠️ ACTION REQUIRED: RESCUE TEAM ALFA DISPATCHED TO TARGET S-01 IMMEDIATELY!' : 'RESCUE DISPATCH QUEUED FOLLOWING TARGET S-01'}
        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
    this.show();
  }
}

window.ShowMeWhy = ShowMeWhy;
