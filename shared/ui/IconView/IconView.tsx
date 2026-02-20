"use client";

import { FC, useMemo } from "react";
import parse from "html-react-parser";
import { Element, HTMLReactParserOptions } from "html-react-parser";

export interface StratisUiIcon {
  data: string;
}

interface Props {
  icon: StratisUiIcon;
  size?: number;
  className?: string;
  color?: string;
}

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element) {
      if (
        domNode.name === "svg" ||
        domNode.name === "path" ||
        domNode.name === "circle" ||
        domNode.name === "rect" ||
        domNode.name === "polygon" ||
        domNode.name === "line" ||
        domNode.name === "polyline"
      ) {
        if (domNode.attribs) {
          delete domNode.attribs.fill;
          domNode.attribs.stroke = "currentColor";
        }
      }
    }
  },
};

export const IconView: FC<Props> = ({
  icon,
  size = 24,
  className = "",
  color,
}) => {
  const parsed = useMemo(() => {
    const element = parse(icon.data, options);
    if (!element) return null;

    return (
      <div
        className={`${className} ${color ? `text-${color}` : ""}`}
        style={{
          width: size,
          height: size,
          display: "inline-flex",
          fill: "transparent",
        }}
      >
        {element}
      </div>
    );
  }, [icon.data, className, size, color]);

  return parsed;
};
