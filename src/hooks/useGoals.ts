import type { Goal } from "@prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useGoals() {
  return useQuery<Goal[], Error>({
    queryKey: ["goals"],
    queryFn: async () => {
      const res = await fetch("/api/goals");
      if (!res.ok) throw new Error("Falha ao buscar metas");
      return (await res.json()) as Goal[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();

  return useMutation<Goal, Error, { title: string; targetAmount: number; dueDate: string }>({
    mutationKey: ["createGoal"],
    mutationFn: async (newGoal) => {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGoal),
      });
      if (!res.ok) throw new Error("Erro ao criar meta");
      return (await res.json()) as Goal;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useUpdateGoal() {
  const qc = useQueryClient();
  return useMutation<
    { success: boolean },
    Error,
    {
      id: string;
      title?: string;
      targetAmount?: number;
      currentAmount?: number;
      dueDate?: string;
    }
  >({
    mutationKey: ["updateGoal"],
    mutationFn: async ({ id, ...data }) => {
      const res = await fetch(`/api/goals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao atualizar meta");
      return (await res.json()) as { success: boolean };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}

export function useDeleteGoal() {
  const qc = useQueryClient();
  return useMutation<{ success: boolean }, Error, { id: string }>({
    mutationKey: ["deleteGoal"],
    mutationFn: async ({ id }) => {
      const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir meta");
      return (await res.json()) as { success: boolean };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}
