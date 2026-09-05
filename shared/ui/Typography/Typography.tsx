import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

export type TypographyWeight = "regular" | "medium" | "semibold";

export type TypographyColor =
  | "base"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "heading"
  | "disabled"
  | "inverse"
  | "link";

export type DisplaySize = "lg" | "md" | "sm";
export type HeadingSize = "xl" | "lg" | "md" | "sm";
export type BodySize = "lg" | "md" | "sm";
export type LabelSize = "md" | "sm" | "xs";

type Variant =
  | `display-${DisplaySize}`
  | `heading-${HeadingSize}`
  | `body-${BodySize}`
  | `label-${LabelSize}`;

// Классы — литералы: JIT Tailwind сканирует исходники по тексту и
// `text-${variant}` не увидел бы.
const VARIANT_CLASS: Record<Variant, string> = {
  "display-lg": "font-heading text-display-lg tracking-display-lg",
  "display-md": "font-heading text-display-md tracking-display-md",
  "display-sm": "font-heading text-display-sm tracking-display-sm",
  "heading-xl": "font-heading text-heading-xl tracking-heading-xl",
  "heading-lg": "font-heading text-heading-lg tracking-heading-lg",
  "heading-md": "font-heading text-heading-md tracking-heading-md",
  "heading-sm": "font-heading text-heading-sm tracking-heading-sm",
  "body-lg": "font-body text-body-lg tracking-body-lg",
  "body-md": "font-body text-body-md tracking-body-md",
  "body-sm": "font-body text-body-sm tracking-body-sm",
  "label-md": "font-body text-label-md tracking-label-md",
  "label-sm": "font-body text-label-sm tracking-label-sm",
  "label-xs": "font-body text-label-xs tracking-label-xs",
};

const WEIGHT_CLASS: Record<TypographyWeight, string> = {
  regular: "font-regular",
  medium: "font-medium",
  semibold: "font-semibold",
};

const COLOR_CLASS: Record<TypographyColor, string> = {
  base: "text-surface-text-base",
  secondary: "text-surface-text-secondary",
  tertiary: "text-surface-text-tertiary",
  quaternary: "text-surface-text-quaternary",
  heading: "text-surface-text-heading",
  disabled: "text-surface-text-disabled",
  inverse: "text-surface-text-inverse",
  link: "text-surface-text-link",
};

interface CommonProps {
  as?: ElementType;
  weight?: TypographyWeight;
  color?: TypographyColor;
  className?: string;
  children?: ReactNode;
}
type NativeProps = Omit<ComponentPropsWithoutRef<"p">, keyof CommonProps>;

interface BaseProps extends CommonProps, NativeProps {
  variant: Variant;
  defaultWeight: TypographyWeight;
  defaultAs: ElementType;
}

const Base = ({
  variant,
  defaultWeight,
  defaultAs,
  as,
  weight,
  color,
  className,
  children,
  ...rest
}: BaseProps) => {
  const Element = as ?? defaultAs;
  const classes = [
    VARIANT_CLASS[variant],
    WEIGHT_CLASS[weight ?? defaultWeight],
    color ? COLOR_CLASS[color] : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Element className={classes} {...rest}>
      {children}
    </Element>
  );
};

interface DisplayProps extends CommonProps, NativeProps {
  size?: DisplaySize;
}
const Display = ({ size = "md", ...rest }: DisplayProps) => {
  return (
    <Base
      variant={`display-${size}`}
      defaultWeight="medium"
      defaultAs="p"
      {...rest}
    />
  );
};

interface HeadingProps extends CommonProps, NativeProps {
  size?: HeadingSize;
}
const Heading = ({ size = "lg", ...rest }: HeadingProps) => {
  return (
    <Base
      variant={`heading-${size}`}
      defaultWeight="medium"
      defaultAs="p"
      {...rest}
    />
  );
};

interface BodyProps extends CommonProps, NativeProps {
  size?: BodySize;
}
const Body = ({ size = "md", ...rest }: BodyProps) => {
  return (
    <Base
      variant={`body-${size}`}
      defaultWeight="medium"
      defaultAs="p"
      {...rest}
    />
  );
};

interface LabelProps extends CommonProps, NativeProps {
  size?: LabelSize;
}
const Label = ({ size = "md", ...rest }: LabelProps) => {
  return (
    <Base
      variant={`label-${size}`}
      defaultWeight="medium"
      defaultAs="span"
      {...rest}
    />
  );
};

Display.displayName = "Typography.Display";
Heading.displayName = "Typography.Heading";
Body.displayName = "Typography.Body";
Label.displayName = "Typography.Label";

export const Typography = { Display, Heading, Body, Label };
