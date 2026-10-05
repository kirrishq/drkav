"use client";

import { Button, Checkbox, ContactActionList, Input, Label, SmartCaptcha, Textarea, buttonVariants, cn, type ContactFabAction } from "@drkav/ui";
import Image from "next/image";
import { createPortal } from "react-dom";
import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { contactActions as defaultContactActions } from "@/components/site-header/contact-actions";

type ContactPhoto = {
  alt: string;
  height: number;
  src: string;
  title: string;
  width: number;
};

const contactPhotos: readonly ContactPhoto[] = [
  {
    alt: "Стойка ресепшен клиники ASBeauty",
    height: 1069,
    src: "/images/contacts/04-clinic.jpg",
    title: "Ресепшен клиники ASBeauty",
    width: 1600,
  },
  {
    alt: "Стойка ресепшен с логотипом ASBeauty",
    height: 1070,
    src: "/images/contacts/01-clinic.jpg",
    title: "Стойка ресепшен",
    width: 1600,
  },
  {
    alt: "Вход в клинику ASBeauty",
    height: 894,
    src: "/images/contacts/02-clinic.png",
    title: "Вход в клинику",
    width: 605,
  },
  {
    alt: "Входная зона клиники ASBeauty",
    height: 1070,
    src: "/images/contacts/03-clinic.jpg",
    title: "Входная зона",
    width: 1600,
  },
] as const;

const yandexMapsUrl = "https://yandex.ru/maps/-/CXU7jRZM";
const twoGisUrl = "https://2gis.ru/moscow/search/ASBeauty%2C%20%D0%B4.%20%D0%96%D1%83%D0%BA%D0%BE%D0%B2%D0%BA%D0%B0%2C%20%D0%A0%D1%83%D0%B1%D0%BB%D0%B5%D0%B2%D0%BE-%D0%A3%D1%81%D0%BF%D0%B5%D0%BD%D1%81%D0%BA%D0%BE%D0%B5%20%D1%88%D0%BE%D1%81%D1%81%D0%B5%2C%20123%D0%91";
const yandexMapEmbedUrl = "https://yandex.ru/map-widget/v1/?ll=37.243370%2C55.738110&mode=search&oid=75508515849&ol=biz&z=17";

function createIdempotencyKey(): string {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="M7 17 17 7m-7 0h7v7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: "next" | "previous" }) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d={direction === "next" ? "m9 5 7 7-7 7" : "m15 5-7 7 7 7"} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
    </svg>
  );
}

