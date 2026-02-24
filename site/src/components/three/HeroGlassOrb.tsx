import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import type { Mesh } from "three";

function OrbCore() {
  const meshRef = useRef<Mesh | null>(null);
  const ringRef = useRef<Mesh | null>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.14;
      meshRef.current.rotation.x += delta * 0.04;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.08;
      ringRef.current.rotation.x += delta * 0.03;
    }
  });

  return (
    <group>
      {/* Main glass orb */}
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.9}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.1, 32]} />
          <meshPhysicalMaterial
            color="#a5c8ff"
            roughness={0.04}
            metalness={0.05}
            transmission={0.97}
            thickness={1.4}
            clearcoat={1}
            clearcoatRoughness={0.04}
            ior={1.45}
            envMapIntensity={1.2}
            attenuationColor="#6090e0"
            attenuationDistance={0.6}
          />
        </mesh>
      </Float>

      {/* Outer ring 1 */}
      <Float speed={0.8} floatIntensity={0.4}>
        <mesh ref={ringRef} rotation={[Math.PI * 0.35, 0.2, 0]}>
          <torusGeometry args={[1.7, 0.012, 16, 100]} />
          <meshPhysicalMaterial
            color="#93c5fd"
            roughness={0.1}
            metalness={0.4}
            transmission={0.5}
          />
        </mesh>
      </Float>

      {/* Outer ring 2 */}
      <Float speed={0.6} floatIntensity={0.3}>
        <mesh rotation={[Math.PI * 0.55, 0.8, 0]}>
          <torusGeometry args={[2.05, 0.007, 16, 100]} />
          <meshPhysicalMaterial
            color="#60a5fa"
            roughness={0.15}
            metalness={0.3}
            transmission={0.6}
          />
        </mesh>
      </Float>

      {/* Particle dots */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin((i / 8) * Math.PI * 2) * 2.3,
            Math.cos((i / 8) * Math.PI * 2) * 0.5,
            Math.cos((i / 8) * Math.PI * 2) * 1.2,
          ]}
        >
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#93c5fd" emissive="#3b82f6" emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroGlassOrb() {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [prefersReducedMotion]);

  const fallback = (
    <div className="relative h-[340px] sm:h-[400px] lg:h-[520px] w-full flex items-center justify-center">
      <div className="absolute inset-0 rounded-3xl" style={{
        background: "radial-gradient(circle at 35% 38%, rgba(147,197,253,0.22) 0%, rgba(37,99,235,0.08) 40%, transparent 70%)"
      }} />
      <div className="w-48 h-48 rounded-full animate-pulse-glow" style={{
        background: "radial-gradient(circle, rgba(147,197,253,0.3) 0%, rgba(37,99,235,0.1) 50%, transparent 100%)",
        boxShadow: "0 0 80px rgba(37,99,235,0.35)"
      }} />
    </div>
  );

  if (!enabled) return fallback;

  return (
    <div className="h-[340px] sm:h-[400px] lg:h-[520px] w-full">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 42 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 2]} intensity={1.1} color="#e0eeff" />
        <pointLight position={[-3, -2, 3]} intensity={0.7} color="#60a5fa" />
        <pointLight position={[2, 3, -2]} intensity={0.4} color="#a5f3fc" />
        <Suspense fallback={null}>
          <OrbCore />
        </Suspense>
      </Canvas>
    </div>
  );
}

