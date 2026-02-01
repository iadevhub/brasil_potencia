"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Smartphone, 
  Pill, 
  Cpu, 
  Plane,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Calculator
} from "lucide-react"
import { fundamentosEconomicos, calcularCambioFundamental, historicalData } from "@/lib/brasil-data"
import { useExchangeRate } from "@/hooks/use-exchange-rate"

interface CustoItem {
  nome: string
  icone: React.ReactNode
  precoUSD: number
  categoria: string
}

export function WeakCurrencyCost() {
  // Dados
  const dados2024 = historicalData[historicalData.length - 1]
  const resultado = calcularCambioFundamental(dados2024)
  
  // Câmbio em tempo real
  const { data: liveData } = useExchangeRate(['USD-BRL'])
  const cambioMercado = liveData?.USDBRL 
    ? parseFloat(liveData.USDBRL.bid) 
    : dados2024.cambioReal

  // Câmbio benchmark (se tivéssemos fundamentos de país desenvolvido)
  const cambioBenchmark = 3.15 // Calculado com fundamentos benchmark

  // Itens para comparar
  const itens: CustoItem[] = [
    { nome: "iPhone 16 Pro", icone: <Smartphone className="w-5 h-5" />, precoUSD: 1199, categoria: "Tecnologia" },
    { nome: "MacBook Pro M4", icone: <Cpu className="w-5 h-5" />, precoUSD: 1999, categoria: "Tecnologia" },
    { nome: "Remédio Importado (30 dias)", icone: <Pill className="w-5 h-5" />, precoUSD: 150, categoria: "Saúde" },
    { nome: "Passagem NY (ida/volta)", icone: <Plane className="w-5 h-5" />, precoUSD: 800, categoria: "Viagem" },
  ]

  // Cálculos macro
  const importacaoTecnologia2024 = 50 // bilhões USD (estimativa)
  const diferencaCambio = cambioMercado - cambioBenchmark
  const custoExtraTecnologia = importacaoTecnologia2024 * diferencaCambio

  // Dívida externa - custo extra
  const dividaExternaBRL = 200 // bilhões USD
  const custoExtraDivida = dividaExternaBRL * diferencaCambio / 1000 // em bilhões BRL

  // Juros pagos a mais (Selic alta para defender câmbio)
  const taxaJurosExtra = 5 // pontos percentuais acima do necessário
  const dividaPublicaBRL = fundamentosEconomicos.brasil.dividaPIB * 22 // PIB ~22 trilhões BRL
  const custoJurosExtra = (dividaPublicaBRL * taxaJurosExtra) / 100

  return (
    <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-background">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Calculator className="w-6 h-6 text-accent" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">
                Quanto Custa a Moeda Fraca?
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                O brasileiro paga mais caro por tudo que vem de fora
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-accent border-accent">
            +R$ {diferencaCambio.toFixed(2)} por dólar
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Comparação de preços */}
        <div className="space-y-3">
          {itens.map((item) => {
            const precoAtual = item.precoUSD * cambioMercado
            const precoPotencial = item.precoUSD * cambioBenchmark
            const economia = precoAtual - precoPotencial
            const percentual = ((economia / precoAtual) * 100).toFixed(0)

            return (
              <div 
                key={item.nome}
                className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-primary">{item.icone}</span>
                    <div>
                      <span className="font-medium">{item.nome}</span>
                      <p className="text-xs text-muted-foreground">US$ {item.precoUSD.toLocaleString()}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {item.categoria}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center p-2 bg-destructive/10 rounded">
                    <p className="text-[10px] text-muted-foreground">Hoje</p>
                    <p className="font-bold text-destructive">
                      R$ {precoAtual.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-primary/10 rounded">
                    <p className="text-[10px] text-muted-foreground">Potencial</p>
                    <p className="font-bold text-primary">
                      R$ {precoPotencial.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-green-500/10 rounded">
                    <p className="text-[10px] text-muted-foreground">Economia</p>
                    <p className="font-bold text-green-500">
                      R$ {economia.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-[9px] text-muted-foreground">(-{percentual}%)</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Impacto macro */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-destructive/10 to-accent/10 border border-destructive/20">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            Impacto Macroeconômico Anual
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <Cpu className="w-5 h-5 text-destructive mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Custo Extra Importação Tech</p>
              <p className="text-xl font-bold text-destructive">
                R$ {custoExtraTecnologia.toFixed(0)} bi
              </p>
              <p className="text-[9px] text-muted-foreground">
                Base: US$ {importacaoTecnologia2024} bi/ano
              </p>
            </div>
            
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <DollarSign className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Custo Extra Dívida Externa</p>
              <p className="text-xl font-bold text-orange-500">
                R$ {(custoExtraDivida * 1000).toFixed(0)} bi
              </p>
              <p className="text-[9px] text-muted-foreground">
                Base: US$ {dividaExternaBRL} bi dívida
              </p>
            </div>
            
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Juros Extras (Selic Alta)</p>
              <p className="text-xl font-bold text-yellow-500">
                R$ {(custoJurosExtra / 1000).toFixed(0)} tri
              </p>
              <p className="text-[9px] text-muted-foreground">
                {taxaJurosExtra}pp acima do benchmark
              </p>
            </div>
          </div>
        </div>

        {/* Mensagem final */}
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 text-center">
          <p className="text-sm text-muted-foreground mb-1">
            Se o Real tivesse força de moeda de país industrializado:
          </p>
          <p className="text-lg font-semibold text-foreground">
            O brasileiro teria <span className="text-green-500">+{((cambioMercado / cambioBenchmark - 1) * 100).toFixed(0)}%</span> de poder de compra internacional
          </p>
        </div>

        {/* Fontes */}
        <p className="text-[10px] text-muted-foreground text-center">
          Cálculos baseados em câmbio benchmark R$ {cambioBenchmark.toFixed(2)} vs mercado R$ {cambioMercado.toFixed(2)} | Fontes: BCB, MDIC, Tesouro Nacional
        </p>
      </CardContent>
    </Card>
  )
}
