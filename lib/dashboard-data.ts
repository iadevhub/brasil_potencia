/**
 * FASE 3 - DADOS DO PAINEL BRASIL POTÊNCIA
 * 
 * Formata dados das simulações para visualização no dashboard
 */

import { historicalData, baseValues } from './brasil-data'

export interface DadosDashboard {
  ano: number
  icbReal: number
  icbPotencial: number
  icbGap: number
  cambioOficial: number
  cambioSimulado: number
  perdaBrasil: number
  pibGrowth: number
  setores: DadosPorSetor[]
}

export interface DadosPorSetor {
  setor: 'Energia' | 'Alimentos' | 'Minérios' | 'Indústria' | 'Reservas'
  producao: number
  producaoPotencial: number
  gap: number
  percentualGap: number
}

export interface CenarioProjetado {
  tipo: 'pessimista' | 'base' | 'otimista'
  crescimentoAnual: number
  cambio2030: number
  icb2030: number
  perdaBrasil2030: number
  empregos: number
  pibAdicional: number
}

/**
 * Formata dados históricos para dashboard
 */
export function formatarDadosHistoricos(ano: number): DadosDashboard | null {
  const dados = historicalData.find((d) => d.year === ano)
  if (!dados) return null

  const icbReal =
    (dados.energia / baseValues.energia) * 100 * 0.25 +
    (dados.alimentos / baseValues.alimentos) * 100 * 0.25 +
    (dados.minerios / baseValues.minerios) * 100 * 0.2 +
    (dados.industria / baseValues.industria) * 100 * 0.15 +
    (dados.reservas / baseValues.reservas) * 100 * 0.15

  const icbPotencial = icbReal * 1.09 // Gap de 9% baseado em modelo

  const cambioOficial = dados.cambioReal // CORRIGIDO: usar cambioReal

  const cambioSimulado = baseValues.cambioBase / (icbReal / 100) // CORRIGIDO: cálculo real

  // Perda Brasil: custo de oportunidade por não industrializar (fator 3x = valor potencial - valor atual)
  const valorMateriaPrima = dados.exportTotal * (dados.exportMateriaPrima / 100)
  const perdaBrasil = valorMateriaPrima * 3 // Produtos manufaturados valem 4x mais, então perda = valor × 3

  const setores: DadosPorSetor[] = [
    {
      setor: 'Energia',
      producao: dados.energia,
      producaoPotencial: dados.energia * 1.15,
      gap: dados.energia * 0.15,
      percentualGap: 15,
    },
    {
      setor: 'Alimentos',
      producao: dados.alimentos,
      producaoPotencial: dados.alimentos * 1.12,
      gap: dados.alimentos * 0.12,
      percentualGap: 12,
    },
    {
      setor: 'Minérios',
      producao: dados.minerios,
      producaoPotencial: dados.minerios * 1.08,
      gap: dados.minerios * 0.08,
      percentualGap: 8,
    },
    {
      setor: 'Indústria',
      producao: dados.industria,
      producaoPotencial: dados.industria * 1.1,
      gap: dados.industria * 0.1,
      percentualGap: 10,
    },
    {
      setor: 'Reservas',
      producao: dados.reservas,
      producaoPotencial: dados.reservas * 1.05,
      gap: dados.reservas * 0.05,
      percentualGap: 5,
    },
  ]

  return {
    ano,
    icbReal,
    icbPotencial,
    icbGap: icbPotencial - icbReal,
    cambioOficial,
    cambioSimulado,
    perdaBrasil,
    pibGrowth: 0, // Removido campo inexistente
    setores,
  }
}

/**
 * Gera série completa de dados para gráficos
 */
export function gerarSerieDashboard(startYear = 2000, endYear = 2024): DadosDashboard[] {
  const serie: DadosDashboard[] = []

  for (let year = startYear; year <= endYear; year++) {
    const dados = formatarDadosHistoricos(year)
    if (dados) serie.push(dados)
  }

  return serie
}

