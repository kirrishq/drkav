import { BeforeAfterGallery } from "@/components/before-after-gallery/before-after-gallery";
import { StaticPage } from "@/components/content-page/static-page";
import { createContentRepository } from "@/content/content-repository";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/pacientam/do-i-posle");

export default async function BeforeAfterPage() {
  const cases = await createContentRepository().getBeforeAfterCases();
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "До/после" }]} description="Примеры изменений после операций. Откройте карточку, чтобы сравнить иллюстрации с помощью ползунка и перейти к описанию операции." title="Результаты операций: до и после"><BeforeAfterGallery items={cases} /></StaticPage>;
}
