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
  /** Поиск по опциям. Ввод прямо в триггер (только для одиночного выбора). */
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

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <path
      d="M20 20l-3.5-3.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
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

type CommonShell = Pick<
  SelectProps,
  | "size"
  | "label"
  | "helperText"
  | "error"
  | "required"
  | "disabled"
  | "className"
>;

function wrapperProps(
  shell: CommonShell,
  open: boolean,
  extra?: Record<string, string>,
) {
  return {
    className: ["input", "select", shell.className].filter(Boolean).join(" "),
    "data-size": shell.size ?? "md",
    "data-error": shell.error ? "true" : undefined,
    "data-disabled": shell.disabled ? "true" : undefined,
    "data-open": open ? "true" : undefined,
    ...extra,
  };
}

function LabelMark({ required }: { required?: boolean }) {
  if (!required) return null;
  return (
    <span className="input__required" aria-hidden="true">
      *
    </span>
  );
}

function OptionInner({
  option,
  multiple,
}: {
  option: SelectOption;
  multiple?: boolean;
}) {
  return (
    <>
      {multiple && (
        <span className="menu-item__check">
          <Ariakit.SelectItemCheck>
            <CheckIcon />
          </Ariakit.SelectItemCheck>
        </span>
      )}
      {option.icon && <span className="menu-item__icon">{option.icon}</span>}
      <span className="menu-item__label">{option.label}</span>
    </>
  );
}

// ── Обычный путь: single, multiple (чекбоксы), multiple + tags ─────────
function PlainSelect(props: SelectProps) {
  const {
    options,
    value,
    defaultValue,
    onChange,
    multiple,
    tags,
    placeholder = "Select option",
    ...shell
  } = props;

  const select = Ariakit.useSelectStore({
    value,
    setValue: onChange,
    defaultValue: defaultValue ?? (multiple ? [] : ""),
  });
  const open = Ariakit.useStoreState(select, "open");
  const current = Ariakit.useStoreState(select, "value");
  const selected = Array.isArray(current) ? current : current ? [current] : [];

  const removeValue = (val: string) =>
    select.setValue(selected.filter((v) => v !== val));

  const trigger = () => {
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

  return (
    <div {...wrapperProps(shell, open, tags ? { "data-tags": "true" } : {})}>
      {shell.label && (
        <Ariakit.SelectLabel store={select} className="input__label">
          {shell.label}
          <LabelMark required={shell.required} />
        </Ariakit.SelectLabel>
      )}
      <Ariakit.Select
        store={select}
        disabled={shell.disabled}
        className="input__field select__trigger"
      >
        {trigger()}
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
        {options.map((opt) => (
          <Ariakit.SelectItem
            key={opt.value}
            value={opt.value}
            disabled={opt.disabled}
            className="menu-item"
          >
            <OptionInner option={opt} multiple={multiple} />
          </Ariakit.SelectItem>
        ))}
      </Ariakit.SelectPopover>
      {shell.helperText && (
        <span className="input__helper">{shell.helperText}</span>
      )}
    </div>
  );
}

// ── Поиск в триггере (single): паттерн Combobox ────────────────────────
// Комбобокс оперирует ЛЕЙБЛОМ как отображаемым значением; наружу отдаём
// value опции через onChange (маппинг label -> value).
function ComboboxSelect(props: SelectProps) {
  const {
    options,
    value,
    defaultValue,
    onChange,
    placeholder = "Select option",
    ...shell
  } = props;

  const labelOf = (val?: string) =>
    options.find((o) => o.value === val)?.label ?? "";

  const combobox = Ariakit.useComboboxStore({
    resetValueOnHide: true,
    defaultSelectedValue:
      typeof defaultValue === "string" ? labelOf(defaultValue) : "",
    selectedValue: typeof value === "string" ? labelOf(value) : undefined,
    setSelectedValue: (label) => {
      const opt = options.find((o) => o.label === label);
      onChange?.(opt ? opt.value : "");
    },
  });

  const open = Ariakit.useStoreState(combobox, "open");
  const search = Ariakit.useStoreState(combobox, "value");
  const matches = search
    ? options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase()),
      )
    : options;

  return (
    <div {...wrapperProps(shell, open)}>
      {shell.label && (
        <Ariakit.ComboboxLabel store={combobox} className="input__label">
          {shell.label}
          <LabelMark required={shell.required} />
        </Ariakit.ComboboxLabel>
      )}
      <div className="input__field select__trigger">
        <Ariakit.Combobox
          store={combobox}
          disabled={shell.disabled}
          placeholder={placeholder}
          className="select__search-input"
        />
        <span className="select__search-icon">
          <SearchIcon />
        </span>
      </div>
      <Ariakit.ComboboxPopover
        store={combobox}
        gutter={4}
        sameWidth
        portal
        className="dropdown"
      >
        {matches.length > 0 ? (
          matches.map((opt) => (
            <Ariakit.ComboboxItem
              key={opt.value}
              value={opt.label}
              disabled={opt.disabled}
              className="menu-item"
            >
              {opt.icon && <span className="menu-item__icon">{opt.icon}</span>}
              <span className="menu-item__label">{opt.label}</span>
            </Ariakit.ComboboxItem>
          ))
        ) : (
          <div className="dropdown__empty">Ничего не найдено</div>
        )}
      </Ariakit.ComboboxPopover>
      {shell.helperText && (
        <span className="input__helper">{shell.helperText}</span>
      )}
    </div>
  );
}

export function Select(props: SelectProps) {
  // Поиск-в-триггере поддерживаем для одиночного выбора (как на макетах).
  if (props.searchable && !props.multiple) return <ComboboxSelect {...props} />;
  return <PlainSelect {...props} />;
}
