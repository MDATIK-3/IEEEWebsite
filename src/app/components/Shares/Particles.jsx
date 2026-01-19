'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const useReducedMotion = () => {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduced(mediaQuery.matches);
        update();
        mediaQuery.addEventListener('change', update);
        return () => mediaQuery.removeEventListener('change', update);
    }, []);

    return reduced;
};

export default function ThreeBackground() {
    const mountRef = useRef(null);
    const rendererRef = useRef(null);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        camera.position.z = 50;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
        const particleCount = isSmallScreen ? 140 : 180;
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
            opacity: 0.6
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

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

        const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        applyThemeColors();
        colorSchemeQuery.addEventListener('change', applyThemeColors);

        let mouseX = 0,
            mouseY = 0,
            targetX = 0,
            targetY = 0;

        const onMouseMove = e => {
            targetX = (e.clientX / window.innerWidth - 0.5) * 2;
            targetY = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', onMouseMove);

        const clock = new THREE.Clock();
        const animate = () => {
            if (reducedMotion) {
                renderer.render(scene, camera);
                return;
            }
            const delta = clock.getDelta();
            mouseX += (targetX - mouseX) * 0.05;
            mouseY += (targetY - mouseY) * 0.05;
            particles.rotation.y += 0.2 * delta + mouseX * 0.01;
            particles.rotation.x += 0.1 * delta + mouseY * 0.01;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMouseMove);
            colorSchemeQuery.removeEventListener('change', applyThemeColors);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            if (mountRef.current?.contains(renderer.domElement)) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, [reducedMotion]);

    return (
        <div
            ref={mountRef}
            className="fixed inset-0 -z-10 w-full h-full dark:bg-slate-900"
        />
    );
}
