'use client';

import { useState, useEffect, useRef } from 'react';

export function useMotion() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [smoothedPosition, setSmoothedPosition] = useState({ x: 0.5, y: 0.5 });
  const requestRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const ease = 0.08;
    const smooth = () => {
      setSmoothedPosition((prev) => {
        const dx = mousePosition.x - prev.x;
        const dy = mousePosition.y - prev.y;
        return {
          x: prev.x + dx * ease,
          y: prev.y + dy * ease,
        };
      });
      requestRef.current = requestAnimationFrame(smooth);
    };
    requestRef.current = requestAnimationFrame(smooth);
    return () => cancelAnimationFrame(requestRef.current);
  }, [mousePosition]);

  const motion = (xF = 0, yF = 0) => ({
    transform: `translate3d(${(smoothedPosition.x - 0.5) * xF}px, ${(smoothedPosition.y - 0.5) * yF}px, 0)`,
  });

  return { smoothedPosition, motion };
}
