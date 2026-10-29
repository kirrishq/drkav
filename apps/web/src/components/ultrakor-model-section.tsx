"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MutableRefObject } from "react";
import type { Group, PerspectiveCamera } from "three";

type StageSide = "left" | "right";

type Hotspot = {
  desktop: { left: string; top: string; size: string };
  mobile: { left: string; top: string; size: string };
};

type Stage = {
  title: string;
  text: string;
  side: StageSide;
  price?: string;
  hotspot?: Hotspot;
};

type Pose = {
  rotation: number;
  position: readonly [number, number, number];
  scale: number;
  camera: readonly [number, number, number];
  target: readonly [number, number, number];
  fov: number;
};

const stages: readonly Stage[] = [
  {
    title: "Как работает Ультракор",
    text: "Методика сочетает удаление лишних жировых отложений и точное моделирование пропорций с учётом мужской анатомии. Цель — не просто уменьшить объём, а сделать силуэт более рельефным и гармоничным.",
    price: "от 60 000 ₽",
    side: "left",
  },
  {
    title: "Грудь",
    text: "Коррекция грудной зоны помогает сделать верх корпуса более собранным, выразительным и мужественным. Мы подчёркиваем форму, убираем лишний объём и при необходимости добавляем нужный контур через липофилинг.",
    price: "от 40 000 ₽",
    side: "left",
    hotspot: {
      desktop: { left: "72%", top: "48%", size: "13vw" },
      mobile: { left: "52%", top: "44%", size: "25vw" },
    },
  },
  {
    title: "Живот",
    text: "Плоский и рельефный живот — основа атлетичного силуэта. В этой зоне мы убираем лишние жировые отложения и подчёркиваем линии пресса, чтобы тело выглядело более подтянутым и структурным.",
    price: "от 80 000 ₽",
    side: "left",
    hotspot: {
      desktop: { left: "70%", top: "68%", size: "16vw" },
      mobile: { left: "52%", top: "54%", size: "28vw" },
    },
  },
  {
    title: "Руки и плечи",
    text: "Линия плеча и рук сильно влияет на ощущение силы всего силуэта. Мы подчёркиваем дельтовидную зону и визуальную форму бицепса и трицепса, чтобы верхняя часть тела выглядела плотнее и спортивнее.",
    price: "от 60 000 ₽",
    side: "right",
    hotspot: {
      desktop: { left: "36%", top: "64%", size: "14vw" },
      mobile: { left: "62%", top: "48%", size: "25vw" },
    },
  },
  {
    title: "Спина",
    text: "Спина задаёт ширину, V-форму и ощущение мощного корпуса. Мы работаем с зонами, которые скрывают рельеф, и подчёркиваем линию широчайших мышц и поясницы.",
    price: "от 60 000 ₽",
    side: "left",
    hotspot: {
      desktop: { left: "72%", top: "48%", size: "18vw" },
      mobile: { left: "52%", top: "45%", size: "29vw" },
    },
  },
  {
    title: "Ягодицы",
    text: "Ягодичная зона влияет на баланс пропорций и общий спортивный вид тела. При необходимости мы добавляем объём и формируем более гармоничный, подтянутый и естественный контур.",
    price: "от 60 000 ₽",
    side: "left",
    hotspot: {
      desktop: { left: "73%", top: "62%", size: "17vw" },
      mobile: { left: "57%", top: "63%", size: "26vw" },
    },
  },
  {
    title: "Жировая ткань как естественный и надёжный филлер",
    text: "Липофилинг — это безопасная методика коррекции, при которой используется собственная жировая ткань пациента. Она полностью биосовместима, поэтому риск аллергии или отторжения сводится к минимуму.",
    side: "left",
  },
  {
    title: "Взгляните на себя по-другому за 4 шага",
    text: "Консультация. Липосакция. Липофилинг. Реабилитация. Врач оценивает пропорции, убирает локальные жировые отложения, использует собственные ткани для нужного объёма и сопровождает восстановление.",
    side: "left",
  },
];

