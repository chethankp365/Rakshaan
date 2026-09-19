/* ==========================================================================
   RAKSHAAN — MISSION PERFORMANCE SCORECARD MODAL ENGINE & EXPORT CONTROLLER
   ========================================================================== */

class Scorecard {
  constructor() {
    this.modal = document.getElementById('scorecard-modal');
    this.closeBtn = document.getElementById('close-scorecard-btn');
    this.actionBtn = document.getElementById('close-scorecard-action');
    this.printBtn = document.getElementById('print-report-btn');

    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.hide());
    if (this.actionBtn) this.actionBtn.addEventListener('click', () => this.hide());
    if (this.printBtn) {
      this.printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  show() {
    if (this.modal) this.modal.classList.remove('hidden');
  }

  hide() {
    if (this.modal) this.modal.classList.add('hidden');
  }
}

window.Scorecard = Scorecard;
