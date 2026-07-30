import { VideoCard } from "@drkav/ui";

const videos = [
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

export function MediaVideoProjects() {
  return (
    <section aria-labelledby="media-video-projects-title" className="content-card content-card--muted content-section media-video-projects">
      <h2 className="content-card__heading content-card__heading--h2" id="media-video-projects-title">Видео проекты</h2>
      <div className="content-card__grid media-video-projects__grid">
        {videos.map((video) => <VideoCard key={video.videoSrc} {...video} />)}
      </div>
    </section>
  );
}
