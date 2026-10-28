import type { Metadata } from "next";

import "@/styles/ultrakor.css";

export const metadata: Metadata = {
  title: "ULTRAKOR — мужская атлетизация",
  description: "Мужская атлетизация и хирургическая коррекция тела с Артёмом Коробовым.",
};

export default function UltrakorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="ultrakor">{children}</div>;
}
