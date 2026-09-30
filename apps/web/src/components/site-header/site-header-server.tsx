import { getSiteNavigation } from "@/content/site-navigation";

import { SiteHeader as SiteHeaderClient } from "./site-header";

export async function SiteHeader() {
  const navigation = await getSiteNavigation();

  return <SiteHeaderClient navigation={navigation} />;
}
