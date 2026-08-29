import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Upload } from "./Upload";

/**
 * Загрузка файлов: drag&drop-область + клик для выбора. Состояния
 * default/hover/drag-over/error/disabled. Валидация размера через maxSize.
 */
const meta: Meta<typeof Upload> = {
  title: "UI/Upload",
  component: Upload,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    fileType: { control: "inline-radio", options: ["files", "images"] },
    disabled: { control: "boolean" },
    multiple: { control: "boolean" },
    error: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof Upload>;

export const Playground: Story = {
  args: { multiple: true },
};

export const States: Story = {
  name: "Состояния",
  render: () => (
    <div className="flex flex-col gap-24">
      <Upload />
      <Upload error="Файл превышает максимальный размер 10 МБ" />
      <Upload disabled />
    </div>
  ),
};

export const Images: Story = {
  name: "Картинки (сетка превью)",
  args: { fileType: "images", multiple: true },
};

export const WithMaxSize: Story = {
  name: "Валидация размера",
  args: { multiple: true, maxSize: 10 * 1024 * 1024 },
};
