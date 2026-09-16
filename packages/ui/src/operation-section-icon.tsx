import { cn } from "./lib/cn";

export const operationSectionIconKeys = [
  "additional-costs",
  "benefits",
  "consultation",
  "contraindications",
  "faq",
  "included",
  "indications",
  "implants",
  "information",
  "preparation",
  "price",
  "process",
  "promotion",
  "recovery",
  "results",
  "technology",
  "types",
] as const;

export type OperationSectionIconKey = (typeof operationSectionIconKeys)[number];

export function isOperationSectionIconKey(value: string): value is OperationSectionIconKey {
  return (operationSectionIconKeys as readonly string[]).includes(value);
}

export type OperationSectionIconProps = {
  className?: string;
  icon: OperationSectionIconKey;
};

export function OperationSectionIcon({ className, icon }: OperationSectionIconProps) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.6,
  };

  let content;

  switch (icon) {
    case "additional-costs":
      content = (
        <>
          <path {...common} d="M5 8.5h14M5 15.5h14" />
          <path {...common} d="M8.5 5v7m7-3.5v7" />
        </>
      );
      break;
    case "benefits":
      content = <path {...common} d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />;
      break;
    case "consultation":
      content = <path {...common} d="M4.5 5.5h15v10h-8l-4.5 3v-3h-2.5v-10Zm3.5 4h8m-8 3h5" />;
      break;
    case "contraindications":
      content = (
        <>
          <path {...common} d="m12 3.8 8 15H4l8-15Z" />
          <path {...common} d="M12 9v4m0 3h.01" />
        </>
      );
      break;
    case "faq":
      content = (
        <>
          <circle {...common} cx="12" cy="12" r="8.5" />
          <path {...common} d="M9.8 9.4a2.3 2.3 0 1 1 3.7 1.8c-.9.7-1.5 1.1-1.5 2.3m0 2.8h.01" />
        </>
      );
      break;
    case "included":
      content = (
        <>
          <circle {...common} cx="12" cy="12" r="8.5" />
          <path {...common} d="m8 12 2.5 2.5 5.5-5.5" />
        </>
      );
      break;
    case "indications":
      content = (
        <>
          <circle {...common} cx="12" cy="12" r="8.5" />
          <path {...common} d="m8 12 2.5 2.5 5.5-5.5" />
        </>
      );
      break;
    case "implants":
      content = (
        <>
          <path {...common} d="M6.5 9.5c0-2.2 2.5-4 5.5-4s5.5 1.8 5.5 4v5c0 2.2-2.5 4-5.5 4s-5.5-1.8-5.5-4v-5Z" />
          <path {...common} d="M6.5 10.5c0 2.2 2.5 4 5.5 4s5.5-1.8 5.5-4" />
        </>
      );
      break;
    case "information":
      content = (
        <>
          <circle {...common} cx="12" cy="12" r="8.5" />
          <path {...common} d="M12 10.8v5m0-7.7h.01" />
        </>
      );
      break;
    case "preparation":
      content = (
        <>
          <path {...common} d="M8 4.5h8v2H8zM6 6.5h12v13H6z" />
          <path {...common} d="m8.8 12 1.8 1.8 4.6-4.6" />
        </>
      );
      break;
    case "price":
      content = <path {...common} d="m4.5 6.5 8.8-2 6.2 6.2-7.8 7.8-6.2-6.2 2-8.8Zm3.2 3.2h.01" />;
      break;
    case "process":
      content = (
        <>
          <path {...common} d="M5 6.5h5v4H5zM14 13.5h5v4h-5z" />
          <path {...common} d="M10 8.5h2a2 2 0 0 1 2 2v3m0 0-1.8-1.8m1.8 1.8 1.8-1.8" />
        </>
      );
      break;
    case "promotion":
      content = (
        <>
          <path {...common} d="M4.5 9h15v10h-15zM3.5 6.5h17v2.5h-17zM12 6.5v12.5" />
          <path {...common} d="M12 6.5H8.8a1.8 1.8 0 1 1 1.8-1.8c0 1.1 1.4 1.8 1.4 1.8Zm0 0h3.2a1.8 1.8 0 1 0-1.8-1.8c0 1.1-1.4 1.8-1.4 1.8Z" />
        </>
      );
      break;
    case "recovery":
      content = <path {...common} d="M18.8 9.2A7 7 0 0 0 6.2 7.1L4.5 9m0 0V5.5m0 3.5H8m-2.8 6.3A7 7 0 0 0 17.8 16.9l1.7-1.9m0 0v3.5m0-3.5H16" />;
      break;
    case "results":
      content = (
        <>
          <path {...common} d="M12 3.5v4m0 9v4M3.5 12h4m9 0h4M6 6l2.8 2.8m6.4 6.4L18 18m0-12-2.8 2.8m-6.4 6.4L6 18" />
          <circle {...common} cx="12" cy="12" r="3" />
        </>
      );
      break;
    case "technology":
      content = (
        <>
          <circle {...common} cx="12" cy="12" r="3" />
          <path {...common} d="M12 3.5v2m0 13v2M3.5 12h2m13 0h2M6 6l1.4 1.4m9.2 9.2L18 18m0-12-1.4 1.4m-9.2 9.2L6 18" />
        </>
      );
      break;
    case "types":
      content = (
        <>
          <rect {...common} x="4.5" y="5" width="6" height="6" rx="1" />
          <rect {...common} x="13.5" y="5" width="6" height="6" rx="1" />
          <rect {...common} x="9" y="13" width="6" height="6" rx="1" />
        </>
      );
      break;
  }

  return (
    <svg
      aria-hidden="true"
      className={cn("operation-section-icon", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      {content}
    </svg>
  );
}
