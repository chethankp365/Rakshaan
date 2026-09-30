import * as THREE from 'three';

// Thermal Ironbow Colormap Shader Material
export const ThermalMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uHeatTemp: { value: 37.0 }, // Target temperature in Celsius
    uIsWarmBody: { value: 0 },   // 1 for survivor/responder, 0 for terrain/water
  },
  vertexShader: `
    varying vec3 vPosition;
    varying vec3 vNormal;
    void main() {
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uHeatTemp;
    uniform float uIsWarmBody;
    varying vec3 vPosition;
    varying vec3 vNormal;

    // Ironbow Palette function (Dark Purple -> Red -> Orange -> Yellow -> White)
    vec3 ironbow(float t) {
      t = clamp(t, 0.0, 1.0);
      vec3 color;
      color.r = smoothstep(0.0, 0.35, t);
      color.g = smoothstep(0.3, 0.75, t);
      color.b = smoothstep(0.7, 1.0, t) + (1.0 - smoothstep(0.0, 0.25, t)) * 0.4;
      return color;
    }

    void main() {
      float intensity = dot(vNormal, vec3(0.0, 1.0, 0.3)) * 0.5 + 0.5;
      float heat = 0.15 + intensity * 0.2;

      if (uIsWarmBody > 0.5) {
        // Human Body Heat (37C) - Bright White / Yellow Pulse
        heat = 0.85 + sin(uTime * 4.0) * 0.1;
      }

      vec3 thermalColor = ironbow(heat);
      gl_FragColor = vec4(thermalColor, 1.0);
    }
  `,
});

export class ThermalPass {
  public enabled: boolean = false;
  public updateTime(t: number) {
    ThermalMaterial.uniforms.uTime.value = t;
  }
}
