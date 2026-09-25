"use client";

import { Button, Checkbox, Input, Label, Textarea, buttonVariants, cn } from "@drkav/ui";
import Image from "next/image";
import { createPortal } from "react-dom";
import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";

type ContactPhoto = {
  alt: string;
  height: number;
  src: string;
  title: string;
  width: number;
};

const contactPhotos: readonly ContactPhoto[] = [
  {
    alt: "Фасад медицинского центра с главным входом",
    height: 848,
    src: "/images/contacts/04-clinic.jpg",
    title: "Вход в медицинский центр",
    width: 1366,
  },
  {
    alt: "Светлый кабинет для консультаций",
    height: 404,
    src: "/images/contacts/01-clinic.jpg",
    title: "Кабинет для консультаций",
    width: 600,
  },
  {
    alt: "Светлая операционная с медицинским оборудованием",
    height: 848,
    src: "/images/contacts/02-clinic.jpg",
    title: "Операционная",
    width: 1366,
  },
  {
    alt: "Зона ожидания и стойка администратора",
    height: 847,
    src: "/images/contacts/03-clinic.jpg",
    title: "Зона ожидания",
    width: 1366,
  },
] as const;

const yandexMapsUrl = "https://yandex.ru/maps/?rtext=~55.678304,37.451744&rtt=auto";
const twoGisUrl = "https://2gis.ru/moscow/search/%D0%91%D0%BE%D0%BB%D1%8C%D1%88%D0%B0%D1%8F%20%D0%9E%D1%87%D0%B0%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F%2031";
const yandexMapEmbedUrl = "https://yandex.by/map-widget/v1/-/CCUFJQVmxC";

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

function FeedbackForm() {
  const formStartedAt = useRef(Date.now());
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/forms/feedback", {
        body: JSON.stringify({
          contact: formData.get("contact"),
          formStartedAt: formStartedAt.current,
          message: formData.get("message"),
          name: formData.get("name"),
          personalDataConsent: formData.get("personal-data") === "on",
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
        <Button onClick={() => { formStartedAt.current = Date.now(); setSubmitted(false); }} size="md" variant="outline">
          Написать ещё
        </Button>
      </div>
    );
  }

  return (
    <form className="contacts-page__feedback-form" onSubmit={handleSubmit}>
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
      <label className="contacts-page__feedback-consent">
        <Checkbox name="personal-data" required />
        <span>Согласен на обработку персональных данных</span>
      </label>
      {error ? <p aria-live="polite" className="contacts-page__feedback-error" role="alert">{error}</p> : null}
      <Button disabled={isSubmitting} size="lg" type="submit">
        {isSubmitting ? "Отправляем…" : "Отправить сообщение"}
      </Button>
    </form>
  );
}

export function ContactsPageContent() {
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
      <section aria-labelledby="directions-title" className="content-card content-card--muted contacts-page__directions-section content-section" id="directions">
        <p className="contacts-page__eyebrow">Как добраться</p>
        <h2 className="content-card__heading content-card__heading--h2" id="directions-title">Будем ждать вас</h2>
        <div className="contacts-page__address-inline">
          <p className="contacts-page__eyebrow">Адрес</p>
          <address>
            г. Москва, ул. Большая Очаковская, 31<br />
            этаж 1, кабинет 12
          </address>
        </div>
        <div className="contacts-page__directions">
          <div>
            <h3 className="content-card__heading content-card__heading--h4">На общественном транспорте</h3>
            <p>До метро «Озёрная» (жёлтая ветка), выход № 4. Затем пешком около 7 минут.</p>
          </div>
          <div>
            <h3 className="content-card__heading content-card__heading--h4">На автомобиле</h3>
            <p>По улице Марии Поливановой действуют знаки «Остановка и стоянка запрещены». Если парковка у здания занята, лучше припарковаться во дворе.</p>
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

      <section aria-labelledby="contacts-title" className="contacts-page__contact-layout content-section" id="contacts">
        <article className="content-card content-card--accent contacts-page__contact-card">
          <p className="contacts-page__eyebrow">Контакты</p>
          <h2 className="content-card__heading content-card__heading--h2" id="contacts-title">Свяжитесь с нами</h2>
          <dl className="contacts-page__details">
            <div><dt>Клиника</dt><dd><a href="tel:+74951514206">+7 495 151-42-06</a></dd></div>
            <div><dt>Администратор Ольга</dt><dd><a href="tel:+79256255510">+7 925 625-55-10</a></dd></div>
            <div><dt>Электронная почта</dt><dd><a href="mailto:admin@drkav.ru">admin@drkav.ru</a></dd></div>
            <div><dt>Режим работы</dt><dd>9:15–19:00, понедельник–пятница</dd></div>
          </dl>
          <p className="contacts-page__note">По всем вопросам звоните или пишите администратору.</p>
        </article>

        <article className="content-card content-card--muted contacts-page__feedback-card">
          <p className="contacts-page__eyebrow">Обратная связь</p>
          <h2 className="content-card__heading content-card__heading--h2">Есть вопрос или предложение?</h2>
          <p className="contacts-page__feedback-description">Напишите нам — разберёмся с вопросом и передадим ваши предложения команде.</p>
          <FeedbackForm />
        </article>
      </section>

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
