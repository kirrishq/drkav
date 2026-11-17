import { UltrakorZoneContent } from "@/components/ultrakor-zone-content";
import { UltrakorZoneOverlay } from "@/components/ultrakor-zone-overlay";

export default function InterceptedZonePage({ params }: { params: Promise<{ zone: string }> }) {
  return <UltrakorZoneOverlay><UltrakorZoneContent inOverlay params={params} /></UltrakorZoneOverlay>;
}
