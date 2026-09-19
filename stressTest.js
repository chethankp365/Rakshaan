/* ==========================================================================
   RAKSHAAN — AUTONOMY STRESS TEST & FAILURE INJECTION CONTROLLER
   ========================================================================== */

class StressTest {
  constructor(simState) {
    this.simState = simState;
    this.bindButtons();
  }

  bindButtons() {
    const gpsBtn = document.getElementById('inject-gps-btn');
    if (gpsBtn) gpsBtn.addEventListener('click', () => this.simState.injectGPSLoss());

    const commBtn = document.getElementById('inject-comm-btn');
    if (commBtn) commBtn.addEventListener('click', () => this.simState.injectCommLoss());

    const hazardBtn = document.getElementById('inject-hazard-btn');
    if (hazardBtn) hazardBtn.addEventListener('click', () => this.simState.injectHazard());

    const batBtn = document.getElementById('inject-battery-btn');
    if (batBtn) batBtn.addEventListener('click', () => this.simState.injectLowBattery());
  }
}

window.StressTest = StressTest;
