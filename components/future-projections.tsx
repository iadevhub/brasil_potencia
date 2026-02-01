"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { 
  Zap, 
  Wheat, 
  Mountain, 
  Factory, 
  Landmark,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Play,
  Calculator
} from "lucide-react"
import { 
  type Pesos, 
  type FutureScenario,
  calcularProjecaoFutura,
  defaultPesos 
} from "@/lib/brasil-data"

interface FutureProjectionsProps {
  currentPesos: Pesos
}

const scenarioPresets = {
  otimista: {
    nome: "Brasil Potencia",
    descricao: "Industrializacao acelerada e investimento em tecnologia",
    energia: 180,
    alimentos: 170,
    minerios: 160,
    industria: 150,
    reservas: 450
  },
  conservador: {
    nome: "Crescimento Moderado",
    descricao: "Continuidade das tendencias atuais",
    energia: 150,
    alimentos: 160,
    minerios: 140,
    industria: 100,
    reservas: 380
  },
  pessimista: {
    nome: "Estagnacao",
    descricao: "Desindustrializacao e dependencia de commodities",
    energia: 130,
    alimentos: 155,
    minerios: 120,
    industria: 75,
    reservas: 320
  }
}

const chartConfig = {
  cambioProjetado: {
    label: "Cambio ICB",
    color: "#22c55e",
  },
  cambioAtualProjetado: {
    label: "Cambio Tendencia",
    color: "#ef4444",
  },
}

