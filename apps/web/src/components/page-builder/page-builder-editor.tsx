"use client";

import { useState } from "react";

import {
  builderBlockDefinitions,
  type BuilderBlock,
  type BuilderBlockType,
  type BuilderPage,
  type RichTextBlock,
} from "@drkav/content-contracts";
import { Button, cn } from "@drkav/ui";

import { PageBuilderRenderer } from "./page-builder-renderer";

type Viewport = "desktop" | "mobile";

function createBlock(type: BuilderBlockType, index: number): BuilderBlock {
  const id = `local-${type}-${Date.now()}-${index}`;
  const body: RichTextBlock[] = [
    {
      type: "paragraph",
      children: [{ type: "text", text: "Добавьте текст блока." }],
    },
  ];

  switch (type) {
    case "hero":
      return {
        id,
        type,
        heading: "Новый первый экран",
        description: "Добавьте описание страницы.",
        align: "left",
      };
    case "rich-text":
      return { id, type, heading: "Новый текстовый блок", body };
    case "callout":
      return { id, type, title: "Важное сообщение", body, tone: "accent" };
    case "faq":
      return {
        id,
        type,
        heading: "Вопросы и ответы",
        items: [{ question: "Новый вопрос", answer: "Добавьте ответ." }],
      };
  }
}

function getBlockLabel(type: BuilderBlockType): string {
  return builderBlockDefinitions.find((definition) => definition.type === type)?.label ?? type;
}

function getRichTextValue(block: Extract<BuilderBlock, { type: "rich-text" | "callout" }>): string {
  const firstBlock = block.body[0];

  if (!firstBlock || firstBlock.type !== "paragraph") {
    return "";
  }

  return firstBlock.children
    .filter((child) => child.type === "text")
    .map((child) => child.text)
    .join("");
}

function setSimpleRichTextBody(text: string): RichTextBlock[] {
  return [
    {
      type: "paragraph",
      children: [{ type: "text", text }],
    },
  ];
}

function Field({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="page-builder-editor__field">
      <span className="page-builder-editor__label">{label}</span>
      {children}
    </label>
  );
}

