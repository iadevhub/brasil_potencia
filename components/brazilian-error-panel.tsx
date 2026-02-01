"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AlertTriangle, ArrowRight, Package, Factory, TrendingUp, TrendingDown, Globe } from "lucide-react"
import { countryComparison, countryDetailData, calcularDesvioPercentual, type CountryDetailData } from "@/lib/brasil-data"

interface BrazilianErrorPanelProps {
  data: {
    exportMateriaPrima: number
    exportIndustrializado: number
    importInsumos: number
    importConsumo: number
    perdaBrasil: number
  }
}

const chartConfig = {
  materiaPrima: {
    label: "Materia-prima",
    color: "#ef4444",
  },
  industrializado: {
    label: "Industrializado",
    color: "#22c55e",
  },
}

const exchangeConfig = {
  cambioReal: {
    label: "Cambio Real",
    color: "#ef4444",
  },
  cambioSimulado: {
    label: "Cambio Simulado",
    color: "#22c55e",
  },
}

function CountryExportPieChart({ country }: { country: CountryDetailData }) {
  const data = [
    { name: "Materia-prima", value: country.exportComposition.materiaPrima, fill: "#ef4444" },
    { name: "Industrializado", value: country.exportComposition.industrializado, fill: "#22c55e" },
  ]

  return (
    <div className="text-center">
      <p className="text-xs font-medium text-muted-foreground mb-1">Exportacoes</p>
      <ChartContainer config={chartConfig} className="h-[100px] w-full">
        <ResponsiveContainer width="100%" height={100}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={20}
              outerRadius={38}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
      <div className="flex flex-col gap-0.5 text-[10px] mt-1">
        <div className="flex items-center justify-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
          <span className="text-muted-foreground">{country.exportComposition.materiaPrima}% MP</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
          <span className="text-muted-foreground">{country.exportComposition.industrializado}% Ind</span>
        </div>
      </div>
    </div>
  )
}