const desktopPoses: readonly Pose[] = [
  { rotation: Math.PI / 2, position: [1.6, -3.4, 0], scale: 4.9, camera: [0, 0.2, 7], target: [0, -0.3, 0], fov: 32 },
  { rotation: 0, position: [1.45, -1.7, 0], scale: 4.7, camera: [0, 0.25, 6.3], target: [0, -0.25, 0], fov: 32 },
  { rotation: 0, position: [1.3, -2.25, 0], scale: 4.15, camera: [0, 0.15, 6.6], target: [0, -0.65, 0], fov: 32 },
  { rotation: -Math.PI * 0.28, position: [-1.45, -2.75, 0], scale: 4.65, camera: [0, 0.2, 6.2], target: [0, -0.2, 0], fov: 32 },
  { rotation: -Math.PI, position: [1.25, -2.35, 0], scale: 3.85, camera: [0, 0.2, 6.7], target: [0, -0.75, 0], fov: 32 },
  { rotation: -Math.PI / 2, position: [1.5, -1.55, 0], scale: 3.7, camera: [0, 0.1, 6.9], target: [0, -1.45, 0], fov: 32 },
  { rotation: 0, position: [1.75, -2.25, 0], scale: 3.05, camera: [0, 0.2, 7.4], target: [0, -1.25, 0], fov: 32 },
  { rotation: 0.12, position: [1.75, -2, 0], scale: 3.45, camera: [0, 4.4, 8.5], target: [0, -1.85, 0], fov: 34 },
];

const mobilePoses: readonly Pose[] = [
  { rotation: Math.PI / 2, position: [0.3, -1.7, 0], scale: 2.35, camera: [0, 0.2, 9.2], target: [0, -1.1, 0], fov: 34 },
  { rotation: 0, position: [0.15, -1.8, 0], scale: 2.45, camera: [0, 0.2, 8.9], target: [0, -0.9, 0], fov: 34 },
  { rotation: 0, position: [0.05, -1.7, 0], scale: 2.35, camera: [0, 0.15, 9.1], target: [0, -1.15, 0], fov: 34 },
  { rotation: -Math.PI * 0.28, position: [-0.1, -1.75, 0], scale: 2.35, camera: [0, 0.2, 9], target: [0, -1, 0], fov: 34 },
  { rotation: -Math.PI, position: [0.05, -1.65, 0], scale: 2.25, camera: [0, 0.2, 9.2], target: [0, -1.1, 0], fov: 34 },
  { rotation: -Math.PI / 2, position: [0.2, -1.15, 0], scale: 2.2, camera: [0, 0.15, 9.3], target: [0, -1.35, 0], fov: 34 },
  { rotation: 0, position: [0.1, -1.6, 0], scale: 2.15, camera: [0, 0.2, 9.5], target: [0, -1.25, 0], fov: 34 },
  { rotation: 0.12, position: [0.15, -1.5, 0], scale: 2.3, camera: [0, 4.6, 10], target: [0, -1.7, 0], fov: 36 },
];

function interpolate(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function smoothstep(amount: number) {
  return amount * amount * (3 - 2 * amount);
}

function getPoseFrame(progress: number, poses: readonly Pose[]) {
  // Each text stage owns the exact pose at its visual center; interpolation happens between centers.
  const position = Math.min(poses.length - 1, Math.max(0, progress * poses.length - 0.5));
  const index = Math.floor(position);
  const nextIndex = Math.min(poses.length - 1, index + 1);
  return { amount: smoothstep(position - index), from: poses[index], target: poses[nextIndex] };
}

function SceneCamera({ mobile, progress }: { mobile: boolean; progress: MutableRefObject<number> }) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    const { amount, from, target } = getPoseFrame(progress.current, mobile ? mobilePoses : desktopPoses);
    const easing = Math.min(delta * 5.5, 1);
    camera.position.x += (interpolate(from.camera[0], target.camera[0], amount) - camera.position.x) * easing;
    camera.position.y += (interpolate(from.camera[1], target.camera[1], amount) - camera.position.y) * easing;
    camera.position.z += (interpolate(from.camera[2], target.camera[2], amount) - camera.position.z) * easing;
    camera.lookAt(
      interpolate(from.target[0], target.target[0], amount),
      interpolate(from.target[1], target.target[1], amount),
      interpolate(from.target[2], target.target[2], amount),
    );
    const perspectiveCamera = camera as PerspectiveCamera;
    const nextFov = interpolate(from.fov, target.fov, amount);
    if (Math.abs(perspectiveCamera.fov - nextFov) > 0.01) {
      perspectiveCamera.fov = nextFov;
      perspectiveCamera.updateProjectionMatrix();
    }
  });

  return null;
}

