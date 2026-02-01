"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  techDependencyData, 
  globalInvestmentsData,
  type TechDependencyData,
  type GlobalInvestmentData 
} from "@/lib/brasil-data"
import { AlertTriangle, Cpu, Leaf, TrendingUp, Globe, DollarSign } from "lucide-react"

function getRiskBadge(nivel: string) {
  const colors: Record<string, string> = {
    'crítico': 'destructive',
    'alto': 'default',
    'médio': 'secondary',
    'baixo': 'outline'
  }
  return <Badge variant={colors[nivel] as any || 'default'}>{nivel.toUpperCase()}</Badge>
}

function CategoryIcon({ categoria }: { categoria: string }) {
  switch (categoria) {
    case 'semicondutores': return <Cpu className="w-5 h-5" />
    case 'fertilizantes': return <Leaf className="w-5 h-5" />
    default: return <Globe className="w-5 h-5" />
  }
}

function DependencyCard({ data }: { data: TechDependencyData }) {
  return (
    <Card className={`border-l-4 ${data.nivelRisco === 'crítico' ? 'border-l-red-500' : 'border-l-orange-500'}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CategoryIcon categoria={data.categoria} />
            <CardTitle className="text-base capitalize">{data.categoria}</CardTitle>
          </div>
          {getRiskBadge(data.nivelRisco)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dependência de Importação */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Dependência de Importação</span>
            <span className="font-bold text-red-500">{data.importPercentual}%</span>
          </div>
          <Progress value={data.importPercentual} className="h-2" />
        </div>

        {/* Valores */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground block">Importação</span>
            <span className="font-bold text-lg">US$ {data.importValue} bi</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Produção Nacional</span>
            <span className="font-bold text-lg">US$ {data.producaoNacional} bi</span>
          </div>
        </div>

        {/* Principais Supridores */}
        <div>
          <span className="text-sm text-muted-foreground block mb-2">Principais Supridores</span>
          <div className="flex flex-wrap gap-1">
            {data.principaisSupridores.slice(0, 4).map((s) => (
              <Badge key={s.pais} variant="outline" className="text-xs">
                {s.pais} ({s.percentual}%)
              </Badge>
            ))}
          </div>
        </div>

        {/* Métricas */}
        {data.metricas && (
          <div className="border-t pt-3 mt-3">
            <span className="text-sm text-muted-foreground block mb-2">Métricas Chave</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(data.metricas).slice(0, 4).map(([key, value]) => (
                <div key={key} className="bg-muted/50 p-2 rounded">
                  <span className="text-muted-foreground block">{key}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projeção */}
        {data.projecao2033 && (
          <div className="flex items-center gap-2 text-sm bg-green-500/10 p-2 rounded">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>Meta 2033: {data.projecao2033}% produção nacional</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function InvestmentComparison() {
  const chipsData = globalInvestmentsData.filter(d => d.tipo === 'chips')
  const maxInvestment = Math.max(...chipsData.map(d => d.investimentoUSD))
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-500" />
          Investimentos Globais em Semicondutores
        </CardTitle>
        <CardDescription>Comparação de investimentos anunciados (US$ bilhões)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {chipsData.map((item) => {
          const width = (item.investimentoUSD / maxInvestment) * 100
          const isBrazil = item.pais === 'Brasil'
          
          return (
            <div key={item.pais} className={`${isBrazil ? 'bg-yellow-500/10 p-2 rounded border border-yellow-500/30' : ''}`}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.bandeira}</span>
                  <span className={`text-sm ${isBrazil ? 'font-bold text-yellow-600' : ''}`}>{item.pais}</span>
                </div>
                <span className={`font-bold ${isBrazil ? 'text-yellow-600' : ''}`}>
                  US$ {item.investimentoUSD} bi
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${isBrazil ? 'bg-yellow-500' : 'bg-primary'}`}
                  style={{ width: `${width}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{item.periodo}</span>
            </div>
          )
        })}
        
        <div className="bg-red-500/10 p-3 rounded-lg mt-4 border border-red-500/30">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="font-semibold text-red-600">Alerta de Soberania</p>
              <p className="text-sm text-muted-foreground">
                O Brasil investe <strong>280x menos</strong> que a China em semicondutores. 
                Isso significa dependência crítica em eletrônicos, defesa, saúde e agricultura de precisão.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RiskMatrix() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Matriz de Risco Geopolítico
        </CardTitle>
        <CardDescription>Vulnerabilidades por concentração de fornecedores</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Semicondutores */}
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold flex items-center gap-2">
                <Cpu className="w-4 h-4" /> Semicondutores
              </span>
              <Badge variant="destructive">RISCO CRÍTICO</Badge>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 80% vem de Taiwan, China e Coreia do Sul (tensões geopolíticas)</li>
              <li>• Sanções EUA-China podem interromper fornecimento</li>
              <li>• Brasil não tem fábricas de chips avançados</li>
            </ul>
          </div>

          {/* Fertilizantes */}
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold flex items-center gap-2">
                <Leaf className="w-4 h-4" /> Fertilizantes
              </span>
              <Badge variant="destructive">RISCO CRÍTICO</Badge>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 97% do potássio e 77% do nitrogênio são importados</li>
              <li>• Interrupção = queda de 30-50% na produção agrícola</li>
              <li>• Agronegócio = 25% do PIB brasileiro</li>
            </ul>
          </div>

          {/* Resumo */}
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-sm">
              <strong>Conclusão:</strong> O Brasil está em posição de extrema vulnerabilidade. 
              A falta de investimento em industrialização básica compromete a soberania nacional, 
              a segurança alimentar e a capacidade de defesa.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function TechDependencyPanel() {
  return (
    <div className="w-full space-y-6">
      {/* Resumo de Alerta */}
      <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 p-4 rounded-lg border border-red-500/30">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
          <div>
            <h3 className="font-bold text-lg text-red-600">Dependência Tecnológica Crítica</h3>
            <p className="text-sm text-muted-foreground mt-1">
              O Brasil importa <strong>92% dos semicondutores</strong> e <strong>85% dos fertilizantes</strong>. 
              Qualquer interrupção no fornecimento global pode paralisar a economia brasileira.
            </p>
          </div>
        </div>
      </div>

      {/* Cards de Dependência */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {techDependencyData.map((dep) => (
          <DependencyCard key={dep.id} data={dep} />
        ))}
      </div>

      {/* Comparação de Investimentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InvestmentComparison />
        <RiskMatrix />
      </div>

      {/* Fontes */}
      <div className="text-xs text-muted-foreground text-center pt-4 border-t">
        Fontes: WSTS, CHIPS Act (EUA), European Chips Act, Lei 14.968/2024 (Brasil), ANDA, MDIC
      </div>
    </div>
  )
}
