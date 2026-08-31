import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Dropdown } from "./Dropdown";
import type { DropdownItem } from "./Dropdown";
import { IconSettings, IconPencil, IconTrash } from "../icons";

/**
 * Dropdown — кнопка-триггер (Button + шеврон), открывающая меню из массива
 * `menu`. Построен на Ariakit Menu; меню-попап и пункты используют те же
 * стили, что и Select (.dropdown / .menu-item).
 */
const meta: Meta<typeof Dropdown> = {
  title: "UI/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["filled", "outlined", "ghost", "soft"],
    },
    tone: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "error"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    menu: { control: false },
    leftIcon: { control: false },
  },
  // Место под раскрытое меню в доке.
  decorators: [
    (Story) => (
      <div style={{ minHeight: 220 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Dropdown>;

const items: DropdownItem[] = [
  { label: "Option label", icon: <IconSettings />, onClick: () => {} },
  { label: "Редактировать", icon: <IconPencil />, onClick: () => {} },
  { label: "Удалить", icon: <IconTrash />, onClick: () => {}, disabled: true },
];

export const Playground: Story = {
  args: {
    children: "button",
    leftIcon: <IconSettings />,
    variant: "filled",
    tone: "primary",
    size: "md",
    menu: items,
  },
};

// Раскрытое меню.
export const Open: Story = {
  args: {
    children: "button",
    leftIcon: <IconSettings />,
    menu: items,
    defaultOpen: true,
  },
};

// Три размера.
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-16">
      {(["sm", "md", "lg"] as const).map((s) => (
        <Dropdown key={s} size={s} leftIcon={<IconSettings />} menu={items}>
          button
        </Dropdown>
      ))}
    </div>
  ),
};
