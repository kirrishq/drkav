import { FeatureLinkCard } from "@drkav/ui";

const schoolUrl = "https://neschool.drkav.ru/";

const formats = [
  {
    description: "Расширяйте свой опыт и развивайте насмотренность, адаптируйте методики к разным сценариям и повышайте уверенность при выполнении сложных операций.",
    imageSrc: "/images/education-formats/masterclasses.png",
    title: "Онлайн мастер-классы",
  },
  {
    description: "Разбирайте свои ошибки, обретайте уверенность в рекомендациях и решениях, становитесь авторитетом для коллег и пациентов.",
    imageSrc: "/images/education-formats/mentorship.png",
    title: "Менторство",
  },
  {
    description: "Выбирайте конкретную операцию, приходите в операционную и получайте полное представление о технике и ключевых методиках.",
    imageSrc: "/images/education-formats/operation.jpg",
    title: "1 на 1 в операционной",
  },
  {
    description: "Погрузитесь в реальные кейсы, получите рекомендации и опыт профессионального наставничества.",
    imageSrc: "/images/education-formats/internship.png",
    title: "Стажировка — интенсив",
  },
] as const;

type EducationFormatCopy = {
  description: string;
  title: string;
};

export function EducationFormats({ copy }: { copy?: readonly EducationFormatCopy[] }) {
  const copyByTitle = new Map(copy?.map((item) => [item.title, item.description]));

  return (
    <section aria-labelledby="education-formats-title" className="education-formats">
      <h2 className="type-h2 education-formats__title" id="education-formats-title">Форматы обучения в НеШколе</h2>
      <div className="education-formats__grid">
        {formats.map((format) => (
          <FeatureLinkCard
            description={copyByTitle.get(format.title) ?? format.description}
            href={schoolUrl}
            imageAlt=""
            imageSrc={format.imageSrc}
            key={format.title}
            rel="noreferrer"
            target="_blank"
            title={format.title}
          />
        ))}
      </div>
    </section>
  );
}
