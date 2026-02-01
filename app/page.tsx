"use client"

import { useState, useMemo } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { IndexCards } from "@/components/index-cards"
import { HistoricalChart } from "@/components/historical-chart"
import { BasketSliders } from "@/components/basket-sliders"
import { BrazilianErrorPanel } from "@/components/brazilian-error-panel"
import { FutureProjections } from "@/components/future-projections"
import { SectorAnalysis } from "@/components/sector-analysis"
import { LiveDataPanel } from "@/components/live-data-panel"
import { TechDependencyPanel } from "@/components/tech-dependency-panel"
import { EconomicDashboard } from "@/components/economic-dashboard"
import { ScenariosPanel } from "@/components/scenarios-panel"
import { PolicyRecommendations } from "@/components/policy-recommendations"
import { defaultPesos, type Pesos, generateChartData, getLatestData } from "@/lib/brasil-data"

// Força renderização dinâmica (não usa cache estático)
export const dynamic = 'force-dynamic'

export default function BrasilPotenciaPage() {
  const [pesos, setPesos] = useState<Pesos>(defaultPesos)
  const [startYear, setStartYear] = useState(2000)
  const [endYear, setEndYear] = useState(2024)

  const chartData = useMemo(
    () => generateChartData(pesos, startYear, endYear),
    [pesos, startYear, endYear]
  )

  const latestData = useMemo(() => getLatestData(pesos), [pesos])

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="container mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Row 1: KPI Cards + Live Data */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9">
            <IndexCards data={latestData} />
          </div>
          <div className="lg:col-span-3">
            <LiveDataPanel />
          </div>
        </section>

        {/* Row 2: Historical Chart - Full Width */}
        <section>
          <HistoricalChart
            data={chartData}
            startYear={startYear}
            endYear={endYear}
            onStartYearChange={setStartYear}
            onEndYearChange={setEndYear}
          />
        </section>

        {/* Row 3: Basket Sliders + Future Projections (2 Columns) */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <BasketSliders pesos={pesos} onPesosChange={setPesos} />
          <FutureProjections currentPesos={pesos} />
        </section>

        {/* Row 4: Brazilian Error + Sector Analysis (2 Columns) */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <BrazilianErrorPanel data={latestData} />
          <SectorAnalysis />
        </section>

        {/* Row 5: Economic Summary (FASE 3) */}
        <section>
          <EconomicDashboard />
        </section>

        {/* Row 6: Cenários (FASE 3) */}
        <section>
          <ScenariosPanel />
        </section>

        {/* Row 7: Políticas (FASE 4) */}
        <section>
          <PolicyRecommendations />
        </section>

        {/* Row 8: Tech Dependency Panel - Full Width */}
        <section className="w-full">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="bg-linear-to-r from-destructive/10 to-orange-500/10 px-6 py-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span className="text-2xl">🔌</span>
                Dependência Tecnológica - A Armadilha da Soberania
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Análise de vulnerabilidade em semicondutores, fertilizantes e riscos geopolíticos
              </p>
            </div>
            <div className="p-6">
              <TechDependencyPanel />
            </div>
          </div>
        </section>

        {/* Footer Disclaimer */}
        <footer className="text-center text-muted-foreground text-sm py-6 border-t border-border mt-4">
          <p className="mb-2">
            Todos os dados sao publicos e oficiais (IBGE, BCB, MDIC, ANP, WSTS, CHIPS Act, Lei 14.968/2024).
          </p>
          <p className="mb-2">
            As simulacoes sao exercicios teoricos para fins educacionais.
          </p>
          <p>
            Criado por <span className="text-primary">Arildo Stepenovski</span> | Objetivo: Educacao economica e debate sobre soberania nacional
          </p>
        </footer>
      </div>
    </main>
  )
}
