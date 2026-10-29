"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useCallback, useEffect, useRef, useState } from "react";
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

const MODEL_TRANSITION_SECONDS = 1.6;
const TEXT_TRANSITION_MS = 1300;
const GESTURE_LOCK_MS = 1750;

function interpolate(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function smoothstep(amount: number) {
  return amount * amount * (3 - 2 * amount);
}

function SceneCamera({ mobile, reducedMotion, stageIndex }: { mobile: boolean; reducedMotion: boolean; stageIndex: number }) {
  const { camera, invalidate } = useThree();
  const targetPosition = useRef<[number, number, number]>([...(mobile ? mobilePoses[0].target : desktopPoses[0].target)]);
  const fromCamera = useRef<[number, number, number]>([camera.position.x, camera.position.y, camera.position.z]);
  const fromTarget = useRef<[number, number, number]>([...targetPosition.current]);
  const fromFov = useRef((camera as PerspectiveCamera).fov);
  const elapsed = useRef(MODEL_TRANSITION_SECONDS);

  useEffect(() => {
    fromCamera.current = [camera.position.x, camera.position.y, camera.position.z];
    fromTarget.current = [...targetPosition.current];
    fromFov.current = (camera as PerspectiveCamera).fov;
    elapsed.current = reducedMotion ? MODEL_TRANSITION_SECONDS : 0;
    invalidate();
  }, [camera, invalidate, mobile, reducedMotion, stageIndex]);

  useFrame((_, delta) => {
    const pose = (mobile ? mobilePoses : desktopPoses)[stageIndex];
    elapsed.current = Math.min(MODEL_TRANSITION_SECONDS, elapsed.current + delta);
    const amount = reducedMotion ? 1 : smoothstep(elapsed.current / MODEL_TRANSITION_SECONDS);
    camera.position.x = interpolate(fromCamera.current[0], pose.camera[0], amount);
    camera.position.y = interpolate(fromCamera.current[1], pose.camera[1], amount);
    camera.position.z = interpolate(fromCamera.current[2], pose.camera[2], amount);
    targetPosition.current[0] = interpolate(fromTarget.current[0], pose.target[0], amount);
    targetPosition.current[1] = interpolate(fromTarget.current[1], pose.target[1], amount);
    targetPosition.current[2] = interpolate(fromTarget.current[2], pose.target[2], amount);
    camera.lookAt(...targetPosition.current);
    const perspectiveCamera = camera as PerspectiveCamera;
    perspectiveCamera.fov = interpolate(fromFov.current, pose.fov, amount);
    perspectiveCamera.updateProjectionMatrix();
    if (elapsed.current < MODEL_TRANSITION_SECONDS) invalidate();
  });

  return null;
}

function AthleteModel({ mobile, reducedMotion, stageIndex }: { mobile: boolean; reducedMotion: boolean; stageIndex: number }) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF("/models/ultrakor/athlete.glb");
  const { invalidate } = useThree();
  const fromRotation = useRef((mobile ? mobilePoses[0] : desktopPoses[0]).rotation);
  const fromPosition = useRef<[number, number, number]>([...(mobile ? mobilePoses[0] : desktopPoses[0]).position]);
  const fromScale = useRef((mobile ? mobilePoses[0] : desktopPoses[0]).scale);
  const elapsed = useRef(MODEL_TRANSITION_SECONDS);

  useEffect(() => {
    if (group.current) {
      fromRotation.current = group.current.rotation.y;
      fromPosition.current = [group.current.position.x, group.current.position.y, group.current.position.z];
      fromScale.current = group.current.scale.x;
    }
    elapsed.current = reducedMotion ? MODEL_TRANSITION_SECONDS : 0;
    invalidate();
  }, [invalidate, mobile, reducedMotion, stageIndex]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const pose = (mobile ? mobilePoses : desktopPoses)[stageIndex];
    elapsed.current = Math.min(MODEL_TRANSITION_SECONDS, elapsed.current + delta);
    const amount = reducedMotion ? 1 : smoothstep(elapsed.current / MODEL_TRANSITION_SECONDS);
    group.current.rotation.y = interpolate(fromRotation.current, pose.rotation, amount);
    group.current.position.x = interpolate(fromPosition.current[0], pose.position[0], amount);
    group.current.position.y = interpolate(fromPosition.current[1], pose.position[1], amount);
    group.current.position.z = interpolate(fromPosition.current[2], pose.position[2], amount);
    group.current.scale.x = interpolate(fromScale.current, pose.scale, amount);
    group.current.scale.y = group.current.scale.x;
    group.current.scale.z = group.current.scale.x;
    if (elapsed.current < MODEL_TRANSITION_SECONDS) invalidate();
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
  const stageRef = useRef(0);
  const gestureDelta = useRef(0);
  const gestureLocked = useRef(false);
  const touchStart = useRef<number | null>(null);
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gestureTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [leavingStageIndex, setLeavingStageIndex] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const updateMobile = () => setMobile(media.matches);
    updateMobile();
    media.addEventListener("change", updateMobile);
    return () => media.removeEventListener("change", updateMobile);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => setReducedMotion(media.matches);
    updateReducedMotion();
    media.addEventListener("change", updateReducedMotion);
    return () => media.removeEventListener("change", updateReducedMotion);
  }, []);

  const activateStage = useCallback((nextStage: number, scroll = true) => {
    const clampedStage = Math.min(stages.length - 1, Math.max(0, nextStage));
    if (clampedStage === stageRef.current) return;
    setLeavingStageIndex(stageRef.current);
    stageRef.current = clampedStage;
    setStageIndex(clampedStage);
    if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    transitionTimeout.current = setTimeout(() => setLeavingStageIndex(null), reducedMotion ? 0 : TEXT_TRANSITION_MS);
    if (scroll && sectionRef.current) {
      const sectionTop = window.scrollY + sectionRef.current.getBoundingClientRect().top;
      window.scrollTo({ top: sectionTop + clampedStage * window.innerHeight, behavior: reducedMotion ? "auto" : "smooth" });
    }
  }, [reducedMotion]);

  useEffect(() => {
    const isSectionActive = () => {
      if (!sectionRef.current) return;
      const bounds = sectionRef.current.getBoundingClientRect();
      return bounds.top <= 2 && bounds.bottom >= window.innerHeight - 2;
    };
    const lockGesture = () => {
      gestureLocked.current = true;
      if (gestureTimeout.current) clearTimeout(gestureTimeout.current);
      gestureTimeout.current = setTimeout(() => {
        gestureLocked.current = false;
        gestureDelta.current = 0;
      }, reducedMotion ? 180 : GESTURE_LOCK_MS);
    };
    const moveStage = (direction: -1 | 1) => {
      const nextStage = stageRef.current + direction;
      if (nextStage < 0 || nextStage >= stages.length) return false;
      lockGesture();
      activateStage(nextStage);
      return true;
    };
    const handleWheel = (event: WheelEvent) => {
      if (!isSectionActive() || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const leavingSection = (stageRef.current === 0 && event.deltaY < 0) || (stageRef.current === stages.length - 1 && event.deltaY > 0);
      if (leavingSection) return;
      event.preventDefault();
      if (gestureLocked.current) return;
      gestureDelta.current += event.deltaY;
      if (Math.abs(gestureDelta.current) < 42) return;
      moveStage(gestureDelta.current > 0 ? 1 : -1);
      gestureDelta.current = 0;
    };
    const handleTouchStart = (event: TouchEvent) => {
      if (!isSectionActive()) return;
      touchStart.current = event.touches[0]?.clientY ?? null;
    };
    const handleTouchMove = (event: TouchEvent) => {
      if (touchStart.current === null || !isSectionActive()) return;
      const currentY = event.touches[0]?.clientY;
      if (currentY === undefined) return;
      const delta = touchStart.current - currentY;
      const leavingSection = (stageRef.current === 0 && delta < 0) || (stageRef.current === stages.length - 1 && delta > 0);
      if (!leavingSection) event.preventDefault();
    };
    const handleTouchEnd = (event: TouchEvent) => {
      if (touchStart.current === null || !isSectionActive()) return;
      const endY = event.changedTouches[0]?.clientY ?? touchStart.current;
      const delta = touchStart.current - endY;
      touchStart.current = null;
      if (gestureLocked.current || Math.abs(delta) < 42) return;
      moveStage(delta > 0 ? 1 : -1);
    };
    const syncStageFromScroll = () => {
      if (!sectionRef.current || gestureLocked.current) return;
      const sectionTop = window.scrollY + sectionRef.current.getBoundingClientRect().top;
      const localScroll = window.scrollY - sectionTop;
      if (localScroll < 0 || localScroll > sectionRef.current.offsetHeight - window.innerHeight) return;
      const nextStage = Math.min(stages.length - 1, Math.max(0, Math.round(localScroll / window.innerHeight)));
      if (nextStage !== stageRef.current) activateStage(nextStage, false);
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("scroll", syncStageFromScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("scroll", syncStageFromScroll);
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
      if (gestureTimeout.current) clearTimeout(gestureTimeout.current);
    };
  }, [activateStage, reducedMotion]);

  useEffect(() => {
    const handleResize = () => {
      if (!sectionRef.current) return;
      const sectionTop = window.scrollY + sectionRef.current.getBoundingClientRect().top;
      const sectionBottom = sectionTop + sectionRef.current.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY <= sectionBottom - window.innerHeight) {
        window.scrollTo({ top: sectionTop + stageRef.current * window.innerHeight });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const hotspot = stages[stageIndex].hotspot?.[mobile ? "mobile" : "desktop"];

  return (
    <section
      className={`ultrakor-model-section${stageIndex === stages.length - 1 ? " is-light" : ""}`}
      aria-labelledby="ultrakor-model-title"
      ref={sectionRef}
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
          <Canvas
            camera={{ fov: mobile ? 34 : 32, position: mobile ? [0, 0.2, 9.2] : [0, 0.2, 7] }}
            dpr={[1, 1.5]}
            frameloop="demand"
            gl={{ antialias: !mobile, powerPreference: "high-performance" }}
          >
            <ambientLight intensity={2.2} />
            <directionalLight intensity={3} position={[3, 5, 4]} />
            <SceneCamera mobile={mobile} reducedMotion={reducedMotion} stageIndex={stageIndex} />
            <AthleteModel mobile={mobile} reducedMotion={reducedMotion} stageIndex={stageIndex} />
          </Canvas>
        </div>
      </div>
    </section>
  );
}
