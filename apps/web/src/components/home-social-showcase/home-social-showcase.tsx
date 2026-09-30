/* eslint-disable @next/next/no-img-element -- The gallery uses intentionally cropped local thumbnails. */

import { buttonVariants, cn } from "@drkav/ui";

import { HomeSocialDotsBackground } from "./home-social-dots-background";

const socialPosts = [
  {
    alt: "Доктор Коробов на церемонии премии «Хрустальный лотос»",
    imageSrc: "/images/home/social/maxresdefault.jpg",
  },
  {
    alt: "Доктор Коробов на конгрессе пластических хирургов",
    imageSrc: "/images/home/social/yt4.webp",
  },
  {
    alt: "Интервью доктора Коробова",
    imageSrc: "/images/home/social/yt5.webp",
  },
  {
    alt: "Доктор Коробов в медицинском интервью",
    imageSrc: "/images/home/social/yt6.webp",
  },
  {
    alt: "Выступление доктора Коробова на конгрессе",
    imageSrc: "/images/home/social/yt7.webp",
  },
  {
    alt: "Профессиональная лекция доктора Коробова",
    imageSrc: "/images/home/social/yt1.webp",
  },
  {
    alt: "Доктор Коробов на профессиональном мероприятии",
    imageSrc: "/images/home/social/yt2.webp",
  },
  {
    alt: "Материалы о пластической хирургии",
    imageSrc: "/images/home/social/yt3.webp",
  },
] as const;

const socialLinks = [
  { href: "https://t.me/drkav_official", label: "Telegram" },
  { href: "https://www.youtube.com/channel/UCyNisHCb9vYS6qLWlgK6lwg", label: "YouTube" },
  { href: "https://www.instagram.com/dr.kav/", label: "Instagram*" },
  { href: "https://vk.com/publicdoctorkav", label: "ВКонтакте" },
] as const;

function SocialPost({ alt, decorative = false, imageSrc }: (typeof socialPosts)[number] & { decorative?: boolean }) {
  return (
    <div aria-hidden={decorative || undefined} className="home-social-showcase__post">
      <img alt={decorative ? "" : alt} loading="lazy" src={imageSrc} />
    </div>
  );
}

export function HomeSocialShowcase() {
  return (
    <section aria-labelledby="home-social-showcase-title" className="home-social-showcase">
      <div className="home-social-showcase__stage">
        <HomeSocialDotsBackground />
        <div className="home-social-showcase__gallery home-social-showcase__gallery--left">
          {socialPosts.slice(0, 4).map((post) => <SocialPost key={post.imageSrc} {...post} />)}
        </div>

        <div className="home-social-showcase__intro">
          <h2 className="type-h2 home-social-showcase__title" id="home-social-showcase-title">Всё о пластической хирургии</h2>
          <p className="home-social-showcase__description">
            Подписывайтесь на наши соцсети, чтобы узнавать о новых методиках, операциях и трендах в пластической хирургии.
          </p>
          <div className="home-social-showcase__actions">
            {socialLinks.map((link) => (
              <a
                className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
                href={link.href}
                key={link.href}
                rel="noreferrer"
                target="_blank"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="home-social-showcase__gallery home-social-showcase__gallery--right">
          {socialPosts.slice(4).map((post) => <SocialPost key={post.imageSrc} {...post} />)}
        </div>

        <div className="home-social-showcase__marquee">
          <div className="home-social-showcase__marquee-track">
            {[...socialPosts, ...socialPosts].map((post, index) => (
              <SocialPost decorative={index >= socialPosts.length} key={`${post.imageSrc}-${index}`} {...post} />
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
