import { RegistryScaffoldPage } from "@/components/content-page/registry-scaffold-page";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/obo-mne/specializaciya");

export default function SpecializationPage() {
  return <RegistryScaffoldPage parent={{ href: "/obo-mne", label: "Обо мне" }} route="/obo-mne/specializaciya" />;
}