function CountryExchangeChart({ country }: { country: CountryDetailData }) {
  const latestReal = country.historicalExchange[country.historicalExchange.length - 1].cambioReal
  const latestSimulado = country.historicalExchange[country.historicalExchange.length - 1].cambioSimulado
  const desvio = calcularDesvioPercentual(latestReal, latestSimulado)

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-muted-foreground">Evolucao do Cambio ({country.moeda})</p>
        <div className={`flex items-center gap-1 text-xs ${desvio > 0 ? 'text-destructive' : 'text-primary'}`}>
          {desvio > 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
          <span>{desvio > 0 ? '+' : ''}{desvio.toFixed(0)}%</span>
        </div>
      </div>
      <ChartContainer config={exchangeConfig} className="h-[120px] w-full">
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={country.historicalExchange} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradientReal-${country.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id={`gradientSimulado-${country.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="year" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={9}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={9}
              tickLine={false}
              axisLine={false}
              width={35}
              tickFormatter={(v) => country.id === 'coreia' ? `${(v/1000).toFixed(1)}k` : v.toFixed(0)}
            />
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  formatter={(value, name) => (
                    <span>
                      {name === "cambioReal" ? "Real" : "Simulado"}: {Number(value).toLocaleString('pt-BR')}
                    </span>
                  )}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="cambioReal"
              stroke="#ef4444"
              strokeWidth={2}
              fill={`url(#gradientReal-${country.id})`}
            />
            <Area
              type="monotone"
              dataKey="cambioSimulado"
              stroke="#22c55e"
              strokeWidth={2}
              fill={`url(#gradientSimulado-${country.id})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
      <div className="flex justify-center gap-3 mt-1 text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-[#ef4444]" />
          <span className="text-muted-foreground">Real</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-[#22c55e]" />
          <span className="text-muted-foreground">Simulado</span>
        </div>
      </div>
    </div>
  )
}

function CountryProductsList({ title, products, icon: Icon }: { title: string; products: string[]; icon: React.ElementType }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-xs font-medium text-foreground">{title}</p>
      </div>
      <div className="flex flex-wrap gap-1">
        {products.slice(0, 6).map((product, index) => (
          <span 
            key={index}
            className="px-2 py-0.5 text-[10px] rounded-full bg-secondary text-secondary-foreground"
          >
            {product}
          </span>
        ))}
      </div>
    </div>
  )
}

function CountryDetailCard({ country }: { country: CountryDetailData }) {
  const isGain = country.perdaEstimada < 0

  return (
    <div className="space-y-4">
      {/* Header with flag and basic info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{country.bandeira}</span>
          <div>
            <h4 className="font-semibold text-foreground">{country.nome}</h4>
            <p className="text-xs text-muted-foreground">PIB: US$ {country.pibNominal.toFixed(2)} tri</p>
          </div>
        </div>
        <div className={`text-right ${isGain ? 'text-primary' : 'text-destructive'}`}>
          <p className="text-xs text-muted-foreground">
            {isGain ? 'Ganho estimado' : 'Perda estimada'}
          </p>
          <p className="text-lg font-bold">
            US$ {Math.abs(country.perdaEstimada)} bi
          </p>
        </div>
      </div>

      {/* Export composition pie chart */}
      <div className="grid grid-cols-2 gap-4">
        <CountryExportPieChart country={country} />
        <div className="text-center">
          <p className="text-xs font-medium text-muted-foreground mb-1">Importacoes</p>
          <ChartContainer config={chartConfig} className="h-[100px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Materia-prima", value: country.importComposition.materiaPrima, fill: "#22c55e" },
                    { name: "Produto Final", value: country.importComposition.produtoFinal, fill: "#ef4444" },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={38}
                  paddingAngle={2}
                  dataKey="value"
                >
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex flex-col gap-0.5 text-[10px] mt-1">
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
              <span className="text-muted-foreground">{country.importComposition.produtoFinal}% Final</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <span className="text-muted-foreground">{country.importComposition.materiaPrima}% MP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Exchange rate evolution */}
      <CountryExchangeChart country={country} />

      {/* Products lists */}
      <div className="grid grid-cols-1 gap-3">
        <CountryProductsList 
          title="Principais Exportacoes" 
          products={country.principaisExportacoes}
          icon={Package}
        />
        <CountryProductsList 
          title="Principais Importacoes" 
          products={country.principaisImportacoes}
          icon={Factory}
        />
      </div>
    </div>
  )
}

export function BrazilianErrorPanel({ data }: BrazilianErrorPanelProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>("brasil")

  const exportData = [
    { name: "Materia-prima", value: data.exportMateriaPrima, fill: "#ef4444" },
    { name: "Industrializado", value: data.exportIndustrializado, fill: "#22c55e" },
  ]

  const importData = [
    { name: "Insumos (produção)", value: data.importInsumos, fill: "#22c55e" },
    { name: "Consumo Final", value: data.importConsumo, fill: "#ef4444" },
  ]

  const selectedCountryData = countryDetailData.find(c => c.id === selectedCountry)

  return (
    <div className="space-y-4">
      {/* Main Brazilian Error Card */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-accent" />
            Erro Brasileiro - O Problema
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Por que o Brasil deixa dinheiro na mesa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export/Import Comparison */}
          <div className="grid grid-cols-2 gap-4">
            {/* Exports */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">EXPORTAMOS</span>
              </div>
              <ChartContainer config={chartConfig} className="h-[120px] w-full">
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie
                      data={exportData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={45}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {exportData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="flex flex-col gap-1 text-xs mt-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
                  <span className="text-muted-foreground">{data.exportMateriaPrima}% Materia-prima</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
                  <span className="text-muted-foreground">{data.exportIndustrializado}% Industrializado</span>
                </div>
              </div>
            </div>

            {/* Imports */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Factory className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">IMPORTAMOS</span>
              </div>
              <ChartContainer config={chartConfig} className="h-[120px] w-full">
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie
                      data={importData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={45}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {importData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="flex flex-col gap-1 text-xs mt-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
                  <span className="text-muted-foreground">{data.importInsumos}% Insumos (produção)</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
                  <span className="text-muted-foreground">{data.importConsumo}% Consumo Final</span>
                </div>
              </div>
            </div>
          </div>

          {/* The Problem Explanation */}
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-destructive">Materia-prima</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-primary">Produto Final</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Brasil exporta soja e importa oleo de soja. Exporta minerio de ferro e importa aco. 
              Produtos industrializados valem 3-5x mais que materia-prima.
            </p>
            <div className="mt-3 p-3 rounded bg-card">
              <p className="text-sm text-muted-foreground">Perda estimada anual:</p>
              <p className="text-2xl font-bold text-accent">US$ {data.perdaBrasil.toFixed(0)} bilhoes</p>
              <p className="text-xs text-muted-foreground">Valor que o Brasil deixa de agregar</p>
            </div>
          </div>

          {/* Country Comparison Bar Chart */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Comparativo: Exportacoes por Tipo</p>
            <ChartContainer config={chartConfig} className="h-[150px] w-full">
              <ResponsiveContainer width="100%" height={150}>
                <BarChart
                  data={countryComparison}
                  layout="vertical"
                  margin={{ top: 0, right: 0, left: 70, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="pais"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => (
                          <span>
                            {name === "industrializado" ? "Industrializado" : "Materia-prima"}: {value}%
                          </span>
                        )}
                      />
                    }
                  />
                  <Bar dataKey="industrializado" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="materiaPrima" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex justify-center gap-4 mt-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-[#22c55e]" />
                <span className="text-muted-foreground">Industrializado</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-[#ef4444]" />
                <span className="text-muted-foreground">Materia-prima</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Country Comparison Card */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Comparativo Detalhado de Paises
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Analise completa: exportacoes, cambio e produtos principais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCountry} onValueChange={setSelectedCountry} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              {countryDetailData.map((country) => (
                <TabsTrigger 
                  key={country.id} 
                  value={country.id}
                  className="text-xs flex items-center gap-1"
                >
                  <span>{country.bandeira}</span>
                  <span className="hidden sm:inline">{country.nome}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            {countryDetailData.map((country) => (
              <TabsContent key={country.id} value={country.id} className="mt-0">
                <CountryDetailCard country={country} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Summary Comparison Table */}
      <Card className="bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">
            Resumo Comparativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Pais</th>
                  <th className="text-center py-2 px-2 text-muted-foreground font-medium">MP %</th>
                  <th className="text-center py-2 px-2 text-muted-foreground font-medium">Ind %</th>
                  <th className="text-center py-2 px-2 text-muted-foreground font-medium">PIB (tri)</th>
                  <th className="text-right py-2 px-2 text-muted-foreground font-medium">Perda/Ganho</th>
                </tr>
              </thead>
              <tbody>
                {countryDetailData.map((country) => {
                  const isGain = country.perdaEstimada < 0
                  return (
                    <tr key={country.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-2">
                          <span>{country.bandeira}</span>
                          <span className="font-medium text-foreground">{country.nome}</span>
                        </div>
                      </td>
                      <td className="text-center py-2 px-2 text-destructive font-medium">
                        {country.exportComposition.materiaPrima}%
                      </td>
                      <td className="text-center py-2 px-2 text-primary font-medium">
                        {country.exportComposition.industrializado}%
                      </td>
                      <td className="text-center py-2 px-2 text-muted-foreground">
                        ${country.pibNominal.toFixed(2)}
                      </td>
                      <td className={`text-right py-2 px-2 font-bold ${isGain ? 'text-primary' : 'text-destructive'}`}>
                        {isGain ? '+' : '-'}${Math.abs(country.perdaEstimada)}bi
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-muted-foreground mt-3 text-center">
            MP = Materia-prima | Ind = Industrializado | Valores em USD
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
