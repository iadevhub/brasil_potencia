#!/usr/bin/env node

/**
 * FASE 2 - MODELO ECONÔMICO DO BRASIL
 * 
 * Implementa a lógica de simulação econômica com:
 * - ICB (Índice Cesta Brasil)
 * - Câmbio Simulado vs Real
 * - Perda Brasil (não agregar valor)
 * - Fatores: Juros, Risco-País, Inflação
 * - Correlações e validações R²
 */

import { historicalData, baseValues, YearData } from './brasil-data'

// ═══════════════════════════════════════════════════════════════════════════
// INTERFACES E TIPOS
// ═══════════════════════════════════════════════════════════════════════════

export interface FatoresEconomicos {
  year: number
  taxaJuros: number // Taxa SELIC (%)
  riscoPais: number // Spread de risco (bps)
  inflacao: number // IPCA (%)
  pibReal: number // PIB real (índice 2010=100)
  cambioOficial: number // Câmbio observado (R$/USD)
}

export interface SimulacaoAnual {
  year: number
  icbReal: number // ICB calculado com pesos atuais
  icbPotencial: number // ICB se agregasse valor
  cambioOficial: number // Câmbio real
  cambioSimulado: number // Câmbio se PIB estivesse no potencial
  perdaBrasil: number // USD bilhões não agregados
  correlacao: number // Câmbio vs Commodities
}

export interface ValidacaoModelo {
  periodoAnalise: string
  r2_cambio_commodities: number
  r2_energia_pib: number
  r2_icb_cambio: number
  correlacoes: {
    [key: string]: number
  }
  metricas: {
    rmse: number
    mae: number
    mape: number
  }
  status: 'válido' | 'com_ajustes' | 'inválido'
}

// ═══════════════════════════════════════════════════════════════════════════
// DADOS ECONÔMICOS HISTÓRICOS (2000-2024)
// ═══════════════════════════════════════════════════════════════════════════

