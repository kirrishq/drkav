/* eslint-disable @next/next/no-img-element -- Thumbnails are served from the original site's media CDN. */

import { buttonVariants, cn } from "@drkav/ui";

import { HomeSocialDotsBackground } from "./home-social-dots-background";

const socialPosts = [
  {
    alt: "Доктор Коробов на церемонии премии «Хрустальный лотос»",
    imageSrc: "https://cdn.prod.website-files.com/61f3f4390534ec0c5cda944c/63ef5e4501337063266619a2_maxresdefault.jpg",
  },
  {
    alt: "Доктор Коробов на конгрессе пластических хирургов",
    imageSrc: "https://cdn.prod.website-files.com/61f3f4390534ec0c5cda944c/63efc3e0536a2fd4f38cfbbc_yt4.webp",
  },
  {
    alt: "Интервью доктора Коробова",
    imageSrc: "https://cdn.prod.website-files.com/61f3f4390534ec0c5cda944c/63efc3e1ba04fc401721e4c3_yt5.webp",
  },
  {
    alt: "Доктор Коробов в медицинском интервью",
    imageSrc: "https://cdn.prod.website-files.com/61f3f4390534ec0c5cda944c/63efc3e3623d7747f5c182fc_yt6.webp",
  },
  {
    alt: "Выступление доктора Коробова на конгрессе",
    imageSrc: "https://cdn.prod.website-files.com/61f3f4390534ec0c5cda944c/63efc3e810fa36ba4da0f814_yt7.webp",
  },
  {
    alt: "Профессиональная лекция доктора Коробова",
    imageSrc: "https://cdn.prod.website-files.com/61f3f4390534ec0c5cda944c/63efc31805fc0482857484d4_yt1.webp",
  },
  {
    alt: "Доктор Коробов на профессиональном мероприятии",
    imageSrc: "https://cdn.prod.website-files.com/61f3f4390534ec0c5cda944c/63efc3dfa2e73baf34f164c4_yt2.webp",
  },
  {
    alt: "Материалы о пластической хирургии",
    imageSrc: "https://cdn.prod.website-files.com/61f3f4390534ec0c5cda944c/63efc3e105fc04bdde748a48_yt3.webp",
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
