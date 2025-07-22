import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import type { Category } from "@prisma/client";

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Falha ao buscar categorias");
      return (await res.json()) as Category[];
    },
    staleTime: 1000 * 60 * 5, 
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation<Category, Error, { name: string; type: Category["type"] }>({
    mutationFn: async (data) => {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao criar categoria");
      return (await res.json()) as Category;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation<
    { success: boolean },
    Error,
    { id: string; name?: string; type?: Category["type"] }
  >({
    mutationKey: ["updateCategory"],
    mutationFn: ({ id, ...data }) =>
      fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => {
        if (!r.ok) throw new Error("Erro ao atualizar categoria");
        return r.json();
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation<{ success: boolean }, Error, { id: string }>({
    mutationKey: ["deleteCategory"],
    mutationFn: ({ id }) =>
      fetch(`/api/categories/${id}`, { method: "DELETE" }).then((r) => {
        if (!r.ok) throw new Error("Erro ao excluir categoria");
        return r.json();
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}
