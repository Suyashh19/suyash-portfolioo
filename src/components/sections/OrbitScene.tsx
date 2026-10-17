"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// An orbital-tracking scene inspired by OrbitGuard AI: a wireframe Earth,
// satellites on inclined orbits and a slowly drifting debris field.

const ORBITS = [
  { radius: 2.15, tilt: [0.35, 0, 0.2], speed: 0.42, sats: 2 },
  { radius: 2.6, tilt: [-0.6, 0.3, -0.15], speed: 0.28, sats: 3 },
  { radius: 3.1, tilt: [1.15, -0.2, 0.4], speed: 0.19, sats: 2 },
] as const;

function Globe({ color, core }: { color: string; core: string }) {
  const dots = useMemo(() => {
    // Fibonacci sphere gives an even "city lights" dot pattern.
    const n = 900;
    const pos = new Float32Array(n * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      pos.set([Math.cos(t) * r * 1.42, y * 1.42, Math.sin(t) * r * 1.42], i * 3);
    }
    return pos;
  }, []);

  return (
    <group>
      <mesh>
        <sphereGeometry args={[1.38, 48, 48]} />
        <meshBasicMaterial color={core} transparent opacity={0.7} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.4, 3]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.09} />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dots, 3]} />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.02} transparent opacity={0.7} sizeAttenuation />
      </points>
      {/* atmosphere halo */}
      <mesh scale={1.12}>
        <sphereGeometry args={[1.4, 48, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.035} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function Orbit({
  radius,
  tilt,
  speed,
  sats,
  color,
  signal,
}: (typeof ORBITS)[number] & { color: string; signal: string }) {
  const group = useRef<THREE.Group>(null);
  const satRefs = useRef<(THREE.Mesh | null)[]>([]);

  const ring = useMemo(() => {
    const pts = new THREE.EllipseCurve(0, 0, radius, radius).getPoints(160);
    return new THREE.BufferGeometry().setFromPoints(pts.map((p) => new THREE.Vector3(p.x, 0, p.y)));
  }, [radius]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    satRefs.current.forEach((m, i) => {
      if (!m) return;
      const a = t + (i / sats) * Math.PI * 2;
      m.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
    });
  });

  return (
    <group ref={group} rotation={tilt as unknown as [number, number, number]}>
      <lineLoop geometry={ring}>
        <lineBasicMaterial color={color} transparent opacity={0.16} />
      </lineLoop>
      {Array.from({ length: sats }).map((_, i) => (
        <mesh key={i} ref={(m) => void (satRefs.current[i] = m)}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color={signal} />
          <mesh scale={3}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial color={signal} transparent opacity={0.18} depthWrite={false} />
          </mesh>
        </mesh>
      ))}
    </group>
  );
}

// Deterministic PRNG so the debris field is identical on every render.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DEBRIS = (() => {
  const rand = mulberry32(7);
  const n = 700;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = 1.9 + rand() * 2.6;
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    pos.set([r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi) * 0.6, r * Math.sin(phi) * Math.sin(theta)], i * 3);
  }
  return pos;
})();

function Debris({ color }: { color: string }) {
  const ref = useRef<THREE.Points>(null);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[DEBRIS, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.012} transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ pointer, clock }, dt) => {
    if (!ref.current) return;
    // Slow spin plus a gentle lean toward the pointer.
    ref.current.rotation.y = clock.getElapsedTime() * 0.06 + pointer.x * 0.25;
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, -pointer.y * 0.15 + 0.15, 3, dt);
  });
  return <group ref={ref}>{children}</group>;
}

export default function OrbitScene({ reducedMotion, active = true }: { reducedMotion: boolean; active?: boolean }) {
  // Neutral planet and debris; orange is reserved for the tracked satellites.
  const color = "#c9ccd6";
  const signal = "#ff6a2b";

  return (
    <Canvas
      camera={{ position: [0, 0.4, 10.5], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      frameloop={!active ? "never" : reducedMotion ? "demand" : "always"}
      aria-hidden
    >
      <Rig>
        <Globe color={color} core="#0a0b0e" />
        {ORBITS.map((o, i) => (
          <Orbit key={i} {...o} color={color} signal={signal} />
        ))}
        <Debris color={color} />
      </Rig>
    </Canvas>
  );
}