function FeedbackForm({ captchaSiteKey }: { captchaSiteKey?: string }) {
  const formStartedAt = useRef(Date.now());
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaActive, setCaptchaActive] = useState(false);
  const [captchaExecuteSignal, setCaptchaExecuteSignal] = useState(0);
  const [captchaResetSignal, setCaptchaResetSignal] = useState(0);
  const handleCaptchaTokenChange = useCallback((token: string | null) => setCaptchaToken(token), []);
  const idempotencyKey = useRef<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }

    setError(null);

    if (captchaSiteKey && !captchaToken) {
      setCaptchaExecuteSignal((value) => value + 1);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      idempotencyKey.current ??= createIdempotencyKey();
      const response = await fetch("/api/forms/feedback", {
        body: JSON.stringify({
          contact: formData.get("contact"),
          captchaToken,
          formStartedAt: formStartedAt.current,
          idempotencyKey: idempotencyKey.current,
          marketingConsent: formData.get("marketing-consent") === "on",
          message: formData.get("message"),
          name: formData.get("name"),
          personalDataConsent: formData.get("personal-data") === "on",
          privacyPolicyConsent: formData.get("privacy-policy") === "on",
          website: formData.get("website"),
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "Не удалось отправить сообщение.");
      }
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Не удалось отправить сообщение.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div aria-live="polite" className="contacts-page__feedback-success">
        <div aria-hidden="true" className="contacts-page__feedback-success-icon">✓</div>
        <h3 className="content-card__heading content-card__heading--h3">Спасибо за сообщение</h3>
        <p>Мы передали его администратору. Если понадобится уточнить детали, мы свяжемся с вами.</p>
        <Button onClick={() => { formStartedAt.current = Date.now(); idempotencyKey.current = null; setCaptchaResetSignal((value) => value + 1); setSubmitted(false); }} size="md" variant="outline">
          Написать ещё
        </Button>
      </div>
    );
  }

  return (
    <form className="contacts-page__feedback-form" onFocus={() => setCaptchaActive(true)} onSubmit={handleSubmit}>
      <input aria-hidden="true" autoComplete="off" className="sr-only" name="website" tabIndex={-1} />
      <div className="contacts-page__form-field">
        <Label htmlFor="feedback-name" required>Имя</Label>
        <Input autoComplete="name" id="feedback-name" name="name" placeholder="Как к вам обращаться" required />
      </div>
      <div className="contacts-page__form-field">
        <Label htmlFor="feedback-contact" required>Контакт для ответа</Label>
        <Input autoComplete="email" id="feedback-contact" name="contact" placeholder="Телефон или электронная почта" required />
      </div>
      <div className="contacts-page__form-field">
        <Label htmlFor="feedback-message" required>Ваш вопрос или предложение</Label>
        <Textarea id="feedback-message" name="message" placeholder="Напишите, чем мы можем помочь" required />
      </div>
      <div className="contacts-page__feedback-consents">
        <label className="contacts-page__feedback-consent">
          <Checkbox name="personal-data" required />
          <span>Согласен на <a href="/consent" rel="noreferrer" target="_blank">обработку персональных данных</a></span>
        </label>
        <label className="contacts-page__feedback-consent">
          <Checkbox name="privacy-policy" required />
          <span>Соглашаюсь с <a href="/policy" rel="noreferrer" target="_blank">политикой конфиденциальности</a></span>
        </label>
        <label className="contacts-page__feedback-consent">
          <Checkbox name="marketing-consent" />
          <span>Соглашаюсь на получение <a href="/consent-marketing" rel="noreferrer" target="_blank">рекламной и информационной рассылки</a></span>
        </label>
      </div>
      <SmartCaptcha
        active={captchaActive}
        executeSignal={captchaExecuteSignal}
        onTokenChange={handleCaptchaTokenChange}
        resetSignal={captchaResetSignal}
        siteKey={captchaSiteKey}
      />
      {captchaSiteKey ? <p className="type-text-xs smart-captcha__notice">Форма защищена SmartCaptcha. <a href="https://yandex.ru/legal/smartcaptcha_notice/" rel="noreferrer" target="_blank">Подробнее об обработке данных</a>.</p> : null}
      {error ? <p aria-live="polite" className="contacts-page__feedback-error" role="alert">{error}</p> : null}
      <Button disabled={isSubmitting} size="lg" type="submit">
        {isSubmitting ? "Отправляем…" : "Отправить сообщение"}
      </Button>
    </form>
  );
}

