"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Sparkles, 
  Flame, 
  Factory, 
  ShieldAlert, 
  Banknote,
  TrendingDown,
  RotateCcw,
  Target,
  Zap
} from "lucide-react"
import { fundamentosEconomicos } from "@/lib/brasil-data"
import { useExchangeRate } from "@/hooks/use-exchange-rate"

interface CenarioParams {
  inflacao: number
  produtividade: number
  risco: number
  industria: number
  divida: number
}

export function ScenarioSimulator() {
  const br = fundamentosEconomicos.brasil
  const bm = fundamentosEconomicos.benchmark
  
  // Câmbio em tempo real
  const { data: liveData } = useExchangeRate(['USD-BRL'])
  const cambioMercado = liveData?.USDBRL 
    ? parseFloat(liveData.USDBRL.bid) 
    : 5.70

  // Estado do cenário
  const [cenario, setCenario] = useState<CenarioParams>({
    inflacao: br.inflacaoAnual,
    produtividade: br.produtividadePPP,
    risco: br.riscoPaisBps,
    industria: br.exportIndustrializada,
    divida: br.dividaPIB
  })

  // Calcular câmbio baseado no cenário
  const resultado = useMemo(() => {
    const cambioPPP = 2.65
    
    // Fator inflação
    const diferencialInflacao = cenario.inflacao - bm.inflacaoAnual
    const fatorInflacao = 1 + (diferencialInflacao * 0.02)
    
    // Fator produtividade
    const ratioProdutividade = cenario.produtividade / bm.produtividadePPP
    const fatorProdutividade = 1 / ratioProdutividade
    
    // Fator risco
    const spreadRisco = (cenario.risco - bm.riscoPaisBps) / 100
    const fatorRisco = 1 + (spreadRisco * 0.05)
    
    // Fator estrutural
    const gapIndustrializacao = (bm.exportIndustrializada - cenario.industria) / 100
    const fatorEstrutura = 1 + (gapIndustrializacao * 0.15)
    
    // Fator fiscal
    const excessoDivida = Math.max(0, cenario.divida - bm.dividaPIB) / 100
    const fatorFiscal = 1 + (excessoDivida * 0.10)
    
    const cambioSimulado = cambioPPP * fatorInflacao * fatorProdutividade * fatorRisco * fatorEstrutura * fatorFiscal
    const ganhoPoder = ((cambioMercado - cambioSimulado) / cambioMercado * 100)
    
    return {
      cambio: Math.max(cambioSimulado, 2.00),
      ganhoPoder: Math.max(0, ganhoPoder),
      fatores: {
        inflacao: fatorInflacao,
        produtividade: fatorProdutividade,
        risco: fatorRisco,
        estrutura: fatorEstrutura,
        fiscal: fatorFiscal
      }
    }
  }, [cenario, cambioMercado, bm])

  // Resetar para valores atuais
  const resetarCenario = () => {
    setCenario({
      inflacao: br.inflacaoAnual,
      produtividade: br.produtividadePPP,
      risco: br.riscoPaisBps,
      industria: br.exportIndustrializada,
      divida: br.dividaPIB
    })
  }

  // Aplicar cenário benchmark
  const aplicarBenchmark = () => {
    setCenario({
      inflacao: bm.inflacaoAnual,
      produtividade: bm.produtividadePPP,
      risco: bm.riscoPaisBps,
      industria: bm.exportIndustrializada,
      divida: bm.dividaPIB
    })
  }

  // Cenário intermediário
  const aplicarIntermediario = () => {
    setCenario({
      inflacao: (br.inflacaoAnual + bm.inflacaoAnual) / 2,
      produtividade: (br.produtividadePPP + bm.produtividadePPP) / 2,
      risco: (br.riscoPaisBps + bm.riscoPaisBps) / 2,
      industria: (br.exportIndustrializada + bm.exportIndustrializada) / 2,
      divida: (br.dividaPIB + bm.dividaPIB) / 2
    })
  }

  const sliders = [
    {
      id: "inflacao",
      nome: "Inflação Anual",
      icone: <Flame className="w-4 h-4" />,
      valor: cenario.inflacao,
      min: 1,
      max: 10,
      step: 0.5,
      unidade: "%",
      onChange: (v: number) => setCenario(c => ({ ...c, inflacao: v })),
      cor: "text-red-500",
      descricao: `Atual: ${br.inflacaoAnual}% | Meta: ${bm.inflacaoAnual}%`
    },
    {
      id: "produtividade",
      nome: "PIB per Capita PPP",
      icone: <TrendingDown className="w-4 h-4" />,
      valor: cenario.produtividade,
      min: 20000,
      max: 70000,
      step: 1000,
      unidade: " USD",
      formatador: (v: number) => `$${(v/1000).toFixed(0)}k`,
      onChange: (v: number) => setCenario(c => ({ ...c, produtividade: v })),
      cor: "text-orange-500",
      descricao: `Atual: $${(br.produtividadePPP/1000).toFixed(0)}k | Meta: $${(bm.produtividadePPP/1000).toFixed(0)}k`
    },
    {
      id: "risco",
      nome: "Risco País (EMBI+)",
      icone: <ShieldAlert className="w-4 h-4" />,
      valor: cenario.risco,
      min: 30,
      max: 400,
      step: 10,
      unidade: " bps",
      onChange: (v: number) => setCenario(c => ({ ...c, risco: v })),
      cor: "text-yellow-500",
      descricao: `Atual: ${br.riscoPaisBps} bps | Meta: ${bm.riscoPaisBps} bps`
    },
    {
      id: "industria",
      nome: "Exportação Industrializada",
      icone: <Factory className="w-4 h-4" />,
      valor: cenario.industria,
      min: 10,
      max: 80,
      step: 5,
      unidade: "%",
      onChange: (v: number) => setCenario(c => ({ ...c, industria: v })),
      cor: "text-purple-500",
      descricao: `Atual: ${br.exportIndustrializada}% | Meta: ${bm.exportIndustrializada}%`
    },
    {
      id: "divida",
      nome: "Dívida Pública / PIB",
      icone: <Banknote className="w-4 h-4" />,
      valor: cenario.divida,
      min: 40,
      max: 120,
      step: 2,
      unidade: "%",
      onChange: (v: number) => setCenario(c => ({ ...c, divida: v })),
      cor: "text-blue-500",
      descricao: `Atual: ${br.dividaPIB}% | Meta: ${bm.dividaPIB}%`
    }
  ]

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">
                E Se Corrigíssemos?
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Simule cenários movendo os controles abaixo
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetarCenario}
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Atual
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={aplicarIntermediario}
              className="text-xs"
            >
              <Target className="w-3 h-3 mr-1" />
              Meio-termo
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={aplicarBenchmark}
              className="text-xs"
            >
              <Zap className="w-3 h-3 mr-1" />
              Benchmark
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Sliders */}
        <div className="space-y-4">
          {sliders.map((slider) => (
            <div key={slider.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={slider.cor}>{slider.icone}</span>
                  <span className="text-sm font-medium">{slider.nome}</span>
                </div>
                <Badge variant="secondary" className="font-mono">
                  {slider.formatador 
                    ? slider.formatador(slider.valor)
                    : `${slider.valor}${slider.unidade}`
                  }
                </Badge>
              </div>
              <Slider
                value={[slider.valor]}
                onValueChange={(v) => slider.onChange(v[0])}
                min={slider.min}
                max={slider.max}
                step={slider.step}
                className="py-2"
              />
              <p className="text-[10px] text-muted-foreground">{slider.descricao}</p>
            </div>
          ))}
        </div>

        {/* Resultado */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-green-500/10 border border-primary/20">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              Se o Brasil tivesse esses fundamentos:
            </p>
            <div className="flex items-center justify-center gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Mercado Hoje</p>
                <p className="text-2xl font-bold text-destructive">R$ {cambioMercado.toFixed(2)}</p>
              </div>
              <div className="text-3xl text-muted-foreground">→</div>
              <div>
                <p className="text-xs text-muted-foreground">Cenário Simulado</p>
                <p className="text-4xl font-bold text-primary">R$ {resultado.cambio.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Ganho de Poder de Compra</p>
              <p className="text-2xl font-bold text-green-500">
                +{resultado.ganhoPoder.toFixed(0)}%
              </p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Economia por US$ 1.000</p>
              <p className="text-2xl font-bold text-green-500">
                R$ {((cambioMercado - resultado.cambio) * 1000).toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        {/* Explicação */}
        <p className="text-[10px] text-muted-foreground text-center">
          Modelo BEER (Behavioral Equilibrium Exchange Rate) - Câmbio calculado com base em fundamentos macroeconômicos reais
        </p>
      </CardContent>
    </Card>
  )
}