function AthleteModel({ mobile, progress }: { mobile: boolean; progress: MutableRefObject<number> }) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF("/models/ultrakor/athlete.glb");

  useFrame((_, delta) => {
    if (!group.current) return;
    const { amount, from, target } = getPoseFrame(progress.current, mobile ? mobilePoses : desktopPoses);
    const easing = Math.min(delta * 5.5, 1);
    group.current.rotation.y += (interpolate(from.rotation, target.rotation, amount) - group.current.rotation.y) * easing;
    group.current.position.x += (interpolate(from.position[0], target.position[0], amount) - group.current.position.x) * easing;
    group.current.position.y += (interpolate(from.position[1], target.position[1], amount) - group.current.position.y) * easing;
    group.current.position.z += (interpolate(from.position[2], target.position[2], amount) - group.current.position.z) * easing;
    const nextScale = interpolate(from.scale, target.scale, amount);
    group.current.scale.x += (nextScale - group.current.scale.x) * easing;
    group.current.scale.y = group.current.scale.x;
    group.current.scale.z = group.current.scale.x;
  });

  const initialPose = mobile ? mobilePoses[0] : desktopPoses[0];
  return <primitive object={scene} ref={group} rotation={[0, initialPose.rotation, 0]} scale={initialPose.scale} position={initialPose.position} />;
}

function StageCopy({ index, leaving = false }: { index: number; leaving?: boolean }) {
  const stage = stages[index];
  return (
    <div
      aria-hidden={leaving || undefined}
      className={`ultrakor-model-section__copy ultrakor-model-section__copy--${stage.side} ${leaving ? "is-leaving" : "is-entering"}`}
      key={`${leaving ? "leaving" : "active"}-${index}`}
    >
      <h2 className="ultrakor__heading" id={leaving ? undefined : "ultrakor-model-title"}>{stage.title}</h2>
      <p>{stage.text}</p>
      {stage.price ? <p className="ultrakor-model-section__price">{stage.price}</p> : null}
      {index === stages.length - 1 ? <a className="ultrakor__button ultrakor__button--solid ultrakor-model-section__cta" href="#contact">Записаться на консультацию</a> : null}
    </div>
  );
}

useGLTF.preload("/models/ultrakor/athlete.glb");

export function UltrakorModelSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const stageRef = useRef(0);
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [leavingStageIndex, setLeavingStageIndex] = useState<number | null>(null);
  const [lightProgress, setLightProgress] = useState(0);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const updateMobile = () => setMobile(media.matches);
    updateMobile();
    media.addEventListener("change", updateMobile);
    return () => media.removeEventListener("change", updateMobile);
  }, []);

  useEffect(() => {
    let animationFrame = 0;
    const updateProgress = () => {
      if (!sectionRef.current) return;
      const bounds = sectionRef.current.getBoundingClientRect();
      const nextProgress = Math.min(1, Math.max(0, -bounds.top / Math.max(bounds.height - window.innerHeight, 1)));
      const nextStage = Math.min(stages.length - 1, Math.floor(nextProgress * stages.length));
      progress.current = nextProgress;
      if (nextStage !== stageRef.current) {
        setLeavingStageIndex(stageRef.current);
        stageRef.current = nextStage;
        setStageIndex(nextStage);
        if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
        transitionTimeout.current = setTimeout(() => setLeavingStageIndex(null), 620);
      }
      setLightProgress(Math.min(1, Math.max(0, (nextProgress - 0.875) / 0.125)));
      animationFrame = window.requestAnimationFrame(updateProgress);
    };
    updateProgress();
    return () => {
      window.cancelAnimationFrame(animationFrame);
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    };
  }, []);

  const hotspot = stages[stageIndex].hotspot?.[mobile ? "mobile" : "desktop"];

  return (
    <section
      className={`ultrakor-model-section${lightProgress > 0.56 ? " is-light" : ""}`}
      aria-labelledby="ultrakor-model-title"
      ref={sectionRef}
      style={{ "--ultrakor-light-progress": lightProgress } as CSSProperties}
    >
      <div className="ultrakor-model-section__sticky">
        {leavingStageIndex !== null ? <StageCopy index={leavingStageIndex} leaving /> : null}
        <StageCopy index={stageIndex} />
        <div className="ultrakor-model-section__progress" aria-hidden="true">
          {stages.map((stage, index) => <span className={index === stageIndex ? "is-active" : ""} key={stage.title}>{String(index + 1).padStart(2, "0")}</span>)}
        </div>
        {hotspot ? (
          <span
            className="ultrakor-model-section__hotspot"
            key={`hotspot-${stageIndex}`}
            style={{ height: hotspot.size, left: hotspot.left, top: hotspot.top, width: hotspot.size }}
            aria-hidden="true"
          />
        ) : null}
        <div className="ultrakor-model-section__stage" aria-label="3D-модель атлетичного мужского тела">
          <Canvas camera={{ fov: mobile ? 34 : 32, position: mobile ? [0, 0.2, 9.2] : [0, 0.2, 7] }}>
            <ambientLight intensity={2.2} />
            <directionalLight intensity={3} position={[3, 5, 4]} />
            <SceneCamera mobile={mobile} progress={progress} />
            <AthleteModel mobile={mobile} progress={progress} />
          </Canvas>
        </div>
      </div>
    </section>
  );
}
