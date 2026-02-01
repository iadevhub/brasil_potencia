"use client"

import { gerarCenariosProjetados } from "@/lib/dashboard-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ScenariosPanel() {
  const cenarios = gerarCenariosProjetados()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cenarios.map((c) => (
        <Card key={c.tipo}>
          <CardHeader>
            <CardTitle className="capitalize">Cenário {c.tipo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Crescimento anual</span>
              <strong>{(c.crescimentoAnual * 100).toFixed(1)}%</strong>
            </div>
            <div className="flex justify-between">
              <span>Câmbio 2030</span>
              <strong>R$ {c.cambio2030.toFixed(2)}</strong>
            </div>
            <div className="flex justify-between">
              <span>ICB 2030</span>
              <strong>{c.icb2030.toFixed(2)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Empregos</span>
              <strong>{c.empregos.toLocaleString("pt-BR")}</strong>
            </div>
            <div className="flex justify-between">
              <span>PIB adicional</span>
              <strong>+{(c.pibAdicional * 100).toFixed(1)}%</strong>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
