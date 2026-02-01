"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingDown, 
  Flame, 
  Factory, 
  ShieldAlert, 
  Banknote,
  AlertTriangle,
  ArrowRight
} from "lucide-react"
import { fundamentosEconomicos, calcularCambioFundamental, historicalData } from "@/lib/brasil-data"
import { useExchangeRate } from "@/hooks/use-exchange-rate"

interface DiagnosticFactor {
  id: string
  nome: string
  icone: React.ReactNode
  valorBrasil: string
  valorBenchmark: string
  diferenca: string
  impactoCambio: string
  cor: string
  progresso: number
}

export function DiagnosticPanel() {
  const br = fundamentosEconomicos.brasil
  const bm = fundamentosEconomicos.benchmark
  
  // Dados atuais
  const dados2024 = historicalData[historicalData.length - 1]
  const resultado = calcularCambioFundamental(dados2024)
  
  // Câmbio em tempo real
  const { data: liveData } = useExchangeRate(['USD-BRL'])
  const cambioMercado = liveData?.USDBRL 
    ? parseFloat(liveData.USDBRL.bid) 
    : dados2024.cambioReal

  // Calcular fatores de diagnóstico
  const fatores: DiagnosticFactor[] = [
    {
      id: "inflacao",
      nome: "Inflação",
      icone: <Flame className="w-5 h-5" />,
      valorBrasil: `${br.inflacaoAnual}%`,
      valorBenchmark: `${bm.inflacaoAnual}%`,
      diferenca: `${(br.inflacaoAnual / bm.inflacaoAnual).toFixed(1)}x maior`,
      impactoCambio: `+${((resultado.fatores.inflacao - 1) * 100).toFixed(1)}%`,
      cor: "text-red-500",
      progresso: Math.min(100, (br.inflacaoAnual / bm.inflacaoAnual) * 50)
    },
    {
      id: "produtividade",
      nome: "Produtividade",
      icone: <TrendingDown className="w-5 h-5" />,
      valorBrasil: `$${(br.produtividadePPP / 1000).toFixed(0)}k PPP`,
      valorBenchmark: `$${(bm.produtividadePPP / 1000).toFixed(0)}k PPP`,
      diferenca: `${((1 - br.produtividadePPP / bm.produtividadePPP) * 100).toFixed(0)}% menor`,
      impactoCambio: `+${((resultado.fatores.produtividade - 1) * 100).toFixed(0)}%`,
      cor: "text-orange-500",
      progresso: Math.min(100, ((bm.produtividadePPP - br.produtividadePPP) / bm.produtividadePPP) * 100)
    },
    {
      id: "risco",
      nome: "Risco País",
      icone: <ShieldAlert className="w-5 h-5" />,
      valorBrasil: `${br.riscoPaisBps} bps`,
      valorBenchmark: `${bm.riscoPaisBps} bps`,
      diferenca: `${(br.riscoPaisBps / bm.riscoPaisBps).toFixed(1)}x maior`,
      impactoCambio: `+${((resultado.fatores.risco - 1) * 100).toFixed(1)}%`,
      cor: "text-yellow-500",
      progresso: Math.min(100, (br.riscoPaisBps / bm.riscoPaisBps) * 33)
    },
    {
      id: "industria",
      nome: "Industrialização",
      icone: <Factory className="w-5 h-5" />,
      valorBrasil: `${br.exportIndustrializada}% exp.`,
      valorBenchmark: `${bm.exportIndustrializada}% exp.`,
      diferenca: `${(bm.exportIndustrializada / br.exportIndustrializada).toFixed(1)}x menor`,
      impactoCambio: `+${((resultado.fatores.estrutura - 1) * 100).toFixed(1)}%`,
      cor: "text-purple-500",
      progresso: Math.min(100, ((bm.exportIndustrializada - br.exportIndustrializada) / bm.exportIndustrializada) * 100)
    },
    {
      id: "divida",
      nome: "Dívida Pública",
      icone: <Banknote className="w-5 h-5" />,
      valorBrasil: `${br.dividaPIB}% PIB`,
      valorBenchmark: `${bm.dividaPIB}% PIB`,
      diferenca: `${((br.dividaPIB / bm.dividaPIB - 1) * 100).toFixed(0)}% maior`,
      impactoCambio: `+${((resultado.fatores.fiscal - 1) * 100).toFixed(1)}%`,
      cor: "text-blue-500",
      progresso: Math.min(100, ((br.dividaPIB - bm.dividaPIB) / bm.dividaPIB) * 100)
    }
  ]

  // Somar todos os impactos
  const impactoTotal = Object.values(resultado.fatores)
    .filter((_, i) => i < 5) // Exclui fatorCesta
    .reduce((acc, f) => acc * f, 1)
  
  const desvalorizacaoTotal = ((impactoTotal - 1) * 100).toFixed(0)

  return (
    <Card className="border-destructive/30 bg-gradient-to-br from-destructive/5 to-background">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">
                Por Que o Real é Fraco?
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Diagnóstico dos 5 fatores que depreciam a moeda brasileira
              </p>
            </div>
          </div>
          <Badge variant="destructive" className="text-lg px-3 py-1">
            +{desvalorizacaoTotal}% depreciação
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Fatores */}
        <div className="space-y-3">
          {fatores.map((fator) => (
            <div 
              key={fator.id}
              className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={fator.cor}>{fator.icone}</span>
                  <span className="font-semibold">{fator.nome}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${fator.cor} border-current`}
                >
                  {fator.impactoCambio} no câmbio
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                <div>
                  <p className="text-muted-foreground text-xs">Brasil</p>
                  <p className="font-medium text-destructive">{fator.valorBrasil}</p>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Benchmark</p>
                  <p className="font-medium text-primary">{fator.valorBenchmark}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Progress value={fator.progresso} className="h-2 flex-1" />
                <span className="text-xs text-muted-foreground w-20 text-right">
                  {fator.diferenca}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-destructive/10 to-orange-500/10 border border-destructive/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Se tivéssemos fundamentos de país desenvolvido:</p>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Hoje</p>
                  <p className="text-2xl font-bold text-destructive">R$ {cambioMercado.toFixed(2)}</p>
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Fundamentos</p>
                  <p className="text-2xl font-bold text-primary">R$ {resultado.cambioFundamental.toFixed(2)}</p>
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Potencial</p>
                  <p className="text-2xl font-bold text-green-500">R$ {resultado.cambioPotencial.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Desalinhamento do mercado:</p>
              <p className="text-3xl font-bold text-destructive">
                +{resultado.desalinhamento.toFixed(0)}%
              </p>
              <p className="text-xs text-muted-foreground">acima do fundamental</p>
            </div>
          </div>
        </div>

        {/* Fontes */}
        <p className="text-[10px] text-muted-foreground text-center">
          Fontes: BCB (IPCA, Reservas), IBGE (PIB), FMI (PPP), JPMorgan (EMBI+), MDIC (Exportações), Tesouro Nacional (Dívida)
        </p>
      </CardContent>
    </Card>
  )
}
