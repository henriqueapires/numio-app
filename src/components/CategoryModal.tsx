"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useCreateCategory, useCategories } from "@/hooks/useCategories";
import { CategoryType } from "@prisma/client";

export function CategoryModal() {
  const [open, setOpen] = useState(false);
  const { mutate: createCategory, status } = useCreateCategory();
  const { data: cats } = useCategories();

  const [name, setName] = useState("");
  const [type, setType] = useState<CategoryType>(CategoryType.EXPENSE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory(
      { name, type },
      {
        onSuccess: () => {
          setOpen(false);
          setName("");
          setType(CategoryType.EXPENSE);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Nova Categoria</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Categoria</DialogTitle>
          <DialogDescription>
            Defina o nome e se é receita ou despesa.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="cat-name" className="pb-2">
              Nome
            </Label>
            <Input
              id="cat-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="cat-type" className="pb-2">
              Tipo
            </Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as CategoryType)}
            >
              <SelectTrigger id="cat-type">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CategoryType.INCOME}>Receita</SelectItem>
                <SelectItem value={CategoryType.EXPENSE}>Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button disabled={status === "pending"} type="submit">
              {status === "pending" ? "Criando…" : "Criar Categoria"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
