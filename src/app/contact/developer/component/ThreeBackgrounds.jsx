"use client";

import dynamic from "next/dynamic";

// Heavy WebGL canvases (three / @react-three/fiber). Loaded only on the client,
// after hydration, so they stay off this route's critical path.
const ThreeBackground = dynamic(
  () => import("@/app/components/Shares/ThreeBackground"),
  { ssr: false }
);
const Particles = dynamic(
  () => import("@/app/components/Shares/Particles"),
  { ssr: false }
);

export default function ThreeBackgrounds() {
  return (
    <>
      <ThreeBackground />
      <Particles />
    </>
  );
}
