import type { Metadata } from "next";
import type React from "react";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "drkav.ru — редизайн",
  description: "Frontend-first редизайн сайта drkav.ru",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
