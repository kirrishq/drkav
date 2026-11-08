"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ConsultationTrigger } from "@drkav/ui";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { ultrakorZones } from "@/content/ultrakor-zones";
import { useGLTF } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box3, Vector3 } from "three";
import type { CSSProperties, RefObject } from "react";
import type { Group, PerspectiveCamera } from "three";

type StageSide = "left" | "right";
let preservedStage = 0;

function Link(props: ComponentProps<typeof NextLink>) {
  return <NextLink {...props} scroll={false} onClick={event => {
    props.onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    sessionStorage.setItem("ultrakor-model-return", String(window.scrollY));
    preservedStage = Math.max(0, stages.findIndex(stage => stage.title.toUpperCase() === document.querySelector("#ultrakor-model-title")?.textContent?.toUpperCase()));
    document.body.dataset.ultrakorDetail = "true";
  }} />;
}

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
  { rotation: 0, position: [1.6, -3.4, 0], scale: 4.9, camera: [0, 0.2, 7], target: [0, -0.3, 0], fov: 32 },
  { rotation: 0, position: [1.45, -1.7, 0], scale: 4.7, camera: [0, 0.25, 6.3], target: [0, -0.25, 0], fov: 32 },
  { rotation: 0, position: [1.3, -2.25, 0], scale: 4.15, camera: [0, 0.15, 6.6], target: [0, -0.65, 0], fov: 32 },
  { rotation: -Math.PI * 0.28, position: [-1.45, -2.75, 0], scale: 4.65, camera: [0, 0.2, 6.2], target: [0, -0.2, 0], fov: 32 },
  { rotation: -Math.PI, position: [1.25, -2.35, 0], scale: 3.85, camera: [0, 0.2, 6.7], target: [0, -0.75, 0], fov: 32 },
  { rotation: -Math.PI / 2, position: [1.5, -1.55, 0], scale: 3.7, camera: [0, 0.1, 6.9], target: [0, -1.45, 0], fov: 32 },
  { rotation: 0, position: [1.75, -2.25, 0], scale: 3.05, camera: [0, 0.2, 7.4], target: [0, -1.25, 0], fov: 32 },
  { rotation: 0.12, position: [1.75, -2, 0], scale: 3.45, camera: [0, 4.4, 8.5], target: [0, -1.85, 0], fov: 34 },
];

