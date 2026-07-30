import { VideoCard } from "@drkav/ui";

const videos = [
  {
    location: "Санкт-Петербург",
    posterAlt: "Превью выступления на Всероссийском съезде герниологов",
    posterSrc: "/images/speaking-videos/spb.jpg",
    title: "VI Всероссийский съезд герниологов",
    videoSrc: "https://drkav.ru/videos/conferences/spb.mp4",
    year: "2023",
  },
  {
    location: "Москва",
    posterAlt: "Превью выступления на Инновационной школе эстетической медицины",
    posterSrc: "/images/speaking-videos/innovation.jpg",
    title: "Инновационная школа эстетической медицины. Обзор конференции ИШЭМ",
    videoSrc: "https://drkav.ru/videos/conferences/innovation.mp4",
    year: "2023",
  },
  {
    location: "Москва",
    posterAlt: "Превью выступления на Национальном конгрессе имени Н.О. Миланова",
    posterSrc: "/images/speaking-videos/congress.jpg",
    title: "XI Национальный конгресс имени Миланова. Пластическая хирургия, эстетическая медицина и косметология",
    videoSrc: "https://drkav.ru/videos/homepage/video-2.mp4",
    year: "2022",
  },
] as const;

export function SpeakingVideos() {
  return (
    <section aria-label="Видеозаписи выступлений" className="speaking-videos">
      <div className="content-card__grid speaking-videos__grid">
        {videos.map((video) => <VideoCard key={video.videoSrc} {...video} />)}
      </div>
    </section>
  );
}
