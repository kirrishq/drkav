"use client";

import {
  createContext,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { Button, buttonVariants } from "./button";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Label } from "./label";
import { PhoneInput } from "./phone-input";
import { RadioButton } from "./radio-button";
import { cn } from "./lib/cn";

type ConsultationFormat = "clinic" | "online";
type ContactMethod = "telegram" | "phone" | "max";

type ConsultationDialogContextValue = {
  open: () => void;
};

const ConsultationDialogContext = createContext<ConsultationDialogContextValue | null>(null);

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="consultation-dialog__close-icon" fill="none" viewBox="0 0 24 24">
      <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
    </svg>
  );
}

export type ConsultationFormProps = {
  className?: string;
  compact?: boolean;
  onSuccess?: () => void;
};

export function ConsultationForm({ className, compact = false, onSuccess }: ConsultationFormProps) {
  const idPrefix = useId().replaceAll(":", "");
  const [consultationFormat, setConsultationFormat] = useState<ConsultationFormat>("clinic");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("phone");
  const [submitted, setSubmitted] = useState(false);

  const nameId = `${idPrefix}-name`;
  const contactId = `${idPrefix}-contact`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }

    setSubmitted(true);
    onSuccess?.();
  }

  if (submitted) {
    return (
      <div aria-live="polite" className={cn("consultation-form consultation-form--success", className)}>
        <div className="consultation-form__success-icon" aria-hidden="true">✓</div>
        <h3 className="type-h3 consultation-form__success-title">Заявка отправлена</h3>
        <p className="type-text-base consultation-form__success-description">
          Администратор свяжется с вами выбранным способом и уточнит удобное время.
        </p>
        <Button onClick={() => setSubmitted(false)} size="md" variant="outline">
          Заполнить ещё раз
        </Button>
      </div>
    );
  }

  return (
    <form className={cn("consultation-form", compact && "consultation-form--compact", className)} onSubmit={handleSubmit}>
      <div className="consultation-form__field">
        <Label htmlFor={nameId} required>Имя</Label>
        <Input autoComplete="name" id={nameId} name="name" placeholder="Как к вам обращаться" required />
      </div>

      <fieldset className="consultation-form__fieldset">
        <legend className="type-label consultation-form__legend">Формат консультации</legend>
        <div className="consultation-form__options consultation-form__options--formats">
          <RadioButton
            checked={consultationFormat === "clinic"}
            className="consultation-form__option"
            name="consultation-format"
            onChange={() => setConsultationFormat("clinic")}
            value="clinic"
          >
            <span>Очно в клинике</span>
            <span className="consultation-form__price">1 950 ₽</span>
          </RadioButton>
          <RadioButton
            checked={consultationFormat === "online"}
            className="consultation-form__option"
            name="consultation-format"
            onChange={() => setConsultationFormat("online")}
            value="online"
          >
            <span>Онлайн</span>
            <span className="consultation-form__price">950 ₽</span>
          </RadioButton>
        </div>
      </fieldset>

      <fieldset className="consultation-form__fieldset">
        <legend className="type-label consultation-form__legend">Удобный способ связи</legend>
        <div className="consultation-form__options consultation-form__options--contacts">
          <RadioButton
            checked={contactMethod === "telegram"}
            className="consultation-form__option"
            name="contact-method"
            onChange={() => setContactMethod("telegram")}
            value="telegram"
          >
            Telegram
          </RadioButton>
          <RadioButton
            checked={contactMethod === "phone"}
            className="consultation-form__option"
            name="contact-method"
            onChange={() => setContactMethod("phone")}
            value="phone"
          >
            Телефон
          </RadioButton>
          <RadioButton
            checked={contactMethod === "max"}
            className="consultation-form__option"
            name="contact-method"
            onChange={() => setContactMethod("max")}
            value="max"
          >
            MAX
          </RadioButton>
        </div>
      </fieldset>

      <div className="consultation-form__field">
        <Label htmlFor={contactId} required>Контакт для связи</Label>
        {contactMethod === "telegram" ? (
          <Input
            autoComplete="username"
            id={contactId}
            name="contact"
            placeholder="Имя пользователя или телефон"
            required
          />
        ) : (
          <PhoneInput id={contactId} name="contact" required />
        )}
      </div>

      <div className="consultation-form__consents">
        <label className="consultation-form__consent">
          <Checkbox name="personal-data" required />
          <span>Согласен на обработку персональных данных</span>
        </label>
        <label className="consultation-form__consent">
          <Checkbox name="privacy-policy" required />
          <span>Соглашаюсь с политикой конфиденциальности</span>
        </label>
      </div>

      <Button className="consultation-form__submit" size="lg" type="submit">
        Записаться на консультацию
      </Button>
      <p className="type-text-sm consultation-form__note">
        После отправки заявки администратор свяжется с вами для подтверждения записи.
      </p>
    </form>
  );
}

export function ConsultationSection() {
  return (
    <section aria-labelledby="consultation-section-title" className="consultation-section">
      <div className="consultation-section__layout">
        <div className="consultation-section__content">
          <p className="type-label consultation-section__eyebrow">Главный шаг</p>
          <h2 className="type-h2 consultation-section__title" id="consultation-section-title">Запись на консультацию</h2>
          <p className="type-text-base consultation-section__description">
            Выберите формат встречи и удобный способ связи — администратор поможет согласовать дату и ответит на организационные вопросы.
          </p>
          <ul className="consultation-section__details">
            <li className="type-text-base consultation-section__detail">Очно в клинике — 1 950 ₽</li>
            <li className="type-text-base consultation-section__detail">Онлайн — 950 ₽</li>
            <li className="type-text-base consultation-section__detail">После заявки администратор свяжется с вами</li>
          </ul>
        </div>
        <ConsultationForm />
      </div>
    </section>
  );
}

export function ConsultationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ConsultationDialogContext.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      {isOpen ? <ConsultationDialog onClose={() => setIsOpen(false)} /> : null}
    </ConsultationDialogContext.Provider>
  );
}

export type ConsultationTriggerProps = {
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

export function ConsultationTrigger({ children, className, onClick }: ConsultationTriggerProps) {
  const context = useContext(ConsultationDialogContext);

  if (!context) {
    throw new Error("ConsultationTrigger must be rendered inside ConsultationProvider");
  }

  return (
    <button
      className={className ?? buttonVariants({ size: "md", variant: "primary" })}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          context.open();
        }
      }}
      type="button"
    >
      {children}
    </button>
  );
}

function ConsultationDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    dialog.showModal();

    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, []);

  return (
    <dialog
      aria-labelledby={titleId}
      className="consultation-dialog"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      ref={dialogRef}
    >
      <div className="consultation-dialog__content">
        <div className="consultation-dialog__header">
          <div>
            <p className="type-label consultation-dialog__eyebrow">Главный шаг</p>
            <h2 className="type-h2 consultation-dialog__title" id={titleId}>Запись на консультацию</h2>
          </div>
          <button aria-label="Закрыть форму записи" className="consultation-dialog__close focus-ring" onClick={onClose} type="button">
            <CloseIcon />
          </button>
        </div>
        <ConsultationForm compact />
      </div>
    </dialog>
  );
}
