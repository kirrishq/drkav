import { notFound } from "next/navigation";
import { UltrakorModelComparison } from "@/components/ultrakor-model-comparison";
export const metadata = { title: "Сравнение моделей Ультракора", robots: { index: false, follow: false } };
export default function ComparisonPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <UltrakorModelComparison />;
}
