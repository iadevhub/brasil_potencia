"use client"

import { useMemo } from "react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Legend,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useHistoricalExchangeRate } from "@/hooks/use-exchange-rate"
import { Wifi, WifiOff } from "lucide-react"

interface ChartDataPoint {
  year: number
  cambioReal: number
  cambioSimulado: number
  icb: number
}

interface HistoricalChartProps {
  data: ChartDataPoint[]
  startYear: number
  endYear: number
  onStartYearChange: (year: number) => void
  onEndYearChange: (year: number) => void
}

const years = Array.from({ length: 25 }, (_, i) => 2000 + i)

const chartConfig = {
  cambioReal: {
    label: "Real Atual (USD/BRL)",
    color: "#ef4444",
  },
  cambioSimulado: {
    label: "Real Simulado (Lastreado)",
    color: "#22c55e",
  },
  icb: {
    label: "Indice Cesta Brasil",
    color: "#3b82f6",
  },
}

export function HistoricalChart({
  data,
  startYear,
  endYear,
  onStartYearChange,
  onEndYearChange,
}: HistoricalChartProps) {
  // Buscar dados em tempo real dos ultimos 365 dias
  const { data: liveData, isLoading, isError, source } = useHistoricalExchangeRate('USD-BRL', 365)

  // Combinar dados historicos com dados em tempo real
  const chartData = useMemo(() => {
    if (liveData && liveData.length > 0) {
      // Agrupar dados da API por ano para sobrepor aos dados historicos
      const liveByYear: Record<number, number[]> = {}
      liveData.forEach(item => {
        const year = new Date(item.date).getFullYear()
        if (!liveByYear[year]) liveByYear[year] = []
        liveByYear[year].push(item.bid)
      })

      // Calcular media por ano dos dados em tempo real
      const liveAverages: Record<number, number> = {}
      Object.entries(liveByYear).forEach(([year, values]) => {
        liveAverages[Number(year)] = values.reduce((a, b) => a + b, 0) / values.length
      })

      // Atualizar dados com valores em tempo real quando disponiveis
      return data.map(point => {
        if (liveAverages[point.year]) {
          return {
            ...point,
            cambioReal: Number(liveAverages[point.year].toFixed(2))
          }
        }
        return point
      })
    }
    return data
  }, [data, liveData])

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              Historico Comparativo (2000-2024)
              {isError ? (
                <WifiOff className="h-4 w-4 text-destructive" />
              ) : (
                <Wifi className="h-4 w-4 text-primary" />
              )}
            </CardTitle>
            <CardDescription className="text-muted-foreground flex items-center gap-2">
              Cotacao Real vs Real Simulado (se fosse lastreado na cesta produtiva)
              {source && (
                <Badge variant="outline" className="text-[10px]">
                  {source}
                </Badge>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">De:</Label>
              <Select
                value={startYear.toString()}
                onValueChange={(v) => onStartYearChange(Number(v))}
              >
                <SelectTrigger className="w-24 bg-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.filter(y => y < endYear).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Ate:</Label>
              <Select
                value={endYear.toString()}
                onValueChange={(v) => onEndYearChange(Number(v))}
              >
                <SelectTrigger className="w-24 bg-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.filter(y => y > startYear).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSimulado" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="year"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        const label = name === "cambioReal" 
                          ? "Real Atual" 
                          : name === "cambioSimulado" 
                            ? "Real Simulado" 
                            : "ICB"
                        return (
                          <span>
                            {label}: {name === "icb" ? value : `R$ ${Number(value).toFixed(2)}`}
                          </span>
                        )
                      }}
                    />
                  }
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => {
                    if (value === "cambioReal") return "Real Atual (USD/BRL)"
                    if (value === "cambioSimulado") return "Real Simulado (Lastreado)"
                    return value
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cambioSimulado"
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#colorSimulado)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="cambioReal"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorReal)"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}

        {/* Legend explanation */}
        <div className="mt-4 flex flex-wrap gap-6 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
            <span className="text-muted-foreground">Verde = Real forte (moeda valorizada)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
            <span className="text-muted-foreground">Vermelho = Real fraco (moeda desvalorizada)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
