import { cn } from "@drkav/ui";
import Image from "next/image";

const PRODOCTOROV_URL = "https://prodoctorov.ru/moskva/vrach/158087-korobov/";
const PRODOCTOROV_LOGO_URL = "https://prodoctorov.ru/static/_v1/pd/logos/logo-pd-widget.png";

type ProdoctorovRatingBannerProps = {
  className?: string;
};

export function ProdoctorovRatingBanner({ className }: ProdoctorovRatingBannerProps) {
  return (
    <a
      aria-label="Открыть профиль Артёма Коробова на ПроДокторов"
      className={cn("prodoctorov-rating-banner", className)}
      href={PRODOCTOROV_URL}
      rel="noreferrer"
      target="_blank"
    >
      <div className="prodoctorov-rating-banner__topline">
        <Image
          alt="ПроДокторов"
          className="prodoctorov-rating-banner__logo"
          decoding="async"
          height="17"
          loading="lazy"
          src={PRODOCTOROV_LOGO_URL}
          width="112"
        />
        <span aria-hidden="true" className="prodoctorov-rating-banner__stars">★★★★★</span>
      </div>
      <div className="prodoctorov-rating-banner__bottomline">
        <span>Коробов Артём Владимирович</span>
        <span><strong>5.0</strong> Рейтинг на портале</span>
      </div>
    </a>
  );
}
