import { quoteScore } from "./getBestQuotes";
import { Quote, QuotesSortType } from "../model/models";

export const sortQuotes = (quotes: Quote[], sort: QuotesSortType) => {
  return [...quotes].sort((a, b) => {
    if (sort === "newest") {
      return b.date.getTime() - a.date.getTime();
    }
    if (sort === "oldest") {
      return a.date.getTime() - b.date.getTime();
    }
    if (sort === "best") {
      return quoteScore(b) - quoteScore(a);
    }
    if (sort === "worst") {
      return quoteScore(a) - quoteScore(b);
    }

    return 0;
  });
};
