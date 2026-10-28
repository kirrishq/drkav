"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MutableRefObject } from "react";
import type { Group } from "three";

const stages = [
  { title: "Как работает Ультракор", text: "Методика сочетает удаление лишних жировых отложений и точное моделирование пропорций с учётом мужской анатомии. Цель — не просто уменьшить объём, а сделать силуэт более рельефным и гармоничным.", price: "от 60 000 ₽" },
  { title: "Грудь", text: "Коррекция грудной зоны помогает сделать верх корпуса более собранным, выразительным и мужественным. Мы подчёркиваем форму, убираем лишний объём и при необходимости добавляем нужный контур через липофилинг.", price: "от 40 000 ₽" },
  { title: "Живот", text: "Плоский и рельефный живот — основа атлетичного силуэта. В этой зоне мы убираем лишние жировые отложения и подчёркиваем линии пресса, чтобы тело выглядело более подтянутым и структурным.", price: "от 80 000 ₽" },
  { title: "Руки и плечи", text: "Линия плеча и рук сильно влияет на ощущение силы всего силуэта. Мы подчёркиваем дельтовидную зону и визуальную форму бицепса и трицепса, чтобы верхняя часть тела выглядела плотнее и спортивнее.", price: "от 60 000 ₽" },
  { title: "Спина", text: "Спина задаёт ширину, V-форму и ощущение мощного корпуса. Мы работаем с зонами, которые скрывают рельеф, и подчёркиваем линию широчайших мышц и поясницы.", price: "от 60 000 ₽" },
  { title: "Ягодицы", text: "Ягодичная зона влияет на баланс пропорций и общий спортивный вид тела. При необходимости мы добавляем объём и формируем более гармоничный, подтянутый и естественный контур.", price: "от 60 000 ₽" },
  { title: "Жировая ткань как естественный и надёжный филлер", text: "Липофилинг — это безопасная методика коррекции, при которой используется собственная жировая ткань пациента. Она полностью биосовместима, поэтому риск аллергии или отторжения сводится к минимуму." },
  { title: "Взгляните на себя по-другому за 4 шага", text: "Консультация. Липосакция. Липофилинг. Реабилитация. Врач оценивает пропорции, убирает локальные жировые отложения, использует собственные ткани для нужного объёма и сопровождает восстановление." },
] as const;

const hotspots = [
  null,
  { left: "43%", top: "34%", size: "13vw" },
  { left: "49%", top: "54%", size: "16vw" },
  { left: "25%", top: "39%", size: "14vw" },
  { left: "49%", top: "39%", size: "18vw" },
  { left: "58%", top: "58%", size: "18vw" },
  null,
  null,
] as const;

const cameraStages = [
  { rotation: Math.PI * 0.5, x: 1.6, y: -3.4, scale: 4.9, camera: [0, 0.2, 7] },
  { rotation: Math.PI * 0.5, x: 1.1, y: -3.1, scale: 5.8, camera: [0, 0.3, 5.1] },
  { rotation: Math.PI * 0.5, x: 1.15, y: -3.2, scale: 5.5, camera: [0, 0.15, 5.5] },
  { rotation: Math.PI * 0.35, x: -1.3, y: -3.1, scale: 5.8, camera: [0, 0.15, 5.2] },
  { rotation: Math.PI * 1.0, x: 0.2, y: -3.2, scale: 5.2, camera: [0, 0.2, 5.8] },
  { rotation: Math.PI * 0.55, x: -0.2, y: -3.2, scale: 5.7, camera: [0, 0.15, 5.3] },
  { rotation: Math.PI * 0.5, x: 1.5, y: -3.4, scale: 4.7, camera: [0, 0.2, 7] },
  { rotation: Math.PI * 0.5, x: 1.5, y: -3.2, scale: 4.8, camera: [0, 3.6, 7.2] },
] as const;

