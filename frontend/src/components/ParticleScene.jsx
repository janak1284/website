import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';

const PARTICLE_COUNT = 4000;
const SHAPE_COUNT = 10;
const dummy = new THREE.Object3D();
const tempColor = new THREE.Color();
const colorTop = new THREE.Color('#8B5CF6'); // Primary purple
const colorBottom = new THREE.Color('#C026D3'); // Highlight magenta
const colorDeep = new THREE.Color('#4C1D95'); // Deep indigo
const vec3 = new THREE.Vector3(); // Reusable vector

function createParticleData2() {
  const shapes = Array.from({ length: SHAPE_COUNT }, () => new Float32Array(PARTICLE_COUNT * 3));
  const colors = new Float32Array(PARTICLE_COUNT * 3);

  const phi = Math.PI * (3 - Math.sqrt(5));

  // Pre-calculate clusters for domains (Network)
  const clusters = [
    new THREE.Vector3(3, 2, 0),
    new THREE.Vector3(-3, 2, 1),
    new THREE.Vector3(2, -2, -2),
    new THREE.Vector3(-2, -3, 0),
    new THREE.Vector3(0, 0, 3),
    new THREE.Vector3(0, 4, -1)
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const idx = i * 3;
    const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2; // -1 to 1
    const radius = Math.sqrt(1 - y * y);
    const theta = phi * i;

    // SHAPE A (Old): Resonance Ring (About & Contact)
    const ring_r = 6.5;
    const noise = Math.sin(theta * 6) * Math.cos(y * 8) * 0.6 + Math.sin(theta * 3 + y * 4) * 0.8;
    const final_r = ring_r + noise;
    const ring_x = Math.cos(theta) * radius * final_r;
    const ring_y = y * final_r;
    const ring_z = Math.sin(theta) * radius * final_r;

    // Assign to About (1), and Contact (9)
    shapes[1][idx] = ring_x * 1.2; shapes[1][idx + 1] = ring_y * 1.2; shapes[1][idx + 2] = ring_z * 1.2;
    shapes[9][idx] = ring_x; shapes[9][idx + 1] = ring_y; shapes[9][idx + 2] = ring_z;

    // SHAPE A (New): Small Torus for Hero text "O" alignment
    const thin_ring_r = 2.1;
    const thin_tube_r = 0.15;
    // Use deterministic mapping so they expand radially and smoothly without leaving sparse edges
    const thin_u = theta;
    const thin_v = y * Math.PI * 4;
    const thin_x = (thin_ring_r + thin_tube_r * Math.cos(thin_v)) * Math.cos(thin_u);
    const thin_y = (thin_ring_r + thin_tube_r * Math.cos(thin_v)) * Math.sin(thin_u);
    const thin_z = thin_tube_r * Math.sin(thin_v);

    // Assign to Hero (0), perfectly centered
    shapes[0][idx] = thin_x; shapes[0][idx + 1] = thin_y; shapes[0][idx + 2] = thin_z;

    // SHAPE B: Domain Clusters (ProblemStatements)
    const cluster = clusters[i % 6];
    const c_theta = Math.random() * Math.PI * 2;
    const c_phi = Math.acos((Math.random() * 2) - 1);
    const c_r = Math.random() * 0.8 + (Math.random() > 0.95 ? Math.random() * 2 : 0);
    const clus_x = cluster.x * 1.5 + Math.sin(c_phi) * Math.cos(c_theta) * c_r;
    const clus_y = cluster.y * 1.5 + Math.sin(c_phi) * Math.sin(c_theta) * c_r;
    const clus_z = cluster.z * 1.5 + Math.cos(c_phi) * c_r;

    // Assign to Domains (2)
    shapes[2][idx] = clus_x; shapes[2][idx + 1] = clus_y; shapes[2][idx + 2] = clus_z;

    // SHAPE C: Thick Double Helix (Prizes, Qualification, Schedule)
    const h_t = i / PARTICLE_COUNT;
    const h_y = (h_t - 0.5) * 16;
    const strand = (i % 2 === 0) ? 0 : Math.PI;
    const h_ang = h_y * 1.5;
    const h_rad = 2.5;
    const cx = Math.cos(h_ang + strand) * h_rad;
    const cz = Math.sin(h_ang + strand) * h_rad;
    const thickness = 0.8;
    const u = Math.random();
    const v = Math.random();
    const t_theta = u * 2.0 * Math.PI;
    const t_phi = Math.acos(2.0 * v - 1.0);
    const t_r = Math.cbrt(Math.random()) * thickness;

    const hel_x = cx + Math.sin(t_phi) * Math.cos(t_theta) * t_r;
    const hel_y = -h_y + Math.cos(t_phi) * t_r;
    const hel_z = cz + Math.sin(t_phi) * Math.sin(t_theta) * t_r;

    // Assign to Prizes (3), Qualification (4), Schedule (5)
    shapes[3][idx] = hel_x; shapes[3][idx + 1] = hel_y; shapes[3][idx + 2] = hel_z;
    shapes[4][idx] = hel_x; shapes[4][idx + 1] = hel_y; shapes[4][idx + 2] = hel_z;
    shapes[5][idx] = hel_x; shapes[5][idx + 1] = hel_y; shapes[5][idx + 2] = hel_z;

    // SHAPE D: Data Grid / Landscape (Speakers, Sponsors, Venue)
    const gridDim = Math.ceil(Math.sqrt(PARTICLE_COUNT));
    const gx = (i % gridDim);
    const gy = Math.floor(i / gridDim);
    const grid_x = (gx / gridDim - 0.5) * 20 + (Math.random() - 0.5) * 0.2;
    const grid_y = (gy / gridDim - 0.5) * 20 + (Math.random() - 0.5) * 0.2;
    const grid_z = Math.sin(grid_x * 0.5) * Math.cos(grid_y * 0.5) * 2; // Wavy landscape

    // Assign to Speakers (6), Sponsors (7), Venue (8)
    shapes[6][idx] = grid_x; shapes[6][idx + 1] = grid_z - 3; shapes[6][idx + 2] = grid_y; // Rotated to lie flat
    shapes[7][idx] = grid_x; shapes[7][idx + 1] = grid_z - 3; shapes[7][idx + 2] = grid_y;
    shapes[8][idx] = grid_x; shapes[8][idx + 1] = grid_z - 3; shapes[8][idx + 2] = grid_y;

    // Base Color assignment
    const colorT = (y + 1) / 2;
    tempColor.lerpColors(colorBottom, colorTop, colorT);
    colors[idx] = tempColor.r;
    colors[idx + 1] = tempColor.g;
    colors[idx + 2] = tempColor.b;
  }

  return { shapes, colors };
}

