import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PictureCard } from "./PictureCard";

/**
 * Превью-карточка для сетки картинок в Upload (fileType="images"): 128×128,
 * оверлей прогресса с процентом, состояние ошибки, кнопка удаления на ховере.
 */
const meta: Meta<typeof PictureCard> = {
  title: "UI/Upload.PictureCard",
  component: PictureCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { onRemove: () => {} },
};
export default meta;

type Story = StoryObj<typeof PictureCard>;

// Инлайновый SVG как data-URI, чтобы стори не зависела от внешних картинок.
const SAMPLE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%235a3ece"/><stop offset="1" stop-color="%2318a6bc"/></linearGradient></defs><rect width="128" height="128" fill="url(%23g)"/></svg>',
  );

export const Playground: Story = {
  args: { src: SAMPLE, alt: "preview" },
};

export const States: Story = {
  name: "Состояния",
  render: () => (
    <div className="flex gap-12">
      <PictureCard src={SAMPLE} alt="ok" onRemove={() => {}} />
      <PictureCard src={SAMPLE} alt="uploading" progress={45} />
      <PictureCard src={SAMPLE} alt="error" error onRemove={() => {}} />
    </div>
  ),
};
