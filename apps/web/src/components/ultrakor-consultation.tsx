import { ConsultationForm } from "@drkav/ui";

export function UltrakorConsultation({
  id = "contact",
  title = "Запишитесь на консультацию",
  description,
}: { id?: string; title?: string; description?: string } = {}) {
  const titleId = `${id}-title`;

  return (
    <section aria-labelledby={titleId} className="ultrakor__section ultrakor-consultation" id={id}>
      <div className="ultrakor__inner">
        <h2 className="ultrakor__heading" id={titleId}>{title}</h2>
        {description ? <p className="ultrakor-consultation__description">{description}</p> : null}
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
