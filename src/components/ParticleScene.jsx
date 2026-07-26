import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from 'framer-motion';
import * as THREE from 'three';

const PARTICLE_COUNT = 4000;

function createParticleData() {
  const spherePositions = new Float32Array(PARTICLE_COUNT * 3);
  const helixPositions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  
  const colorTop = new THREE.Color('#ff4d3d'); // Warm red/orange
  const colorBottom = new THREE.Color('#7d5bff'); // Cool blue/violet
  const tempColor = new THREE.Color();

  // Sphere: Fibonacci sphere for even distribution
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2; // y goes from 1 to -1
    const radius = Math.sqrt(1 - y * y);
    const theta = phi * i;

    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;

    // Scale sphere up a bit
    const sphereRadius = 2.5;
    spherePositions[i * 3] = x * sphereRadius;
    spherePositions[i * 3 + 1] = y * sphereRadius;
    spherePositions[i * 3 + 2] = z * sphereRadius;

    // Helix: Two intertwined strands + some scatter for volume
    const t = i / PARTICLE_COUNT; // 0 to 1
    const helixRadius = 1.2;
    const helixHeight = 15;
    const turns = 4;
    const angle = t * Math.PI * 2 * turns;
    const strandOffset = (i % 2 === 0) ? 0 : Math.PI;
    
    // Add some random scatter to make it look like a particle cloud rather than a thin line
    const scatterR = (Math.random() - 0.5) * 0.4;
    const scatterAngle = Math.random() * Math.PI * 2;

    const hX = Math.cos(angle + strandOffset) * helixRadius + Math.cos(scatterAngle) * scatterR;
    const hY = (t - 0.5) * helixHeight; // -7.5 to 7.5
    const hZ = Math.sin(angle + strandOffset) * helixRadius + Math.sin(scatterAngle) * scatterR;

    helixPositions[i * 3] = hX;
    helixPositions[i * 3 + 1] = -hY; // invert so t=0 is at the top
    helixPositions[i * 3 + 2] = hZ;

    // Colors: Gradient based on Y position (using sphere Y as base)
    // Map y from [-1, 1] to [0, 1]
    const colorT = (y + 1) / 2;
    tempColor.lerpColors(colorBottom, colorTop, colorT);
    colors[i * 3] = tempColor.r;
    colors[i * 3 + 1] = tempColor.g;
    colors[i * 3 + 2] = tempColor.b;
  }

  return { spherePositions, helixPositions, colors };
}

export function ParticleScene({ scrollYProgress }) {
  const pointsRef = useRef();
  
  const { spherePositions, helixPositions, colors } = useMemo(() => createParticleData(), []);
  
  // Custom geometry to hold both states and current state
  const geometryRef = useRef();
  const currentPositions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);

  useFrame((state, delta) => {
    if (!pointsRef.current || !geometryRef.current) return;

    // scrollYProgress is a MotionValue
    const scroll = scrollYProgress.get(); 
    
    // We want the morph to happen between scroll 0.1 and 0.4 (roughly hero to proof section)
    const morphTarget = Math.max(0, Math.min(1, (scroll - 0.1) * (1 / 0.3)));
    
    // Base rotation
    pointsRef.current.rotation.y += delta * 0.05;
    
    // Additive noise and lerp
    const time = state.clock.getElapsedTime();
    const positions = geometryRef.current.attributes.position.array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      
      // Lerp between sphere and helix
      const targetX = THREE.MathUtils.lerp(spherePositions[idx], helixPositions[idx], morphTarget);
      const targetY = THREE.MathUtils.lerp(spherePositions[idx + 1], helixPositions[idx + 1], morphTarget);
      const targetZ = THREE.MathUtils.lerp(spherePositions[idx + 2], helixPositions[idx + 2], morphTarget);
      
      // Add subtle noise/breathing
      const noise = Math.sin(time * 2 + i * 0.1) * 0.05 * (1 - morphTarget); // Less noise in helix form
      
      positions[idx] = targetX + (targetX > 0 ? noise : -noise);
      positions[idx + 1] = targetY + (targetY > 0 ? noise : -noise);
      positions[idx + 2] = targetZ + (targetZ > 0 ? noise : -noise);
    }
    
    geometryRef.current.attributes.position.needsUpdate = true;
    
    // Dolly camera: move forward as we morph
    const baseZ = 6;
    const helixZ = 5;
    state.camera.position.z = THREE.MathUtils.lerp(baseZ, helixZ, morphTarget);
    
    // Tilt towards mouse
    const mouseX = (state.pointer.x * Math.PI) / 10;
    const mouseY = (state.pointer.y * Math.PI) / 10;
    
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, mouseY, 0.05);
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, pointsRef.current.rotation.y + mouseX * 0.01, 0.05);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={currentPositions}
          itemSize={3}
          usage={THREE.DynamicDrawUsage}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </points>
  );
}
