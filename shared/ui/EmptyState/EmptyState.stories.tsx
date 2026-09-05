import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EmptyState } from "./EmptyState";
import { IconSearch } from "../icons";
import { Button } from "../Button";

const meta: Meta<typeof EmptyState> = {
  title: "UI/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    icon: { control: "object" },
    action: { control: "object" },
  },
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: "Ничего не найдено",
    description: "По таким фильтрам цитат не найдено",
    icon: <IconSearch />,
    action: <Button>Добавить цитату</Button>,
  },
};
