import { UltrakorPortfolioVideo } from "@/components/ultrakor-portfolio-video";

export type UltrakorCase = {
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  beforeVideo: string;
  afterVideo: string;
};

const defaultCases: UltrakorCase[] = [1, 2, 3].map(caseId => ({
  title: `Ультракор — кейс ${caseId}`,
  description: "Фотографии до и после мужской липоскульптуры.",
  beforeImage: `/images/ultrakor/results/case_${caseId}_before.webp`,
  afterImage: `/images/ultrakor/results/case_${caseId}_after.webp`,
  beforeVideo: `/videos/ultrakor/results/case_${caseId}_before.mp4`,
  afterVideo: `/videos/ultrakor/results/case_${caseId}_after.mp4`,
}));

export function UltrakorPortfolio({ cases = defaultCases }: { cases?: UltrakorCase[] }) {
  return (
    <section className="ultrakor__section ultrakor-portfolio" aria-labelledby="ultrakor-portfolio-title">
      <div className="ultrakor__inner">
        <h2 className="ultrakor__heading" id="ultrakor-portfolio-title">Примеры до/после</h2>
        {cases.map((item) => <article className="ultrakor-portfolio__case" key={item.title}>
          <div className="ultrakor-portfolio__images">
            <UltrakorPortfolioVideo alt={`${item.title}: до операции`} imageSrc={item.beforeImage} label="До" videoSrc={item.beforeVideo} />
            <UltrakorPortfolioVideo alt={`${item.title}: после операции`} imageSrc={item.afterImage} label="После" videoSrc={item.afterVideo} />
          </div>
          <div className="ultrakor-portfolio__content">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <a className="ultrakor__button ultrakor__button--outline" href="/konsultaciya">Подробнее</a>
          </div>
        </article>)}
      </div>
    </section>
  );
}