export function FutureProjections({ currentPesos }: FutureProjectionsProps) {
  const [activeScenario, setActiveScenario] = useState<'otimista' | 'conservador' | 'pessimista'>('conservador')
  const [customScenario, setCustomScenario] = useState({
    energia: 150,
    alimentos: 160,
    minerios: 140,
    industria: 100,
    reservas: 380
  })
  const [customPesos, setCustomPesos] = useState<Pesos>(currentPesos)
  const [isCustomMode, setIsCustomMode] = useState(false)

  const years = [2025, 2026, 2027, 2028, 2029, 2030]
  
  const projectionData = useMemo(() => {
    const scenario = isCustomMode ? customScenario : scenarioPresets[activeScenario]
    
    const cenarios: FutureScenario[] = years.map((ano, index) => {
      const progress = (index + 1) / years.length
      const current2024 = { energia: 138, alimentos: 148, minerios: 132, industria: 89, reservas: 360 }
      
      return {
        ano,
        energia: Math.round(current2024.energia + (scenario.energia - current2024.energia) * progress),
        alimentos: Math.round(current2024.alimentos + (scenario.alimentos - current2024.alimentos) * progress),
        minerios: Math.round(current2024.minerios + (scenario.minerios - current2024.minerios) * progress),
        industria: Math.round(current2024.industria + (scenario.industria - current2024.industria) * progress),
        reservas: Math.round(current2024.reservas + (scenario.reservas - current2024.reservas) * progress)
      }
    })
    
    return calcularProjecaoFutura(cenarios, isCustomMode ? customPesos : currentPesos)
  }, [activeScenario, customScenario, customPesos, isCustomMode, currentPesos])

  const finalProjection = projectionData[projectionData.length - 1]
  const improvementPercent = finalProjection ? -finalProjection.diferencaPercentual : 0

  const handleSliderChange = (key: keyof typeof customScenario, value: number[]) => {
    setCustomScenario(prev => ({ ...prev, [key]: value[0] }))
  }

  const handlePesoChange = (key: keyof Pesos, value: number[]) => {
    const newValue = value[0] / 100
    const oldValue = customPesos[key]
    const diff = newValue - oldValue
    
    const otherKeys = Object.keys(customPesos).filter(k => k !== key) as (keyof Pesos)[]
    const totalOthers = otherKeys.reduce((sum, k) => sum + customPesos[k], 0)
    
    if (totalOthers > 0) {
      const newPesos = { ...customPesos, [key]: newValue }
      otherKeys.forEach(k => {
        newPesos[k] = Math.max(0, customPesos[k] - (diff * customPesos[k] / totalOthers))
      })
      setCustomPesos(newPesos)
    }
  }

  const resetCustom = () => {
    setCustomScenario(scenarioPresets.conservador)
    setCustomPesos(currentPesos)
  }

  const components = [
    { key: 'energia' as const, label: 'Energia', icon: Zap, color: '#facc15', min: 80, max: 250 },
    { key: 'alimentos' as const, label: 'Alimentos', icon: Wheat, color: '#22c55e', min: 80, max: 250 },
    { key: 'minerios' as const, label: 'Minerios', icon: Mountain, color: '#a855f7', min: 80, max: 250 },
    { key: 'industria' as const, label: 'Industria', icon: Factory, color: '#3b82f6', min: 50, max: 200 },
    { key: 'reservas' as const, label: 'Reservas', icon: Landmark, color: '#f97316', min: 250, max: 550 },
  ]

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Projecoes Futuras (2025-2030)
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Simule cenarios hipoteticos e veja o impacto projetado na cotacao do Real
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scenario Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Cenario Base</p>
            <Button 
              variant={isCustomMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="text-xs"
            >
              {isCustomMode ? "Modo Personalizado" : "Personalizar"}
            </Button>
          </div>
          
          {!isCustomMode && (
            <Tabs value={activeScenario} onValueChange={(v) => setActiveScenario(v as typeof activeScenario)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="otimista" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Otimista
                </TabsTrigger>
                <TabsTrigger value="conservador" className="text-xs">
                  Moderado
                </TabsTrigger>
                <TabsTrigger value="pessimista" className="text-xs">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  Pessimista
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-3 p-3 rounded-lg bg-secondary/50">
                <p className="text-sm font-medium text-foreground">{scenarioPresets[activeScenario].nome}</p>
                <p className="text-xs text-muted-foreground mt-1">{scenarioPresets[activeScenario].descricao}</p>
              </div>
            </Tabs>
          )}
        </div>

        {/* Custom Scenario Sliders */}
        {isCustomMode && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Indices da Cesta (2030)</p>
              <Button variant="ghost" size="sm" onClick={resetCustom} className="text-xs">
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
            
            <div className="space-y-3">
              {components.map(({ key, label, icon: Icon, color, min, max }) => (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5" style={{ color }} />
                      <span className="text-xs text-muted-foreground">{label}</span>
                    </div>
                    <span className="text-xs font-mono text-foreground">{customScenario[key]}</span>
                  </div>
                  <Slider
                    value={[customScenario[key]]}
                    onValueChange={(v) => handleSliderChange(key, v)}
                    min={min}
                    max={max}
                    step={5}
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            {/* Custom Weights */}
            <div className="pt-3 border-t border-border">
              <p className="text-sm font-medium text-foreground mb-3">Pesos Personalizados da Cesta</p>
              <div className="space-y-3">
                {components.map(({ key, label, icon: Icon, color }) => (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" style={{ color }} />
                        <span className="text-xs text-muted-foreground">{label}</span>
                      </div>
                      <span className="text-xs font-mono text-foreground">{(customPesos[key] * 100).toFixed(0)}%</span>
                    </div>
                    <Slider
                      value={[customPesos[key] * 100]}
                      onValueChange={(v) => handlePesoChange(key, v)}
                      min={0}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Projection Chart */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Projecao do Cambio Real/USD</p>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradientProjetado" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gradientTendencia" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="ano" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  domain={['dataMin - 0.5', 'dataMax + 0.5']}
                  tickFormatter={(v) => `R$${v.toFixed(1)}`}
                  width={45}
                />
                <ReferenceLine y={5.15} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" />
                <ChartTooltip 
                  content={
                    <ChartTooltipContent 
                      formatter={(value, name) => (
                        <span>
                          {name === "cambioProjetado" ? "Cambio ICB" : "Tendencia Atual"}: R$ {Number(value).toFixed(2)}
                        </span>
                      )}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="cambioAtualProjetado"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#gradientTendencia)"
                  name="cambioAtualProjetado"
                />
                <Area
                  type="monotone"
                  dataKey="cambioProjetado"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#gradientProjetado)"
                  name="cambioProjetado"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-[#22c55e]" />
              <span className="text-muted-foreground">Cambio ICB (Simulado)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-[#ef4444]" />
              <span className="text-muted-foreground">Tendencia Atual</span>
            </div>
          </div>
        </div>

        {/* Projection Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-secondary/50 text-center">
            <p className="text-xs text-muted-foreground mb-1">ICB 2030</p>
            <p className="text-lg font-bold text-foreground">{finalProjection?.icbProjetado || 0}</p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 text-center">
            <p className="text-xs text-muted-foreground mb-1">Real Projetado</p>
            <p className="text-lg font-bold text-primary">R$ {finalProjection?.cambioProjetado.toFixed(2) || '0.00'}</p>
          </div>
          <div className={`p-3 rounded-lg text-center ${improvementPercent > 0 ? 'bg-primary/10' : 'bg-destructive/10'}`}>
            <p className="text-xs text-muted-foreground mb-1">vs Tendencia</p>
            <p className={`text-lg font-bold ${improvementPercent > 0 ? 'text-primary' : 'text-destructive'}`}>
              {improvementPercent > 0 ? '+' : ''}{improvementPercent.toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Scenario Explanation */}
        <div className="p-3 rounded-lg bg-muted/30 border border-border">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Como interpretar:</span> O grafico mostra a diferenca entre 
            o cambio se o Brasil seguir valorizando sua producao (verde) versus a tendencia atual de desvalorizacao (vermelho). 
            Aumentar a industria e reservas tende a fortalecer o Real.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
