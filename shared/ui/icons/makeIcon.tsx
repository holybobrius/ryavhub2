import { Icon, type IconProps } from "../Icon/Icon";

/** Пропсы иконки-компонента: всё от Icon, кроме уже зашитой разметки. */
export type IconComponentProps = Omit<IconProps, "data">;

/**
 * Превращает строку SVG-данных (`.data` из stratis-ui-icons) в готовый
 * React-компонент иконки. Используется в барели `shared/ui/icons/index.ts`.
 *
 * Компонент без хуков → работает и в серверных компонентах.
 */
export function makeIcon(data: string) {
  function IconComponent(props: IconComponentProps) {
    return <Icon data={data} {...props} />;
  }
  return IconComponent;
}
