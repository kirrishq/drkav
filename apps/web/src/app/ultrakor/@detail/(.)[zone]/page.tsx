import UltrakorZonePage from "../../[zone]/page";
import { UltrakorZoneOverlay } from "@/components/ultrakor-zone-overlay";

export default function InterceptedZonePage({ params }: { params: Promise<{ zone: string }> }) {
  return <UltrakorZoneOverlay><UltrakorZonePage params={params} /></UltrakorZoneOverlay>;
}
