import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IconTile } from "./IconTile";
import type { IconTileSize } from "./IconTile";
import { IconSettings } from "../icons";
import { Typography } from "../Typography";

/**
 * IconTile — иконка в скруглённой квадратной плитке. Оси: size
 * (small 48 / default 60 / large 80), состояние inactive. Иконка — SVG
 * (`icon`) или картинкой (`src`, при inactive — чб). Server-компонент.
 */
const meta: Meta<typeof IconTile> = {
  title: "UI/IconTile",
  component: IconTile,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "inline-radio", options: ["small", "default", "large"] },
    inactive: { control: "boolean" },
    icon: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof IconTile>;

const SIZES: IconTileSize[] = ["small", "default", "large"];

export const Playground: Story = {
  args: {
    icon: <IconSettings />,
    size: "default",
    inactive: false,
  },
};

// Три размера.
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-24">
      {SIZES.map((s) => (
        <div key={s} className="flex flex-col items-center gap-8">
          <IconTile size={s} icon={<IconSettings />} />
          <Typography.Label size="sm" color="secondary">
            {s}
          </Typography.Label>
        </div>
      ))}
    </div>
  ),
};

// Активное и неактивное состояние.
export const States: Story = {
  render: () => (
    <div className="flex items-center gap-24">
      <div className="flex flex-col items-center gap-8">
        <IconTile icon={<IconSettings />} />
        <Typography.Label size="sm" color="secondary">
          default
        </Typography.Label>
      </div>
      <div className="flex flex-col items-center gap-8">
        <IconTile icon={<IconSettings />} inactive />
        <Typography.Label size="sm" color="secondary">
          inactive
        </Typography.Label>
      </div>
    </div>
  ),
};

// Иконка картинкой (растр). При inactive накладывается чб-фильтр.
const sampleImg =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="15" fill="#ff5f6d"/>
      <path d="M10 17l4 4 8-9" stroke="#fff" stroke-width="3" fill="none"
        stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  );

export const ImageIcon: Story = {
  render: () => (
    <div className="flex items-center gap-24">
      <div className="flex flex-col items-center gap-8">
        <IconTile src={sampleImg} alt="" />
        <Typography.Label size="sm" color="secondary">
          default
        </Typography.Label>
      </div>
      <div className="flex flex-col items-center gap-8">
        <IconTile src={sampleImg} alt="" inactive />
        <Typography.Label size="sm" color="secondary">
          inactive (чб)
        </Typography.Label>
      </div>
    </div>
  ),
};
