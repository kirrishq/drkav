import { BlogIndex } from "@/components/blog/blog-index";
import { PatientSubpageLayout } from "@/components/patient-page/patient-subpage-layout";
import { StaticPage } from "@/components/content-page/static-page";
import { PatientRelatedPages } from "@/components/patient-related-pages/patient-related-pages";
import { createContentRepository } from "@/content/content-repository";

export const metadata = { title: "Блог доктора Коробова", description: "Статьи и профессиональные комментарии о пластической хирургии." };

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const blog = await createContentRepository().getBlogIndex();
  const activeCategory = blog.categories.some((item) => item.key === category) ? category : undefined;

  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Блог доктора" }]} className="patient-subpage-page" description="Статьи и профессиональные комментарии о пластической хирургии, подготовке и восстановлении." title="Блог доктора Коробова"><PatientSubpageLayout><BlogIndex {...blog} activeCategory={activeCategory} /></PatientSubpageLayout><PatientRelatedPages currentHref="/pacientam/blog" /></StaticPage>;
}
