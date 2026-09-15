import { describe, expect, test } from "bun:test";
import dayjs from "dayjs";
import {
  getDayGrid,
  getMonthGrid,
  getYearGrid,
  parseDate,
  formatDate,
  isInRange,
  isPeriodInRange,
} from "./calendar";

const iso = (d: dayjs.Dayjs) => d.format("YYYY-MM-DD");
const flat = (grid: dayjs.Dayjs[][]) => grid.flat().map(iso);

describe("getDayGrid", () => {
  test("всегда 6 строк по 7 дней", () => {
    for (const m of ["2027-01-01", "2021-02-01", "2024-02-01"]) {
      const grid = getDayGrid(dayjs(m));
      expect(grid).toHaveLength(6);
      expect(grid.map((w) => w.length)).toEqual([7, 7, 7, 7, 7, 7]);
    }
  });

  test("январь 2027 начинается с понедельника 28.12.2026", () => {
    expect(iso(getDayGrid(dayjs("2027-01-01"))[0][0])).toBe("2026-12-28");
  });

  test("февраль 2021 начинается с понедельника — хвоста слева нет", () => {
    expect(iso(getDayGrid(dayjs("2021-02-01"))[0][0])).toBe("2021-02-01");
  });

  test("август 2021 начинается с воскресенья — хвост слева 6 дней", () => {
    expect(iso(getDayGrid(dayjs("2021-08-01"))[0][0])).toBe("2021-07-26");
  });

  test("високосный февраль содержит 29 число", () => {
    expect(flat(getDayGrid(dayjs("2024-02-01")))).toContain("2024-02-29");
  });

  test("день внутри viewDate на сетку не влияет", () => {
    expect(flat(getDayGrid(dayjs("2027-01-31")))).toEqual(
      flat(getDayGrid(dayjs("2027-01-01"))),
    );
  });
});

describe("getMonthGrid", () => {
  test("3 строки по 4, январь первым", () => {
    const grid = getMonthGrid(dayjs("2027-06-15"));
    expect(grid.map((r) => r.length)).toEqual([4, 4, 4]);
    expect(iso(grid[0][0])).toBe("2027-01-01");
    expect(iso(grid[2][3])).toBe("2027-12-01");
  });

  test("месяц и день внутри viewDate на сетку не влияют", () => {
    expect(flat(getMonthGrid(dayjs("2027-12-31")))).toEqual(
      flat(getMonthGrid(dayjs("2027-01-01"))),
    );
  });
});

describe("getYearGrid", () => {
  test("десятилетие плюс по году с краёв", () => {
    const years = getYearGrid(dayjs("2027-06-15"))
      .flat()
      .map((d) => d.year());
    expect(years).toHaveLength(12);
    expect(years[0]).toBe(2019);
    expect(years[11]).toBe(2030);
  });

  test("любая дата внутри десятилетия даёт одну сетку", () => {
    expect(flat(getYearGrid(dayjs("2029-12-31")))).toEqual(
      flat(getYearGrid(dayjs("2020-01-01"))),
    );
  });

  test("следующее десятилетие — уже другая сетка", () => {
    expect(getYearGrid(dayjs("2030-06-15")).flat()[0].year()).toBe(2029);
  });

  test("ячейка — первое января своего года", () => {
    expect(iso(getYearGrid(dayjs("2027-06-15")).flat()[0])).toBe("2019-01-01");
  });
});

describe("parseDate", () => {
  test("разбирает DD.MM.YYYY", () => {
    expect(iso(parseDate("12.01.2027")!)).toBe("2027-01-12");
  });

  test("несуществующая дата — null, а не переползание в март", () => {
    expect(parseDate("31.02.2027")).toBeNull();
  });

  test("нестрогий формат не принимается", () => {
    expect(parseDate("1.1.27")).toBeNull();
  });

  test("пустая строка и мусор — null", () => {
    expect(parseDate("")).toBeNull();
    expect(parseDate("завтра")).toBeNull();
  });
});

describe("formatDate", () => {
  test("null превращается в пустую строку", () => {
    expect(formatDate(null)).toBe("");
  });

  test("обратна parseDate", () => {
    expect(formatDate(parseDate("12.01.2027"))).toBe("12.01.2027");
  });
});

describe("isInRange", () => {
  // Ячейка сетки — всегда полночь, а min/max приходят из приложения
  // живым dayjs(), то есть со временем. Сравнение должно идти по дню.
  const cell = dayjs("2027-01-12");

  test("без границ — всегда true", () => {
    expect(isInRange(cell)).toBe(true);
  });

  test("границы включительные, время внутри дня игнорируется", () => {
    expect(isInRange(cell, dayjs("2027-01-12T15:42"))).toBe(true);
    expect(isInRange(cell, undefined, dayjs("2027-01-12T09:00"))).toBe(true);
  });

  test("за границей — false", () => {
    expect(isInRange(cell, dayjs("2027-01-13"))).toBe(false);
    expect(isInRange(cell, undefined, dayjs("2027-01-11"))).toBe(false);
  });

  test("соседний день отсекается независимо от его времени", () => {
    expect(isInRange(cell, dayjs("2027-01-13T00:00"))).toBe(false);
    expect(isInRange(cell, undefined, dayjs("2027-01-11T23:59"))).toBe(false);
  });
});

describe("isPeriodInRange", () => {
  const january = dayjs("2027-01-01");

  test("без границ — всегда true", () => {
    expect(isPeriodInRange(january, "month")).toBe(true);
  });

  test("месяц жив, пока в нём есть хоть один выбираемый день", () => {
    expect(isPeriodInRange(january, "month", dayjs("2027-01-31"))).toBe(true);
    expect(
      isPeriodInRange(january, "month", undefined, dayjs("2027-01-01")),
    ).toBe(true);
  });

  test("месяц целиком за границей — false", () => {
    expect(isPeriodInRange(january, "month", dayjs("2027-02-01"))).toBe(false);
    expect(
      isPeriodInRange(january, "month", undefined, dayjs("2026-12-31")),
    ).toBe(false);
  });

  test("год считается по своим краям", () => {
    expect(isPeriodInRange(january, "year", dayjs("2027-12-31"))).toBe(true);
    expect(isPeriodInRange(january, "year", dayjs("2028-01-01"))).toBe(false);
    expect(
      isPeriodInRange(january, "year", undefined, dayjs("2027-01-01")),
    ).toBe(true);
    expect(
      isPeriodInRange(january, "year", undefined, dayjs("2026-12-31")),
    ).toBe(false);
  });
});
