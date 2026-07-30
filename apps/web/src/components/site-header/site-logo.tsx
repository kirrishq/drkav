import Link from "next/link";
import Image from "next/image";

type SiteLogoProps = {
  onNavigate?: () => void;
};

export function SiteLogo({ onNavigate }: SiteLogoProps) {
  return (
    <Link
      aria-label="Доктор Коробов — на главную"
      className="focus-ring inline-flex min-h-11 shrink-0 items-center rounded-md px-1 text-primary"
      href="/"
      onClick={onNavigate}
    >
      <Image alt="" aria-hidden="true" className="site-logo__image" height={230} priority src="/images/branding/logo.png" width={560} />
    </Link>
  );
}
