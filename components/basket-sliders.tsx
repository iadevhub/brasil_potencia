"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { RotateCcw, Zap, Wheat, Mountain, Factory, Landmark } from "lucide-react"
import type { Pesos } from "@/lib/brasil-data"
import { defaultPesos } from "@/lib/brasil-data"

interface BasketSlidersProps {
  pesos: Pesos
  onPesosChange: (pesos: Pesos) => void
}

const componentConfig = [
  {
    key: "energia" as keyof Pesos,
    label: "Energia",
    description: "Petroleo, eletricidade, gas",
    icon: Zap,
    color: "bg-amber-500",
  },
  {
    key: "alimentos" as keyof Pesos,
    label: "Alimentos",
    description: "Soja, carne, cafe, milho",
    icon: Wheat,
    color: "bg-green-500",
  },
  {
    key: "minerios" as keyof Pesos,
    label: "Minerios",
    description: "Ferro, niobio, ouro",
    icon: Mountain,
    color: "bg-orange-500",
  },
  {
    key: "industria" as keyof Pesos,
    label: "Industria",
    description: "Producao industrial IBGE",
    icon: Factory,
    color: "bg-blue-500",
  },
  {
    key: "reservas" as keyof Pesos,
    label: "Reservas",
    description: "Reservas cambiais (USD)",
    icon: Landmark,
    color: "bg-purple-500",
  },
]

export function BasketSliders({ pesos, onPesosChange }: BasketSlidersProps) {
  const totalPeso = Object.values(pesos).reduce((sum, p) => sum + p, 0)

  const handleSliderChange = (key: keyof Pesos, value: number[]) => {
    const newValue = value[0]
    const oldValue = pesos[key]
    const diff = newValue - oldValue

    // Distribute the difference among other sliders proportionally
    const otherKeys = Object.keys(pesos).filter(k => k !== key) as (keyof Pesos)[]
    const otherTotal = otherKeys.reduce((sum, k) => sum + pesos[k], 0)

    if (otherTotal === 0) return

    const newPesos = { ...pesos, [key]: newValue }

    // Adjust other sliders to keep total at ~1
    for (const k of otherKeys) {
      const proportion = pesos[k] / otherTotal
      const adjustment = diff * proportion
      newPesos[k] = Math.max(0.05, Math.min(0.5, pesos[k] - adjustment))
    }

    // Normalize to ensure total is exactly 1
    const total = Object.values(newPesos).reduce((sum, p) => sum + p, 0)
    for (const k of Object.keys(newPesos) as (keyof Pesos)[]) {
      newPesos[k] = newPesos[k] / total
    }

    onPesosChange(newPesos)
  }

  const resetPesos = () => {
    onPesosChange(defaultPesos)
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Composicao da Cesta (Ajustavel)
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Ajuste os pesos para simular diferentes cenarios
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetPesos}
            className="gap-2 bg-transparent"
          >
            <RotateCcw className="w-4 h-4" />
            Resetar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {componentConfig.map(({ key, label, description, icon: Icon, color }) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </div>
              <span className="text-lg font-semibold text-foreground tabular-nums">
                {(pesos[key] * 100).toFixed(0)}%
              </span>
            </div>
            <Slider
              value={[pesos[key]]}
              min={0.05}
              max={0.5}
              step={0.01}
              onValueChange={(value) => handleSliderChange(key, value)}
              className="cursor-pointer"
            />
          </div>
        ))}

        {/* Total indicator */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total dos pesos:</span>
            <span className={`font-semibold ${Math.abs(totalPeso - 1) < 0.01 ? "text-primary" : "text-destructive"}`}>
              {(totalPeso * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Formula explanation */}
        <div className="p-4 rounded-lg bg-secondary/50 text-sm">
          <p className="font-medium text-foreground mb-2">Formula do Indice Cesta Brasil (ICB):</p>
          <code className="text-xs text-muted-foreground block">
            ICB = (E x {(pesos.energia * 100).toFixed(0)}%) + (A x {(pesos.alimentos * 100).toFixed(0)}%) + (M x {(pesos.minerios * 100).toFixed(0)}%) + (I x {(pesos.industria * 100).toFixed(0)}%) + (R x {(pesos.reservas * 100).toFixed(0)}%)
          </code>
          <p className="text-xs text-muted-foreground mt-2">
            Onde E=Energia, A=Alimentos, M=Minerios, I=Industria, R=Reservas (normalizados base 100 = 2010)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
