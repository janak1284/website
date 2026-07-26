import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, extend, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

// Helper: 3D Simplex/Curl Noise GLSL
const glslNoise = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

vec3 curlNoise(vec3 p) {
  const float e = 0.1;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);

  vec3 p_x0 = vec3(snoise(p - dx), snoise(p - dx + vec3(12.3, 4.5, 6.7)), snoise(p - dx + vec3(7.8, 9.1, 2.3)));
  vec3 p_x1 = vec3(snoise(p + dx), snoise(p + dx + vec3(12.3, 4.5, 6.7)), snoise(p + dx + vec3(7.8, 9.1, 2.3)));
  vec3 p_y0 = vec3(snoise(p - dy), snoise(p - dy + vec3(12.3, 4.5, 6.7)), snoise(p - dy + vec3(7.8, 9.1, 2.3)));
  vec3 p_y1 = vec3(snoise(p + dy), snoise(p + dy + vec3(12.3, 4.5, 6.7)), snoise(p + dy + vec3(7.8, 9.1, 2.3)));
  vec3 p_z0 = vec3(snoise(p - dz), snoise(p - dz + vec3(12.3, 4.5, 6.7)), snoise(p - dz + vec3(7.8, 9.1, 2.3)));
  vec3 p_z1 = vec3(snoise(p + dz), snoise(p + dz + vec3(12.3, 4.5, 6.7)), snoise(p + dz + vec3(7.8, 9.1, 2.3)));

  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

  return normalize(vec3(x, y, z) / (2.0 * e));
}
`;

const FlowMaterial = shaderMaterial(
  { 
    uTime: 0, 
    uColor1: new THREE.Color('#8B5CF6'), 
    uColor2: new THREE.Color('#C026D3'),
    uPointer: new THREE.Vector3(0, 0, 0),
    uShapeA: 0,
    uShapeB: 0,
    uLerp: 0.0
  },
  // vertex shader
  `
  ${glslNoise}
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uPointer;
  uniform float uShapeA;
  uniform float uShapeB;
  uniform float uLerp;
  
  attribute vec3 aShape1;
  attribute vec3 aShape2;
  attribute vec3 aShape3;
  attribute vec3 aShape4;

  varying vec3 vColor;
  
  vec3 getShape(float index) {
    if (index < 0.5) return position;  // position acts as aShape0
    if (index < 1.5) return aShape1;
    if (index < 2.5) return aShape2;
    if (index < 3.5) return aShape3;
    if (index < 4.5) return aShape4;
    return position;
  }

  void main() {
    vec3 posA = getShape(uShapeA);
    vec3 posB = getShape(uShapeB);
    vec3 targetPos = mix(posA, posB, uLerp);

    // Flow displacement
    vec3 noisePos = targetPos * 2.0 + uTime * 0.4;
    vec3 curl = curlNoise(noisePos);
    
    // Scale curl effect based on shape (less wavy for grid, more wavy for sphere)
    float curlStrength = 0.15;
    if (uShapeA < 0.5 && uShapeB < 0.5) curlStrength = 0.08; // thin ring
    if (uShapeA > 3.5 && uShapeB > 3.5) curlStrength = 0.05; // grid
    
    vec3 finalPos = targetPos + curl * curlStrength;
    
    // Mouse Repel
    float distToPointer = distance(finalPos, uPointer);
    if (distToPointer < 1.5) {
      vec3 repelDir = normalize(finalPos - uPointer);
      float repelForce = (1.5 - distToPointer) * 0.4;
      finalPos += repelDir * repelForce;
    }
    
    // Color depends on displacement
    float mixFactor = (curl.x + curl.y + curl.z + 3.0) / 6.0;
    vColor = mix(uColor1, uColor2, mixFactor);

    vec4 modelViewPosition = modelViewMatrix * vec4(finalPos, 1.0);
    
    // Depth attenuation for point size. Larger base size to ensure visibility when shapes disperse!
    gl_PointSize = 15.0 * (1.0 / -modelViewPosition.z);
    
    // Clamp point size to prevent massive particles when passing through camera
    gl_PointSize = clamp(gl_PointSize, 1.0, 10.0);
    
    gl_Position = projectionMatrix * modelViewPosition;
  }
  `,
  // fragment shader
  `
  varying vec3 vColor;
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard; 
    
    float alpha = 1.0 - (dist * 2.0);
    alpha = pow(alpha, 2.0);
    
    gl_FragColor = vec4(vColor, alpha * 0.85);
  }
  `
);

extend({ FlowMaterial });

const PARTICLE_COUNT = 50000;
const SHAPE_COUNT = 10;
const SECTION_TO_SHAPE = [0, 1, 2, 3, 3, 3, 4, 4, 4, 1]; // Hero->0, About->1, etc.

function createShapeData() {
  const shape0 = new Float32Array(PARTICLE_COUNT * 3); // Thin Ring
  const shape1 = new Float32Array(PARTICLE_COUNT * 3); // Sphere
  const shape2 = new Float32Array(PARTICLE_COUNT * 3); // Clusters
  const shape3 = new Float32Array(PARTICLE_COUNT * 3); // Double Helix
  const shape4 = new Float32Array(PARTICLE_COUNT * 3); // Grid

  const phi = Math.PI * (3 - Math.sqrt(5));
  
  const clusters = [
    new THREE.Vector3(3, 2, 0), new THREE.Vector3(-3, 2, 1), new THREE.Vector3(2, -2, -2),
    new THREE.Vector3(-2, -3, 0), new THREE.Vector3(0, 0, 3), new THREE.Vector3(0, 4, -1)
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const idx = i * 3;
    const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2; // -1 to 1
    const radius = Math.sqrt(1 - y * y);
    const theta = phi * i;

    // SHAPE 0: Hero Thin Torus
    const R = 0.65;
    const r = 0.03;
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI * 2;
    const randomTubeRadius = Math.random() * r;
    shape0[idx] = (R + randomTubeRadius * Math.cos(v)) * Math.cos(u) - 0.85;
    shape0[idx + 1] = (R + randomTubeRadius * Math.cos(v)) * Math.sin(u);
    shape0[idx + 2] = randomTubeRadius * Math.sin(v);

    // SHAPE 1: Sphere (Shader will deform this with Curl Noise)
    const sphere_r = 6.0;
    shape1[idx] = Math.cos(theta) * radius * sphere_r;
    shape1[idx + 1] = y * sphere_r;
    shape1[idx + 2] = Math.sin(theta) * radius * sphere_r;

    // SHAPE 2: Domain Clusters
    const cluster = clusters[i % 6];
    const c_theta = Math.random() * Math.PI * 2;
    const c_phi = Math.acos((Math.random() * 2) - 1);
    const c_r = Math.random() * 0.8 + (Math.random() > 0.95 ? Math.random() * 2 : 0);
    shape2[idx] = cluster.x * 1.5 + Math.sin(c_phi) * Math.cos(c_theta) * c_r;
    shape2[idx + 1] = cluster.y * 1.5 + Math.sin(c_phi) * Math.sin(c_theta) * c_r;
    shape2[idx + 2] = cluster.z * 1.5 + Math.cos(c_phi) * c_r;

    // SHAPE 3: Thick Double Helix
    const h_t = i / PARTICLE_COUNT;
    const h_y = (h_t - 0.5) * 16; 
    const strand = (i % 2 === 0) ? 0 : Math.PI;
    const h_ang = h_y * 1.5; 
    const h_rad = 2.5;
    const cx = Math.cos(h_ang + strand) * h_rad;
    const cz = Math.sin(h_ang + strand) * h_rad;
    const thickness = 0.8; 
    const t_theta = Math.random() * 2.0 * Math.PI;
    const t_phi = Math.acos(2.0 * Math.random() - 1.0);
    const t_r = Math.cbrt(Math.random()) * thickness; 
    shape3[idx] = cx + Math.sin(t_phi) * Math.cos(t_theta) * t_r;
    shape3[idx + 1] = -h_y + Math.cos(t_phi) * t_r; 
    shape3[idx + 2] = cz + Math.sin(t_phi) * Math.sin(t_theta) * t_r;

    // SHAPE 4: Wavy Data Grid
    const gridDim = Math.ceil(Math.sqrt(PARTICLE_COUNT));
    const gx = (i % gridDim);
    const gy = Math.floor(i / gridDim);
    const grid_x = (gx / gridDim - 0.5) * 20 + (Math.random() - 0.5) * 0.2;
    const grid_y = (gy / gridDim - 0.5) * 20 + (Math.random() - 0.5) * 0.2;
    const grid_z = Math.sin(grid_x * 0.5) * Math.cos(grid_y * 0.5) * 2;
    // Rotated to lie flat
    shape4[idx] = grid_x; 
    shape4[idx + 1] = grid_z - 3; 
    shape4[idx + 2] = grid_y;
  }

  return { shape0, shape1, shape2, shape3, shape4 };
}

export function FlowFieldShader({ scrollYProgress }) {
  const materialRef = useRef();
  const groupRef = useRef();
  const sectionOffsets = useRef([]);
  const { camera } = useThree();
  const vec3 = new THREE.Vector3();

  const { shape0, shape1, shape2, shape3, shape4 } = useMemo(() => createShapeData(), []);

  useEffect(() => {
    const updateOffsets = () => {
      const sections = document.querySelectorAll('section');
      const offsets = [];
      sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        offsets.push(rect.top + window.scrollY);
      });
      sectionOffsets.current = offsets;
    };
    
    updateOffsets();
    const interval = setInterval(updateOffsets, 1000);
    window.addEventListener('resize', updateOffsets);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateOffsets);
    };
  }, []);

  useFrame((state, delta) => {
    if (!materialRef.current || !groupRef.current) return;

    const time = state.clock.elapsedTime;
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const triggerOffset = scrollY + (viewportHeight / 2);
    
    const offsets = sectionOffsets.current;
    let currentSectionIdx = 0;
    let nextSectionIdx = 0;
    let lerpFactor = 0;

    if (offsets.length === SHAPE_COUNT) {
      for (let i = 0; i < offsets.length; i++) {
        if (triggerOffset >= offsets[i]) {
          currentSectionIdx = i;
        }
      }
      nextSectionIdx = Math.min(SHAPE_COUNT - 1, currentSectionIdx + 1);
      
      if (currentSectionIdx !== nextSectionIdx) {
        const start = offsets[currentSectionIdx];
        const end = offsets[nextSectionIdx];
        const sectionHeight = end - start;
        
        let progress = (currentSectionIdx === 0) 
          ? scrollY / (sectionHeight || 1) 
          : (triggerOffset - start) / (sectionHeight || 1);
        
        progress = Math.max(0, Math.min(1, progress));
        
        // Fluid transition logic
        if (progress > 0.4) {
          const p = (progress - 0.4) / 0.6;
          lerpFactor = p * p * (3 - 2 * p);
        } else {
          lerpFactor = 0.0;
        }
      }
    } else {
      // Fallback mapping if DOM isn't ready
      const scroll = scrollYProgress.get(); 
      const sectionFloat = Math.max(0, Math.min(SHAPE_COUNT - 1.001, scroll * SHAPE_COUNT));
      currentSectionIdx = Math.floor(sectionFloat);
      nextSectionIdx = Math.min(SHAPE_COUNT - 1, currentSectionIdx + 1);
      
      const rawLerp = sectionFloat - currentSectionIdx;
      let holdThreshold = 0.4;
      if (currentSectionIdx === 0) holdThreshold = 0.8;
      
      if (rawLerp > holdThreshold) {
        const p = (rawLerp - holdThreshold) / (1 - holdThreshold);
        lerpFactor = p * p * (3 - 2 * p);
      } else {
        lerpFactor = 0.0;
      }
    }

    // Map section index to actual shape ID
    const shapeA = SECTION_TO_SHAPE[currentSectionIdx];
    const shapeB = SECTION_TO_SHAPE[nextSectionIdx];

    // Pointer unprojection for Repel
    vec3.set(state.pointer.x, state.pointer.y, 0.5);
    vec3.unproject(camera);
    vec3.sub(camera.position).normalize();
    const distanceToZ0 = (0 - camera.position.z) / vec3.z;
    const pointer3DWorld = new THREE.Vector3().copy(camera.position).add(vec3.multiplyScalar(distanceToZ0));
    const pointerLocal = groupRef.current.worldToLocal(pointer3DWorld.clone());

    // Group Rotation for 3D effect (similar to old ParticleScene)
    const mouseX = (state.pointer.x * Math.PI) / 10;
    const mouseY = (state.pointer.y * Math.PI) / 10;
    
    let scrollRotationOffset = 0;
    if (offsets.length > 5 && currentSectionIdx >= 5) {
      const start = offsets[5];
      const end = offsets[6] || (start + viewportHeight * 2);
      let localProgress = (triggerOffset - start) / ((end - start) || 1);
      localProgress = Math.max(0, Math.min(1, localProgress));
      scrollRotationOffset = localProgress * Math.PI * 4;
    }

    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      (time * 0.05) + scrollRotationOffset + mouseX,
      4,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      mouseY + Math.sin(time * 0.5) * 0.05,
      4,
      delta
    );

    // Update Uniforms
    materialRef.current.uTime = time;
    materialRef.current.uShapeA = shapeA;
    materialRef.current.uShapeB = shapeB;
    materialRef.current.uLerp = lerpFactor;
    materialRef.current.uPointer.copy(pointerLocal);
  });

  return (
    <group ref={groupRef} position={[0, 0.35, 0]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={shape0.length / 3} array={shape0} itemSize={3} />
          <bufferAttribute attach="attributes-aShape1" count={shape1.length / 3} array={shape1} itemSize={3} />
          <bufferAttribute attach="attributes-aShape2" count={shape2.length / 3} array={shape2} itemSize={3} />
          <bufferAttribute attach="attributes-aShape3" count={shape3.length / 3} array={shape3} itemSize={3} />
          <bufferAttribute attach="attributes-aShape4" count={shape4.length / 3} array={shape4} itemSize={3} />
        </bufferGeometry>
        <flowMaterial ref={materialRef} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}
