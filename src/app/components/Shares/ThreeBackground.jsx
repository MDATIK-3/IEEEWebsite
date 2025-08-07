"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

const Particle = ({ pos }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.1;
    ref.current.position.y = pos[1] + Math.sin(t + pos[0]) * 0.4;
  });
  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color="#80dfff" emissive="#0ff" emissiveIntensity={0.6} />
    </mesh>
  );
};

const Background = () => (
  <Canvas camera={{ position: [0, 0, 10], fov: 65 }} style={{ position: "fixed", inset: 0, zIndex: -1 }}>
    <ambientLight intensity={0.3} />
    <pointLight position={[10, 10, 10]} intensity={1.2} />
    {Array.from({ length: 40 }, () => [
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 12,
    ]).map((p, i) => (
      <Particle key={i} pos={p} />
    ))}
  </Canvas>
);

export default Background;