export const fatoresEconomicosHistoricos: FatoresEconomicos[] = [
  // 2000-2005: Crise de volatilidade, pós-Real
  { year: 2000, taxaJuros: 18.3, riscoPais: 850, inflacao: 5.97, pibReal: 68, cambioOficial: 1.83 },
  { year: 2001, taxaJuros: 17.3, riscoPais: 950, inflacao: 7.67, pibReal: 70, cambioOficial: 2.35 },
  { year: 2002, taxaJuros: 19.2, riscoPais: 1200, inflacao: 12.53, pibReal: 72, cambioOficial: 2.92 },
  { year: 2003, taxaJuros: 16.3, riscoPais: 980, inflacao: 9.30, pibReal: 75, cambioOficial: 3.08 },
  { year: 2004, taxaJuros: 16.3, riscoPais: 680, inflacao: 7.60, pibReal: 80, cambioOficial: 2.93 },
  { year: 2005, taxaJuros: 19.2, riscoPais: 520, inflacao: 5.69, pibReal: 85, cambioOficial: 2.44 },
  
  // 2006-2008: Boom de commodities, Juros declinando
  { year: 2006, taxaJuros: 13.8, riscoPais: 320, inflacao: 3.14, pibReal: 88, cambioOficial: 2.18 },
  { year: 2007, taxaJuros: 11.3, riscoPais: 250, inflacao: 4.46, pibReal: 92, cambioOficial: 1.95 },
  { year: 2008, taxaJuros: 13.8, riscoPais: 640, inflacao: 5.90, pibReal: 93, cambioOficial: 1.83 },
  { year: 2009, taxaJuros: 9.9, riscoPais: 580, inflacao: 4.31, pibReal: 90, cambioOficial: 2.00 },
  
  // 2010-2014: Pós-crise, crescimento moderado
  { year: 2010, taxaJuros: 10.75, riscoPais: 270, inflacao: 5.04, pibReal: 100, cambioOficial: 1.76 },
  { year: 2011, taxaJuros: 12.0, riscoPais: 350, inflacao: 6.50, pibReal: 101, cambioOficial: 1.67 },
  { year: 2012, taxaJuros: 7.1, riscoPais: 310, inflacao: 5.84, pibReal: 102, cambioOficial: 1.95 },
  { year: 2013, taxaJuros: 10.0, riscoPais: 380, inflacao: 6.20, pibReal: 103, cambioOficial: 2.16 },
  { year: 2014, taxaJuros: 11.65, riscoPais: 580, inflacao: 6.41, pibReal: 103, cambioOficial: 2.35 },
  
  // 2015-2019: Recessão, recuperação, estabilidade
  { year: 2015, taxaJuros: 14.25, riscoPais: 650, inflacao: 10.67, pibReal: 100, cambioOficial: 3.33 },
  { year: 2016, taxaJuros: 13.75, riscoPais: 520, inflacao: 6.29, pibReal: 99, cambioOficial: 3.49 },
  { year: 2017, taxaJuros: 10.25, riscoPais: 350, inflacao: 3.69, pibReal: 101, cambioOficial: 3.19 },
  { year: 2018, taxaJuros: 6.5, riscoPais: 380, inflacao: 3.75, pibReal: 102, cambioOficial: 3.65 },
  { year: 2019, taxaJuros: 5.0, riscoPais: 320, inflacao: 3.20, pibReal: 103, cambioOficial: 3.95 },
  
  // 2020-2024: Pandemia, recuperação, inflação
  { year: 2020, taxaJuros: 2.0, riscoPais: 480, inflacao: 3.21, pibReal: 98, cambioOficial: 5.16 },
  { year: 2021, taxaJuros: 5.25, riscoPais: 420, inflacao: 8.04, pibReal: 101, cambioOficial: 5.39 },
  { year: 2022, taxaJuros: 13.75, riscoPais: 480, inflacao: 5.79, pibReal: 102, cambioOficial: 5.17 },
  { year: 2023, taxaJuros: 13.75, riscoPais: 400, inflacao: 4.62, pibReal: 103, cambioOficial: 4.97 },
  { year: 2024, taxaJuros: 10.5, riscoPais: 350, inflacao: 4.30, pibReal: 104, cambioOficial: 5.15 },
]

// ═══════════════════════════════════════════════════════════════════════════
// FUNÇÕES DE CÁLCULO DO MODELO
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calcula o ICB (Índice Cesta Brasil) real baseado nos componentes
 */
export function calcularICBReal(dados: YearData, pesos = defaultPesos): number {
  const energia = (dados.energia / baseValues.energia) * 100
  const alimentos = (dados.alimentos / baseValues.alimentos) * 100
  const minerios = (dados.minerios / baseValues.minerios) * 100
  const industria = (dados.industria / baseValues.industria) * 100
  const reservas = (dados.reservas / baseValues.reservas) * 100

  return (
    energia * pesos.energia +
    alimentos * pesos.alimentos +
    minerios * pesos.minerios +
    industria * pesos.industria +
    reservas * pesos.reservas
  )
}

/**
 * Calcula ICB potencial se Brasil agregasse mais valor (reduzia material prima %)
 */
export function calcularICBPotencial(
  dados: YearData,
  pesos = defaultPesos,
  reducaoMateriaPrima = 0.15 // 15% de redução
): number {
  // Aumenta industria e alimentos processados
  const energiaPot = dados.energia * 1.05 // Busca mais energia renovável
  const alimentosPot = dados.alimentos * 1.20 // Processados
  const mineriosPot = dados.minerios * 0.90 // Menos exportação bruta
  const industriaPot = dados.industria * 1.25 // Mais industrializado
  const reservasPot = dados.reservas * 1.10 // Mais estável

  const icbPot =
    (energiaPot / baseValues.energia) * 100 * pesos.energia +
    (alimentosPot / baseValues.alimentos) * 100 * pesos.alimentos +
    (mineriosPot / baseValues.minerios) * 100 * pesos.minerios +
    (industriaPot / baseValues.industria) * 100 * pesos.industria +
    (reservasPot / baseValues.reservas) * 100 * pesos.reservas

  return icbPot
}

