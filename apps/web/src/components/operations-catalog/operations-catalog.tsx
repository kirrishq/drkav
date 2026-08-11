import type { OperationCatalogGroup } from "@drkav/content-contracts";
import Image from "next/image";
import Link from "next/link";

type OperationsCatalogProps = {
  groups: readonly OperationCatalogGroup[];
};

function ArrowIcon() {
  return (
    <span aria-hidden="true" className="operations-catalog__arrow">
      <svg className="operations-catalog__arrow-icon" fill="none" viewBox="0 0 24 24">
        <path
          d="M7 17 17 7m-7 0h7v7"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.75"
        />
      </svg>
    </span>
  );
}

export function OperationsCatalog({ groups }: OperationsCatalogProps) {
  return (
    <div className="operations-catalog">
      {groups.map((group) => (
        <section className="operations-catalog__group" key={group.key}>
          <div aria-hidden="true" className="operations-catalog__media">
            {group.image ? (
              <Image
                alt=""
                fill
                sizes="100vw"
                src={group.image.url}
                unoptimized
              />
            ) : (
              <span>Изображение группы загружается в CMS</span>
            )}
          </div>
          <div className="operations-catalog__content">
            <h2 className="operations-catalog__title">{group.name}</h2>
            <div className="operations-catalog__links">
              {group.operations.map((operation, index) => (
                <Link
                  className={
                    index === 0
                      ? "operations-catalog__link operations-catalog__link--featured"
                      : "operations-catalog__link"
                  }
                  href={operation.canonicalPath}
                  key={operation.canonicalPath}
                >
                  <span>{operation.heading}</span>
                  <ArrowIcon />
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
