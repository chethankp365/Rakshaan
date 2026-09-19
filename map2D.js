/* ==========================================================================
   RAKSHAAN — 2D COMMAND MAP CANVAS RENDERER
   ========================================================================== */

class Map2D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.radarAngle = 0;
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.clientWidth;
    this.canvas.height = parent.clientHeight;
  }

  render(simState) {
    if (!this.canvas || this.canvas.classList.contains('hidden-canvas')) return;
    this.resize();

    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    // Background Dark Grid
    ctx.fillStyle = '#07090e';
    ctx.fillRect(0, 0, w, h);

    // Map Coordinates Offset & Scale (-60 to +60 in 3D world space)
    const scale = Math.min(w, h) / 130;
    const cx = w / 2;
    const cy = h / 2;

    const toScreenX = (worldX) => cx + worldX * scale;
    const toScreenY = (worldZ) => cy + worldZ * scale;

    // 1. Grid Coverage Cells
    const gridCellSize = 5 * scale;
    ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';

    for (let r = 0; r < 20; r++) {
      for (let c = 0; c < 20; c++) {
        const worldX = (r - 10) * 5;
        const worldZ = (c - 10) * 5;
        const sx = toScreenX(worldX);
        const sy = toScreenY(worldZ);

        if (simState.coverageMatrix[r][c] === 1) {
          ctx.fillRect(sx, sy, gridCellSize, gridCellSize);
        }
        ctx.strokeRect(sx, sy, gridCellSize, gridCellSize);
      }
    }

    // 2. Flight Path Line
    if (simState.activePath && simState.activePath.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);

      simState.activePath.forEach((p, idx) => {
        const sx = toScreenX(p.x);
        const sy = toScreenY(p.z);
        if (idx === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 3. Hazards (2D Circles)
    simState.hazards.forEach(hz => {
      if (!hz.active) return;
      const hx = toScreenX(hz.x);
      const hy = toScreenY(hz.z);
      const hr = hz.radius * scale;

      ctx.beginPath();
      ctx.arc(hx, hy, hr, 0, Math.PI * 2);
      ctx.fillStyle = hz.type === 'FIRE' ? 'rgba(244, 63, 94, 0.25)' : 'rgba(0, 240, 255, 0.2)';
      ctx.strokeStyle = hz.type === 'FIRE' ? '#f43f5e' : '#00f0ff';
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.font = '10px Rajdhani';
      ctx.fillText(hz.name, hx - 20, hy - hr - 4);
    });

    // 4. Survivors (2D Icons & Blips)
    simState.survivors.forEach(s => {
      if (s.status === 'UNKNOWN') return;
      const sx = toScreenX(s.x);
      const sy = toScreenY(s.z);
      const color = s.priority === 'CRITICAL' ? '#f43f5e' : (s.priority === 'HIGH' ? '#f59e0b' : '#10b981');

      ctx.beginPath();
      ctx.arc(sx, sy, 8, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px Orbitron';
      ctx.fillText(`${s.id} (${s.priority})`, sx + 12, sy + 4);
    });

    // 5. Rescue Base
    const bx = toScreenX(simState.rescueBase.x);
    const by = toScreenY(simState.rescueBase.z);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(bx - 6, by - 6, 12, 12);
    ctx.fillStyle = '#fff';
    ctx.font = '10px Rajdhani';
    ctx.fillText('RESCUE BASE', bx - 25, by - 10);

    // Moving Rescue Team Unit
    if (simState.rescueTeam.active) {
      const rx = toScreenX(simState.rescueTeam.x);
      const ry = toScreenY(simState.rescueTeam.z);
      ctx.beginPath();
      ctx.arc(rx, ry, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#a855f7';
      ctx.fill();
      ctx.fillText('RESCUE TEAM ALFA', rx + 10, ry + 3);
    }

    // 6. Primary Drone RAKSHAAN-01
    const dx = toScreenX(simState.drone.x);
    const dy = toScreenY(simState.drone.z);

    // Radar Sweep
    this.radarAngle += 0.05;
    ctx.beginPath();
    ctx.moveTo(dx, dy);
    ctx.arc(dx, dy, 35 * scale, this.radarAngle, this.radarAngle + 0.4);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
    ctx.fill();

    // Drone Quadcopter Icon
    ctx.save();
    ctx.translate(dx, dy);
    ctx.rotate((simState.drone.heading * Math.PI) / 180);

    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(-6, -6, 12, 12);

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-10, -10); ctx.lineTo(10, 10);
    ctx.moveTo(10, -10); ctx.lineTo(-10, 10);
    ctx.stroke();

    ctx.restore();

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 11px JetBrains Mono';
    ctx.fillText(`RAKSHAAN-01 ALPHA [${Math.round(simState.drone.altitude)}m]`, dx + 12, dy - 8);

    // 7. Scout Drone RAKSHAAN-02
    if (simState.droneBeta) {
      const b2x = toScreenX(simState.droneBeta.x);
      const b2y = toScreenY(simState.droneBeta.z);

      ctx.save();
      ctx.translate(b2x, b2y);
      ctx.rotate((simState.droneBeta.heading * Math.PI) / 180);

      ctx.fillStyle = '#ff9f0a';
      ctx.fillRect(-5, -5, 10, 10);

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-8, -8); ctx.lineTo(8, 8);
      ctx.moveTo(8, -8); ctx.lineTo(-8, 8);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#ff9f0a';
      ctx.font = 'bold 10px JetBrains Mono';
      ctx.fillText(`RAKSHAAN-02 SCOUT [${Math.round(simState.droneBeta.altitude)}m]`, b2x + 10, b2y - 6);
    }
  }
}

window.Map2D = Map2D;
