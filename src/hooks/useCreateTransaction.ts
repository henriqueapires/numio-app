import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TransactionWithCategory } from "./useTransactions"; 

export function useCreateTransaction() {
  const qc = useQueryClient();

  return useMutation<TransactionWithCategory, Error, {
    amount: number;
    date: string;
    description?: string;
    categoryId: string;
  }>({
    mutationKey: ["createTransaction"],
    mutationFn: async (newTx) => {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTx),
      });
      if (!res.ok) throw new Error("Erro ao criar transação");
      return (await res.json()) as TransactionWithCategory;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useUpdateTransaction() {
  const qc = useQueryClient();
  return useMutation<
    { success: boolean },
    Error,
    { 
      id: string;
      amount?: number;
      date?: string;
      description?: string;
      categoryId?: string;
    }
  >({
    mutationKey: ["updateTransaction"],
    mutationFn: async ({ id, ...data }) => {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao atualizar transação");
      return (await res.json()) as { success: boolean };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation<{ success: boolean }, Error, { id: string }>({
    mutationKey: ["deleteTransaction"],
    mutationFn: async ({ id }) => {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir transação");
      return (await res.json()) as { success: boolean };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}
