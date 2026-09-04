"use client";

import * as Ariakit from "@ariakit/react";
import type { CSSProperties, ReactNode } from "react";
import { Button } from "../Button";
import type { ButtonVariant, ButtonTone, ButtonSize } from "../Button";
// Меню-попап и пункты берём теми же классами, что и Select
// (.dropdown / .menu-item) — один источник стилей меню.
import "../Select/select.css";
import "./dropdown.css";

export interface DropdownItem {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export interface DropdownProps {
  /** Пункты меню. */
  menu: DropdownItem[];
  /** Лейбл триггер-кнопки. */
  children?: ReactNode;
  /** Иконка слева в триггере. */
  leftIcon?: ReactNode;
  /** Проброс в Button. */
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  disabled?: boolean;
  /** Открыть по умолчанию (для сторибука/демо). */
  defaultOpen?: boolean;
  className?: string;
}

// Шеврон вниз; при открытии разворачиваем на 180° (см. inline-transform).
const chevronStyle = (open: boolean): CSSProperties => ({
  transform: open ? "rotate(180deg)" : undefined,
  transition: "transform 0.15s ease",
});

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    style={chevronStyle(open)}
  >
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Dropdown = ({
  menu,
  children,
  leftIcon,
  variant = "filled",
  tone = "primary",
  size = "md",
  disabled,
  defaultOpen,
  className,
}: DropdownProps) => {
  // placement bottom-end — меню выровнено по правому краю кнопки.
  const store = Ariakit.useMenuStore({ defaultOpen, placement: "bottom-end" });
  const open = Ariakit.useStoreState(store, "open");

  return (
    <>
      <Ariakit.MenuButton
        store={store}
        disabled={disabled}
        render={
          <Button
            variant={variant}
            tone={tone}
            size={size}
            leftIcon={leftIcon}
            rightIcon={<Chevron open={open} />}
            className={className}
          />
        }
      >
        {children}
      </Ariakit.MenuButton>
      <Ariakit.Menu
        store={store}
        gutter={4}
        portal
        className="dropdown dropdown-menu"
      >
        {menu.map((item, i) => (
          <Ariakit.MenuItem
            key={i}
            className="menu-item"
            disabled={item.disabled}
            onClick={item.onClick}
          >
            {item.icon && <span className="menu-item__icon">{item.icon}</span>}
            <span className="menu-item__label">{item.label}</span>
          </Ariakit.MenuItem>
        ))}
      </Ariakit.Menu>
    </>
  );
};
