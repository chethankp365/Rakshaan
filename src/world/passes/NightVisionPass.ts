import * as THREE from 'three';

export const NightVisionMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    varying vec3 vNormal;

    void main() {
      float intensity = dot(vNormal, vec3(0.0, 1.0, 0.5)) * 0.5 + 0.5;
      vec3 greenTone = vec3(0.1, 0.95, 0.3) * (intensity + 0.2);

      // Scanline noise
      float scanline = sin(gl_FragCoord.y * 0.8 + uTime * 10.0) * 0.08;
      greenTone += vec3(scanline);

      gl_FragColor = vec4(greenTone, 1.0);
    }
  `,
});

export class NightVisionPass {
  public enabled: boolean = false;
  public updateTime(t: number) {
    NightVisionMaterial.uniforms.uTime.value = t;
  }
}
