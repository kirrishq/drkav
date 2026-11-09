import Image from "next/image";

export type UltrakorCase = {
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
};

const defaultCases: UltrakorCase[] = [1, 2, 3].map(caseId => ({
  title: `Ультракор — кейс ${caseId}`,
  description: "Фотографии до и после мужской липоскульптуры.",
  beforeImage: `/images/ultrakor/results/case_${caseId}_before.webp`,
  afterImage: `/images/ultrakor/results/case_${caseId}_after.webp`,
}));

export function UltrakorPortfolio({ cases = defaultCases }: { cases?: UltrakorCase[] }) {
  return (
    <section className="ultrakor__section ultrakor-portfolio" aria-labelledby="ultrakor-portfolio-title">
      <div className="ultrakor__inner">
        <h2 className="ultrakor__heading" id="ultrakor-portfolio-title">Примеры до/после</h2>
        {cases.map((item) => <article className="ultrakor-portfolio__case" key={item.title}>
          <div className="ultrakor-portfolio__images">
            <div className="ultrakor-portfolio__image"><Image alt={`${item.title}: до операции`} fill sizes="(max-width: 1023px) 42vw, 20vw" src={item.beforeImage} /><span>До</span></div>
            <div className="ultrakor-portfolio__image"><Image alt={`${item.title}: после операции`} fill sizes="(max-width: 1023px) 42vw, 20vw" src={item.afterImage} /><span>После</span></div>
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
