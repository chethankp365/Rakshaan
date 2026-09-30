import * as THREE from 'three';

// LiDAR Pointcloud Sweeping Depth Material
export const LidarMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uScanRadius: { value: 30.0 },
  },
  vertexShader: `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uScanRadius;
    varying vec3 vWorldPosition;

    void main() {
      float dist = length(vWorldPosition.xz);
      float sweep = mod(dist - uTime * 25.0, uScanRadius);
      float scanLine = smoothstep(2.0, 0.0, sweep);

      // Depth elevation color: near = cyan/green, high = orange/magenta
      float heightNorm = clamp((vWorldPosition.y + 5.0) / 40.0, 0.0, 1.0);
      vec3 lidarColor = mix(vec3(0.0, 0.8, 1.0), vec3(1.0, 0.4, 0.0), heightNorm);

      // Add intense cyan scan wave overlay
      lidarColor += vec3(0.2, 1.0, 0.8) * scanLine * 2.0;

      // Grid dot matrix pattern
      vec2 grid = abs(fract(vWorldPosition.xz * 0.5 - 0.5) - 0.5);
      float dots = smoothstep(0.1, 0.05, length(grid));
      lidarColor += vec3(dots * 0.3);

      gl_FragColor = vec4(lidarColor, 0.85);
    }
  `,
  transparent: true,
});

export class LidarPass {
  public enabled: boolean = false;
  public updateTime(t: number) {
    LidarMaterial.uniforms.uTime.value = t;
  }
}
