import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import "dayjs/locale/ru";
dayjs.extend(customParseFormat);

/** 6 строк по 7 дней, первая ячейка — всегда понедельник. */
export const getDayGrid = (viewDate: Dayjs): Dayjs[][] => {
  const firstDayOfMonth = viewDate.startOf("month");
  const start = dayjs(firstDayOfMonth).locale("ru").startOf("week");

  const grid = Array.from({ length: 6 }, (_, r) =>
    Array.from({ length: 7 }, (_, c) => start.add(r * 7 + c, "day")),
  );

  return grid;
};

/** 3 строки по 4: первые числа 12 месяцев года viewDate. */
export const getMonthGrid = (viewDate: Dayjs): Dayjs[][] => {
  const start = viewDate.locale("ru").startOf("year");

  const grid = Array.from({ length: 3 }, (_, r) =>
    Array.from({ length: 4 }, (_, c) => start.add(r * 4 + c, "month")),
  );

  return grid;
};

/** 3 строки по 4: десятилетие viewDate плюс по году с краёв. */
export const getYearGrid = (viewDate: Dayjs): Dayjs[][] => {
  const viewYear = viewDate.get("year");
  const firstYearInDecade = Math.floor(viewYear / 10) * 10;

  const start = viewDate
    .locale("ru")
    .year(firstYearInDecade - 1)
    .startOf("year");

  const grid = Array.from({ length: 3 }, (_, r) =>
    Array.from({ length: 4 }, (_, c) => start.add(r * 4 + c, "year")),
  );

  return grid;
};

/** Строгий разбор DD.MM.YYYY. Всё прочее — null. */
export const parseDate = (text: string): Dayjs | null => {
  const date = dayjs(text, "DD.MM.YYYY", true).locale("ru");
  if (!date.isValid()) {
    return null;
  }

  return date;
};

/** Обратная к parseDate. null → "". */
export const formatDate = (date: Dayjs | null): string => {
  if (!date || !date.isValid()) {
    return "";
  }

  return date.format("DD.MM.YYYY");
};

export const isInRange = (date: Dayjs, min?: Dayjs, max?: Dayjs): boolean => {
  if ((min && date.isBefore(min, "day")) || (max && date.isAfter(max, "day")))
    return false;

  return true;
};
