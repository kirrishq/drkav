import { RegistryScaffoldPage } from "@/components/content-page/registry-scaffold-page";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/konsultacii/ochnaya-konsultaciya-v-klinike");

export default function InPersonConsultationPage() {
  return <RegistryScaffoldPage parent={{ href: "/konsultaciya", label: "Консультация" }} route="/konsultacii/ochnaya-konsultaciya-v-klinike" />;
}