const mobilePoses: readonly Pose[] = [
  { rotation: 0, position: [0.3, -1.7, 0], scale: 2.35, camera: [0, 0.2, 9.2], target: [0, -1.1, 0], fov: 34 },
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

function scrollPose(mobile: boolean, progress: number): Pose {
  const poses = mobile ? mobilePoses : desktopPoses;
  const clamped = Math.max(0, Math.min(poses.length - 1, progress));
  const index = Math.floor(clamped);
  const from = poses[index], to = poses[Math.min(index + 1, poses.length - 1)];
  const amount = smoothstep(clamped - index);
  const vector = (a: readonly number[], b: readonly number[]): [number, number, number] => [interpolate(a[0], b[0], amount), interpolate(a[1], b[1], amount), interpolate(a[2], b[2], amount)];
  return { rotation: interpolate(from.rotation, to.rotation, amount), position: vector(from.position, to.position), scale: interpolate(from.scale, to.scale, amount), camera: vector(from.camera, to.camera), target: vector(from.target, to.target), fov: interpolate(from.fov, to.fov, amount) };
}

function ScrollProgress({ target, current, reducedMotion }: { target: RefObject<number>; current: RefObject<number>; reducedMotion: boolean }) {
  const { invalidate, gl } = useThree();
  useFrame((_, delta) => {
    const remaining = target.current - current.current;
    current.current = reducedMotion || Math.abs(remaining) < 0.0001
      ? target.current
      : current.current + remaining * (1 - Math.exp(-9 * Math.min(delta, 0.05)));
    const moving = current.current !== target.current;
    if (process.env.NODE_ENV === "development") {
      gl.domElement.dataset.scrollProgress = current.current.toFixed(5);
      gl.domElement.dataset.renderFrame = String(gl.info.render.frame);
      gl.domElement.dataset.renderState = moving ? "moving" : "idle";
    }
    if (moving) invalidate();
  }, -1);
  return null;
}

function SceneCamera({ mobile, reducedMotion, stageIndex, scrollProgress }: { mobile: boolean; reducedMotion: boolean; stageIndex: number; scrollProgress?: RefObject<number> }) {
  const { camera, invalidate } = useThree();
  const targetPosition = useRef<[number, number, number]>([...(mobile ? mobilePoses[0].target : desktopPoses[0].target)]);
  const fromCamera = useRef<[number, number, number]>([camera.position.x, camera.position.y, camera.position.z]);
  const fromTarget = useRef<[number, number, number]>([...targetPosition.current]);
  const fromFov = useRef((camera as PerspectiveCamera).fov);
  const transitionStartedAt = useRef<number | null>(null);

  useEffect(() => {
    fromCamera.current = [camera.position.x, camera.position.y, camera.position.z];
    fromTarget.current = [...targetPosition.current];
    fromFov.current = (camera as PerspectiveCamera).fov;
    transitionStartedAt.current = performance.now();
    invalidate();
  }, [camera, invalidate, mobile, reducedMotion, stageIndex]);

  useFrame(() => {
    const pose = scrollProgress ? scrollPose(mobile, scrollProgress.current) : (mobile ? mobilePoses : desktopPoses)[stageIndex];
    // Demand rendering pauses the frame clock while idle. Measure this transition
    // from its own start so the first frame cannot skip the animation.
    const elapsed = transitionStartedAt.current === null
      ? MODEL_TRANSITION_SECONDS
      : Math.min(MODEL_TRANSITION_SECONDS, (performance.now() - transitionStartedAt.current) / 1000);
    const amount = scrollProgress || reducedMotion ? 1 : smoothstep(elapsed / MODEL_TRANSITION_SECONDS);
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
    camera.updateMatrixWorld();
    if (!scrollProgress && !reducedMotion && elapsed < MODEL_TRANSITION_SECONDS) invalidate();
  });

  return null;
}

function AthleteModel({ mobile, reducedMotion, stageIndex, marker, source = "/models/ultrakor/athlete.glb", scrollProgress }: { mobile: boolean; reducedMotion: boolean; stageIndex: number; marker: RefObject<SVGSVGElement | null>; source?: string; scrollProgress?: RefObject<number> }) {
  const group = useRef<Group>(null);
  const { scene: loadedScene } = useGLTF(source);
  const scene = useMemo(() => loadedScene.clone(), [loadedScene]);
  const { invalidate } = useThree();
  const fromRotation = useRef((mobile ? mobilePoses[0] : desktopPoses[0]).rotation);
  const fromPosition = useRef<[number, number, number]>([...(mobile ? mobilePoses[0] : desktopPoses[0]).position]);
  const fromScale = useRef((mobile ? mobilePoses[0] : desktopPoses[0]).scale);
  const transitionStartedAt = useRef<number | null>(null);
  const bounds = useRef<Box3 | null>(null);
  const point = useRef(new Vector3());
  const edge = useRef(new Vector3());
  const { camera, size } = useThree();

  useEffect(() => {
    // Measure the asset before applying the presentation pose.
    const clone = scene.clone();
    clone.position.set(0, 0, 0);
    clone.rotation.set(0, 0, 0);
    clone.scale.setScalar(1);
    bounds.current = new Box3().setFromObject(clone);
  }, [scene]);

  useEffect(() => {
    if (group.current) {
      fromRotation.current = group.current.rotation.y;
      fromPosition.current = [group.current.position.x, group.current.position.y, group.current.position.z];
      fromScale.current = group.current.scale.x;
    }
    transitionStartedAt.current = performance.now();
    invalidate();
  }, [invalidate, mobile, reducedMotion, stageIndex]);

  useFrame(() => {
    if (!group.current) return;
    const pose = scrollProgress ? scrollPose(mobile, scrollProgress.current) : (mobile ? mobilePoses : desktopPoses)[stageIndex];
    // Demand rendering pauses the frame clock while idle. Measure this transition
    // from its own start so the first frame cannot skip the animation.
    const elapsed = transitionStartedAt.current === null
      ? MODEL_TRANSITION_SECONDS
      : Math.min(MODEL_TRANSITION_SECONDS, (performance.now() - transitionStartedAt.current) / 1000);
    const amount = scrollProgress || reducedMotion ? 1 : smoothstep(elapsed / MODEL_TRANSITION_SECONDS);
    group.current.rotation.y = interpolate(fromRotation.current, pose.rotation, amount);
    group.current.position.x = interpolate(fromPosition.current[0], pose.position[0], amount);
    group.current.position.y = interpolate(fromPosition.current[1], pose.position[1], amount);
    group.current.position.z = interpolate(fromPosition.current[2], pose.position[2], amount);
    group.current.scale.x = interpolate(fromScale.current, pose.scale, amount);
    group.current.scale.y = group.current.scale.x;
    group.current.scale.z = group.current.scale.x;
    const zones = [null, [-0.05, 0.717, 0.10, 0.055], [0, 0.625, 0.10, 0.085], [0.14, 0.70, 0.01, 0.075], [0, 0.65, -0.10, 0.14], [0.06, 0.465, -0.09, 0.065]] as const;
    const zone = zones[stageIndex];
    if (zone && bounds.current && marker.current) {
      const box = bounds.current;
      const height = box.max.y - box.min.y;
      const centerX = (box.min.x + box.max.x) / 2;
      const centerZ = (box.min.z + box.max.z) / 2;
      point.current.set(centerX + zone[0] * height, box.min.y + zone[1] * height, centerZ + zone[2] * height);
      group.current.updateWorldMatrix(true, false);
      group.current.localToWorld(point.current);
      edge.current.copy(point.current);
      // Camera-right radius keeps the overlay circular at every viewing angle.
      edge.current.addScaledVector(new Vector3().setFromMatrixColumn(camera.matrixWorld, 0), zone[3] * height * group.current.scale.x);
      point.current.project(camera);
      edge.current.project(camera);
      const diameter = Math.abs(edge.current.x - point.current.x) * size.width;
      marker.current.style.left = `${(point.current.x + 1) * size.width / 2}px`;
      marker.current.style.top = `${(1 - point.current.y) * size.height / 2}px`;
      marker.current.style.width = `${diameter}px`;
      marker.current.style.height = `${diameter}px`;
    }
    if (!scrollProgress && !reducedMotion && elapsed < MODEL_TRANSITION_SECONDS) invalidate();
  });

  const initialPose = useRef((mobile ? mobilePoses : desktopPoses)[stageIndex]).current;
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
      {index > 0 && stage.price ? <p className="ultrakor-model-section__price">{stage.price}</p> : null}
      {index >= 1 && index <= ultrakorZones.length ? <Link className="ultrakor-model-section__details" href={`/ultrakor/${ultrakorZones[index - 1].slug}`} tabIndex={leaving ? -1 : undefined}>Подробнее <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14"><path d="M10.8101 1.96222L0.726954 12.0453L1.66171 12.9801L11.7448 2.89698L11.9344 9.4447L13.208 9.07311L13.0134 2.35278C12.9877 1.46249 12.2434 0.718185 11.3531 0.692412L4.80762 0.502924L4.43487 1.77539L10.8101 1.96222Z" fill="currentColor" stroke="currentColor" strokeWidth="0.542084" /></svg><span className="sr-only">: {stage.title}</span></Link> : null}
      {index === stages.length - 1 ? <ConsultationTrigger className="ultrakor__button ultrakor__button--solid ultrakor-model-section__cta">Записаться на консультацию</ConsultationTrigger> : null}
    </div>
  );
}

// Resolve the viewport before loading so phones never download the desktop GLB.

/** Development comparison uses the production poses and lighting unchanged. */
export function UltrakorPosePreview({ stageIndex, source, mobile }: { stageIndex: number; source: string; mobile: boolean }) {
  const marker = useRef<SVGSVGElement>(null);
  const pose = (mobile ? mobilePoses : desktopPoses)[stageIndex];
  return <Canvas camera={{ fov: pose.fov, position: [...pose.camera] }} dpr={1} frameloop="demand" gl={{ antialias: !mobile }}>
    <ambientLight intensity={2.2} /><directionalLight intensity={3} position={[3,5,4]} />
    <SceneCamera stageIndex={stageIndex} mobile={mobile} reducedMotion />
    <AthleteModel stageIndex={stageIndex} source={source} mobile={mobile} reducedMotion marker={marker} />
  </Canvas>;
}

function FootModel({ source }: { source: string }) {
  const { scene } = useGLTF(source);
  const copy = useMemo(() => scene.clone(), [scene]);
  return <primitive object={copy} />;
}
export function UltrakorFootPreview({ source, side }: { source: string; side: boolean }) {
  return <Canvas key={String(side)} camera={{ fov: 25, position: side ? [1.1,-.9,0] : [0,-.9,1.1] }} onCreated={({camera})=>camera.lookAt(0,-.9,0)} dpr={1.5} frameloop="demand"><ambientLight intensity={2.2}/><directionalLight intensity={3} position={[3,5,4]}/><FootModel source={source}/></Canvas>;
}

export function UltrakorModelSection() {
  const pathname = usePathname();
  const sectionRef = useRef<HTMLElement>(null);
  const markerRef = useRef<SVGSVGElement>(null);
  const [leavingMarker, setLeavingMarker] = useState<CSSProperties | null>(null);
  const stageRef = useRef(preservedStage);
  const scrollTarget = useRef(preservedStage);
  const scrollCurrent = useRef(preservedStage);
  const wakeScene = useRef<(() => void) | null>(null);
  const gestureDelta = useRef(0);
  const gestureLocked = useRef(false);
  const touchStart = useRef<number | null>(null);
  const gestureTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [stageIndex, setStageIndex] = useState(preservedStage);
  const [leavingStageIndex, setLeavingStageIndex] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);
  const [viewportReady, setViewportReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const zone = ultrakorZones.findIndex(item => pathname === `/ultrakor/${item.slug}`);
    if (zone < 0) return;
    const selectedStage = zone + 1;
    preservedStage = selectedStage;
    stageRef.current = selectedStage;
    scrollTarget.current = selectedStage;
    wakeScene.current?.();
    setStageIndex(selectedStage);
  }, [pathname]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const updateMobile = () => { setMobile(media.matches); setViewportReady(true); };
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
    const marker = markerRef.current;
    setLeavingMarker(marker ? { left: marker.style.left, top: marker.style.top, width: marker.style.width, height: marker.style.height } : null);
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
    let pendingFrame = 0;
    const syncFromScroll = () => {
      pendingFrame = 0;
      if (document.body.dataset.ultrakorDetail || document.querySelector("dialog[open]")) return;
      const section = sectionRef.current;
      if (!section) return;
      const bounds = section.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(stages.length - 1, Math.max(0, -bounds.top / distance * (stages.length - 1)));
      if (mobile && gestureLocked.current) return;
      if (!mobile && scrollTarget.current !== progress) {
        scrollTarget.current = progress;
        wakeScene.current?.();
      }
      activateStage(Math.round(progress), false);
    };
    const scheduleSync = () => {
      if (!pendingFrame) pendingFrame = window.requestAnimationFrame(syncFromScroll);
    };
    scheduleSync();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);
    return () => {
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      window.cancelAnimationFrame(pendingFrame);
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    };
  }, [activateStage, mobile]);

  useEffect(() => {
    if (!mobile || !viewportReady) return;
    const isSectionActive = () => {
      if (document.querySelector("dialog[open]")) return false;
      if (!sectionRef.current) return;
      const bounds = sectionRef.current.getBoundingClientRect();
      return bounds.top <= 2 && bounds.bottom >= window.innerHeight - 2;
    };
    const lockGesture = () => {
      gestureLocked.current = true;
      if (gestureTimeout.current) clearTimeout(gestureTimeout.current);
      gestureLocked.current = false;
      gestureDelta.current = 0;
      touchStart.current = null;
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
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      if (gestureTimeout.current) clearTimeout(gestureTimeout.current);
    };
  }, [activateStage, reducedMotion, mobile, viewportReady]);

  const hotspot = stages[stageIndex].hotspot;

  return (
    <section
      className={`ultrakor-model-section${stageIndex === stages.length - 1 ? " is-light" : ""}`}
      aria-labelledby="ultrakor-model-title"
      ref={sectionRef}
    >
      <div className="ultrakor-model-section__sticky">
        {leavingStageIndex !== null ? <StageCopy index={leavingStageIndex} leaving /> : null}
        <StageCopy index={stageIndex} />
        {leavingMarker && leavingStageIndex !== null ? <svg viewBox="0 0 100 100" className="ultrakor-model-section__hotspot is-leaving" style={leavingMarker} aria-hidden="true"><circle className="ultrakor-model-section__hotspot-ring" cx="50" cy="50" r="47" pathLength="1" /></svg> : null}
        {stageIndex < stages.length - 1 ? <button className="ultrakor-model-section__progress ultrakor-model-section__skip" type="button" onClick={() => {
          if (mobile) {
            gestureLocked.current = true;
            if (gestureTimeout.current) clearTimeout(gestureTimeout.current);
            activateStage(stages.length - 1);
            gestureTimeout.current = setTimeout(() => { gestureLocked.current = false; gestureDelta.current = 0; }, GESTURE_LOCK_MS);
            return;
          }
          const section = sectionRef.current;
          if (!section) return;
          window.scrollTo({ top: window.scrollY + section.getBoundingClientRect().top + section.offsetHeight - window.innerHeight, behavior: reducedMotion ? "auto" : "smooth" });
        }}>Пропустить анимацию <svg className="ultrakor-model-section__skip-arrow" aria-hidden="true" width="10" height="10" viewBox="0 0 14 14"><path d="M10.8101 1.96222L0.726954 12.0453L1.66171 12.9801L11.7448 2.89698L11.9344 9.4447L13.208 9.07311L13.0134 2.35278C12.9877 1.46249 12.2434 0.718185 11.3531 0.692412L4.80762 0.502924L4.43487 1.77539L10.8101 1.96222Z" fill="currentColor" stroke="currentColor" strokeWidth="0.542084" /></svg></button> : null}
        {hotspot ? (
          <svg
            ref={markerRef}
            viewBox="0 0 100 100"
            className="ultrakor-model-section__hotspot"
            key={`hotspot-${stageIndex}`}
            aria-hidden="true"
          ><circle className="ultrakor-model-section__hotspot-ring" cx="50" cy="50" r="47" pathLength="1" /></svg>
        ) : null}
        <div className="ultrakor-model-section__stage" aria-label="3D-модель атлетичного мужского тела">
          {viewportReady ? <Canvas
            camera={{ fov: mobile ? 34 : 32, position: mobile ? [0, 0.2, 9.2] : [0, 0.2, 7] }}
            dpr={[1, 1.5]}
            frameloop="demand"
            onCreated={({ invalidate }) => { wakeScene.current = invalidate; invalidate(); }}
            gl={{ antialias: !mobile, powerPreference: "high-performance" }}
          >
            <ambientLight intensity={2.2} />
            <directionalLight intensity={3} position={[3, 5, 4]} />
            {!mobile ? <ScrollProgress target={scrollTarget} current={scrollCurrent} reducedMotion={reducedMotion} /> : null}
            <SceneCamera mobile={mobile} reducedMotion={reducedMotion} stageIndex={stageIndex} scrollProgress={mobile ? undefined : scrollCurrent} />
            <AthleteModel mobile={mobile} reducedMotion={reducedMotion} stageIndex={stageIndex} marker={markerRef} scrollProgress={mobile ? undefined : scrollCurrent} source={mobile ? "/models/ultrakor/athlete-mobile-100k.glb?feet=1" : "/models/ultrakor/athlete.glb?feet=1"} />
          </Canvas> : null}
        </div>
      </div>
    </section>
  );
}
