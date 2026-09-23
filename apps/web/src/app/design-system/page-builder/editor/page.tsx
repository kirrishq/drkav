import type { Metadata } from "next";

import { PageBuilderEditor } from "@/components/page-builder/page-builder-editor";
import { builderPageFixture } from "@/content/builder-page-fixture";

export const metadata: Metadata = {
  title: "Page Builder Editor — drkav",
  description: "Внутренний прототип редактора страниц из блоков.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function PageBuilderEditorPage() {
  return <PageBuilderEditor initialPage={builderPageFixture} />;
}
