import type { OperationCatalogGroup } from "@drkav/content-contracts";
import { ArrowUpRightIcon } from "@drkav/ui";
import Image from "next/image";
import Link from "next/link";

import { operationCategoryFallbackImages } from "@/content/operation-category-images";

type OperationsCatalogProps = {
  groups: readonly OperationCatalogGroup[];
};

export function OperationsCatalog({ groups }: OperationsCatalogProps) {
  return (
    <div className="operations-catalog">
      {groups.map((group) => (
        <section className="operations-catalog__group" key={group.key}>
          <div aria-hidden="true" className="operations-catalog__media">
            {group.image || operationCategoryFallbackImages[group.key as keyof typeof operationCategoryFallbackImages] ? (
              <Image
                alt=""
                fill
                sizes="100vw"
                src={group.image?.url ?? operationCategoryFallbackImages[group.key as keyof typeof operationCategoryFallbackImages]}
                unoptimized
              />
            ) : (
              <span>Изображение группы загружается в CMS</span>
            )}
          </div>
          <div className="operations-catalog__content">
            <h2 className="type-h2 operations-catalog__title">{group.name}</h2>
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
                  <span aria-hidden="true" className="operations-catalog__arrow">
                    <ArrowUpRightIcon />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
