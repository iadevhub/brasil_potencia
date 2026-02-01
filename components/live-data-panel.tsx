'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useExchangeRate, useHistoricalExchangeRate } from '@/hooks/use-exchange-rate'
import { RefreshCw, TrendingUp, TrendingDown, Wifi, WifiOff, Clock } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const GREEN = '#22c55e'
const RED = '#ef4444'
const BLUE = '#3b82f6'

export function LiveDataPanel() {
  const { 
    data: exchangeData, 
    isLoading, 
    isError, 
    source, 
    timestamp,
    refresh 
  } = useExchangeRate(['USD-BRL', 'EUR-BRL'])
  
  const { 
    data: historicalData, 
    isLoading: histLoading 
  } = useHistoricalExchangeRate('USD-BRL', 30)
  
  const usdBrl = exchangeData?.USDBRL
  const eurBrl = exchangeData?.EURBRL
  
  const formatTime = (ts: string | undefined) => {
    if (!ts) return '--:--'
    return new Date(ts).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }
  
  // Preparar dados para o grafico
  const chartData = historicalData
    .slice()
    .reverse()
    .slice(-15) // Ultimos 15 pontos para melhor visualizacao
    .map(item => ({
      date: formatDate(item.date),
      value: item.bid,
    }))
  
  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            Tempo Real
            {isError ? (
              <WifiOff className="h-3 w-3 text-destructive" />
            ) : (
              <Wifi className="h-3 w-3 text-primary" />
            )}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-[10px] px-1.5">
              {source || '...'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refresh()}
              disabled={isLoading}
              className="h-6 w-6 p-0"
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="h-2.5 w-2.5" />
          <span>{formatTime(timestamp)}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 pt-0">
        {/* Cotacoes atuais */}
        <div className="space-y-2">
          {/* USD/BRL */}
          <div className="bg-secondary/50 rounded-lg p-2">
            {isLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground">USD/BRL</span>
                  <div className="text-lg font-bold text-foreground">
                    R$ {parseFloat(usdBrl?.bid || '0').toFixed(4)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {parseFloat(usdBrl?.pctChange || '0') >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-red-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-green-500" />
                    )}
                    <span 
                      className="text-xs font-medium"
                      style={{ 
                        color: parseFloat(usdBrl?.pctChange || '0') >= 0 ? RED : GREEN 
                      }}
                    >
                      {parseFloat(usdBrl?.pctChange || '0') >= 0 ? '+' : ''}
                      {usdBrl?.pctChange || '0'}%
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Max: {usdBrl?.high || '-'} | Min: {usdBrl?.low || '-'}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* EUR/BRL */}
          <div className="bg-secondary/50 rounded-lg p-2">
            {isLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground">EUR/BRL</span>
                  <div className="text-lg font-bold text-foreground">
                    R$ {parseFloat(eurBrl?.bid || '0').toFixed(4)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {parseFloat(eurBrl?.pctChange || '0') >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-red-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-green-500" />
                    )}
                    <span 
                      className="text-xs font-medium"
                      style={{ 
                        color: parseFloat(eurBrl?.pctChange || '0') >= 0 ? RED : GREEN 
                      }}
                    >
                      {parseFloat(eurBrl?.pctChange || '0') >= 0 ? '+' : ''}
                      {eurBrl?.pctChange || '0'}%
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Max: {eurBrl?.high || '-'} | Min: {eurBrl?.low || '-'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Grafico mini */}
        <div>
          <div className="text-[10px] text-muted-foreground mb-1">USD/BRL - 15 dias</div>
          {histLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : (
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValueLive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={BLUE} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={BLUE} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    hide
                  />
                  <YAxis 
                    hide
                    domain={['dataMin - 0.05', 'dataMax + 0.05']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(26, 26, 46, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      fontSize: '10px',
                      padding: '4px 8px',
                    }}
                    labelStyle={{ color: '#fff', fontSize: '9px' }}
                    formatter={(value: number) => [`R$ ${value.toFixed(4)}`, '']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={BLUE}
                    strokeWidth={1.5}
                    fill="url(#colorValueLive)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className="text-[9px] text-muted-foreground text-center pt-1 border-t border-border">
          Atualiza a cada 60s | BCB + Cache
        </div>
      </CardContent>
    </Card>
  )
}
