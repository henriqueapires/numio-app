import type { Transaction, Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export type TransactionWithCategory = Transaction & {
  category: Category;
};

export function useTransactions() {
  return useQuery<TransactionWithCategory[], Error>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await fetch("/api/transactions");
      if (!res.ok) throw new Error("Falha ao buscar transações");
      return (await res.json()) as TransactionWithCategory[];
    },
    staleTime: 1000 * 30,
  });
}
