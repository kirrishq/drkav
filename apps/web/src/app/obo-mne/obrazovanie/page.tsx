import { RegistryScaffoldPage } from "@/components/content-page/registry-scaffold-page";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/obo-mne/obrazovanie");

export default function EducationBackgroundPage() {
  return <RegistryScaffoldPage parent={{ href: "/obo-mne", label: "Обо мне" }} route="/obo-mne/obrazovanie" />;
}