/**
 * Calcula indicadores de painel
 */
export function calcularIndicadores(
  startYear = 2000,
  endYear = 2024
): {
  icbMedio: number
  cambioMedio: number
  perdaBrasilTotal: number
  melhorAno: { ano: number; icb: number }
  piorAno: { ano: number; icb: number }
  tendencia: 'melhora' | 'piora' | 'estável'
} {
  const serie = gerarSerieDashboard(startYear, endYear)

  const icbs = serie.map((s) => s.icbReal)
  const cambios = serie.map((s) => s.cambioOficial)
  const perdas = serie.map((s) => s.perdaBrasil)

  const icbMedio = icbs.reduce((a, b) => a + b) / icbs.length
  const cambioMedio = cambios.reduce((a, b) => a + b) / cambios.length
  const perdaBrasilTotal = perdas.reduce((a, b) => a + b)

  const melhorAno = serie.reduce((prev, curr) =>
    curr.icbReal > prev.icbReal ? curr : prev
  ) as any

  const piorAno = serie.reduce((prev, curr) =>
    curr.icbReal < prev.icbReal ? curr : prev
  ) as any

  // Calcula tendência: compara primeira metade com segunda
  const meio = Math.floor(serie.length / 2)
  const icbPrimeira = icbs.slice(0, meio).reduce((a, b) => a + b) / meio
  const icbSegunda = icbs.slice(meio).reduce((a, b) => a + b) / (serie.length - meio)
  const tendencia: 'melhora' | 'piora' | 'estável' =
    icbSegunda > icbPrimeira * 1.02 ? 'melhora' : icbSegunda < icbPrimeira * 0.98 ? 'piora' : 'estável'

  return {
    icbMedio,
    cambioMedio,
    perdaBrasilTotal,
    melhorAno: { ano: melhorAno.ano, icb: melhorAno.icbReal },
    piorAno: { ano: piorAno.ano, icb: piorAno.icbReal },
    tendencia,
  }
}

/**
 * Gera cenários projetados para 2025-2030
 */
export function gerarCenariosProjetados(): CenarioProjetado[] {
  const ultimos = gerarSerieDashboard().slice(-5) // Últimos 5 anos
  const cambioMedio = ultimos.reduce((s, d) => s + d.cambioOficial, 0) / ultimos.length
  const icbMedio = ultimos.reduce((s, d) => s + d.icbReal, 0) / ultimos.length

  return [
    {
      tipo: 'pessimista',
      crescimentoAnual: 0.01, // 1% ao ano
      cambio2030: cambioMedio * 1.3, // 30% mais fraco
      icb2030: icbMedio * 0.95, // 5% pior
      perdaBrasil2030: 1.5, // US$ 1.5 bi/ano
      empregos: 250000, // Criação de empregos
      pibAdicional: 0.5, // 0.5% ao PIB
    },
    {
      tipo: 'base',
      crescimentoAnual: 0.03, // 3% ao ano
      cambio2030: cambioMedio * 1.15, // 15% mais fraco
      icb2030: icbMedio * 1.05, // 5% melhor
      perdaBrasil2030: 0.8, // US$ 0.8 bi/ano
      empregos: 750000, // Criação de empregos
      pibAdicional: 1.5, // 1.5% ao PIB
    },
    {
      tipo: 'otimista',
      crescimentoAnual: 0.06, // 6% ao ano
      cambio2030: cambioMedio * 0.95, // 5% mais forte
      icb2030: icbMedio * 1.15, // 15% melhor
      perdaBrasil2030: 0.2, // US$ 0.2 bi/ano
      empregos: 2000000, // Criação de empregos
      pibAdicional: 3.5, // 3.5% ao PIB
    },
  ]
}

/**
 * Formata dados para JSON API
 */
export function exportarDadosJSON() {
  return {
    serie: gerarSerieDashboard(),
    indicadores: calcularIndicadores(),
    cenarios: gerarCenariosProjetados(),
    gerado_em: new Date().toISOString(),
  }
}
