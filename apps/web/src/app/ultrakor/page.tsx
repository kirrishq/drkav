import Image from "next/image";
import { UltrakorResults } from "@/components/ultrakor-results";
import { UltrakorIndications } from "@/components/ultrakor-indications";
import { UltrakorPortfolio } from "@/components/ultrakor-portfolio";
import { UltrakorDoctor } from "@/components/ultrakor-doctor";
import { UltrakorSafety } from "@/components/ultrakor-safety";
import { UltrakorPricing } from "@/components/ultrakor-pricing";
import { UltrakorConsultation } from "@/components/ultrakor-consultation";
import { UltrakorKnowledge } from "@/components/ultrakor-knowledge";
import { UltrakorQuestions } from "@/components/ultrakor-questions";

export default function UltrakorPage() {
  return (
    <main>
      <section className="ultrakor__hero" aria-labelledby="ultrakor-title">
        <div className="ultrakor__hero-copy">
          <p className="ultrakor__hero-eyebrow">Мужская липоскульптура<br />от хирурга Коробова А.В.</p>
          <h1 className="ultrakor__display" id="ultrakor-title"><span className="ultrakor__word-ultra">Ультра</span><span className="ultrakor__word-kor">кор</span></h1>
          <div className="ultrakor__hero-description">
            <p className="ultrakor__hero-lead">Собранное и атлетичное тело<br /><span className="ultrakor__accent">с естественным эффектом</span></p>
            <p>Индивидуальная методика для мужчин,<br />которым <span className="ultrakor__accent">важно скорректировать</span><br />пропорции тела, <span className="ultrakor__accent">подчеркнуть рельеф</span><br />и получить <span className="ultrakor__accent">прогнозируемый результат</span><br />с медицинским сопровождением.</p>
            <a className="ultrakor__button ultrakor__button--solid" href="#contact">Записаться на консультацию</a>
          </div>
        </div>
        <div className="ultrakor__hero-model"><Image alt="Модель с атлетичным мужским телосложением" fill priority sizes="(max-width: 700px) 80vw, 30vw" src="/images/ultrakor/hero-model.png" /></div>
      </section>

      <UltrakorResults />

      <UltrakorIndications />
      <UltrakorPortfolio />
      <UltrakorDoctor />
      <UltrakorSafety />
      <UltrakorPricing />
      <UltrakorConsultation />
      <UltrakorKnowledge />
      <UltrakorQuestions />
    </main>
  );
}