/**
 * Calcula câmbio simulado baseado em relação ICB
 * Se ICB está alto, Real deveria ser mais forte (câmbio menor)
 */
export function calcularCambioSimulado(
  icbAtual: number,
  icbBase: number = 100,
  cambioBase: number = baseValues.cambioBase
): number {
  // Relação inversa: quanto maior o ICB, menor o câmbio (Real mais forte)
  const fatorFortalecimento = icbBase / icbAtual
  return cambioBase * fatorFortalecimento
}

/**
 * Calcula a "Perda Brasil" - valor não agregado por exportar matéria-prima
 */
export function calcularPerdaBrasil(dados: YearData, fatores: FatoresEconomicos): number {
  // Estimativa: material prima exportada poderia agregar 3-5x mais valor
  const fatorAgregacao = 4.0 // Valor agregado potencial
  const valorMateriaPrima = dados.exportTotal * (dados.exportMateriaPrima / 100)
  
  // Ajusta por inflação e câmbio
  const ajusteInflacao = (1 + fatores.inflacao / 100)
  const ajusteCambio = baseValues.cambioBase / fatores.cambioOficial
  
  const valorPotencial = valorMateriaPrima * fatorAgregacao * ajusteInflacao * ajusteCambio
  return (valorPotencial - valorMateriaPrima) / 1000 // Retorna em USD bilhões
}

/**
 * Calcula a simulação econômica para um ano
 */
export function simularAnoEconomico(
  year: number,
  pesos = defaultPesos
): SimulacaoAnual {
  const dadosReais = historicalData.find((d) => d.year === year)
  const fatoresReais = fatoresEconomicosHistoricos.find((f) => f.year === year)

  if (!dadosReais || !fatoresReais) {
    throw new Error(`Dados não encontrados para ano ${year}`)
  }

  const icbReal = calcularICBReal(dadosReais, pesos)
  const icbPotencial = calcularICBPotencial(dadosReais, pesos)
  const cambioSimulado = calcularCambioSimulado(icbReal)
  const perdaBrasil = calcularPerdaBrasil(dadosReais, fatoresReais)

  // Correlação simplicidade: câmbio vs commodities
  const correlacao = calcularCorrelacaoCambioXCommodities(dadosReais)

  return {
    year,
    icbReal: parseFloat(icbReal.toFixed(2)),
    icbPotencial: parseFloat(icbPotencial.toFixed(2)),
    cambioOficial: dadosReais.cambioReal,
    cambioSimulado: parseFloat(cambioSimulado.toFixed(4)),
    perdaBrasil: parseFloat(perdaBrasil.toFixed(2)),
    correlacao: parseFloat(correlacao.toFixed(3)),
  }
}

/**
 * Calcula correlação entre câmbio e commodities
 */
function calcularCorrelacaoCambioXCommodities(dados: YearData): number {
  // Simplificado: correlação entre câmbio (inverso) e média de commodities
  const mediaComm = (dados.alimentos + dados.minerios) / 2
  const cambioInverso = 10 / dados.cambioReal // Quanto maior a taxa, mais fraco o real
  
  // Tendência esperada: quando Real desvaloriza (cambio sobe), commodities valorizam
  const relacao = (cambioInverso / 10) * (mediaComm / 100)
  return Math.min(1, Math.max(0, relacao)) // Normaliza entre 0 e 1
}

/**
 * Gera simulações para período completo
 */
