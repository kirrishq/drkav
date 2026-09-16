"use client";

import { Button, VideoCard, cn, type VideoCardProps } from "@drkav/ui";
import { useState } from "react";

const mediaVideos = [
  {
    location: "Интервью Ксении Собчак",
    posterAlt: "Превью интервью о липосакции",
    posterSrc: "/images/media-videos/sobchak.jpg",
    title: "Липосакция: самая опасная операция в пластической хирургии? Опыт звезд и мнение врачей.",
    videoSrc: "https://drkav.ru/videos/smi/sobchak.mp4",
    year: "",
  },
  {
    location: "Интервью для шоу «ТОП ПЕРСОНА»",
    posterAlt: "Превью интервью о пластической хирургии",
    posterSrc: "/images/media-videos/interview.jpg",
    title: "Как сделать тело мечты без спортзала и диет.",
    videoSrc: "https://drkav.ru/videos/smi/interview.mp4",
    year: "",
  },
] as const;

export type MediaVideoProjectsProps = {
  items?: readonly VideoCardProps[];
  title?: string;
  tone?: "muted" | "surface";
};

export function MediaVideoProjects({ items = mediaVideos, title = "Видео проекты", tone = "muted" }: MediaVideoProjectsProps) {
  const [visibleCount, setVisibleCount] = useState(Math.min(3, items.length));
  const visibleItems = items.slice(0, visibleCount);

  return (
    <section aria-labelledby="media-video-projects-title" className={cn("content-card content-section media-video-projects", tone === "muted" && "content-card--muted")}>
      <h2 className="content-card__heading content-card__heading--h2" id="media-video-projects-title">{title}</h2>
      <div className="content-card__grid media-video-projects__grid">
        {visibleItems.map((video) => <VideoCard dialogItems={items} key={video.videoSrc} {...video} />)}
      </div>
      {visibleCount < items.length ? <div className="media-video-projects__more"><Button onClick={() => setVisibleCount((count) => Math.min(count + 3, items.length))} variant="outline">Показать ещё</Button></div> : null}
    </section>
  );
}
