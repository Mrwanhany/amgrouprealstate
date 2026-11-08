"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef } from "react";
import { BoxGeometry, type Group } from "three";

/**
 * Abstract architectural form for the hero: five stacked, slowly drifting
 * floor plates in brass and graphite.
 *
 * Deliberately not a literal house — at this scale a recognisable model
 * reads as clip art, whereas stacked plates read as architecture and hold
 * up against the photography behind them.
 */
function FloorPlates() {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;

    // Continuous slow yaw, plus a gentle lean toward the pointer.
    group.current.rotation.y += delta * 0.12;

    const targetX = state.pointer.y * 0.18;
    const targetZ = -state.pointer.x * 0.12;

    // Frame-rate independent easing toward the target.
    const ease = 1 - Math.pow(0.001, delta);
    group.current.rotation.x += (targetX - group.current.rotation.x) * ease;
    group.current.rotation.z += (targetZ - group.current.rotation.z) * ease;
  });

  // width, height, depth, y offset, gold?
  // Thin plates with a wide footprint read as floor slabs; thick ones read
  // as furniture, which is why the heights here are deliberately tiny.
  const plates: Array<[number, number, number, number, boolean]> = [
    [2.35, 0.045, 2.35, -1.05, false],
    [2.0, 0.04, 2.0, -0.55, true],
    [1.66, 0.04, 1.66, -0.05, false],
    [1.32, 0.035, 1.32, 0.45, true],
    [0.96, 0.035, 0.96, 0.92, false],
    [0.56, 0.03, 0.56, 1.3, true],
  ];

  return (
    <group ref={group}>
      {plates.map(([w, h, d, y, gold], index) => (
        <mesh key={index} position={[0, y, 0]} castShadow={false}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial
            color={gold ? "#c9a227" : "#232327"}
            metalness={gold ? 1 : 0.85}
            roughness={gold ? 0.22 : 0.32}
            transparent
            opacity={gold ? 0.95 : 0.78}
          />
        </mesh>
      ))}

      {/* Hairline outlines so each slab keeps an edge against the photograph */}
      {plates.map(([w, , d, y], index) => (
        <lineSegments key={`edge-${index}`} position={[0, y, 0]}>
          <edgesGeometry args={[new BoxGeometry(w, 0.001, d)]} />
          <lineBasicMaterial color="#e8d5a3" transparent opacity={0.28} />
        </lineSegments>
      ))}

      {/* Slender core running through the stack */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.032, 0.032, 2.6, 12]} />
        <meshStandardMaterial
          color="#e8d5a3"
          metalness={1}
          roughness={0.18}
          emissive="#c9a227"
          emissiveIntensity={0.12}
        />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      // Cap DPR: a retina laptop would otherwise render 4x the pixels for
      // a decorative element nobody is inspecting closely.
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.75, 8.4], fov: 26 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      {/* Lit by hand rather than with an HDR environment — a drei preset
          would mean a multi-megabyte network fetch for a background element. */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 4]} intensity={2.1} color="#fff3d6" />
      <directionalLight position={[-5, -1, -3]} intensity={0.8} color="#6e7fa8" />
      <pointLight position={[0, 2.5, 2]} intensity={14} color="#e8d5a3" distance={9} />

      <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.5}>
        <FloorPlates />
      </Float>
    </Canvas>
  );
}
