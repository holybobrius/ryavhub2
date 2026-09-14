"use client";

import { Dayjs } from "dayjs";
import { Input, InputProps } from "../Input";
import { useRef, useState } from "react";
import { formatDate, isInRange, parseDate } from "./calendar";
import * as Ariakit from "@ariakit/react";
import "./date-picker.css";
import { IconCalendar } from "../icons";
import CalendarPanel from "./CalendarPanel";

export interface DatePickerProps extends Omit<
  InputProps,
  "value" | "defaultValue" | "onChange" | "onBlur" | "ref" | "type"
> {
  placeholder?: string;
  value?: Dayjs | null;
  defaultValue?: Dayjs | null;
  onChange?: (value: Dayjs | null) => void;
  minDate?: Dayjs;
  maxDate?: Dayjs;
}

export const DatePicker = ({
  placeholder = "дд.мм.гггг",
  value: valueProp,
  defaultValue,
  onChange,
  minDate,
  maxDate,
  error,
  disabled,
  ...props
}: DatePickerProps) => {
  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<Dayjs | null>(
    defaultValue ?? null,
  );
  const value = isControlled ? valueProp : internalValue;

  const [text, setText] = useState<string>(() => formatDate(value));
  const [parseError, setParseError] = useState<boolean>(false);

  const valueKey = formatDate(value);
  const [prevValueKey, setPrevValueKey] = useState(valueKey);
  if (valueKey !== prevValueKey) {
    setPrevValueKey(valueKey);
    setText(valueKey);
    setParseError(false);
  }

  const popover = Ariakit.usePopoverStore({ placement: "bottom-start" });
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const commit = (next: Dayjs | null) => {
    if (!isControlled) {
      setInternalValue(next);
    }
    setText(formatDate(next));
    setParseError(false);
    onChange?.(next);
  };

  const isInside = (node: Element | null): boolean =>
    !!node &&
    (!!inputRef.current?.closest(".input")?.contains(node) ||
      !!panelRef.current?.contains(node));

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (isInside(e.relatedTarget as Element)) return;

    const trimmed = text.trim();
    if (!trimmed) return commit(null);
    if (trimmed === formatDate(value)) return;

    const parsed = parseDate(trimmed);
    if (!parsed || !isInRange(parsed, minDate, maxDate)) {
      setParseError(true);
      return;
    }

    commit(parsed);
  };

  return (
    <Ariakit.PopoverProvider store={popover}>
      <Input
        {...props}
        ref={inputRef}
        value={text}
        error={error || parseError}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        leftIcon={
          <Ariakit.PopoverDisclosure
            disabled={disabled}
            className="cursor-pointer"
            render={<button type="button" aria-label="Выбрать дату" />}
          >
            <IconCalendar size={16} />
          </Ariakit.PopoverDisclosure>
        }
      />
      <Ariakit.Popover
        ref={panelRef}
        unmountOnHide
        gutter={8}
        aria-label="Выбор даты"
        getAnchorRect={(anchor) =>
          anchor?.closest(".input__field")?.getBoundingClientRect() ?? null
        }
      >
        <CalendarPanel
          value={value}
          minDate={minDate}
          maxDate={maxDate}
          onCancel={popover.hide}
          onCommit={(next) => {
            commit(next);
            popover.hide();
          }}
        />
      </Ariakit.Popover>
    </Ariakit.PopoverProvider>
  );
};
