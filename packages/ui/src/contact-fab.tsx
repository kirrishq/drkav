"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import { cn } from "./lib/cn";

export type ContactActionKind =
  | "email"
  | "max"
  | "phone"
  | "telegram"
  | "whatsapp";

export type ContactFabAction = {
  detail?: string;
  href: string;
  kind: ContactActionKind;
  label: string;
  external?: boolean;
};

export type ContactFabProps = {
  actions: readonly ContactFabAction[];
  children?: ReactNode;
};

export type ContactActionListProps = {
  actions: readonly ContactFabAction[];
  className?: string;
};

export function ContactActionIcon({ kind }: { kind: ContactActionKind }) {
  const iconId = useId().replaceAll(":", "");

  if (kind === "phone") {
    return (
      <svg aria-hidden="true" viewBox="0 0 287.32 287.32">
        <path
          d="M267.749,191.076c-14.595-11.729-27.983-17.431-40.93-17.431c-18.729,0-32.214,11.914-44.423,24.119c-1.404,1.405-3.104,2.06-5.349,2.06c-10.288,0.001-28.387-12.883-53.794-38.293c-29.89-29.892-41.191-48.904-33.592-56.506c20.6-20.593,27.031-41.237-4.509-80.462C73.861,10.51,62.814,3.68,51.38,3.68c-15.42,0-27.142,12.326-37.484,23.202c-1.788,1.88-3.477,3.656-5.133,5.312c-11.689,11.688-11.683,37.182,0.017,68.2c12.837,34.033,38.183,71.055,71.37,104.247c25.665,25.663,53.59,46.403,80.758,60.328c23.719,12.158,46.726,18.672,64.783,18.672c0.002,0,0.004,0,0.007,0c11.3,0,20.479-2.465,26.541-7.478c12.314-10.181,35.234-29.039,35.081-51.439C287.236,212.71,280.653,201.451,267.749,191.076z"
        />
      </svg>
    );
  }

  if (kind === "email") {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
        <rect fill="none" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" width="18" x="3" y="5" />
        <path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      </svg>
    );
  }

  if (kind === "telegram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 240.1 240.1">
        <defs>
          <linearGradient id={`${iconId}-telegram`} x1="-838.041" x2="-838.041" y1="660.581" y2="660.3427" gradientTransform="matrix(1000 0 0 -1000 838161 660581)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2AABEE" />
            <stop offset="1" stopColor="#229ED9" />
          </linearGradient>
        </defs>
        <circle cx="120.1" cy="120.1" r="120.1" fill={`url(#${iconId}-telegram)`} />
        <path fill="#fff" d="M54.3 118.8c35-15.2 58.3-25.3 70-30.2 33.3-13.9 40.3-16.3 44.8-16.4 1 0 3.2.2 4.7 1.4 1.2 1 1.5 2.3 1.7 3.3s.4 3.1.2 4.7c-1.8 19-9.6 65.1-13.6 86.3-1.7 9-5 12-8.2 12.3-7 .6-12.3-4.6-19-9-10.6-6.9-16.5-11.2-26.8-18-11.9-7.8-4.2-12.1 2.6-19.1 1.8-1.8 32.5-29.8 33.1-32.3.1-.3.1-1.5-.6-2.1-.7-.6-1.7-.4-2.5-.2-1.1.2-17.9 11.4-50.6 33.5-4.8 3.3-9.1 4.9-13 4.8-4.3-.1-12.5-2.4-18.7-4.4-7.5-2.4-13.5-3.7-13-7.9.2-2.2 3.2-4.4 8.9-6.7Z" />
      </svg>
    );
  }

  if (kind === "whatsapp") {
    return (
      <svg aria-hidden="true" viewBox="0 0 175.216 175.552">
        <defs>
          <linearGradient id={`${iconId}-whatsapp`} x1="85.915" x2="86.535" y1="32.567" y2="137.092" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#57d163" />
            <stop offset="1" stopColor="#23b33a" />
          </linearGradient>
        </defs>
        <path fill="#b3b3b3" d="m54.532 138.45 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.523h.023c33.707 0 61.139-27.426 61.153-61.135.006-16.335-6.349-31.696-17.895-43.251A60.75 60.75 0 0 0 87.94 25.983c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.558z" />
        <path fill="#fff" d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z" />
        <path fill={`url(#${iconId}-whatsapp)`} d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.929z" />
        <path fill="#fff" fillRule="evenodd" d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 1000 1000">
      <defs>
        <linearGradient id={`${iconId}-max-a`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#4cf" />
          <stop offset="0.662" stopColor="#53e" />
          <stop offset="1" stopColor="#93d" />
        </linearGradient>
        <radialGradient id={`${iconId}-max-c`} cx="0" cy="1" r="0.8">
          <stop offset="0" stopColor="#4cf" stopOpacity="0.8" />
          <stop offset="1" stopColor="#93d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="1000" fill={`url(#${iconId}-max-a)`} ry="249.681" />
      <rect width="1000" height="1000" fill={`url(#${iconId}-max-c)`} ry="249.681" />
      <path fill="#fff" fillRule="evenodd" d="M508.211 878.328c-75.007 0-109.864-10.95-170.453-54.75-38.325 49.275-159.686 87.783-164.979 21.9 0-49.456-10.95-91.248-23.36-136.873-14.782-56.21-31.572-118.807-31.572-209.508 0-216.626 177.754-379.597 388.357-379.597 210.785 0 375.947 171.001 375.947 381.604.707 207.346-166.595 376.118-373.94 377.224m3.103-571.585c-102.564-5.292-182.499 65.7-200.201 177.024-14.6 92.162 11.315 204.398 33.397 210.238 10.585 2.555 37.23-18.98 53.837-35.587a189.8 189.8 0 0 0 92.71 33.032c106.273 5.112 197.08-75.794 204.215-181.95 4.154-106.382-77.67-196.486-183.958-202.574Z" clipRule="evenodd" />
    </svg>
  );
}

export function ContactActionList({ actions, className }: ContactActionListProps) {
  return (
    <div className={cn("contact-actions", className)}>
      {actions.map((action) => (
        <a
          className="contact-actions__action"
          href={action.href}
          key={action.href}
          rel={action.external ? "noreferrer" : undefined}
          target={action.external ? "_blank" : undefined}
        >
          <span className={cn("contact-actions__icon", `contact-actions__icon--${action.kind}`)}>
            <ContactActionIcon kind={action.kind} />
          </span>
          <span className="contact-actions__copy">
            <span className="contact-actions__label">{action.label}</span>
            {action.detail ? <span className="contact-actions__detail">{action.detail}</span> : null}
          </span>
        </a>
      ))}
    </div>
  );
}

function ContactFabIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      {open ? (
        <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      ) : (
        <>
          <path d="M7.5 6.5h9a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4h-5l-3.5 2v-2.4a4 4 0 0 1-3-3.6v-2a4 4 0 0 1 3.5-4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
          <path d="M8 11.5h8M8 14h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
        </>
      )}
    </svg>
  );
}

export function ContactFab({ actions, children }: ContactFabProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const widgetRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }

    function closeOnOutsidePointer(event: PointerEvent) {
      const target = event.target;

      if (target instanceof Node && !widgetRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsidePointer);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
    };
  }, [open]);

  return (
    <div className="contact-fab" ref={widgetRef}>
      {open ? (
        <div aria-label="Способы связи" className="contact-fab__panel" id={panelId} role="dialog">
          <div className="contact-fab__heading">
            <p className="type-label contact-fab__title">Выберите удобный способ связи</p>
          </div>
          <ContactActionList actions={actions} />
          {children ? <div className="contact-fab__footer">{children}</div> : null}
        </div>
      ) : null}
      <button
        aria-controls={panelId}
        aria-expanded={open}
        aria-label={open ? "Закрыть способы связи" : "Открыть способы связи"}
        className="contact-fab__toggle"
        onClick={() => setOpen((current) => !current)}
        ref={toggleRef}
        title={open ? "Закрыть способы связи" : "Связаться с администратором"}
        type="button"
      >
        <ContactFabIcon open={open} />
      </button>
    </div>
  );
}