function interpolate(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function SceneCamera({ progress }: { progress: MutableRefObject<number> }) {
  const { camera } = useThree();
  const isMobile = useRef(typeof window !== "undefined" && window.innerWidth <= 700).current;

  useFrame((_, delta) => {
    const position = Math.min(cameraStages.length - 1, progress.current * cameraStages.length);
    const index = Math.floor(position);
    const nextIndex = Math.min(cameraStages.length - 1, index + 1);
    const amount = position - index;
    const target = cameraStages[nextIndex];
    const from = cameraStages[index];
    camera.position.x += (interpolate(from.camera[0], target.camera[0], amount) - camera.position.x) * Math.min(delta * 6, 1);
    camera.position.y += (interpolate(from.camera[1], target.camera[1], amount) - camera.position.y) * Math.min(delta * 6, 1);
    const targetCameraZ = interpolate(from.camera[2], target.camera[2], amount) * (isMobile ? 1.65 : 1);
    camera.position.z += (targetCameraZ - camera.position.z) * Math.min(delta * 6, 1);
    const lookAtY = progress.current > 0.78 ? -1.8 : -0.3;
    camera.lookAt(0, lookAtY, 0);
  });

  return null;
}

function AthleteModel({ progress }: { progress: MutableRefObject<number> }) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF("/models/ultrakor/athlete.glb");
  const isMobile = useRef(typeof window !== "undefined" && window.innerWidth <= 700).current;

  useFrame((_, delta) => {
    if (!group.current) return;
    const position = Math.min(cameraStages.length - 1, progress.current * cameraStages.length);
    const index = Math.floor(position);
    const nextIndex = Math.min(cameraStages.length - 1, index + 1);
    const amount = position - index;
    const from = cameraStages[index];
    const target = cameraStages[nextIndex];
    group.current.rotation.y += (interpolate(from.rotation, target.rotation, amount) - group.current.rotation.y) * Math.min(delta * 6, 1);
    const targetX = interpolate(from.x, target.x, amount) * (isMobile ? 0.45 : 1);
    group.current.position.x += (targetX - group.current.position.x) * Math.min(delta * 6, 1);
    const targetY = interpolate(from.y, target.y, amount) * (isMobile ? 0.38 : 1);
    group.current.position.y += (targetY - group.current.position.y) * Math.min(delta * 6, 1);
    const targetScale = interpolate(from.scale, target.scale, amount) * (isMobile ? 0.34 : 1);
    group.current.scale.x += (targetScale - group.current.scale.x) * Math.min(delta * 6, 1);
    group.current.scale.y = group.current.scale.x;
    group.current.scale.z = group.current.scale.x;
  });

  return <primitive object={scene} ref={group} scale={isMobile ? 1.65 : 4.8} position={[isMobile ? 0.2 : 1.5, -1.25, 0]} />;
}

useGLTF.preload("/models/ultrakor/athlete.glb");

export function UltrakorModelSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [lightProgress, setLightProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      if (!sectionRef.current) return;
      const bounds = sectionRef.current.getBoundingClientRect();
      const nextProgress = Math.min(1, Math.max(0, -bounds.top / Math.max(bounds.height - window.innerHeight, 1)));
      progress.current = nextProgress;
      setStageIndex(Math.min(stages.length - 1, Math.floor(nextProgress * stages.length)));
      setLightProgress(Math.min(1, Math.max(0, (nextProgress - 0.875) / 0.125)));
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <section className={`ultrakor-model-section${lightProgress > 0.01 ? " is-light" : ""}`} aria-labelledby="ultrakor-model-title" ref={sectionRef} style={{ "--ultrakor-light-progress": lightProgress } as CSSProperties}>
      <div className="ultrakor-model-section__sticky">
        <div className={`ultrakor-model-section__copy ultrakor-model-section__copy--${stageIndex % 2 ? "from-right" : "from-left"}`} key={stageIndex}>
          <h2 className="ultrakor__heading" id="ultrakor-model-title">{stages[stageIndex].title}</h2>
          <p>{stages[stageIndex].text}</p>
          {"price" in stages[stageIndex] ? <p className="ultrakor-model-section__price">{stages[stageIndex].price}</p> : null}
          {stageIndex === stages.length - 1 ? <a className="ultrakor__button ultrakor__button--solid ultrakor-model-section__cta" href="#contact">Записаться на консультацию</a> : null}
        </div>
        <div className="ultrakor-model-section__progress" aria-hidden="true">
          {stages.map((stage, index) => <span className={index === stageIndex ? "is-active" : ""} key={stage.title}>{String(index + 1).padStart(2, "0")}</span>)}
        </div>
        {hotspots[stageIndex] ? <span className="ultrakor-model-section__hotspot" style={{ height: hotspots[stageIndex].size, left: hotspots[stageIndex].left, top: hotspots[stageIndex].top, width: hotspots[stageIndex].size }} aria-hidden="true" /> : null}
        <div className="ultrakor-model-section__stage" aria-label="3D-модель атлетичного мужского тела">
          <Canvas camera={{ fov: 32, position: [0, 0.2, 7] }}>
            <ambientLight intensity={2.2} />
            <directionalLight intensity={3} position={[3, 5, 4]} />
            <SceneCamera progress={progress} />
            <AthleteModel progress={progress} />
          </Canvas>
        </div>
      </div>
    </section>
  );
}
