import { ConsultationSection } from "@drkav/ui";

import { StaticPage } from "@/components/content-page/static-page";
import { getPageMetadata } from "@/content/page-registry";
import { getStaticPageMetadata } from "@/content/static-page";

export async function generateMetadata() {
  return getStaticPageMetadata("consultation", getPageMetadata("/konsultaciya", {
    title: "Консультация пластического хирурга — DrKAV",
    description: "Запись на очную или онлайн-консультацию с доктором Коробовым.",
    canonicalPath: "/konsultaciya",
  }));
}

export default function ConsultationPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { label: "Консультация" }]} className="consultation-page" description="Запись на очную или онлайн-консультацию с доктором Коробовым." pageKey="consultation" title="Консультация пластического хирурга"><ConsultationSection captchaSiteKey={process.env.NEXT_PUBLIC_SMARTCAPTCHA_SITE_KEY} submitUrl="/api/forms/consultation" /></StaticPage>;
}
