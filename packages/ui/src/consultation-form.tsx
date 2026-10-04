"use client";

import {
  createContext,
  useCallback,
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
import { ContactActionIcon } from "./contact-fab";
import { Input } from "./input";
import { Label } from "./label";
import { PhoneInput } from "./phone-input";
import { RadioButton } from "./radio-button";
import { SmartCaptcha } from "./smart-captcha";
import { cn } from "./lib/cn";

type ConsultationFormat = "clinic" | "online";
type ContactMethod = "telegram" | "phone" | "max" | "whatsapp";

function createIdempotencyKey(): string {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

type ConsultationDialogContextValue = {
  captchaSiteKey?: string;
  open: () => void;
  submitUrl?: string;
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
  captchaSiteKey?: string;
  className?: string;
  compact?: boolean;
  onSuccess?: () => void;
  submitUrl?: string;
};

export function ConsultationForm({ captchaSiteKey, className, compact = false, onSuccess, submitUrl }: ConsultationFormProps) {
  const idPrefix = useId().replaceAll(":", "");
  const [consultationFormat, setConsultationFormat] = useState<ConsultationFormat>("clinic");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("phone");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaResetSignal, setCaptchaResetSignal] = useState(0);
  const formStartedAt = useRef(Date.now());
  const idempotencyKey = useRef<string | null>(null);
  const handleCaptchaTokenChange = useCallback((token: string | null) => setCaptchaToken(token), []);

  const nameId = `${idPrefix}-name`;
  const phoneId = `${idPrefix}-phone`;
  const telegramUsernameId = `${idPrefix}-telegram-username`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }

    setError(null);

    if (captchaSiteKey && !captchaToken) {
      setError("Подтвердите, что вы не робот.");
      return;
    }

    if (submitUrl) {
      setIsSubmitting(true);

      try {
        const formData = new FormData(event.currentTarget);
        idempotencyKey.current ??= createIdempotencyKey();
        const response = await fetch(submitUrl, {
          body: JSON.stringify({
            contactMethod,
            consultationFormat,
            captchaToken,
            formStartedAt: formStartedAt.current,
            idempotencyKey: idempotencyKey.current,
            marketingConsent: formData.get("marketing-consent") === "on",
            name: formData.get("name"),
            personalDataConsent: formData.get("personal-data") === "on",
            phone: formData.get("phone"),
            privacyPolicyConsent: formData.get("privacy-policy") === "on",
            telegramUsername: formData.get("telegram-username"),
            website: formData.get("website"),
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        const result = (await response.json()) as { error?: string };
        if (!response.ok) {
          throw new Error(result.error || "Не удалось отправить заявку.");
        }
      } catch (submissionError) {
        setError(submissionError instanceof Error ? submissionError.message : "Не удалось отправить заявку.");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
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
        <Button onClick={() => { formStartedAt.current = Date.now(); idempotencyKey.current = null; setCaptchaResetSignal((value) => value + 1); setSubmitted(false); }} size="md" variant="outline">
          Заполнить ещё раз
        </Button>
      </div>
    );
  }

  return (
    <form className={cn("consultation-form", compact && "consultation-form--compact", className)} onSubmit={handleSubmit}>
      <input aria-hidden="true" autoComplete="off" className="sr-only" name="website" tabIndex={-1} />
      <div className="consultation-form__field">
        <Label htmlFor={nameId} required>Имя</Label>
        <Input autoComplete="name" id={nameId} name="name" placeholder="Как к вам обращаться" required />
      </div>

      <div className="consultation-form__field">
        <Label htmlFor={phoneId} required>Телефон</Label>
        <PhoneInput id={phoneId} name="phone" required />
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
            Очно — 2 500 ₽
          </RadioButton>
          <RadioButton
            checked={consultationFormat === "online"}
            className="consultation-form__option"
            name="consultation-format"
            onChange={() => setConsultationFormat("online")}
            value="online"
          >
            Онлайн — 2 500 ₽
          </RadioButton>
        </div>
      </fieldset>

      <fieldset className="consultation-form__fieldset">
        <legend className="type-label consultation-form__legend">Удобный способ связи</legend>
        <div className="consultation-form__options consultation-form__options--contacts">
          <RadioButton
            checked={contactMethod === "phone"}
            className="consultation-form__option"
            icon={<ContactActionIcon kind="phone" />}
            name="contact-method"
            onChange={() => setContactMethod("phone")}
            value="phone"
          >
            Позвонить
          </RadioButton>
          <RadioButton
            checked={contactMethod === "telegram"}
            className="consultation-form__option"
            icon={<ContactActionIcon kind="telegram" />}
            name="contact-method"
            onChange={() => setContactMethod("telegram")}
            value="telegram"
          >
            Telegram
          </RadioButton>
          <RadioButton
            checked={contactMethod === "max"}
            className="consultation-form__option"
            icon={<ContactActionIcon kind="max" />}
            name="contact-method"
            onChange={() => setContactMethod("max")}
            value="max"
          >
            MAX
          </RadioButton>
          <RadioButton
            checked={contactMethod === "whatsapp"}
            className="consultation-form__option"
            icon={<ContactActionIcon kind="whatsapp" />}
            name="contact-method"
            onChange={() => setContactMethod("whatsapp")}
            value="whatsapp"
          >
            WhatsApp
          </RadioButton>
        </div>
      </fieldset>

      {contactMethod === "telegram" ? (
        <div className="consultation-form__field">
          <Label htmlFor={telegramUsernameId}>Имя пользователя</Label>
          <Input autoComplete="username" id={telegramUsernameId} name="telegram-username" placeholder="@username" />
        </div>
      ) : null}

      <div className="consultation-form__consents">
        <label className="consultation-form__consent">
          <Checkbox name="personal-data" required />
          <span>Согласен на <a className="consultation-form__legal-link" href="/consent" rel="noreferrer" target="_blank">обработку персональных данных</a></span>
        </label>
        <label className="consultation-form__consent">
          <Checkbox name="privacy-policy" required />
          <span>Соглашаюсь с <a className="consultation-form__legal-link" href="/policy" rel="noreferrer" target="_blank">политикой конфиденциальности</a></span>
        </label>
        <label className="consultation-form__consent">
          <Checkbox name="marketing-consent" />
          <span>Соглашаюсь на получение <a className="consultation-form__legal-link" href="/consent-marketing" rel="noreferrer" target="_blank">рекламной и информационной рассылки</a></span>
        </label>
      </div>

      <SmartCaptcha
        onTokenChange={handleCaptchaTokenChange}
        resetSignal={captchaResetSignal}
        siteKey={captchaSiteKey}
      />
      {captchaSiteKey ? <p className="type-text-xs smart-captcha__notice">Форма защищена SmartCaptcha.</p> : null}

      {error ? <p aria-live="polite" className="type-text-sm consultation-form__error" role="alert">{error}</p> : null}
      <Button className="consultation-form__submit" disabled={isSubmitting} size="lg" type="submit">
        {isSubmitting ? "Отправляем…" : "Записаться на консультацию"}
      </Button>
      <p className="type-text-sm consultation-form__note">
        После отправки заявки администратор свяжется с вами для подтверждения записи.
      </p>
    </form>
  );
}

export function ConsultationSection({ captchaSiteKey, description = "Выберите формат встречи и удобный способ связи — администратор поможет согласовать дату и ответит на организационные вопросы.", details = ["После заявки администратор свяжется с вами"], submitUrl, title = "Запись на консультацию" }: Pick<ConsultationFormProps, "captchaSiteKey" | "submitUrl"> & { description?: string; details?: readonly string[]; title?: string }) {
  return (
    <section aria-labelledby="consultation-section-title" className="consultation-section">
      <div className="consultation-section__layout">
        <div className="consultation-section__content">
          <div
            aria-label="Доктор Коробов проводит консультацию"
            className="consultation-section__visual"
            role="img"
          />
          <h2 className="type-h2 consultation-section__title" id="consultation-section-title">{title}</h2>
          <p className="type-text-base consultation-section__description">
            {description}
          </p>
          <ul className="consultation-section__details">
            {details.map((detail) => <li className="type-text-base consultation-section__detail" key={detail}>{detail}</li>)}
          </ul>
        </div>
        <ConsultationForm captchaSiteKey={captchaSiteKey} submitUrl={submitUrl} />
      </div>
    </section>
  );
}

export function ConsultationProvider({ captchaSiteKey, children, submitUrl }: { captchaSiteKey?: string; children: ReactNode; submitUrl?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ConsultationDialogContext.Provider value={{ captchaSiteKey, open: () => setIsOpen(true), submitUrl }}>
      {children}
      {isOpen ? <ConsultationDialog captchaSiteKey={captchaSiteKey} onClose={() => setIsOpen(false)} submitUrl={submitUrl} /> : null}
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

function ConsultationDialog({ captchaSiteKey, onClose, submitUrl }: { captchaSiteKey?: string; onClose: () => void; submitUrl?: string }) {
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
            <h2 className="type-h2 consultation-dialog__title" id={titleId}>Запись на консультацию</h2>
          </div>
          <button aria-label="Закрыть форму записи" className="consultation-dialog__close focus-ring" onClick={onClose} type="button">
            <CloseIcon />
          </button>
        </div>
        <ConsultationForm captchaSiteKey={captchaSiteKey} compact submitUrl={submitUrl} />
      </div>
    </dialog>
  );
}
