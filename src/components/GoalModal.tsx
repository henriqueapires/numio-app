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
import { useCreateGoal, useGoals } from "@/hooks/useGoals";

export function GoalModal() {
  const [open, setOpen] = useState(false);
  const { mutate: createGoal, status } = useCreateGoal();

  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createGoal(
      {
        title,
        targetAmount: parseFloat(targetAmount),
        dueDate: new Date(dueDate).toISOString(),
      },
      {
        onSuccess: () => {
          setOpen(false);
          setTitle("");
          setTargetAmount("");
          setDueDate("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Nova Meta</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Meta</DialogTitle>
          <DialogDescription>Defina uma meta financeira.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="goal-title" className="pb-2">
              Título
            </Label>
            <Input
              id="goal-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="goal-amount" className="pb-2">
              Valor Alvo (R$)
            </Label>
            <Input
              id="goal-amount"
              type="number"
              step="0.01"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="goal-due" className="pb-2">
              Data Limite
            </Label>
            <Input
              id="goal-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={status === "pending"}>
              {status === "pending" ? "Salvando…" : "Salvar Meta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
