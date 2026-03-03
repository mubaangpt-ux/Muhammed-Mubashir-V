import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Galaxy arm particle cloud — rendered once, never streaks
// Two galaxies slightly offset for depth

const GALAXY_CONFIGS = [
    {
        count: 12000,
        radius: 180,
        arms: 3,
        spin: 1.4,
        randomness: 0.35,
        randomnessPower: 3,
        // electric blue core → subtle purple outer arms
        innerColor: new THREE.Color("#1a4fd4"),
        outerColor: new THREE.Color("#0a0e1f"),
        position: [0, 0, -600] as [number, number, number],
        rotationSpeed: 0.00008,
    },
    {
        count: 8000,
        radius: 130,
        arms: 2,
        spin: -1.1,
        randomness: 0.4,
        randomnessPower: 2.8,
        innerColor: new THREE.Color("#0e3cb5"),
        outerColor: new THREE.Color("#060810"),
        position: [250, -80, -900] as [number, number, number],
        rotationSpeed: 0.00006,
    },
    {
        count: 6000,
        radius: 100,
        arms: 2,
        spin: 1.7,
        randomness: 0.5,
        randomnessPower: 2.5,
        innerColor: new THREE.Color("#3b6cff"),
        outerColor: new THREE.Color("#07090f"),
        position: [-220, 60, -750] as [number, number, number],
        rotationSpeed: 0.0001,
    },
];

// GPU vertex shader — receives pre-baked colors, just places particles
const VERTEX_SHADER = `
  attribute vec3 aColor;
  varying vec3 vColor;

  void main() {
    vColor = aColor;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPos;
    // size attenuates with distance
    float size = 60.0 / -mvPos.z;
    gl_PointSize = clamp(size, 0.5, 3.5);
  }
`;

const FRAGMENT_SHADER = `
  varying vec3 vColor;
  void main() {
    // soft circular particle
    vec2 xy = gl_PointCoord - 0.5;
    float dist = length(xy);
    if (dist > 0.5) discard;
    float alpha = 1.0 - dist * 2.0;
    alpha = pow(alpha, 2.0);
    gl_FragColor = vec4(vColor, alpha * 0.7);
  }
`;

function GalaxyArm({
    count,
    radius,
    arms,
    spin,
    randomness,
    randomnessPower,
    innerColor,
    outerColor,
    position,
    rotationSpeed,
}: typeof GALAXY_CONFIGS[0]) {
    const pointsRef = useRef<THREE.Points>(null);

    const { positions, colors } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);

        const tmpColor = new THREE.Color();

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const t = Math.random(); // 0=core, 1=edge
            const r = t * radius;
            const armAngle = ((i % arms) / arms) * Math.PI * 2;
            const spinAngle = r * spin;

            // randomness spread — cluster at center
            const randX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
            const randY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r * 0.25;
            const randZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

            pos[i3] = Math.cos(armAngle + spinAngle) * r + randX;
            pos[i3 + 1] = randY;
            pos[i3 + 2] = Math.sin(armAngle + spinAngle) * r + randZ;

            // lerp inner→outer color
            tmpColor.lerpColors(innerColor, outerColor, t);
            col[i3] = tmpColor.r;
            col[i3 + 1] = tmpColor.g;
            col[i3 + 2] = tmpColor.b;
        }

        return { positions: pos, colors: col };
    }, []);

    useFrame(() => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += rotationSpeed;
        }
    });

    return (
        <points ref={pointsRef} position={position}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                    count={count}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-aColor"
                    args={[colors, 3]}
                    count={count}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <shaderMaterial
                vertexShader={VERTEX_SHADER}
                fragmentShader={FRAGMENT_SHADER}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

export default function GalaxyBackground() {
    return (
        <>
            {GALAXY_CONFIGS.map((cfg, i) => (
                <GalaxyArm key={i} {...cfg} />
            ))}
        </>
    );
}
