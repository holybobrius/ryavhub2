import { mock } from "bun:test";

export const mockQuotes = [
  { id: 1n, quote: "Test quote", quote_by: 1n, date: new Date("2024-01-01") },
  {
    id: 2n,
    quote: "Another quote",
    quote_by: 2n,
    date: new Date("2024-01-02"),
  },
];

type Ranking = {
  id: bigint;
  quote_id: bigint;
  created_by: bigint;
  type: "Upvote" | "Downvote";
};

export const mockRankings: Ranking[] = [
  { id: 1n, quote_id: 2n, created_by: 1n, type: "Upvote" },
];

export const mockUsers = [
  { id: 1n, name: "User 1", avatarUrl: "" },
  { id: 2n, name: "User 2", avatarUrl: "" },
];

export const mockDb = {
  quotes: {
    findMany: mock(() => Promise.resolve(mockQuotes)),
  },
  quote_rankings: {
    findMany: mock(() => Promise.resolve(mockRankings)),
    findFirst: mock((): Promise<Ranking | null> => Promise.resolve(null)),
    create: mock(() => Promise.resolve({ id: 1n })),
    update: mock(() => Promise.resolve(undefined)),
    delete: mock(() => Promise.resolve(undefined)),
    count: mock(() => Promise.resolve(0)),
  },
  users: {
    findUnique: mock(({ where }: { where: { id: number } }) => {
      const user = mockUsers.find((u) => u.id === BigInt(where.id));
      return Promise.resolve(user || null);
    }),
  },
};
