import { cn } from "@drkav/ui";

/* eslint-disable @next/next/no-img-element -- this small local SVG does not need the image optimizer. */

const PRODOCTOROV_URL = "https://prodoctorov.ru/moskva/vrach/158087-korobov/";

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
        <img
          alt="ПроДокторов"
          className="prodoctorov-rating-banner__logo"
          decoding="async"
          height="17"
          loading="lazy"
          src="/images/branding/prodoctorov-widget.svg"
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
