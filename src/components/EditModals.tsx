"use client";

import { useState } from "react";
import { format } from "date-fns";
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
import {
  useUpdateTransaction,
  useDeleteTransaction,
} from "@/hooks/useCreateTransaction";
import {
  useUpdateGoal,
  useDeleteGoal,
} from "@/hooks/useGoals";
import type { Goal } from "@prisma/client";
import { TransactionWithCategory } from "@/hooks/useTransactions";
import { Edit } from "lucide-react";

export function EditTransactionModal({ transaction }: { transaction: TransactionWithCategory }) {
  const [open, setOpen] = useState(false);
  const { data: categories } = useCategories();
  const { mutate: updateTx, status: txStatus } = useUpdateTransaction();
  const { mutate: deleteTx } = useDeleteTransaction();

  const [amount, setAmount] = useState(transaction.amount.toString());
  const [date, setDate] = useState(format(new Date(transaction.date), "yyyy-MM-dd"));
  const [description, setDescription] = useState(transaction.description || "");
  const [categoryId, setCategoryId] = useState(transaction.category.id);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateTx(
      {
        id: transaction.id,
        amount: parseFloat(amount),
        date: new Date(date).toISOString(),
        description,
        categoryId,
      },
      { onSuccess: () => setOpen(false) }
    );
  };

  const handleDelete = () => {
    deleteTx(
      { id: transaction.id },
      { onSuccess: () => setOpen(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon"><Edit/></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
          <DialogDescription>Altere os dados da transação.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <Label htmlFor="edit-amount" className="pb-2">Valor (R$)</Label>
            <Input
              id="edit-amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-date" className="pb-2">Data</Label>
            <Input
              id="edit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-category" className="pb-2">Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="edit-category">
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
            <Label htmlFor="edit-description" className="pb-2">Descrição</Label>
            <Input
              id="edit-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <DialogFooter className="flex justify-between">
            <Button
              variant="destructive"
              onClick={handleDelete}
              type="button"
            >
              Excluir
            </Button>
            <Button disabled={txStatus === "pending"} type="submit">
              {txStatus === "pending" ? "Salvando…" : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditGoalModal({ goal }: { goal: Goal }) {
  const [open, setOpen] = useState(false);
  const { mutate: updateGoal, status: goalStatus } = useUpdateGoal();
  const { mutate: deleteGoal } = useDeleteGoal();

  const [title, setTitle] = useState(goal.title);
  const [targetAmount, setTargetAmount] = useState(goal.targetAmount.toString());
  const [currentAmount, setCurrentAmount] = useState(goal.currentAmount.toString());
  const [dueDate, setDueDate] = useState(format(new Date(goal.dueDate), "yyyy-MM-dd"));

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateGoal(
      {
        id: goal.id,
        title,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount),
        dueDate: new Date(dueDate).toISOString(),
      },
      { onSuccess: () => setOpen(false) }
    );
  };

  const handleDelete = () => {
    deleteGoal(
      { id: goal.id },
      { onSuccess: () => setOpen(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon">✏️</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Meta</DialogTitle>
          <DialogDescription>Atualize os detalhes da meta.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <Label htmlFor="edit-goal-title" className="pb-2">Título</Label>
            <Input
              id="edit-goal-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-goal-target" className="pb-2">Valor Alvo (R$)</Label>
            <Input
              id="edit-goal-target"
              type="number"
              step="0.01"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-goal-current" className="pb-2">Valor Atual (R$)</Label>
            <Input
              id="edit-goal-current"
              type="number"
              step="0.01"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="edit-goal-due" className="pb-2">Data Limite</Label>
            <Input
              id="edit-goal-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <DialogFooter className="flex justify-between">
            <Button
              variant="destructive"
              onClick={handleDelete}
              type="button"
            >
              Excluir
            </Button>
            <Button disabled={goalStatus === "pending"} type="submit">
              {goalStatus === "pending" ? "Salvando…" : "Salvar Meta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
