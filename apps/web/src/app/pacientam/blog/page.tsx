import { BlogIndex } from "@/components/blog/blog-index";
import { StaticPage } from "@/components/content-page/static-page";
import { createContentRepository } from "@/content/content-repository";

export const metadata = { title: "Блог доктора Коробова", description: "Статьи и профессиональные комментарии о пластической хирургии." };

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const blog = await createContentRepository().getBlogIndex();
  const activeCategory = blog.categories.some((item) => item.key === category) ? category : undefined;

  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Блог доктора" }]} description="Статьи и профессиональные комментарии о пластической хирургии, подготовке и восстановлении." title="Блог доктора Коробова"><BlogIndex {...blog} activeCategory={activeCategory} /></StaticPage>;
}
