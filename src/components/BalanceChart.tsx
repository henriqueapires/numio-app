"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useTransactions } from "@/hooks/useTransactions";
import { format } from "date-fns";

export function BalanceChart() {
  const { data: transactions } = useTransactions();

  const points = (transactions ?? [])
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce<{ date: string; balance: number }[]>((acc, tx) => {
      const prev = acc.length ? acc[acc.length - 1].balance : 0;
      acc.push({
        date: format(new Date(tx.date), "dd/MM"),
        balance: prev + tx.amount,
      });
      return acc;
    }, []);

  if (!points.length) return <p>Sem dados para gráfico de saldo.</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={points} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="balance" stroke="#8884d8" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
