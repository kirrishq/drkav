import type { Metadata } from "next";

import "@/styles/ultrakor.css";
import { UltrakorAtmosphere } from "@/components/ultrakor-atmosphere";
import { UltrakorBackToTop } from "@/components/ultrakor-back-to-top";
import { UltrakorFooter } from "@/components/ultrakor-footer";

export const metadata: Metadata = {
  title: "ULTRAKOR — мужская атлетизация",
  description: "Мужская атлетизация и хирургическая коррекция тела с Артёмом Коробовым.",
};

export default function UltrakorLayout({ children, detail }: Readonly<{ children: React.ReactNode; detail: React.ReactNode }>) {
  return <div className="ultrakor"><UltrakorAtmosphere />{children}<UltrakorFooter />{detail}<UltrakorBackToTop /></div>;
}
