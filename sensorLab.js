/* ==========================================================================
   RAKSHAAN — 3D SENSOR LAB VISUALIZATION HUB
   ========================================================================== */

class SensorLab {
  constructor(scene3D, cameraDirector) {
    this.scene3D = scene3D;
    this.director = cameraDirector;
    this.activeSensor = 'RGB';
  }

  activateSensor(sensorName) {
    this.activeSensor = sensorName;
    this.director.setMode('SENSOR_VIEW');

    const state = window.simState;
    switch (sensorName) {
      case 'RGB':
        state.drone.sensors.rgb = true;
        state.addEvent('info', 'SENSOR LAB: RGB Optical 4K Camera Frustum Active.');
        break;
      case 'THERMAL':
        state.drone.sensors.thermal = true;
        state.addEvent('info', 'SENSOR LAB: Thermal FLIR Radiometric Sensor Heat Field Active.');
        break;
      case 'LIDAR':
        state.drone.sensors.lidar = true;
        state.addEvent('info', 'SENSOR LAB: LiDAR 360° Laser Point Cloud Scanning Active.');
        break;
      case 'GPS':
        state.injectGPSLoss();
        break;
      case 'COMM':
        state.injectCommLoss();
        break;
      default:
        break;
    }
  }
}

window.SensorLab = SensorLab;
