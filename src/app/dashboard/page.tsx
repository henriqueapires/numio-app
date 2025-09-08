"use client";
import { useCategories } from "@/hooks/useCategories";
import { useTransactions } from "@/hooks/useTransactions";
import { useGoals } from "@/hooks/useGoals";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionModal } from "@/components/TransactionModal";
import { GoalModal } from "@/components/GoalModal";
import { BalanceChart } from "@/components/BalanceChart";
import { ExpensePieChart } from "@/components/ExpensePieChart";
import { EditTransactionModal, EditGoalModal } from "@/components/EditModals";
import { CategoryModal } from "@/components/CategoryModal";
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  PiggyBank,
  CreditCard,
  ChevronRight,
  Activity,
  LogOut,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useUserLimit } from "@/hooks/useUserLimit";
import EnhancedLimitCard from "@/components/EnhancedLimitCard";

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
                <Skeleton className="h-12 w-12 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-64 w-full" />
          </Card>
          <Card className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-64 w-full" />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { data: transactions, isLoading: loadingTransactions } =
    useTransactions();
  const { data: goals, isLoading: loadingGoals } = useGoals();
  const { data: session } = useSession();
  const userName = session?.user?.name ?? "Usuário";

  const balance = transactions?.reduce((sum, t) => sum + t.amount, 0) ?? 0;
  const monthlyExpenses =
    transactions
      ?.filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0) ?? 0;
  const monthlyIncome =
    transactions
      ?.filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0) ?? 0;

  const total = monthlyIncome + Math.abs(monthlyExpenses);
  const percentBalance = total > 0 ? (balance / total) * 100 : 0;
  const percentExpenses =
    total > 0 ? (Math.abs(monthlyExpenses) / total) * 100 : 0;
  const percentIncome = total > 0 ? (monthlyIncome / total) * 100 : 0;

  const { data: limit } = useUserLimit();
  const used = Math.abs(monthlyExpenses);
  const exceeded = limit != null && used > limit;
  const exceededBy = exceeded ? used - limit! : 0;
  const percentOfLimit = limit ? (used / limit) * 100 : 0;

  useEffect(() => {
    if (exceeded) {
      toast.error("Você ultrapassou seu limite mensal!");
    }
  }, [exceeded]);

  const currentDate = new Date();
  const greeting =
    currentDate.getHours() < 12
      ? "Bom dia"
      : currentDate.getHours() < 18
      ? "Boa tarde"
      : "Boa noite";

  if (loadingCategories || loadingTransactions || loadingGoals) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="p-6 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {greeting}, {userName}!
                </h1>
                <p className="text-sm text-muted-foreground">
                  {format(currentDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {/* <Button variant="outline" size="icon" className="relative bg-transparent">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button> */}
            {/* <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar> */}
            <div className="flex gap-2">
              <TransactionModal />
              <CategoryModal />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600"></div>
            <CardContent className="relative p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-green-100 text-sm font-medium">
                    Saldo Atual
                  </p>
                  <p className="text-3xl font-bold">
                    R${" "}
                    {balance.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <div className="flex items-center gap-1 text-green-100">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs">
                      {percentBalance.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Wallet className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600"></div>
            <CardContent className="relative p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-red-100 text-sm font-medium">
                    Despesas Mensais
                  </p>
                  <p className="text-3xl font-bold">
                    R${" "}
                    {Math.abs(monthlyExpenses).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <div className="flex items-center gap-1 text-red-100">
                    <TrendingDown className="h-4 w-4" />
                    <span className="text-xs">
                      {percentBalance.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <CreditCard className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
            <CardContent className="relative p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-blue-100 text-sm font-medium">
                    Receitas Mensais
                  </p>
                  <p className="text-3xl font-bold">
                    R${" "}
                    {monthlyIncome.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <div className="flex items-center gap-1 text-blue-100">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs">
                      {percentBalance.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <DollarSign className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <EnhancedLimitCard
            limit={limit ?? null}
            currentExpenses={used}
            exceeded={exceeded}
            exceededBy={exceededBy}
            percentOfLimit={percentOfLimit}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Fluxo de Saldo
                </CardTitle>
                <Badge variant="secondary">Últimos 30 dias</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <BalanceChart />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5 text-purple-500" />
                  Despesas por Categoria
                </CardTitle>
                <Badge variant="secondary">Este mês</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ExpensePieChart />
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                Transações Recentes
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                Ver todas
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions?.slice(0, 5).length ? (
                transactions.slice(0, 5).map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback
                          className={`${
                            t.amount < 0
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {t.amount < 0 ? (
                            <ArrowDownRight className="h-5 w-5" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{t.category.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(t.date), "dd/MM/yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-semibold ${
                          t.amount < 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {t.amount < 0 ? "-" : "+"}R${" "}
                        {Math.abs(t.amount).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      <EditTransactionModal transaction={t} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma transação ainda.</p>
                  <p className="text-sm">
                    Adicione sua primeira transação para começar!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-500" />
                Metas Financeiras
              </CardTitle>
              <GoalModal />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {goals?.length ? (
                goals.map((g) => {
                  const progress = (g.currentAmount / g.targetAmount) * 100;
                  return (
                    <div
                      key={g.id}
                      className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                            <Target className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{g.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              R${" "}
                              {g.currentAmount.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              })}{" "}
                              de R${" "}
                              {g.targetAmount.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              progress >= 100
                                ? "default"
                                : progress >= 50
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {progress.toFixed(0)}%
                          </Badge>
                          <EditGoalModal goal={g} />
                        </div>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma meta definida ainda.</p>
                  <p className="text-sm">
                    Crie suas primeiras metas financeiras!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
