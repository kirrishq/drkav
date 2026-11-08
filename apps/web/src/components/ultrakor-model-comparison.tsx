"use client";
import { useState } from "react";
import { UltrakorPosePreview, UltrakorFootPreview } from "./ultrakor-model-section";

const poses = ["Общий вид", "Грудь", "Живот", "Руки и плечи", "Спина", "Ягодицы", "Липофилинг", "Финальный ракурс"];
export function UltrakorModelComparison() {
  const [stage, setStage] = useState(0);
  const [mobile, setMobile] = useState(true);
  const [feet, setFeet] = useState(false);
  return <main className="ultrakor-comparison">
    <h1>Сравнение моделей</h1>
    <p>Одинаковые позы, освещение и камера. Оригинал остаётся на основном сайте.</p>
    <nav aria-label="Ракурсы модели">{poses.map((name,index)=><button type="button" aria-pressed={stage===index} key={name} onClick={()=>setStage(index)}>{name}</button>)}</nav>
    <button type="button" onClick={()=>setMobile(!mobile)}>{mobile ? "Мобильные ракурсы" : "Десктопные ракурсы"} — переключить</button>
    <button type="button" onClick={()=>setFeet(!feet)}>{feet ? "Вернуться к телу" : "Стопы крупно"}</button>
    <div className="ultrakor-comparison__grid">{[["Оригинал · 246 192 треугольника", "athlete.glb"],["100 000 · 1,80 МБ", "athlete-mobile-100k.glb"],["59 996 · 1,08 МБ", "athlete-mobile-60k.glb"]].map(([title,file])=><section key={file}><h2>{title}</h2><div className="ultrakor-comparison__canvas">{feet ? <UltrakorFootPreview source={`/models/ultrakor/${file}`} side={mobile}/> : <UltrakorPosePreview stageIndex={stage} mobile={mobile} source={`/models/ultrakor/${file}`} />}</div></section>)}</div>
  </main>;
}