export function PageBuilderEditor({ initialPage }: { initialPage: BuilderPage }) {
  const [page, setPage] = useState(initialPage);
  const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>(
    initialPage.blocks[0]?.id,
  );
  const [draggedBlockId, setDraggedBlockId] = useState<string | undefined>();
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [previewMode, setPreviewMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Черновик не сохранён");

  const selectedBlock = page.blocks.find((block) => block.id === selectedBlockId);

  function updateBlock(id: string, update: (block: BuilderBlock) => BuilderBlock) {
    setPage((currentPage) => ({
      ...currentPage,
      blocks: currentPage.blocks.map((block) =>
        block.id === id ? update(block) : block,
      ),
    }));
    setStatusMessage("Есть несохранённые изменения");
  }

  function updateSelectedBlock(update: (block: BuilderBlock) => BuilderBlock) {
    if (selectedBlockId) {
      updateBlock(selectedBlockId, update);
    }
  }

  function moveBlock(sourceId: string, targetId: string) {
    if (sourceId === targetId) {
      return;
    }

    setPage((currentPage) => {
      const blocks = [...currentPage.blocks];
      const sourceIndex = blocks.findIndex((block) => block.id === sourceId);
      const targetIndex = blocks.findIndex((block) => block.id === targetId);

      if (sourceIndex === -1 || targetIndex === -1) {
        return currentPage;
      }

      const [source] = blocks.splice(sourceIndex, 1);
      blocks.splice(targetIndex, 0, source);
      return { ...currentPage, blocks };
    });
    setStatusMessage("Порядок блоков изменён");
  }

  function addBlock(type: BuilderBlockType) {
    const block = createBlock(type, page.blocks.length);
    setPage((currentPage) => ({
      ...currentPage,
      blocks: [...currentPage.blocks, block],
    }));
    setSelectedBlockId(block.id);
    setStatusMessage("Добавлен новый блок");
  }

  function removeSelectedBlock() {
    if (!selectedBlockId) {
      return;
    }

    const remainingBlocks = page.blocks.filter((block) => block.id !== selectedBlockId);
    setPage((currentPage) => ({ ...currentPage, blocks: remainingBlocks }));
    setSelectedBlockId(remainingBlocks[0]?.id);
    setStatusMessage("Блок удалён из черновика");
  }

  function saveDraft() {
    setStatusMessage("Локальный черновик подготовлен к сохранению в Strapi");
  }

  function publish() {
    setStatusMessage("Публикация подключается на следующем этапе через защищённый CMS API");
  }

  return (
    <div className="page-builder-editor">
      <header className="page-builder-editor__toolbar">
        <div>
          <p className="page-builder-editor__overline">Page Builder</p>
          <h1 className="page-builder-editor__title">{page.internalName}</h1>
        </div>
        <div className="page-builder-editor__toolbar-actions">
          <span className="page-builder-editor__status">{statusMessage}</span>
          <Button onClick={() => setPreviewMode((current) => !current)} variant="outline">
            {previewMode ? "Вернуться к редактированию" : "Предпросмотр"}
          </Button>
          <Button onClick={saveDraft} variant="secondary">Сохранить черновик</Button>
          <Button onClick={publish} variant="primary">Опубликовать</Button>
        </div>
      </header>

      {previewMode ? (
        <div className="page-builder-editor__preview-only">
          <PageBuilderRenderer page={page} />
        </div>
      ) : (
        <div className="page-builder-editor__workspace">
          <aside className="page-builder-editor__sidebar">
            <section className="page-builder-editor__panel">
              <h2 className="page-builder-editor__panel-title">Блоки</h2>
              <p className="page-builder-editor__hint">Перетаскивайте блоки, чтобы изменить порядок.</p>
              <div className="page-builder-editor__block-list">
                {page.blocks.map((block) => (
                  <button
                    className={cn(
                      "page-builder-editor__block-item",
                      selectedBlockId === block.id && "page-builder-editor__block-item--selected",
                    )}
                    draggable
                    key={block.id}
                    onClick={() => setSelectedBlockId(block.id)}
                    onDragEnd={() => setDraggedBlockId(undefined)}
                    onDragOver={(event) => event.preventDefault()}
                    onDragStart={() => setDraggedBlockId(block.id)}
                    onDrop={() => {
                      if (draggedBlockId) moveBlock(draggedBlockId, block.id);
                    }}
                    type="button"
                  >
                    <span aria-hidden="true" className="page-builder-editor__drag-handle">⋮⋮</span>
                    <span>
                      <strong>{getBlockLabel(block.type)}</strong>
                      <small>{block.id}</small>
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="page-builder-editor__panel">
              <h2 className="page-builder-editor__panel-title">Добавить блок</h2>
              <div className="page-builder-editor__palette">
                {builderBlockDefinitions.map((definition) => (
                  <button
                    className="page-builder-editor__palette-item"
                    key={definition.type}
                    onClick={() => addBlock(definition.type)}
                    type="button"
                  >
                    <strong>{definition.label}</strong>
                    <span>{definition.description}</span>
                  </button>
                ))}
              </div>
            </section>
          </aside>

          <section className="page-builder-editor__stage" aria-label="Предпросмотр страницы">
            <div className="page-builder-editor__stage-toolbar">
              <div className="page-builder-editor__segmented-control" role="group" aria-label="Размер предпросмотра">
                <button
                  className={cn(viewport === "desktop" && "page-builder-editor__segmented-item--active")}
                  onClick={() => setViewport("desktop")}
                  type="button"
                >
                  Desktop
                </button>
                <button
                  className={cn(viewport === "mobile" && "page-builder-editor__segmented-item--active")}
                  onClick={() => setViewport("mobile")}
                  type="button"
                >
                  Mobile
                </button>
              </div>
            </div>
            <div className="page-builder-editor__canvas-wrap">
              <div className={cn("page-builder-editor__canvas", viewport === "mobile" && "page-builder-editor__canvas--mobile")}>
                <PageBuilderRenderer page={page} />
              </div>
            </div>
          </section>

          <aside className="page-builder-editor__inspector">
            <section className="page-builder-editor__panel">
              <h2 className="page-builder-editor__panel-title">Стиль страницы</h2>
              <div className="page-builder-editor__fields">
                <Field label="Акцентный цвет">
                  <input
                    aria-label="Акцентный цвет"
                    className="page-builder-editor__color-input"
                    onChange={(event) => setPage((current) => ({ ...current, theme: { ...current.theme, accentColor: event.target.value } }))}
                    type="color"
                    value={page.theme.accentColor}
                  />
                </Field>
                <Field label="Цвет фона">
                  <input
                    aria-label="Цвет фона"
                    className="page-builder-editor__color-input"
                    onChange={(event) => setPage((current) => ({ ...current, theme: { ...current.theme, backgroundColor: event.target.value } }))}
                    type="color"
                    value={page.theme.backgroundColor}
                  />
                </Field>
                <Field label="Цвет текста">
                  <input
                    aria-label="Цвет текста"
                    className="page-builder-editor__color-input"
                    onChange={(event) => setPage((current) => ({ ...current, theme: { ...current.theme, textColor: event.target.value } }))}
                    type="color"
                    value={page.theme.textColor}
                  />
                </Field>
                <Field label="Шрифт заголовков">
                  <select
                    className="page-builder-editor__input"
                    onChange={(event) => setPage((current) => ({ ...current, theme: { ...current.theme, headingFont: event.target.value as BuilderPage["theme"]["headingFont"] } }))}
                    value={page.theme.headingFont}
                  >
                    <option value="geist">Geist</option>
                    <option value="system">Системный</option>
                  </select>
                </Field>
              </div>
            </section>

            <section className="page-builder-editor__panel">
              <h2 className="page-builder-editor__panel-title">Настройки блока</h2>
              {selectedBlock ? (
                <div className="page-builder-editor__fields">
                  <Field label="Скрыть блок">
                    <input
                      checked={selectedBlock.hidden ?? false}
                      onChange={(event) => updateSelectedBlock((block) => ({ ...block, hidden: event.target.checked }))}
                      type="checkbox"
                    />
                  </Field>
                  {selectedBlock.type === "hero" ? (
                    <>
                      <Field label="Заголовок">
                        <input className="page-builder-editor__input" onChange={(event) => updateSelectedBlock((block) => block.type === "hero" ? { ...block, heading: event.target.value } : block)} value={selectedBlock.heading} />
                      </Field>
                      <Field label="Описание">
                        <textarea className="page-builder-editor__input page-builder-editor__textarea" onChange={(event) => updateSelectedBlock((block) => block.type === "hero" ? { ...block, description: event.target.value } : block)} value={selectedBlock.description ?? ""} />
                      </Field>
                    </>
                  ) : null}
                  {selectedBlock.type === "rich-text" || selectedBlock.type === "callout" ? (
                    <>
                      <Field label="Заголовок">
                        <input
                          className="page-builder-editor__input"
                          onChange={(event) => updateSelectedBlock((block) => {
                            if (block.type === "rich-text") {
                              return { ...block, heading: event.target.value };
                            }
                            if (block.type === "callout") {
                              return { ...block, title: event.target.value };
                            }
                            return block;
                          })}
                          value={selectedBlock.type === "rich-text" ? selectedBlock.heading ?? "" : selectedBlock.title ?? ""}
                        />
                      </Field>
                      <Field label="Текст">
                        <textarea className="page-builder-editor__input page-builder-editor__textarea" onChange={(event) => updateSelectedBlock((block) => block.type === selectedBlock.type ? { ...block, body: setSimpleRichTextBody(event.target.value) } : block)} value={getRichTextValue(selectedBlock)} />
                      </Field>
                    </>
                  ) : null}
                  {selectedBlock.type === "faq" ? (
                    <Field label="Первый вопрос">
                      <input className="page-builder-editor__input" onChange={(event) => updateSelectedBlock((block) => block.type === "faq" ? { ...block, items: block.items.map((item, index) => index === 0 ? { ...item, question: event.target.value } : item) } : block)} value={selectedBlock.items[0]?.question ?? ""} />
                    </Field>
                  ) : null}
                  <Button onClick={removeSelectedBlock} variant="outline">Удалить блок</Button>
                </div>
              ) : (
                <p className="page-builder-editor__hint">Выберите блок слева.</p>
              )}
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
