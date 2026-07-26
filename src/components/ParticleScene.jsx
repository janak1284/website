import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';

const PARTICLE_COUNT = 4000;
const dummy = new THREE.Object3D();
const tempColor = new THREE.Color();
const colorTop = new THREE.Color('#8B5CF6'); // Primary purple
const colorBottom = new THREE.Color('#C026D3'); // Highlight magenta
const colorDeep = new THREE.Color('#4C1D95'); // Deep indigo

function createParticleData() {
  const spherePositions = new Float32Array(PARTICLE_COUNT * 3);
  const helixPositions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = phi * i;

    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;

    const sphereRadius = 2.5;
    spherePositions[i * 3] = x * sphereRadius;
    spherePositions[i * 3 + 1] = y * sphereRadius;
    spherePositions[i * 3 + 2] = z * sphereRadius;

    const t = i / PARTICLE_COUNT;
    const helixRadius = 1.2;
    const helixHeight = 15;
    const turns = 4;
    const angle = t * Math.PI * 2 * turns;
    const strandOffset = (i % 2 === 0) ? 0 : Math.PI;
    
    const scatterR = (Math.random() - 0.5) * 0.4;
    const scatterAngle = Math.random() * Math.PI * 2;

    const hX = Math.cos(angle + strandOffset) * helixRadius + Math.cos(scatterAngle) * scatterR;
    const hY = (t - 0.5) * helixHeight;
    const hZ = Math.sin(angle + strandOffset) * helixRadius + Math.sin(scatterAngle) * scatterR;

    helixPositions[i * 3] = hX;
    helixPositions[i * 3 + 1] = -hY;
    helixPositions[i * 3 + 2] = hZ;

    const colorT = (y + 1) / 2;
    tempColor.lerpColors(colorBottom, colorTop, colorT);
    colors[i * 3] = tempColor.r;
    colors[i * 3 + 1] = tempColor.g;
    colors[i * 3 + 2] = tempColor.b;
  }

  return { spherePositions, helixPositions, colors };
}

export function ParticleScene({ scrollYProgress }) {
  const meshRef = useRef();
  const groupRef = useRef();
  const prefersReducedMotion = useReducedMotion();
  const { viewport } = useThree();
  
  const { spherePositions, helixPositions, colors } = useMemo(() => createParticleData(), []);
  const displacements = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []); // Stores current x, y, z displacement for each particle

  useFrame((state, delta) => {
    if (!meshRef.current || !groupRef.current) return;

    const scroll = scrollYProgress.get(); 
    // Smooth transition from sphere to helix across the first half, then slowly expand/twist
    const morphTarget = prefersReducedMotion ? 0 : Math.min(1, scroll * 2.5);
    const pulseIntensity = prefersReducedMotion ? 0 : scroll;
    
    if (!prefersReducedMotion) {
      groupRef.current.rotation.y += delta * (0.05 + scroll * 0.1);
    }
    
    const time = state.clock.getElapsedTime();
    
    // Map pointer to 3D space roughly
    const pointer3D = new THREE.Vector3(
      (state.pointer.x * viewport.width) / 2,
      (state.pointer.y * viewport.height) / 2,
      0
    );

    const baseZ = 6;
    const helixZ = 5;
    state.camera.position.z = THREE.MathUtils.lerp(baseZ, helixZ, morphTarget);

    if (!prefersReducedMotion) {
      const mouseX = (state.pointer.x * Math.PI) / 10;
      const mouseY = (state.pointer.y * Math.PI) / 10;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouseY, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, groupRef.current.rotation.y + mouseX * 0.01, 0.05);
    }

    // Sine wave breathing / resonance pulse grows with scroll
    const breathingAmplitude = prefersReducedMotion ? 0 : 0.05 + morphTarget * 0.1 + pulseIntensity * 0.2;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      
      let targetX = THREE.MathUtils.lerp(spherePositions[idx], helixPositions[idx], morphTarget);
      let targetY = THREE.MathUtils.lerp(spherePositions[idx + 1], helixPositions[idx + 1], morphTarget);
      let targetZ = THREE.MathUtils.lerp(spherePositions[idx + 2], helixPositions[idx + 2], morphTarget);
      
      if (!prefersReducedMotion) {
        // Continuous idle resonance wave
        const distFromCenter = Math.sqrt(targetX * targetX + targetY * targetY + targetZ * targetZ);
        const wave = Math.sin(time * 3 - distFromCenter * 2 + scroll * 10) * breathingAmplitude;
        
        const dirX = targetX / (distFromCenter || 1);
        const dirY = targetY / (distFromCenter || 1);
        const dirZ = targetZ / (distFromCenter || 1);
        
        targetX += dirX * wave;
        targetY += dirY * wave;
        targetZ += dirZ * wave;

        // Pointer Repel
        const dx = targetX - pointer3D.x;
        const dy = targetY - pointer3D.y;
        const distToP = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 2.0;

        let forceX = 0;
        let forceY = 0;

        if (distToP < repelRadius) {
          const force = (repelRadius - distToP) / repelRadius; // 0 to 1
          forceX = (dx / distToP) * force * 1.5;
          forceY = (dy / distToP) * force * 1.5;
        }

        // Ease displacements
        displacements[idx] = THREE.MathUtils.lerp(displacements[idx], forceX, 0.1);
        displacements[idx + 1] = THREE.MathUtils.lerp(displacements[idx + 1], forceY, 0.1);

        targetX += displacements[idx];
        targetY += displacements[idx + 1];
      }

      dummy.position.set(targetX, targetY, targetZ);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      
      // Shift color to deeper indigo based on scroll
      tempColor.setRGB(colors[idx], colors[idx+1], colors[idx+2]);
      tempColor.lerp(colorDeep, scroll * 0.7);
      meshRef.current.setColorAt(i, tempColor);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[null, null, PARTICLE_COUNT]}>
        <sphereGeometry args={[0.015, 4, 4]} />
        <meshBasicMaterial 
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.8}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}
