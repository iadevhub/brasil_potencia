"use client"

import { TrendingUp } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                BRASIL POTENCIA
              </h1>
              <p className="text-sm text-muted-foreground">
                Simulador de Soberania Economica
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hidden sm:inline">Dados oficiais:</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs font-medium">
                IBGE
              </span>
              <span className="px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs font-medium">
                BCB
              </span>
              <span className="px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs font-medium">
                MDIC
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground max-w-2xl text-balance">
          Descubra quanto o Brasil perde por exportar commodities brutas e importar produtos prontos. 
          <span className="text-accent font-medium"> O problema nao e falta de riqueza. E modelo economico errado.</span>
        </p>
      </div>
    </header>
  )
}
