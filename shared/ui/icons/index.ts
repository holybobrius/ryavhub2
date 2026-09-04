import {
  suChevronDown,
  suChevronUp,
  suChevronLeft,
  suChevronRight,
  suX01,
  suSearch01,
  suCheck,
  suPlus01,
  suPencil01,
  suTrash01,
  suSettings,
  suMenu01,
  suFileAttach01,
  suArrowUpRight,
  suArrowUp,
  suDiamond,
  suMessageCircle,
} from "stratis-ui-icons";
import { makeIcon } from "./makeIcon";

export const IconChevronDown = makeIcon(suChevronDown.data);
export const IconChevronUp = makeIcon(suChevronUp.data);
export const IconChevronLeft = makeIcon(suChevronLeft.data);
export const IconChevronRight = makeIcon(suChevronRight.data);
export const IconClose = makeIcon(suX01.data);
export const IconSearch = makeIcon(suSearch01.data);
export const IconCheck = makeIcon(suCheck.data);
export const IconPlus = makeIcon(suPlus01.data);
export const IconPencil = makeIcon(suPencil01.data);
export const IconTrash = makeIcon(suTrash01.data);
export const IconSettings = makeIcon(suSettings.data);
export const IconMenu = makeIcon(suMenu01.data);
export const IconFileAttach = makeIcon(suFileAttach01.data);
export const IconArrowUpRight = makeIcon(suArrowUpRight.data);

// Плейсхолдер: thumb-up/down в stratis-ui-icons@1.5.2 нет, поэтому стрелка
// (для дизлайка QuoteCard поворачивает её на 180°).
export const IconThumbUp = makeIcon(suArrowUp.data);
export const IconDiamond = makeIcon(suDiamond.data);
export const IconMessageCircle = makeIcon(suMessageCircle.data);

export { Icon, type IconProps } from "../Icon/Icon";
export { makeIcon, type IconComponentProps } from "./makeIcon";
