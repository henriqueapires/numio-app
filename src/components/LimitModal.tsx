"use client";

import { useState, useEffect } from "react";
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
import { useUserLimit, useUpdateUserLimit } from "@/hooks/useUserLimit";
import { PiggyBank } from "lucide-react";

export function LimitModal() {
  const { data: limit, isLoading } = useUserLimit();
  const { mutate: updateLimit, status } = useUpdateUserLimit();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number>(0);

  // quando abrir o modal, popula com o valor atual
  useEffect(() => {
    if (limit != null) setValue(limit);
  }, [limit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLimit(
      { monthlyLimit: value },
      { onSuccess: () => setOpen(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
              variant="secondary"
              size="sm"
              className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
            >
          Ajustar limite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Definir Limite Mensal</DialogTitle>
          <DialogDescription>
            Receba alerta se ultrapassar este valor.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="limit">Limite (R$)</Label>
            <Input
              id="limit"
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => setValue(parseFloat(e.target.value))}
              required
            />
          </div>
          <DialogFooter>
            <Button disabled={status==="pending"} type="submit">
              {status==="pending" ? "Salvando…" : "Salvar Limite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
