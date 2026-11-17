import type { SiteNavigation } from "@drkav/content-contracts";

export function SocialIcon({ kind }: { kind: SiteNavigation["socialLinks"][number]["kind"] }) {
  if (kind === "telegram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="m20.7 4.2-2.9 15.1c-.2 1.1-.8 1.4-1.7.9l-4.8-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.4-.1-.6-.6-.2L5.6 13.1.9 11.6c-1-.3-1-1 .2-1.5L19.4 3c.8-.3 1.5.2 1.3 1.2Z" />
      </svg>
    );
  }

  if (kind === "youtube") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M20.1 6.3a2.8 2.8 0 0 0-2-2C16.4 3.8 12 3.8 12 3.8s-4.4 0-6.1.5a2.8 2.8 0 0 0-2 2C3.4 8 3.4 12 3.4 12s0 4 .5 5.7a2.8 2.8 0 0 0 2 2c1.7.5 6.1.5 6.1.5s4.4 0 6.1-.5a2.8 2.8 0 0 0 2-2c.5-1.7.5-5.7.5-5.7s0-4-.5-5.7ZM10 16V8l6 4-6 4Z" />
      </svg>
    );
  }

  if (kind === "instagram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect height="15" rx="4" width="15" x="4.5" y="4.5" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="16.8" cy="7.3" r="1" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4.7 7.2h2.6c.1 4.1 1.8 5.9 3.1 6.3V7.2h2.5v3.5c1.3-.1 2.7-1.8 3.1-3.5h2.5c-.4 2.1-1.8 3.8-3 4.6 1.2.6 2.8 2.1 3.5 4.7h-2.7c-.5-1.6-1.8-2.9-3.4-3v3h-.4c-5.1 0-8-3.5-8.2-9.3Z" />
    </svg>
  );
}
