"use client";

import { Lottie } from "lottie-react";

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
