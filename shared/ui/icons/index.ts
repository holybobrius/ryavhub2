// Иконки дизайн-системы (Stratis UI).
//
// Подключаем НЕ весь пак (820 иконок), а только те, что реально нужны.
// Данные берём из пакета `stratis-ui-icons` (объект `{ name, data }`)
// и оборачиваем в компонент через `makeIcon`.
//
// Использование:
//   import { IconChevronDown } from "@/shared/ui/icons";
//   <IconChevronDown size={20} />
//   <IconChevronDown className="text-surface-text-secondary" />  // цвет = currentColor
//
// ── Как добавить новую иконку ────────────────────────────────────────
// 1. Найди её имя в Storybook (стори «UI/Icons») или в Figma-файле Stratis.
//    Имя в пакете — camelCase с префиксом `su`, например `su-arrow-left`
//    экспортируется как `suArrowLeft`.
// 2. Добавь её в импорт из "stratis-ui-icons" ниже.
// 3. Добавь строку `export const Icon<Name> = makeIcon(su<Name>.data);`
// Всё — новых файлов заводить не нужно.
//
// Примечание про бандл: все перечисленные здесь иконки попадают в бандл
// вместе (они в одном модуле), поэтому держим список = «то, что используем».
// Их немного и каждая ~200 б gzip, так что вес незаметный.

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

// Примитив и фабрика — на случай кастомных/внешних SVG.
export { Icon, type IconProps } from "../Icon/Icon";
export { makeIcon, type IconComponentProps } from "./makeIcon";
