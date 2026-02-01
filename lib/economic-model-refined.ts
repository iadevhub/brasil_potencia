#!/usr/bin/env node

/**
 * FASE 2.5 - REFINAMENTO DO MODELO ECONÔMICO
 * 
 * Melhora o modelo incluindo:
 * - Taxa SELIC como principal driver
 * - Spread de risco país
 * - Inflação acumulada
 * - Relações não-lineares
 * - Segmentação por períodos
 */

import { historicalData, baseValues, YearData } from './brasil-data'
import {
  fatoresEconomicosHistoricos,
  defaultPesos,
  SimulacaoAnual,
  ValidacaoModelo,
  calcularR2,
} from './economic-model'

// ═══════════════════════════════════════════════════════════════════════════
// MODELO REFINADO COM SELIC E RISCO
// ═══════════════════════════════════════════════════════════════════════════

export interface ModeloRefinado extends SimulacaoAnual {
  selic: number
  riscoPais: number
  inflacao: number
  ponderacaoSelic: number
  ponderacaoRisco: number
  ponderacaoInflacao: number
}

/**
 * Calcula câmbio refinado com SELIC, Risco e Inflação
 */
export function calcularCambioRefinado(
  year: number,
  icbReal: number,
  icbBase: number = 100
): ModeloRefinado {
  const fatores = fatoresEconomicosHistoricos.find((f) => f.year === year)
  if (!fatores) throw new Error(`Fatores não encontrados para ${year}`)

  // Normalização de fatores
  const selic_norm = Math.min(fatores.taxaJuros / 20, 1) // 0-1, máx 20%
  const risco_norm = Math.min(fatores.riscoPais / 1500, 1) // 0-1, máx 1500 bps
  const inflacao_norm = Math.min(fatores.inflacao / 15, 1) // 0-1, máx 15%

  // Pesos (podem somar 1 ou mais, representam importância relativa)
  const peso_selic = 0.5 // SELIC é dominante
  const peso_risco = 0.3 // Risco país é importante
  const peso_inflacao = 0.2 // Inflação tem efeito moderado

  // Câmbio refinado = Câmbio base * ajuste SELIC * ajuste Risco * ajuste Inflação
  const ajusteSelic = 1 + peso_selic * selic_norm // Taxa alta → Real mais fraco
  const ajusteRisco = 1 + peso_risco * risco_norm // Risco alto → Real mais fraco
  const ajusteInflacao = 1 + peso_inflacao * inflacao_norm // Inflação → Real mais fraco

  // Ajuste ICB (commodities)
  const fatorICB = icbBase / Math.max(icbReal, 50) // Quanto maior ICB, Real mais forte
  const cambioBase = baseValues.cambioBase

  const cambioRefinado = cambioBase * ajusteSelic * ajusteRisco * ajusteInflacao * fatorICB

  return {
    year,
    icbReal: 0,
    icbPotencial: 0,
    cambioOficial: fatores.cambioOficial,
    cambioSimulado: Math.max(1.2, Math.min(cambioRefinado, 6.0)), // Limita a [1.2, 6.0]
    perdaBrasil: 0,
    correlacao: 0,
    selic: fatores.taxaJuros,
    riscoPais: fatores.riscoPais,
    inflacao: fatores.inflacao,
    ponderacaoSelic: peso_selic * selic_norm,
    ponderacaoRisco: peso_risco * risco_norm,
    ponderacaoInflacao: peso_inflacao * inflacao_norm,
  }
}

/**
 * Gera simulações refinadas para período completo
 */
export function gerarSimulacoesRefinadas(startYear = 2000, endYear = 2024): ModeloRefinado[] {
  const simulacoes: ModeloRefinado[] = []

  for (let year = startYear; year <= endYear; year++) {
    const dados = historicalData.find((d) => d.year === year)
    if (!dados) continue

    // Calcula ICB real para este ano
    const icbReal =
      (dados.energia / baseValues.energia) * 100 * 0.25 +
      (dados.alimentos / baseValues.alimentos) * 100 * 0.25 +
      (dados.minerios / baseValues.minerios) * 100 * 0.2 +
      (dados.industria / baseValues.industria) * 100 * 0.15 +
      (dados.reservas / baseValues.reservas) * 100 * 0.15

    // Calcula câmbio refinado
    const sim = calcularCambioRefinado(year, icbReal)
    simulacoes.push(sim)
  }

  return simulacoes
}

/**
 * Valida modelo refinado e compara com modelo anterior
 */
export function validarModeloRefinado(
  simulacoesOriginais: ModeloRefinado[],
  simulacoesRefinadas: ModeloRefinado[]
): {
  r2_original: number
  r2_refinado: number
  melhoria_r2: number
  mae_original: number
  mae_refinado: number
  melhoria_mae: number
} {
  // Alinha por ano e remove valores inválidos
  const refinadasPorAno = new Map(simulacoesRefinadas.map((s) => [s.year, s]))
  const paresValidos = simulacoesOriginais
    .map((s) => ({
      original: s,
      refinada: refinadasPorAno.get(s.year),
    }))
    .filter(
      (p) =>
        p.refinada &&
        Number.isFinite(p.original.cambioOficial) &&
        Number.isFinite(p.original.cambioSimulado) &&
        Number.isFinite(p.refinada.cambioSimulado)
    ) as { original: ModeloRefinado; refinada: ModeloRefinado }[]

  const cambiosReais = paresValidos.map((p) => p.original.cambioOficial)
  const cambiosSimuladosOriginal = paresValidos.map((p) => p.original.cambioSimulado)
  const cambiosSimuladosRefinado = paresValidos.map((p) => p.refinada.cambioSimulado)

  if (cambiosReais.length === 0) {
    return {
      r2_original: 0,
      r2_refinado: 0,
      melhoria_r2: 0,
      mae_original: 0,
      mae_refinado: 0,
      melhoria_mae: 0,
    }
  }

  // Calcula R²
  const r2_original = calcularR2(cambiosReais, cambiosSimuladosOriginal)
  const r2_refinado = calcularR2(cambiosReais, cambiosSimuladosRefinado)

  // Calcula MAE (Mean Absolute Error)
  const mae_original =
    cambiosReais.reduce((sum, obs, i) => sum + Math.abs(obs - cambiosSimuladosOriginal[i]), 0) /
    cambiosReais.length
  const mae_refinado =
    cambiosReais.reduce((sum, obs, i) => sum + Math.abs(obs - cambiosSimuladosRefinado[i]), 0) /
    cambiosReais.length

  return {
    r2_original,
    r2_refinado,
    melhoria_r2: r2_refinado - r2_original,
    mae_original,
    mae_refinado,
    melhoria_mae: mae_original - mae_refinado,
  }
}

export { defaultPesos }
