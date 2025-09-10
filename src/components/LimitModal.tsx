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
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (open) setValue(limit != null ? String(limit) : "");
  }, [limit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = parseFloat(value.replace(",", ".")); // aceita vírgula
    if (Number.isNaN(numeric) || numeric < 0) return; // pode exibir erro/toast aqui
    updateLimit({ monthlyLimit: numeric }, { onSuccess: () => setOpen(false) });
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
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => {
                if (value === "") return;
                const n = parseFloat(value.replace(",", "."));
                if (!Number.isNaN(n)) setValue(n.toFixed(2));
              }}
              required
            />
          </div>
          <DialogFooter>
            <Button disabled={status === "pending"} type="submit">
              {status === "pending" ? "Salvando…" : "Salvar Limite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
