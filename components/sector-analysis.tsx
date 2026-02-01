"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { 
  Package, 
  Factory, 
  TrendingUp, 
  TrendingDown, 
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Globe,
  Target,
  Shield,
  AlertTriangle
} from "lucide-react"
import { 
  brazilSectorData, 
  countrySectorProfiles,
  calcularPerdaSetorial,
  getSetoresPorPerda,
  type SectorData,
  type CountrySectorProfile
} from "@/lib/brasil-data"

type FilterType = 'all' | 'materiaPrima' | 'industrializado'
type ViewType = 'export' | 'import'

const chartConfig = {
  valor: {
    label: "Valor",
    color: "#22c55e",
  },
  perda: {
    label: "Perda Potencial",
    color: "#ef4444",
  },
}

function SectorCard({ sector, showLoss }: { sector: SectorData; showLoss: boolean }) {
  const perda = calcularPerdaSetorial(sector)
  const isMateriaPrima = sector.categoria === 'materiaPrima'
  
  return (
    <div className="p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{sector.nome}</span>
            <Badge 
              variant={isMateriaPrima ? "destructive" : "default"}
              className="text-[10px] px-1.5 py-0"
            >
              {isMateriaPrima ? 'MP' : 'IND'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {sector.percentualTotal.toFixed(1)}% do total
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-foreground">US$ {sector.valorBilhoes.toFixed(1)} bi</p>
          <div className={`flex items-center gap-0.5 text-xs ${sector.crescimentoAnual >= 0 ? 'text-primary' : 'text-destructive'}`}>
            {sector.crescimentoAnual >= 0 ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            <span>{Math.abs(sector.crescimentoAnual).toFixed(1)}%</span>
          </div>
        </div>
      </div>
      
      {showLoss && perda > 0 && (
        <div className="mt-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Potencial de agregacao:</span>
            <span className="text-xs font-medium text-accent">{sector.potencialAgregacao}x</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted-foreground">Perda estimada:</span>
            <span className="text-xs font-bold text-destructive">US$ {perda.toFixed(1)} bi</span>
          </div>
        </div>
      )}
      
      <div className="mt-2 flex flex-wrap gap-1">
        {sector.principaisParceiros.slice(0, 3).map((parceiro, i) => (
          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            {parceiro}
          </span>
        ))}
      </div>
    </div>
  )
}

function CountryStrengthCard({ profile }: { profile: CountrySectorProfile }) {
  const country = {
    brasil: { nome: 'Brasil', bandeira: '' },
    argentina: { nome: 'Argentina', bandeira: '' },
    mexico: { nome: 'Mexico', bandeira: '' },
    coreia: { nome: 'Coreia do Sul', bandeira: '' }
  }[profile.countryId] || { nome: profile.countryId, bandeira: '' }

  const exportIndustrializado = profile.topExportSectors
    .filter(s => s.categoria === 'industrializado')
    .reduce((sum, s) => sum + s.percentual, 0)

  return (
    <div className="p-4 rounded-lg bg-secondary/30">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{country.bandeira}</span>
        <span className="font-medium text-foreground">{country.nome}</span>
        <Badge variant={exportIndustrializado > 30 ? "default" : "destructive"} className="text-[10px] ml-auto">
          {exportIndustrializado.toFixed(0)}% ind.
        </Badge>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium text-primary mb-1.5 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Fortalezas
          </p>
          <div className="flex flex-wrap gap-1">
            {profile.fortalezas.map((f, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                {f}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <p className="text-xs font-medium text-destructive mb-1.5 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Fraquezas
          </p>
          <div className="flex flex-wrap gap-1">
            {profile.fraquezas.map((f, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/20 text-destructive">
                {f}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">Top Exportacoes</p>
          <div className="space-y-1">
            {profile.topExportSectors.slice(0, 4).map((sector, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ backgroundColor: sector.categoria === 'industrializado' ? '#22c55e' : '#ef4444' }}
                  />
                  <span className="text-muted-foreground truncate max-w-[120px]">{sector.nome}</span>
                </div>
                <span className="text-foreground font-medium">{sector.percentual.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SectorAnalysis() {
  const [viewType, setViewType] = useState<ViewType>('export')
  const [filter, setFilter] = useState<FilterType>('all')
  const [selectedCountry, setSelectedCountry] = useState<string>('all')

  const filteredSectors = useMemo(() => {
    return brazilSectorData
      .filter(s => s.tipo === viewType)
      .filter(s => filter === 'all' || s.categoria === filter)
      .sort((a, b) => b.valorBilhoes - a.valorBilhoes)
  }, [viewType, filter])

  const lossRanking = useMemo(() => {
    return getSetoresPorPerda().slice(0, 8)
  }, [])

  const chartData = useMemo(() => {
    return lossRanking.map(s => ({
      nome: s.nome.length > 12 ? s.nome.substring(0, 12) + '...' : s.nome,
      nomeCompleto: s.nome,
      valor: s.valorBilhoes,
      perda: calcularPerdaSetorial(s)
    }))
  }, [lossRanking])

  const totalPerda = useMemo(() => {
    return lossRanking.reduce((sum, s) => sum + calcularPerdaSetorial(s), 0)
  }, [lossRanking])

  const categoryData = useMemo(() => {
    const mp = filteredSectors.filter(s => s.categoria === 'materiaPrima')
    const ind = filteredSectors.filter(s => s.categoria === 'industrializado')
    return [
      { name: 'Materia-prima', value: mp.reduce((sum, s) => sum + s.valorBilhoes, 0), fill: '#ef4444' },
      { name: 'Industrializado', value: ind.reduce((sum, s) => sum + s.valorBilhoes, 0), fill: '#22c55e' }
    ]
  }, [filteredSectors])

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          Analise Setorial Detalhada
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Sub-setores de exportacao e importacao com potencial de agregacao de valor
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Loss Ranking Chart */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground flex items-center gap-2">
              <Target className="w-4 h-4 text-destructive" />
              Maiores Contribuintes para Perda Brasil
            </p>
            <Badge variant="destructive" className="text-xs">
              Total: US$ {totalPerda.toFixed(0)} bi
            </Badge>
          </div>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis 
                  type="number" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}bi`}
                />
                <YAxis 
                  type="category" 
                  dataKey="nome" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, props) => (
                        <div className="text-xs">
                          <p className="font-medium">{props.payload?.nomeCompleto}</p>
                          <p>Valor: US$ {props.payload?.valor.toFixed(1)} bi</p>
                          <p className="text-destructive">Perda: US$ {props.payload?.perda.toFixed(1)} bi</p>
                        </div>
                      )}
                    />
                  }
                />
                <Bar dataKey="valor" fill="#3b82f6" radius={[0, 0, 0, 0]} name="Valor Exportado" />
                <Bar dataKey="perda" fill="#ef4444" radius={[0, 4, 4, 0]} name="Perda Potencial" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-[#3b82f6]" />
              <span className="text-muted-foreground">Valor Exportado</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-[#ef4444]" />
              <span className="text-muted-foreground">Perda Potencial</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Tabs value={viewType} onValueChange={(v) => setViewType(v as ViewType)} className="flex-shrink-0">
            <TabsList className="h-8">
              <TabsTrigger value="export" className="text-xs h-7 px-3">
                <Package className="w-3 h-3 mr-1" />
                Exportacoes
              </TabsTrigger>
              <TabsTrigger value="import" className="text-xs h-7 px-3">
                <Factory className="w-3 h-3 mr-1" />
                Importacoes
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-1 ml-auto">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('all')}
              className="text-xs h-7 px-2"
            >
              Todos
            </Button>
            <Button 
              variant={filter === 'materiaPrima' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('materiaPrima')}
              className="text-xs h-7 px-2"
            >
              MP
            </Button>
            <Button 
              variant={filter === 'industrializado' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('industrializado')}
              className="text-xs h-7 px-2"
            >
              Ind
            </Button>
          </div>
        </div>

        {/* Category Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <ChartContainer config={chartConfig} className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent 
                        formatter={(value) => `US$ ${Number(value).toFixed(1)} bi`}
                      />
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="text-center space-y-1">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center justify-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.fill }} />
                  <span className="text-muted-foreground">{cat.name}:</span>
                  <span className="font-medium text-foreground">US$ {cat.value.toFixed(1)} bi</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-secondary/30">
            <p className="text-xs font-medium text-foreground mb-2">Resumo {viewType === 'export' ? 'Exportacoes' : 'Importacoes'}</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total setores:</span>
                <span className="font-medium text-foreground">{filteredSectors.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor total:</span>
                <span className="font-medium text-foreground">
                  US$ {filteredSectors.reduce((sum, s) => sum + s.valorBilhoes, 0).toFixed(1)} bi
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">% Materia-prima:</span>
                <span className="font-medium text-destructive">
                  {((categoryData[0].value / (categoryData[0].value + categoryData[1].value)) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sector List */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Detalhamento por Setor</p>
          <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2">
            {filteredSectors.slice(0, 10).map(sector => (
              <SectorCard key={sector.id} sector={sector} showLoss={viewType === 'export'} />
            ))}
          </div>
        </div>

        {/* Country Comparison */}
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium text-foreground">Perfil Setorial por Pais</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {countrySectorProfiles.map(profile => (
              <CountryStrengthCard key={profile.countryId} profile={profile} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
