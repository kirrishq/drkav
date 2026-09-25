import type { ReactNode } from "react";

import { AboutPagesNavigation } from "./about-pages-navigation";

export function AboutSubpageLayout({ children, currentHref }: { children: ReactNode; currentHref: string }) {
  return (
    <div className="about-subpage__layout">
      <div className="about-subpage__main">{children}</div>
      <div className="about-subpage__sidebar">
        <AboutPagesNavigation currentHref={currentHref} />
      </div>
    </div>
  );
}
