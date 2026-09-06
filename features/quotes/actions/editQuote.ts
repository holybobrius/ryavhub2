"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { validateSession } from "@/shared/model/validateSession";
import { isUnauthError } from "@/shared/errors/UnauthError";
import { revalidatePath } from "next/cache";
import { quoteSchema } from "../model/addQuoteSchema";

type EditQuoteBody = {
  quote: string;
  authorId: string;
  date: string;
};

export const editQuote = async (body: EditQuoteBody, quoteId: number) => {
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) return { ok: false, error: "invalid" };

  try {
    const sessionId = (await cookies()).get("sessionId")?.value;
    const { id: createdById } = await validateSession(sessionId);

    await db.quotes.update({
      where: { id: quoteId },
      data: {
        quote: parsed.data.quote,
        quote_by: BigInt(parsed.data.authorId),
        date: new Date(parsed.data.date),
        created_by: createdById,
      },
    });
  } catch (error) {
    if (isUnauthError(error)) return { ok: false, error: "unauthorized" };
    throw error;
  }

  revalidatePath("/quotes");

  return { ok: true };
};
