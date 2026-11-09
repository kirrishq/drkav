import { ConsultationForm } from "@drkav/ui";

export function UltrakorConsultation() {
  return (
    <section aria-labelledby="ultrakor-consultation-title" className="ultrakor__section ultrakor-consultation" id="contact">
      <div className="ultrakor__inner">
        <h2 className="ultrakor__heading" id="ultrakor-consultation-title">Запишитесь на консультацию</h2>
        <p className="ultrakor-consultation__description">
          После консультации оформляется Консультативный лист, в котором будет указан план и стоимость операции. <strong>Стоимость операции будет зафиксирована на 3 месяца с даты выдачи Консультативного листа.</strong>
        </p>
        <div className="ultrakor-consultation__card">
          <ConsultationForm
            captchaSiteKey={process.env.NEXT_PUBLIC_SMARTCAPTCHA_SITE_KEY}
            className="ultrakor-consultation__form"
            submitUrl="/api/forms/consultation"
            variant="ultrakor"
          />
        </div>
      </div>
    </section>
  );
}
