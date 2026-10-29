import Image from "next/image";

export type UltrakorCase = {
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
};

const defaultCases: UltrakorCase[] = [{
  title: "Липосакция с липофилингом грудных мышц",
  description: "Описание кейса",
  beforeImage: "/images/ultrakor/hero-model.png",
  afterImage: "/images/ultrakor/hero-model.png",
}];

export function UltrakorPortfolio({ cases = defaultCases }: { cases?: UltrakorCase[] }) {
  return (
    <section className="ultrakor__section ultrakor-portfolio" aria-labelledby="ultrakor-portfolio-title">
      <div className="ultrakor__inner">
        <h2 className="ultrakor__heading" id="ultrakor-portfolio-title">Примеры до/после</h2>
        {cases.map((item) => <article className="ultrakor-portfolio__case" key={item.title}>
          <div className="ultrakor-portfolio__images">
            <div className="ultrakor-portfolio__image"><Image alt="Пациент до операции" fill sizes="(max-width: 700px) 42vw, 16vw" src={item.beforeImage} /><span>До</span></div>
            <div className="ultrakor-portfolio__image"><Image alt="Пациент после операции" fill sizes="(max-width: 700px) 42vw, 16vw" src={item.afterImage} /><span>После</span></div>
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
