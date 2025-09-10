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
import { useCategories } from "@/hooks/useCategories";
import { useCreateTransaction } from "@/hooks/useCreateTransaction";

export function TransactionModal() {
  const [open, setOpen] = useState(false);
  const { data: categories } = useCategories();
  const createTx = useCreateTransaction();

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTx.mutate(
      {
        amount: parseFloat(amount),
        date: new Date(date).toISOString(),
        description,
        categoryId,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setAmount("");
          setDate("");
          setDescription("");
          setCategoryId("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Nova Transação</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription>
            Preencha os dados para adicionar uma nova transação
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount" className="pb-2">
              Valor (R$)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="date" className="pb-2">
              Data
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="category" className="pb-2">
              Categoria
            </Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecione…" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description" className="pb-2">
              Descrição
            </Label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createTx.status === "pending"}>
              {createTx.status === "pending" ? "Salvando…" : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
