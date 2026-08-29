"use client";

import * as Ariakit from "@ariakit/react";
import type { ReactNode } from "react";
import "../Input/input.css";
import "./select.css";
import type { InputSize } from "../Input";

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export type SelectValue = string | string[];

export interface SelectProps {
  options: SelectOption[];
  value?: SelectValue;
  defaultValue?: SelectValue;
  onChange?: (value: SelectValue) => void;
  /** Мультивыбор (value становится массивом). */
  multiple?: boolean;
  /** Поле поиска в выпадашке для фильтрации опций. */
  searchable?: boolean;
  /** В мультивыборе показывать выбранное тегами в триггере. */
  tags?: boolean;
  size?: InputSize;
  label?: ReactNode;
  helperText?: ReactNode;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12l5 5L19 7"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export function Select({
  options,
  value,
  defaultValue,
  onChange,
  multiple,
  searchable,
  tags,
  size = "md",
  label,
  helperText,
  error,
  required,
  disabled,
  placeholder = "Select option",
  className,
}: SelectProps) {
  const combobox = Ariakit.useComboboxStore({ resetValueOnHide: true });
  const select = Ariakit.useSelectStore({
    combobox: searchable ? combobox : undefined,
    value,
    setValue: onChange,
    defaultValue: defaultValue ?? (multiple ? [] : ""),
  });

  const open = Ariakit.useStoreState(select, "open");
  const currentValue = Ariakit.useStoreState(select, "value");
  const search = Ariakit.useStoreState(combobox, "value");

  const selected = Array.isArray(currentValue)
    ? currentValue
    : currentValue
      ? [currentValue]
      : [];

  const matches =
    searchable && search
      ? options.filter((o) =>
          o.label.toLowerCase().includes(search.toLowerCase()),
        )
      : options;

  const removeValue = (val: string) => {
    select.setValue(selected.filter((v) => v !== val));
  };

  const renderTriggerContent = () => {
    if (selected.length === 0) {
      return (
        <span className="select__value" data-placeholder="">
          {placeholder}
        </span>
      );
    }
    if (multiple && tags) {
      return (
        <span className="select__tags">
          {selected.map((val) => {
            const opt = options.find((o) => o.value === val);
            return (
              <span className="select__tag" key={val}>
                {opt?.icon && (
                  <span className="select__tag-icon">{opt.icon}</span>
                )}
                {opt?.label ?? val}
                <span
                  className="select__tag-remove"
                  role="button"
                  aria-label={`Убрать ${opt?.label ?? val}`}
                  tabIndex={-1}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeValue(val);
                  }}
                >
                  <CloseIcon />
                </span>
              </span>
            );
          })}
        </span>
      );
    }
    const text = selected
      .map((val) => options.find((o) => o.value === val)?.label ?? val)
      .join(", ");
    return <span className="select__value">{text}</span>;
  };

  const items = matches.map((opt) => (
    <Ariakit.SelectItem
      key={opt.value}
      value={opt.value}
      disabled={opt.disabled}
      className="menu-item"
      render={searchable ? <Ariakit.ComboboxItem /> : undefined}
    >
      {multiple && (
        <span className="menu-item__check">
          <Ariakit.SelectItemCheck>
            <CheckIcon />
          </Ariakit.SelectItemCheck>
        </span>
      )}
      {opt.icon && <span className="menu-item__icon">{opt.icon}</span>}
      <span className="menu-item__label">{opt.label}</span>
    </Ariakit.SelectItem>
  ));

  return (
    <div
      className={["input", "select", className].filter(Boolean).join(" ")}
      data-size={size}
      data-error={error ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
      data-open={open ? "true" : undefined}
    >
      {label && (
        <Ariakit.SelectLabel store={select} className="input__label">
          {label}
          {required && (
            <span className="input__required" aria-hidden="true">
              *
            </span>
          )}
        </Ariakit.SelectLabel>
      )}

      <Ariakit.Select
        store={select}
        disabled={disabled}
        className="input__field select__trigger"
      >
        {renderTriggerContent()}
        <span className="select__chevron">
          <ChevronIcon />
        </span>
      </Ariakit.Select>

      <Ariakit.SelectPopover
        store={select}
        gutter={4}
        sameWidth
        portal
        className="dropdown"
      >
        {searchable && (
          <Ariakit.Combobox
            store={combobox}
            autoSelect
            placeholder="Поиск"
            className="dropdown__search"
          />
        )}
        {searchable ? (
          matches.length > 0 ? (
            <Ariakit.ComboboxList store={combobox}>
              {items}
            </Ariakit.ComboboxList>
          ) : (
            <div className="dropdown__empty">Ничего не найдено</div>
          )
        ) : (
          items
        )}
      </Ariakit.SelectPopover>

      {helperText && <span className="input__helper">{helperText}</span>}
    </div>
  );
}
