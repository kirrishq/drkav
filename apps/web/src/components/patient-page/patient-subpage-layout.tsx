import type { ReactNode } from "react";

import { PatientPagesNavigation } from "./patient-pages-navigation";

export function PatientSubpageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="patient-subpage__layout">
      <div className="patient-subpage__main">{children}</div>
      <div className="patient-subpage__sidebar">
        <PatientPagesNavigation />
      </div>
    </div>
  );
}