export function gerarSimulacaoCompleta(
  startYear = 2000,
  endYear = 2024,
  pesos = defaultPesos
): SimulacaoAnual[] {
  const simulacoes: SimulacaoAnual[] = []

  for (let year = startYear; year <= endYear; year++) {
    try {
      const sim = simularAnoEconomico(year, pesos)
      simulacoes.push(sim)
    } catch (error) {
      console.warn(`⚠️ Erro ao simular ${year}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return simulacoes
}

/**
 * Calcula R² (coeficiente de determinação)
 */
export function calcularR2(valores_observados: number[], valores_preditos: number[]): number {
  if (valores_observados.length !== valores_preditos.length) {
    throw new Error('Arrays devem ter o mesmo tamanho')
  }

  const media_obs = valores_observados.reduce((a, b) => a + b, 0) / valores_observados.length
  const ss_res = valores_observados.reduce(
    (sum, obs, i) => sum + Math.pow(obs - valores_preditos[i], 2),
    0
  )
  const ss_tot = valores_observados.reduce((sum, obs) => sum + Math.pow(obs - media_obs, 2), 0)

  return ss_tot === 0 ? 0 : 1 - ss_res / ss_tot
}

/**
 * Valida o modelo econômico
 */
export function validarModelo(simulacoes: SimulacaoAnual[]): ValidacaoModelo {
  // Extrai valores para correlação
  const cambios = simulacoes.map((s) => s.cambioOficial)
  const icbs = simulacoes.map((s) => s.icbReal)
  const correlacoesPorAno = simulacoes.map((s) => s.correlacao)

  // Calcula R² do câmbio simulado vs real
  const cambiosSimulados = simulacoes.map((s) => s.cambioSimulado)
  const r2_cambio = calcularR2(cambios, cambiosSimulados)

  // Calcula R² do ICB vs câmbio (relação inversa esperada)
  const cambiosInversos = cambios.map((c) => 1 / c)
  const r2_icb_cambio = calcularR2(icbs, cambiosInversos)

  // Simula correlação energia vs PIB
  const energias = simulacoes.map((_, i) => historicalData[i].energia)
  const pibEstimado = simulacoes.map((_, i) => fatoresEconomicosHistoricos[i].pibReal)
  const r2_energia_pib = calcularR2(energias, pibEstimado)

  // Calcula métricas de erro
  const erros = simulacoes.map((s, i) => cambios[i] - cambiosSimulados[i])
  const mae = erros.reduce((sum, e) => sum + Math.abs(e), 0) / erros.length
  const mape = erros.reduce((sum, e, i) => sum + Math.abs(e / cambios[i]), 0) / erros.length * 100
  const rmse = Math.sqrt(erros.reduce((sum, e) => sum + e * e, 0) / erros.length)

  // Determina status
  const r2_min = 0.75 // Alvo mínimo
  const status =
    r2_cambio > 0.85 && r2_icb_cambio > 0.80 && r2_energia_pib > 0.75
      ? 'válido'
      : r2_cambio > r2_min || r2_icb_cambio > r2_min
      ? 'com_ajustes'
      : 'inválido'

  return {
    periodoAnalise: `2000-2024 (${simulacoes.length} anos)`,
    r2_cambio_commodities: parseFloat(r2_cambio.toFixed(4)),
    r2_energia_pib: parseFloat(r2_energia_pib.toFixed(4)),
    r2_icb_cambio: parseFloat(r2_icb_cambio.toFixed(4)),
    correlacoes: {
      cambio_commodities: parseFloat(correlacoesPorAno.reduce((a, b) => a + b, 0) / correlacoesPorAno.length),
      energia_pib: parseFloat((r2_energia_pib * 100).toFixed(2)) / 100,
    },
    metricas: {
      rmse: parseFloat(rmse.toFixed(4)),
      mae: parseFloat(mae.toFixed(4)),
      mape: parseFloat(mape.toFixed(2)),
    },
    status,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULTS E EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

const defaultPesos = {
  energia: 0.25,
  alimentos: 0.25,
  minerios: 0.20,
  industria: 0.15,
  reservas: 0.15,
}

export { defaultPesos }
