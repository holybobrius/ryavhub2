import { Children, cloneElement, isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";
import { Avatar } from "./Avatar";
import type { AvatarProps, AvatarShape, AvatarSize } from "./Avatar";
import "./avatar-stack.css";

export interface AvatarStackProps {
  /** Элементы <Avatar>. Размер/форма/кольцо навязываются стопкой. */
  children: ReactNode;
  /** Сколько аватарок показать до чипа «+N». Остальные сворачиваются. */
  max?: number;
  size?: AvatarSize;
  shape?: AvatarShape;
  className?: string;
}

export const AvatarStack = ({
  children,
  max = 5,
  size = 32,
  shape = "circle",
  className,
}: AvatarStackProps) => {
  // Только валидные элементы (пропускаем null/false из условного рендера).
  const avatars = Children.toArray(children).filter(
    isValidElement,
  ) as ReactElement<AvatarProps>[];

  const visible = avatars.slice(0, max);
  const overflow = avatars.length - visible.length;

  // Смещение перекрытия токена не имеет — берём ~1/3 диаметра (провизорно).
  const overlap = Math.round(size / 3);

  return (
    <div
      className={["avatar-stack", className].filter(Boolean).join(" ")}
      style={{ "--stack-overlap": `${overlap}px` } as React.CSSProperties}
    >
      {visible.map((child, i) => (
        <span
          key={child.key ?? i}
          className="avatar-stack__item"
          style={{ zIndex: visible.length - i }}
        >
          {/* Навязываем единый размер/форму + кольцо-обводку. */}
          {cloneElement(child, { size, shape, ring: true })}
        </span>
      ))}
      {overflow > 0 && (
        // Чип «+N» — поверх всех, чтобы текст не перекрывался соседом.
        <span
          className="avatar-stack__item avatar-stack__more"
          style={{ zIndex: visible.length + 1 }}
        >
          <Avatar size={size} shape={shape} color="neutral" type="soft" ring>
            +{overflow}
          </Avatar>
        </span>
      )}
    </div>
  );
};
