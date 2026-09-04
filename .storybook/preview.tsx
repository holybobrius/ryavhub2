import React from "react";
import type { Preview } from "@storybook/nextjs-vite";

import { geologica, ptRootUI } from "../app/fonts";
import { ryavTheme } from "./theme";

import "../app/globals.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    backgrounds: { disable: true },
    docs: { theme: ryavTheme },
  },
  decorators: [
    (Story) => (
      <div
        className={`${geologica.variable} ${ptRootUI.variable} bg-surface-bg-page text-surface-text-base rounded-md p-24`}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
