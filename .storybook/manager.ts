import { addons } from "storybook/manager-api";
import { ryavTheme } from "./theme";

// Тема самого UI Storybook (сайдбар, тулбар). Отдельно от темы preview.
addons.setConfig({ theme: ryavTheme });
