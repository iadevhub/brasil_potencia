"use client"

import { gerarSerieDashboard, calcularIndicadores } from "@/lib/dashboard-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EconomicDashboard() {
  const serie = gerarSerieDashboard(2000, 2024)
  const indicadores = calcularIndicadores()
  const ultimos = serie.slice(-5)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Resumo Econômico (2000-2024)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>ICB médio</span>
            <strong>{indicadores.icbMedio.toFixed(2)}</strong>
          </div>
          <div className="flex justify-between">
            <span>Câmbio médio</span>
            <strong>R$ {indicadores.cambioMedio.toFixed(2)}/USD</strong>
          </div>
          <div className="flex justify-between">
            <span>Perda Brasil total</span>
            <strong>US$ {indicadores.perdaBrasilTotal.toFixed(2)} bi</strong>
          </div>
          <div className="flex justify-between">
            <span>Melhor ano</span>
            <strong>{indicadores.melhorAno.ano} (ICB {indicadores.melhorAno.icb.toFixed(2)})</strong>
          </div>
          <div className="flex justify-between">
            <span>Pior ano</span>
            <strong>{indicadores.piorAno.ano} (ICB {indicadores.piorAno.icb.toFixed(2)})</strong>
          </div>
          <div className="flex justify-between">
            <span>Tendência</span>
            <strong>{indicadores.tendencia.toUpperCase()}</strong>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Últimos 5 anos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {ultimos.map((item) => (
            <div key={item.ano} className="flex justify-between">
              <span>{item.ano}</span>
              <span>ICB {item.icbReal.toFixed(1)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
