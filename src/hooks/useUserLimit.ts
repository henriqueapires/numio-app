import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useUserLimit() {
  return useQuery<number | null, Error>({
    queryKey: ["userLimit"],
    queryFn: async () => {
      const res = await fetch("/api/user/limit");
      if (!res.ok) throw new Error("Falha ao buscar limite");
      return (await res.json()).monthlyLimit as number | null;
    },
  });
}

export function useUpdateUserLimit() {
  const qc = useQueryClient();
  return useMutation<number, Error, { monthlyLimit: number }>({
    mutationKey: ["updateUserLimit"],
    mutationFn: async ({ monthlyLimit }) => {
      const res = await fetch("/api/user/limit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthlyLimit }),
      });
      if (!res.ok) throw new Error("Falha ao atualizar limite");
      return (await res.json()).monthlyLimit as number;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userLimit"] }),
  });
}
