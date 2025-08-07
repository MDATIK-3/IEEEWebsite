"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const classList = document?.documentElement?.classList;
    if (classList?.contains("dark")) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }

    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setIsDark(e.matches);

    matcher.addEventListener("change", onChange);

    return () => matcher.removeEventListener("change", onChange);
  }, []);

  return isDark;
};


const ParticleSystem = ({ isDarkMode }) => {
  const ref = useRef();
  const pointsRef = useRef();
  const linesRef = useRef();
  const numParticles = 150;

  const positions = useMemo(() => {
    const pos = new Float32Array(numParticles * 3);
    for (let i = 0; i < numParticles; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return pos;
  }, []);

  const sizes = useMemo(() => {
    const sz = new Float32Array(numParticles);
    for (let i = 0; i < numParticles; i++) {
      sz[i] = Math.random() * 0.025; // Even smaller bubble size range
    }
    return sz;
  }, []);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const linePositions = [];
    for (let i = 0; i < numParticles; i++) {
      for (let j = i + 1; j < numParticles; j++) {
        const dist = Math.sqrt(
          Math.pow(positions[i * 3] - positions[j * 3], 2) +
          Math.pow(positions[i * 3 + 1] - positions[j * 3 + 1], 2) +
          Math.pow(positions[i * 3 + 2] - positions[j * 3 + 2], 2)
        );
        if (dist < 5) {
          linePositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          );
        }
      }
    }
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    return geometry;
  }, [positions]);

  const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      isDarkMode: { value: isDarkMode },
    },
    vertexShader: `
      attribute float size;
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -position.z);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform bool isDarkMode;
      varying vec3 vPosition;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float twinkle = 0.7 + 0.3 * sin(time * 2.0 + vPosition.x * 0.5 + vPosition.y);
        vec3 lightColor = vec3(0.2, 0.6, 1.0);
        vec3 darkColor = vec3(0.8, 0.9, 1.0);
        vec3 color = isDarkMode ? darkColor : lightColor;
        float intensity = isDarkMode ? 0.9 : 0.7;
        float glow = 1.0 - dist * 1.5;
        gl_FragColor = vec4(color, intensity * glow * twinkle);
      }
    `,
    transparent: true,
  }), [isDarkMode]);

  const lineMaterial = useMemo(() => new THREE.LineBasicMaterial({
    color: new THREE.Color(isDarkMode ? "#4d6b8f" : "#99c2ff"),
    transparent: true,
    opacity: 0.2,
  }), [isDarkMode]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.01;
    ref.current.rotation.x = t * 0.005;
    if (pointsRef.current?.material?.uniforms) {
      pointsRef.current.material.uniforms.time.value = t;
      pointsRef.current.material.uniforms.isDarkMode.value = isDarkMode;
    }
    if (linesRef.current?.material) {
      linesRef.current.material.color.set(isDarkMode ? "#4d6b8f" : "#99c2ff");
    }
  });

  return (
    <group ref={ref}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            itemSize={3}
            count={numParticles}
          />
          <bufferAttribute
            attach="attributes-size"
            array={sizes}
            itemSize={1}
            count={numParticles}
          />
        </bufferGeometry>
        <primitive object={shaderMaterial} />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <primitive object={lineMaterial} />
      </lineSegments>
    </group>
  );
};

const Background = () => {
  const isDarkMode = useDarkMode();
  const fogColor = isDarkMode ? "#0f172a" : "#d4e4ff";

  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 70 }}
      style={{ position: "fixed", inset: 0, zIndex: -1 }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[25, 25, 25]} intensity={2.0} distance={70} decay={2} color="#ffffff" />
      <pointLight position={[-20, -20, 15]} intensity={1.2} color="#ffdab3" distance={60} decay={2} />
      <fog attach="fog" args={[fogColor, 15, 35]} />
      <ParticleSystem isDarkMode={isDarkMode} />
    </Canvas>
  );
};

export default Background;