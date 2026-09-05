import { useState } from "react";

interface HookReturns {
  search: string;
  handleSearchChange: (search: string) => void;
}
export const useQuotesSearch = (): HookReturns => {
  const [search, setSearch] = useState("");

  const handleSearchChange = (search: string) => {
    setSearch(search);
  };

  return { search, handleSearchChange };
};
