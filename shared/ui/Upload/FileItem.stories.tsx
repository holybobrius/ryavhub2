import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FileItem } from "./FileItem";

/**
 * Карточка файла для списка загрузки: иконка, имя, мета (размер / ошибка),
 * опциональный прогресс-бар и кнопка удаления.
 */
const meta: Meta<typeof FileItem> = {
  title: "UI/Upload.FileItem",
  component: FileItem,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
  args: { onRemove: () => {} },
};
export default meta;

type Story = StoryObj<typeof FileItem>;

export const Playground: Story = {
  args: { name: "screenshot.png", size: 248000 },
};

export const States: Story = {
  name: "Состояния",
  render: () => (
    <div className="flex flex-col gap-8">
      <FileItem name="document.pdf" size={1_240_000} onRemove={() => {}} />
      <FileItem name="upload.zip" size={9_800_000} progress={42} />
      <FileItem
        name="huge-video.mov"
        error="Файл превышает максимальный размер 10 МБ"
        onRemove={() => {}}
      />
    </div>
  ),
};
