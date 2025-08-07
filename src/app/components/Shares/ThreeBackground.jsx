'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined') return;

    // === Basic Scene Setup ===
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    camera.position.z = 50;

    // === Particles Setup ===
    const particleCount = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 100;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // === Color Mode Handling ===
    const applyThemeColors = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const palette = isDark
        ? [0.2, 0.3, 0.4, 0.3, 0.4, 0.5, 0.2, 0.3, 0.6]
        : [0.0, 0.6, 0.6, 0.0, 0.7, 0.5, 0.0, 0.8, 0.4];

      for (let i = 0; i < particleCount * 3; i += 3) {
        colors[i] = palette[i % 9];
        colors[i + 1] = palette[(i + 1) % 9];
        colors[i + 2] = palette[(i + 2) % 9];
      }

      geometry.attributes.color.needsUpdate = true;
    };

    applyThemeColors();

    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeQuery.addEventListener('change', applyThemeColors);

    // === Mouse Parallax Effect ===
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

    const onMouseMove = (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    // Initialize mouse position on mount
    const initMousePosition = () => {
      const event = new MouseEvent('mousemove', {
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2,
      });
      window.dispatchEvent(event);
    };

    // Delay event listener to ensure DOM readiness
    setTimeout(() => {
      window.addEventListener('mousemove', onMouseMove);
      initMousePosition(); // Trigger initial mouse position
    }, 0);

    // === Animation Loop ===
    let lastFrame = 0;
    const animate = (time) => {
      if (time - lastFrame > 16) { // Cap at ~60fps
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;
        particles.rotation.y += 0.002 + mouseX * 0.01;
        particles.rotation.x += 0.001 + mouseY * 0.01;
        renderer.render(scene, camera);
        lastFrame = time;
      }
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    // === Resize Handling ===
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // === Cleanup ===
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      colorSchemeQuery.removeEventListener('change', applyThemeColors);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 -z-10 w-full h-full dark:bg-slate-900"
    />
  );
};

export default ThreeBackground;