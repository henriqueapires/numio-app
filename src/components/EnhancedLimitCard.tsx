"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingUp, AlertCircle, CheckCircle, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { LimitModal } from "./LimitModal"

interface EnhancedLimitCardProps {
  limit: number | null
  currentExpenses: number
  exceeded: boolean
  exceededBy: number
  percentOfLimit: number
}

export default function EnhancedLimitCard({
  limit,
  currentExpenses,
  exceeded,
  exceededBy,
  percentOfLimit,
}: EnhancedLimitCardProps) {
  const getStatusConfig = () => {
    if (exceeded) {
      return {
        gradient: "from-red-500 via-red-600 to-red-700",
        textColor: "text-white",
        icon: AlertTriangle,
        iconBg: "bg-red-400/30",
        status: "Limite Excedido",
        statusColor: "bg-red-700",
        pulseClass: "animate-pulse",
        shadowClass: "shadow-[0_0_30px_rgba(239,68,68,0.5)]",
      }
    } else if (percentOfLimit >= 80) {
      return {
        gradient: "from-orange-500 via-orange-600 to-red-500",
        textColor: "text-white",
        icon: AlertCircle,
        iconBg: "bg-orange-400/30",
        status: "Atenção",
        statusColor: "bg-orange-700",
        pulseClass: "",
        shadowClass: "shadow-[0_0_20px_rgba(249,115,22,0.3)]",
      }
    } else if (percentOfLimit >= 50) {
      return {
        gradient: "from-yellow-500 via-orange-500 to-orange-600",
        textColor: "text-white",
        icon: TrendingUp,
        iconBg: "bg-yellow-400/30",
        status: "Moderado",
        statusColor: "bg-yellow-700",
        pulseClass: "",
        shadowClass: "",
      }
    } else {
      return {
        gradient: "from-emerald-500 via-green-500 to-green-600",
        textColor: "text-white",
        icon: CheckCircle,
        iconBg: "bg-green-400/30",
        status: "Saudável",
        statusColor: "bg-green-700",
        pulseClass: "",
        shadowClass: "",
      }
    }
  }

  const config = getStatusConfig()
  const StatusIcon = config.icon

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-0 shadow-2xl transform transition-all duration-300 hover:scale-105",
        config.pulseClass,
        config.shadowClass,
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", config.gradient)}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.1%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      </div>

      <CardContent className="relative p-6 z-10">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("p-3 rounded-xl backdrop-blur-sm border border-white/20", config.iconBg)}>
                <StatusIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">Limite Mensal</p>
                <Badge className={cn("text-xs font-semibold border-0 text-white", config.statusColor)}>
                  {config.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-white">
                R$ {limit?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) ?? "--"}
              </p>
              {exceeded && (
                <div className="flex items-center gap-1 animate-bounce">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-white/80 text-sm">
              <span>Gastos atuais: R$ {currentExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              <span className="font-semibold">{percentOfLimit.toFixed(1)}%</span>
            </div>
          </div>

          {exceeded && (
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="bg-red-800 hover:bg-red-800 text-white border-0 animate-pulse">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Excedeu R$ {exceededBy.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </Badge>
            </div>
          )}

          {limit != null && (
            <div className="space-y-2">
              <div className="relative">
                <Progress value={Math.min(percentOfLimit, 100)} className="h-3 bg-white/20 border border-white/30" />
                {exceeded && (
                  <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-red-600 to-red-800 rounded-full animate-pulse"></div>
                )}
              </div>

              <div className="flex justify-between text-xs text-white/70">
                <span>R$ 0</span>
                <span>R$ {limit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          )}

          <div className="pt-2">
            <LimitModal />
          </div>
        </div>
      </CardContent>

      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
    </Card>
  )
}
