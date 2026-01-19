"use client";

import dynamic from "next/dynamic";

const ThreeBackground = dynamic(() => import("@/app/components/Shares/ThreeBackground"), {
  ssr: false,
});
const ThreeBackground2 = dynamic(() => import("@/app/components/Shares/Particles"), {
  ssr: false,
});

const BackgroundEffects = () => (
  <>
    <ThreeBackground />
    <ThreeBackground2 />
  </>
);

export default BackgroundEffects;
