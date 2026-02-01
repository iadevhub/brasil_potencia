"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingDown, TrendingUp, DollarSign, Gauge, AlertTriangle, Wifi } from "lucide-react"
import { useExchangeRate } from "@/hooks/use-exchange-rate"

interface IndexCardsProps {
  data: {
    ano: number
    cambioReal: number
    cambioSimulado: number
    cambioPotencial?: number
    icb: number
    perdaBrasil: number
    reservas: number
  }
}

export function IndexCards({ data }: IndexCardsProps) {
  // Buscar cotacao em tempo real
  const { data: liveData, isLoading, source } = useExchangeRate(['USD-BRL'])
  
  // Usar cotacao em tempo real se disponivel, senao usar dados estaticos
  const cambioAtual = liveData?.USDBRL 
    ? parseFloat(liveData.USDBRL.bid) 
    : data.cambioReal
    
  const diferencaCambio = ((cambioAtual - data.cambioSimulado) / cambioAtual * 100).toFixed(1)
  const realDesvalorizado = cambioAtual > data.cambioSimulado

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* ICB Card */}
      <Card className="bg-card border-primary/30">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-primary" />
            Indice Cesta Brasil
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3 px-3">
          <div className="text-2xl font-bold text-primary">{data.icb}</div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Base 100 = 2010
          </p>
        </CardContent>
      </Card>

      {/* Câmbio Equilíbrio Card - Novo modelo */}
      <Card className="bg-card border-primary/30">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            Cambio Equilibrio
            <Badge variant="outline" className="text-[8px] px-1 py-0 ml-auto">PPP</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3 px-3">
          <div className="text-2xl font-bold text-primary">
            R$ {data.cambioSimulado.toFixed(2)}
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Modelo: PPP + Balanca + Reservas
          </p>
        </CardContent>
      </Card>

      {/* Real Atual Card - Com dados em tempo real */}
      <Card className="bg-card border-destructive/30">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-destructive" />
            Real Hoje
            {source && (
              <Badge variant="outline" className="text-[8px] px-1 py-0 ml-auto">
                <Wifi className="w-2 h-2 mr-0.5" />
                {source === 'BCB-PTAX' ? 'BCB' : 'Live'}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3 px-3">
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div className="text-2xl font-bold text-destructive">
              R$ {cambioAtual.toFixed(2)}
            </div>
          )}
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Cotacao USD/BRL
          </p>
        </CardContent>
      </Card>

      {/* Perda Brasil Card */}
      <Card className="bg-card border-accent/30">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-accent" />
            Perda Brasil
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3 px-3">
          <div className="text-2xl font-bold text-accent">
            US$ {data.perdaBrasil.toFixed(0)} bi
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Nao agregado/ano
          </p>
        </CardContent>
      </Card>

      {/* Summary Banner */}
      <Card className="col-span-2 lg:col-span-4 bg-secondary/50 border-primary/20">
        <CardContent className="py-3 px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              {realDesvalorizado ? (
                <TrendingDown className="w-5 h-5 text-destructive flex-shrink-0" />
              ) : (
                <TrendingUp className="w-5 h-5 text-primary flex-shrink-0" />
              )}
              <div>
                <p className="text-sm font-medium text-foreground">
                  {realDesvalorizado 
                    ? `Real ${diferencaCambio}% mais fraco que o potencial`
                    : `Real ${Math.abs(Number(diferencaCambio))}% mais forte que o simulado`
                  }
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Baseado na capacidade produtiva real do Brasil
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="text-center">
                <p className="text-muted-foreground">Reservas</p>
                <p className="font-semibold text-foreground">US$ {data.reservas} bi</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Diferenca</p>
                <p className={`font-semibold ${realDesvalorizado ? 'text-destructive' : 'text-primary'}`}>
                  R$ {(cambioAtual - data.cambioSimulado).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
