import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface HyperjumpProps {
    onIntroComplete: () => void;
    staticMode?: boolean;
}

const STAR_COUNT = 3000;
const DURATION_IDLE = 1000; // ms
const DURATION_ACCEL = 1000;
const DURATION_HYPER = 1500;
const DURATION_DECEL = 1000;

export default function Hyperjump({ onIntroComplete, staticMode = false }: HyperjumpProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { size, viewport, camera, gl } = useThree();

    const [phase, setPhase] = useState<"idle" | "accel" | "hyper" | "decel" | "done">("idle");
    const startTime = useRef(performance.now());

    // Mouse tracking for ripple
    const mousePos = useRef(new THREE.Vector2(0, 0));
    const targetMousePos = useRef(new THREE.Vector2(0, 0));

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Normalize to -1 to +1
            targetMousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            targetMousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Generate star positions, sizes, and colors
    const [positions, scales, colors] = useMemo(() => {
        const pos = new Float32Array(STAR_COUNT * 3);
        const scl = new Float32Array(STAR_COUNT);
        const col = new Float32Array(STAR_COUNT * 3);

        const colorPalette = [
            new THREE.Color("#d6e4ff"),
            new THREE.Color("#c8dcff"),
            new THREE.Color("#b9d6ff"),
            new THREE.Color("#e6eeff"),
            new THREE.Color("#a2caff"),
        ];

        for (let i = 0; i < STAR_COUNT; i++) {
            const i3 = i * 3;
            // Distribute in a cylinder/cone along Z axis
            const radius = 20 + Math.random() * 200;
            const angle = Math.random() * Math.PI * 2;

            pos[i3] = Math.cos(angle) * radius;     // X
            pos[i3 + 1] = Math.sin(angle) * radius; // Y
            pos[i3 + 2] = -Math.random() * 1000;    // Z (depth)

            scl[i] = Math.random() * 1.5 + 0.5;

            const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            col[i3] = c.r;
            col[i3 + 1] = c.g;
            col[i3 + 2] = c.b;
        }
        return [pos, scl, col];
    }, []);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uSpeed: { value: 0 },
        uStretch: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
    }), []);

    const vertexShader = `
    attribute float scale;
    attribute vec3 color;
    varying vec3 vColor;
    varying float vAlpha;
    
    uniform float uTime;
    uniform float uSpeed;
    uniform float uStretch;
    uniform vec2 uMouse;
    uniform float uPixelRatio;

    void main() {
      vColor = color;
      
      vec3 pos = position;
      
      // Move stars towards camera
      pos.z += uTime * uSpeed;
      
      // Loop stars back when they pass the camera
      if (pos.z > 50.0) {
        pos.z -= 1000.0;
      }
      
      // Cursor Ripple Effect
      // Convert pos to screen space roughly to compare with normalized mouse
      vec4 viewPos = modelViewMatrix * vec4(pos, 1.0);
      vec4 projectedPos = projectionMatrix * viewPos;
      vec2 screenPos = projectedPos.xy / projectedPos.w;
      
      float distToMouse = distance(screenPos, uMouse);
      float ripple = smoothstep(0.5, 0.0, distToMouse);
      // Push stars away from cursor slightly 
      pos.x += normalize(screenPos - uMouse).x * ripple * 15.0 * (1.0 - uStretch);
      pos.y += normalize(screenPos - uMouse).y * ripple * 15.0 * (1.0 - uStretch);

      // Hyperjump stretch (stretch along Z axis based on distance from center)
      float distFromCenter = length(pos.xy);
      pos.z -= distFromCenter * uStretch * 2.0;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Dynamic sizing based on distance and stretch
      float size = scale * (200.0 / -mvPosition.z) * uPixelRatio;
      // Shrink width but keep length during stretch to simulate lines
      gl_PointSize = size * (1.0 + uStretch * 2.0);
      
      // Fade out based on distance and edge
      vAlpha = smoothstep(1000.0, 0.0, -pos.z);
    }
  `;

    const fragmentShader = `
    varying vec3 vColor;
    varying float vAlpha;
    uniform float uStretch;

    void main() {
      // Create a soft circle
      vec2 xy = gl_PointCoord.xy - vec2(0.5);
      float ll = length(xy);
      
      // If stretching, make it look more like a streak
      if (ll > 0.5) discard;
      
      float intensity = 1.0 - (ll * 2.0);
      intensity = pow(intensity, 1.5);
      
      gl_FragColor = vec4(vColor, vAlpha * intensity);
    }
  `;

    useFrame((state, delta) => {
        const now = performance.now();
        const elapsed = now - startTime.current;

        // Smooth mouse interpolation
        mousePos.current.lerp(targetMousePos.current, 0.1);

        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += delta * 60;
            materialRef.current.uniforms.uMouse.value.copy(mousePos.current);

            // State machine for intro sequence
            let currentSpeed = 1.0; // base drift speed
            let currentStretch = 0.0; // 0 = dots, 1 = streaks

            if (staticMode) {
                currentSpeed = 1.0;
                currentStretch = 0.0;
            } else {
                if (phase === "idle") {
                    if (elapsed > DURATION_IDLE) {
                        setPhase("accel");
                        startTime.current = now;
                    }
                } else if (phase === "accel") {
                    const t = elapsed / DURATION_ACCEL;
                    // Exponential ease in
                    const easeIn = t * t * t;
                    currentSpeed = 1.0 + easeIn * 30.0;
                    currentStretch = easeIn;
                    if (t >= 1) {
                        setPhase("hyper");
                        startTime.current = now;
                    }
                } else if (phase === "hyper") {
                    currentSpeed = 31.0;
                    currentStretch = 1.0;
                    if (elapsed > DURATION_HYPER) {
                        setPhase("decel");
                        startTime.current = now;
                    }
                } else if (phase === "decel") {
                    const t = elapsed / DURATION_DECEL;
                    // Exponential ease out
                    const easeOut = 1 - Math.pow(1 - t, 3);
                    currentSpeed = 31.0 - (easeOut * 30.0);
                    currentStretch = 1.0 - easeOut;
                    if (t >= 1) {
                        setPhase("done");
                        onIntroComplete();
                    }
                } else if (phase === "done") {
                    currentSpeed = 1.0;
                    currentStretch = 0.0;
                }
            } // end if !staticMode

            // Smoothly apply uniforms to avoid jumps
            materialRef.current.uniforms.uSpeed.value = THREE.MathUtils.lerp(
                materialRef.current.uniforms.uSpeed.value,
                currentSpeed,
                0.1
            );
            materialRef.current.uniforms.uStretch.value = THREE.MathUtils.lerp(
                materialRef.current.uniforms.uStretch.value,
                currentStretch,
                0.1
            );
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={STAR_COUNT} array={positions} itemSize={3} args={[positions, 3]} />
                <bufferAttribute attach="attributes-scale" count={STAR_COUNT} array={scales} itemSize={1} args={[scales, 1]} />
                <bufferAttribute attach="attributes-color" count={STAR_COUNT} array={colors} itemSize={3} args={[colors, 3]} />
            </bufferGeometry>
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}
