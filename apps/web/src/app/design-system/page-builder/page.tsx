import type { Metadata } from "next";

import { PageBuilderRenderer } from "@/components/page-builder/page-builder-renderer";
import { builderPageFixture } from "@/content/builder-page-fixture";

export const metadata: Metadata = {
  title: "Page Builder — drkav",
  description: "Внутренняя демонстрация страницы из блоков.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function PageBuilderDemoPage() {
  return <PageBuilderRenderer page={builderPageFixture} />;
}
