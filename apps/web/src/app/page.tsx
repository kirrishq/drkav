import { Button } from "@drkav/ui";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
      <p className="type-overline text-accent">drkav.ru</p>
      <h1 className="type-display mt-4 text-primary">
        Основание нового интерфейса
      </h1>
      <p className="type-body-lg mt-6 max-w-reading text-secondary">
        Здесь появится mobile-first редизайн. Контент и интеграции будут
        подключаться по согласованным контрактам.
      </p>
      <Button className="mt-8" type="button">
        Скоро
      </Button>
    </main>
  );
}