export function ParticleScene({ scrollYProgress, pathname }) {
  const meshRef = useRef();
  const groupRef = useRef();
  const prefersReducedMotion = useReducedMotion();
  const { viewport } = useThree();

  const { shapes, colors } = useMemo(() => createParticleData2(), []);
  const displacements = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const sectionOffsets = useRef([]);

  React.useEffect(() => {
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
    if (!meshRef.current || !groupRef.current) return;

    const scroll = scrollYProgress.get();

    // Determine Shape Interpolation
    const offsets = sectionOffsets.current;
    let currentShapeIdx = 0;
    let nextShapeIdx = 0;
    let lerpFactor = 0;

    let scrollRotationOffset = 0;

    if (pathname && pathname !== '/') {
      currentShapeIdx = 6;
      nextShapeIdx = 6;
      lerpFactor = 0;
      scrollRotationOffset = state.clock.elapsedTime * 0.1;
    } else {
      // We expect exactly 10 sections (Hero -> Contact)
      if (offsets.length === SHAPE_COUNT) {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;

        // Trigger offset: Middle of the screen
        const triggerOffset = scrollY + (viewportHeight / 2);

        for (let i = 0; i < offsets.length; i++) {
          if (triggerOffset >= offsets[i]) {
            currentShapeIdx = i;
          }
        }

        nextShapeIdx = Math.min(SHAPE_COUNT - 1, currentShapeIdx + 1);

        if (currentShapeIdx !== nextShapeIdx) {
          const start = offsets[currentShapeIdx];
          const end = offsets[nextShapeIdx];
          const sectionHeight = end - start;

          let progress;
          if (currentShapeIdx === 0) {
            // The hero section only spans half the scroll distance before switching to shape 1.
            // Multiply by 2 (or divide sectionHeight by 2) to complete the transition in time.
            progress = scrollY / ((sectionHeight / 2) || 1);
          } else {
            progress = (triggerOffset - start) / (sectionHeight || 1);
          }
          progress = Math.max(0, Math.min(1, progress));

          // For the hero section transition, hold less and transition slower over more scroll distance
          let holdThreshold = currentShapeIdx === 0 ? 0.1 : 0.4;
          if (progress > holdThreshold) {
            const p = (progress - holdThreshold) / (1 - holdThreshold);
            lerpFactor = p * p * (3 - 2 * p);
          } else {
            lerpFactor = 0.0;
          }
        }
      } else {
        // Fallback mapping if DOM isn't ready
        const sectionFloat = Math.max(0, Math.min(SHAPE_COUNT - 1.001, scroll * SHAPE_COUNT));
        currentShapeIdx = Math.floor(sectionFloat);
        nextShapeIdx = Math.min(SHAPE_COUNT - 1, currentShapeIdx + 1);

        const rawLerp = sectionFloat - currentShapeIdx;
        let holdThreshold = currentShapeIdx === 0 ? 0.1 : 0.4;

        if (rawLerp > holdThreshold) {
          const p = (rawLerp - holdThreshold) / (1 - holdThreshold);
          lerpFactor = p * p * (3 - 2 * p);
        } else {
          lerpFactor = 0.0;
        }
      }

      // Group Rotation & Sync for Schedule (Idx 5)
      if (offsets.length > 5) {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const triggerOffset = scrollY + (viewportHeight / 2);

        const start = offsets[5];
        const end = offsets[6] || (start + viewportHeight * 2);
        const sectionHeight = end - start;
        let localProgress = (triggerOffset - start) / (sectionHeight || 1);

        localProgress = Math.max(0, Math.min(1, localProgress));
        scrollRotationOffset = localProgress * -Math.PI * 4;
      }
    }

    if (!prefersReducedMotion) {
      const mouseX = (state.pointer.x * Math.PI) / 10;
      const mouseY = (state.pointer.y * Math.PI) / 10;

      let targetRotationY = (scrollRotationOffset + mouseX) % (Math.PI * 2);
      
      groupRef.current.rotation.y = groupRef.current.rotation.y % (Math.PI * 2);
      
      const deltaY = targetRotationY - groupRef.current.rotation.y;
      if (deltaY > Math.PI) {
        targetRotationY -= Math.PI * 2;
      } else if (deltaY < -Math.PI) {
        targetRotationY += Math.PI * 2;
      }

      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotationY,
        4,
        delta
      );
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        mouseY + Math.sin(state.clock.elapsedTime * 0.5) * 0.05,
        4,
        delta
      );
    } else {
      groupRef.current.rotation.y = scrollRotationOffset;
    }

    const time = state.clock.getElapsedTime();

    // Accurate Pointer Unprojection to Z=0 Plane
    vec3.set(state.pointer.x, state.pointer.y, 0.5);
    vec3.unproject(state.camera);
    vec3.sub(state.camera.position).normalize();
    const distanceToZ0 = (0 - state.camera.position.z) / vec3.z;
    const pointer3DWorld = new THREE.Vector3().copy(state.camera.position).add(vec3.multiplyScalar(distanceToZ0));

    // Convert world pointer to group's local space for accurate repel against rotated particles
    const pointerLocal = groupRef.current.worldToLocal(pointer3DWorld.clone());

    const repelRadius = prefersReducedMotion ? 1.0 : 1.5;
    const repelStrength = prefersReducedMotion ? 0.2 : 0.6;
    const breathingAmplitude = prefersReducedMotion ? 0 : 0.08 + scroll * 0.05;
    const mobileScale = window.innerWidth < 768 ? (window.innerWidth / 768) * 0.55 + 0.2 : 1.0;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;

      // Interpolate Target Position
      let targetX = THREE.MathUtils.lerp(shapes[currentShapeIdx][idx], shapes[nextShapeIdx][idx], lerpFactor) * mobileScale;
      let targetY = THREE.MathUtils.lerp(shapes[currentShapeIdx][idx + 1], shapes[nextShapeIdx][idx + 1], lerpFactor) * mobileScale;
      let targetZ = THREE.MathUtils.lerp(shapes[currentShapeIdx][idx + 2], shapes[nextShapeIdx][idx + 2], lerpFactor) * mobileScale;

      if (!prefersReducedMotion) {
        // Continuous additive idle breathing wave
        const distFromCenter = Math.sqrt(targetX * targetX + targetY * targetY + targetZ * targetZ);
        const activeBreathing = (currentShapeIdx === 0) ? lerpFactor * breathingAmplitude : breathingAmplitude;
        const wave = Math.sin(time * 3 - distFromCenter * 2 + scroll * 15) * activeBreathing;

        targetX += (targetX / (distFromCenter || 1)) * wave;
        targetY += (targetY / (distFromCenter || 1)) * wave;
        targetZ += (targetZ / (distFromCenter || 1)) * wave;

        // Pointer Repel Force (Additive)
        const dx = targetX - pointerLocal.x;
        const dy = targetY - pointerLocal.y;
        const dz = targetZ - pointerLocal.z;
        const distToP = Math.sqrt(dx * dx + dy * dy + dz * dz);

        let forceX = 0, forceY = 0, forceZ = 0;

        const activeRepelStrength = (currentShapeIdx === 0) ? lerpFactor * repelStrength : repelStrength;

        if (distToP < repelRadius) {
          const force = (repelRadius - distToP) / repelRadius; // 0 to 1
          forceX = (dx / distToP) * force * activeRepelStrength;
          forceY = (dy / distToP) * force * activeRepelStrength;
          forceZ = (dz / distToP) * force * activeRepelStrength;
        }

        // Spring ease the displacement back to 0
        displacements[idx] = THREE.MathUtils.damp(displacements[idx], forceX, 4, delta);
        displacements[idx + 1] = THREE.MathUtils.damp(displacements[idx + 1], forceY, 4, delta);
        displacements[idx + 2] = THREE.MathUtils.damp(displacements[idx + 2], forceZ, 4, delta);

        targetX += displacements[idx];
        targetY += displacements[idx + 1];
        targetZ += displacements[idx + 2];
      }

      let scale = 1.0;
      if (i % 4 !== 0) {
        if (currentShapeIdx === 0) scale = lerpFactor;
        else if (currentShapeIdx !== 0 && nextShapeIdx === 0) scale = 1 - lerpFactor;
      }

      dummy.position.set(targetX, targetY, targetZ);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Shift color to deeper indigo based on scroll progress
      tempColor.setRGB(colors[idx], colors[idx + 1], colors[idx + 2]);
      tempColor.lerp(colorDeep, scroll * 0.8);
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
