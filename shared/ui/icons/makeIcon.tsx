import { Icon, type IconProps } from "../Icon/Icon";

export type IconComponentProps = Omit<IconProps, "data">;

export function makeIcon(data: string) {
  const IconComponent = (props: IconComponentProps) => {
    return <Icon data={data} {...props} />;
  };
  return IconComponent;
}
