"use client";

import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react").then((module) => module.Lottie), {
  loading: () => null,
  ssr: false,
});

export function HomeBenefitsLottie({
  animationData,
  label,
}: {
  animationData: object;
  label: string;
}) {
  return (
    <Lottie
      aria-label={label}
      autoplay
      className="benefits-strip__lottie"
      loop
      role="img"
      src={animationData}
    />
  );
}
