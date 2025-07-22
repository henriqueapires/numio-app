"use client"

import React from "react";
import { useCategories } from "@/hooks/useCategories";
import { useTransactions } from "@/hooks/useTransactions";
import { useGoals } from "@/hooks/useGoals";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionModal } from "@/components/TransactionModal";
import { GoalModal } from "@/components/GoalModal";
import { BalanceChart } from "@/components/BalanceChart";
import { ExpensePieChart } from "@/components/ExpensePieChart";
import { EditTransactionModal, EditGoalModal } from "@/components/EditModals";
import { CategoryModal } from "@/components/CategoryModal";

export default function DashboardPage() {
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { data: transactions, isLoading: loadingTransactions } = useTransactions();
  const { data: goals, isLoading: loadingGoals } = useGoals();

  const balance =
    transactions?.reduce((sum, t) => sum + t.amount, 0) ?? 0;
  const monthlyExpenses =
    transactions
      ?.filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0) ?? 0;
  const monthlyIncome =
    transactions
      ?.filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0) ?? 0;

  if (loadingCategories || loadingTransactions || loadingGoals) {
    return <div className="p-6">Carregando dados...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Numio</h1>
        <TransactionModal />
        <CategoryModal/>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Saldo Atual</CardTitle>
          </CardHeader>
          <CardContent>R$ {balance.toFixed(2)}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Despesas Mensais</CardTitle>
          </CardHeader>
          <CardContent className="text-red-600">
            R$ {Math.abs(monthlyExpenses).toFixed(2)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receitas Mensais</CardTitle>
          </CardHeader>
          <CardContent className="text-green-600">
            R$ {monthlyIncome.toFixed(2)}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Fluxo de Saldo</CardTitle></CardHeader>
          <CardContent><BalanceChart /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Despesas por Categoria</CardTitle></CardHeader>
          <CardContent><ExpensePieChart /></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {transactions?.slice(0, 5).length ? (
              transactions.slice(0, 5).map((t) => (
                <li key={t.id} className="py-2 flex justify-between">
                  <span>{format(new Date(t.date), "dd/MM/yyyy")}</span>
                  <span>{t.category.name}</span>
                  <span className={t.amount < 0 ? "text-red-600" : "text-green-600"}>
                    R$ {t.amount.toFixed(2)}
                  </span>
                  <EditTransactionModal transaction={t} />
                </li>
              ))
            ) : (
              <li className="py-2">Nenhuma transação ainda.</li>
            )}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metas</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {goals?.length ? (
              goals.map((g) => (
                <li key={g.id} className="py-2 flex justify-between">
                  <span>{g.title}</span>
                  <span>
                    {((g.currentAmount / g.targetAmount) * 100).toFixed(0)}% de R$ {g.targetAmount.toFixed(2)}
                  </span>
                  <EditGoalModal goal={g} />
                </li>
              ))
            ) : (
              <li className="py-2">Nenhuma meta ainda.</li>
            )}
          </ul>
          <GoalModal/>
        </CardContent>
      </Card>
    </div>
  );
}
