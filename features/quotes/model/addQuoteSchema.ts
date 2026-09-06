import { z } from "zod";

export const quoteSchema = z.object({
  quote: z
    .string()
    .trim()
    .min(3, "Минимальная длина цитаты 3 символа")
    .max(500, "Максимальная длина цитаты 500 символов"),
  authorId: z
    .string()
    .trim()
    .refine((v) => {
      try {
        BigInt(v);
        return true;
      } catch {
        return false;
      }
    }, "Укажите автора цитаты"),
  date: z.iso.date("Укажите дату цитаты"),
});

export type QuoteFormValues = z.infer<typeof quoteSchema>;
