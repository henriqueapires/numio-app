"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function ExpensePieChart() {
  const { data: transactions } = useTransactions();
  const { data: categories } = useCategories();

  const sums = (transactions ?? [])
    .filter((t) => t.amount < 0)
    .reduce<Record<string, number>>((acc, tx) => {
      acc[tx.categoryId] = (acc[tx.categoryId] || 0) + Math.abs(tx.amount);
      return acc;
    }, {});

  const data = Object.entries(sums).map(([catId, value]) => {
    const cat = categories?.find((c) => c.id === catId);
    return { name: cat?.name ?? catId, value };
  });

  if (!data.length) return <p>Sem despesas para o gráfico.</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
          {data.map((_, idx) => (
            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
}