export function ContactsPageContent({
  captchaSiteKey,
  contactActions = defaultContactActions,
}: {
  captchaSiteKey?: string;
  contactActions?: readonly ContactFabAction[];
}) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const selectedPhoto = selectedPhotoIndex === null ? null : contactPhotos[selectedPhotoIndex];

  const navigatePhoto = useCallback((direction: "next" | "previous") => {
    setSelectedPhotoIndex((currentIndex) => {
      if (currentIndex === null) return null;
      const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
      return nextIndex >= 0 && nextIndex < contactPhotos.length ? nextIndex : currentIndex;
    });
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!selectedPhoto) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPhotoIndex(null);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigatePhoto("previous");
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        navigatePhoto("next");
      }
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [navigatePhoto, selectedPhoto]);

  function closePhoto() {
    setSelectedPhotoIndex(null);
  }

  return (
    <div className="contacts-page">
      <div className="contacts-page__layout">
        <div className="contacts-page__main">
          <section aria-labelledby="directions-title" className="content-card content-card--muted contacts-page__directions-section content-section" id="directions">
        <h2 className="content-card__heading content-card__heading--h2" id="directions-title">Будем ждать вас</h2>
        <div className="contacts-page__address-inline">
          <p>Клиника ASBeauty</p>
          <address>
            г. Москва, Рублёво-Успенское шоссе, 123Б<br />
            этаж 2, кабинет 1
          </address>
        </div>
        <div className="contacts-page__directions">
          <div>
            <h3 className="content-card__heading content-card__heading--h4">На общественном транспорте</h3>
            <p>Ориентир — остановка «Жуковка-1». От неё до клиники ASBeauty можно дойти пешком.</p>
          </div>
          <div>
            <h3 className="content-card__heading content-card__heading--h4">На автомобиле</h3>
            <p>В навигаторе укажите: Москва, Рублёво-Успенское шоссе, 123Б, клиника ASBeauty.</p>
          </div>
        </div>
        <div className="contacts-page__route-actions">
          <a className={cn(buttonVariants({ size: "md", variant: "primary" }), "contacts-page__route-button")} href={yandexMapsUrl} rel="noreferrer" target="_blank">
            Построить маршрут до клиники — Яндекс Карты
            <ArrowUpRightIcon />
          </a>
          <a className={cn(buttonVariants({ size: "md", variant: "outline" }), "contacts-page__route-button")} href={twoGisUrl} rel="noreferrer" target="_blank">
            Построить маршрут до клиники — 2ГИС
            <ArrowUpRightIcon />
          </a>
        </div>
          </section>

          <section aria-label="Карта проезда" className="contacts-page__map-card content-section" id="map">
        <iframe
          className="contacts-page__map-embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={yandexMapEmbedUrl}
          title="Карта проезда к медицинскому центру"
        />
          </section>

          <section aria-label="Фотографии медицинского центра" className="contacts-page__gallery content-section" id="photos">
        {contactPhotos.map((photo, index) => (
          <button
            aria-label={`Открыть фотографию: ${photo.title}`}
            className="contacts-page__photo"
            key={photo.src}
            onClick={() => setSelectedPhotoIndex(index)}
            type="button"
          >
            <Image
              alt={photo.alt}
              fill
              priority={index === 0}
              sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw"
              src={photo.src}
            />
            <span className="contacts-page__photo-caption">{photo.title}</span>
            <span aria-hidden="true" className="contacts-page__photo-arrow"><ArrowUpRightIcon /></span>
          </button>
        ))}
          </section>
        </div>

      <aside aria-labelledby="contacts-title" className="contacts-page__sidebar content-section" id="contacts">
        <article className="content-card content-card--accent contacts-page__contact-card">
          <h2 className="content-card__heading type-h3" id="contacts-title">Свяжитесь с нами</h2>
          <ContactActionList actions={contactActions} />
          <dl className="contacts-page__details">
            <div><dt>Режим работы</dt><dd>9:15–19:00, понедельник–пятница</dd></div>
          </dl>
          <p className="contacts-page__note">По всем вопросам звоните или пишите администратору.</p>
        </article>
      </aside>

      <article className="content-card content-card--muted contacts-page__feedback-card">
          <h2 className="content-card__heading content-card__heading--h2">Есть вопрос или предложение?</h2>
          <p className="contacts-page__feedback-description">Напишите нам — разберёмся с вопросом и передадим ваши предложения команде.</p>
          <FeedbackForm captchaSiteKey={captchaSiteKey} />
      </article>
      </div>

      {isMounted && selectedPhoto ? createPortal(
        <div aria-label="Просмотр фотографии" aria-modal="true" className="before-after-modal before-after-modal--open" onClick={(event) => { if (event.target === event.currentTarget) closePhoto(); }} role="dialog">
          <div className="before-after-modal__panel contacts-page__lightbox-panel">
            <div className="before-after-modal__close">
              <Button aria-label="Закрыть" onClick={closePhoto} size="icon" variant="ghost"><CloseIcon /></Button>
            </div>
            <button aria-label="Предыдущая фотография" className="before-after-modal__navigation before-after-modal__navigation--previous" disabled={selectedPhotoIndex === 0} onClick={() => navigatePhoto("previous")} type="button"><ArrowIcon direction="previous" /></button>
            <button aria-label="Следующая фотография" className="before-after-modal__navigation before-after-modal__navigation--next" disabled={selectedPhotoIndex === contactPhotos.length - 1} onClick={() => navigatePhoto("next")} type="button"><ArrowIcon direction="next" /></button>
            <div
              className="before-after-modal__media contacts-page__lightbox-media"
              // The modal follows the natural aspect ratio of the selected photo.
              style={{ aspectRatio: `${selectedPhoto.width} / ${selectedPhoto.height}` }}
            >
              <Image alt={selectedPhoto.alt} className="before-after-modal__image contacts-page__lightbox-image" fill sizes="(min-width: 64rem) 42rem, calc(100vw - 2rem)" src={selectedPhoto.src} />
            </div>
            <div className="before-after-modal__content"><p>{selectedPhoto.title}</p></div>
          </div>
        </div>,
        document.body,
      ) : null}
    </div>
  );
}
