/**
 * FASE 4 - ANÁLISE DE POLÍTICAS E ROI
 * 
 * Avalia impacto de políticas de agregação de valor
 */

import { historicalData, baseValues } from './brasil-data'
import { gerarSerieDashboard, calcularIndicadores } from './dashboard-data'

export interface Politica {
  id: string
  nome: string
  descricao: string
  setor: 'Energia' | 'Alimentos' | 'Minérios' | 'Indústria' | 'Renováveis'
  investimento: number // US$ bilhões
  prazo: number // anos
  taxaRetorno: number // % ao ano
}

export interface AnalisePolitica {
  politica: Politica
  vpl: number // Valor Presente Líquido (US$ bi)
  tir: number // Taxa Interna de Retorno (%)
  payback: number // anos
  empregos: number
  pibAdicional: number // % ao PIB
  cambioImpacto: number // Impacto no câmbio (R$/USD)
  reducaoPerdaBrasil: number // US$ bilhões/ano
  roiAno1: number
  roiAno3: number
  roiAno5: number
  viabilidade: 'alta' | 'média' | 'baixa'
}

// ═══════════════════════════════════════════════════════════════════════════
// POLÍTICAS PROPOSTAS
// ═══════════════════════════════════════════════════════════════════════════

export const politicasPropostas: Politica[] = [
  {
    id: 'chips-semiconductores',
    nome: 'Hub de Semicondutores',
    descricao: 'Criar indústria de chips e semicondutores no Brasil',
    setor: 'Indústria',
    investimento: 15, // US$ 15 bilhões
    prazo: 8,
    taxaRetorno: 0.22,
  },
  {
    id: 'energia-renovavel',
    nome: 'Complexo de Energia Renovável',
    descricao: 'Expandir produção de energia solar, eólica e verde com exportação de eletricidade',
    setor: 'Renováveis',
    investimento: 20, // US$ 20 bilhões
    prazo: 10,
    taxaRetorno: 0.18,
  },
  {
    id: 'agro-tech',
    nome: 'Agro-Tech & Processamento',
    descricao: 'Industrializar processamento de alimentos e agroindustrialização',
    setor: 'Alimentos',
    investimento: 8, // US$ 8 bilhões
    prazo: 6,
    taxaRetorno: 0.25,
  },
  {
    id: 'mineracao-verde',
    nome: 'Mineração Verde & Litio',
    descricao: 'Beneficiamento de minérios e exploração de lítio com padrões ESG',
    setor: 'Minérios',
    investimento: 12, // US$ 12 bilhões
    prazo: 7,
    taxaRetorno: 0.20,
  },
  {
    id: 'biodiesel-etanol',
    nome: 'Complexo de Biocombustíveis',
    descricao: 'Expandir biodiesel e etanol verde para exportação',
    setor: 'Energia',
    investimento: 5, // US$ 5 bilhões
    prazo: 5,
    taxaRetorno: 0.28,
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// ANÁLISE DE VIABILIDADE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calcula VPL e TIR para política
 */
export function calcularMetricasFinanceiras(
  politica: Politica,
  taxaDesconto = 0.08 // 8% ao ano
): {
  vpl: number
  tir: number
  payback: number
} {
  // Fluxos de caixa
  const fluxos: number[] = [
    -politica.investimento, // Ano 0: investimento negativo
  ]

  // Anos 1 a prazo: retorno anual
  for (let i = 1; i <= politica.prazo; i++) {
    const retorno = (politica.investimento * politica.taxaRetorno) / (1 + taxaDesconto) ** i
    fluxos.push(retorno)
  }

  // VPL
  const vpl = fluxos.reduce((sum, fluxo, i) => sum + fluxo / (1 + taxaDesconto) ** i)

  // TIR (aproximada iterativamente)
  let tir = 0.1
  for (let iter = 0; iter < 100; iter++) {
    const vpn = fluxos.reduce((sum, fluxo, i) => sum + fluxo / (1 + tir) ** i)
    if (Math.abs(vpn) < 0.01) break
    const vpnd = fluxos.reduce((sum, fluxo, i) =>
      i === 0 ? sum : sum - (i * fluxo) / (1 + tir) ** (i + 1)
    )
    tir = tir - vpn / vpnd
  }

  // Payback (quando fluxo acumulado fica positivo)
  let payback = politica.prazo
  let acumulado = -politica.investimento
  for (let i = 1; i <= politica.prazo; i++) {
    acumulado += (politica.investimento * politica.taxaRetorno) / (1 + taxaDesconto) ** i
    if (acumulado > 0) {
      payback = i - acumulado / ((politica.investimento * politica.taxaRetorno) / (1 + taxaDesconto) ** i)
      break
    }
  }

  return { vpl, tir, payback }
}

/**
 * Estima criação de empregos por política
 */
export function estimarEmpregos(politica: Politica): number {
  // Ratio: ~50 empregos por US$ 1 milhão investido na média
  const empregosPorMilhao = {
    'Chips-semiconductores': 35, // Menos empregos, mais capital intensivo
    'Energia-renovavel': 40, // Média
    'Agro-tech': 60, // Mais trabalho
    'Mineracao-verde': 30, // Altamente automatizado
    'Biodiesel-etanol': 50, // Média
  }

  const ratio = empregosPorMilhao[politica.id.replace(/-/g, '-') as keyof typeof empregosPorMilhao] || 45

  return Math.round((politica.investimento * 1e9) / 1e6 * (ratio / 100))
}

/**
 * Estima impacto no PIB
 */
export function estimarImpactoPIB(politica: Politica): number {
  // Multiplicador: cada US$ 1 investido gera 0.5-1.5 de PIB adicional
  const multiplicadores = {
    'chips-semiconductores': 1.2,
    'energia-renovavel': 0.8,
    'agro-tech': 1.0,
    'mineracao-verde': 0.9,
    'biodiesel-etanol': 1.1,
  }

  const multiplicador = multiplicadores[politica.id as keyof typeof multiplicadores] || 1.0
  const pibBrasilAnual = 2000 // US$ 2 trilhões (simplificado em bilhões)

  return (politica.investimento * multiplicador) / pibBrasilAnual
}

/**
 * Estima impacto no câmbio
 */
export function estimarImpactoCambio(politica: Politica): number {
  // Políticas de exportação fortalecem o real
  // Redução de X% na perda Brasil = câmbio X% mais forte
  const cambioBase = 5.5 // R$/USD

  // Exportações esperadas (% do investimento por ano após implantação)
  const taxaExportacao = {
    'chips-semiconductores': 0.15,
    'energia-renovavel': 0.12,
    'agro-tech': 0.20,
    'mineracao-verde': 0.18,
    'biodiesel-etanol': 0.22,
  }

  const taxa = taxaExportacao[politica.id as keyof typeof taxaExportacao] || 0.15
  const exportacaoMilhoes = politica.investimento * 1000 * taxa
  const impactoCambio = -0.001 * exportacaoMilhoes // Câmbio mais forte

  return Math.max(-0.3, Math.min(0.3, impactoCambio)) // Limita a ±30%
}

/**
 * Estima redução de perda Brasil
 */
export function estimarReducaoPerdaBrasil(politica: Politica): number {
  // Baseado em agregação de valor estimada
  const reducoes = {
    'chips-semiconductores': 0.4, // US$ 0.4 bi/ano
    'energia-renovavel': 0.6,
    'agro-tech': 0.5,
    'mineracao-verde': 0.45,
    'biodiesel-etanol': 0.3,
  }

  return reducoes[politica.id as keyof typeof reducoes] || 0.35
}

/**
 * Calcula ROI por ano
 */
export function calcularROIPorAno(politica: Politica, ano: 1 | 3 | 5): number {
  const reducaoPerda = estimarReducaoPerdaBrasil(politica)
  const impactoPIB = estimarImpactoPIB(politica)

  // ROI em % (ano * impacto)
  const ganhoTotal = (reducaoPerda + impactoPIB * 100) * ano // Simplificado

  return (ganhoTotal / politica.investimento) * 100
}

/**
 * Avalia viabilidade geral
 */
export function avaliarViabilidade(analise: Omit<AnalisePolitica, 'viabilidade'>): 'alta' | 'média' | 'baixa' {
  const score =
    (analise.tir > 0.20 ? 3 : analise.tir > 0.12 ? 2 : 1) +
    (analise.payback < 4 ? 3 : analise.payback < 6 ? 2 : 1) +
    (analise.vpl > 10 ? 3 : analise.vpl > 0 ? 2 : 1)

  if (score >= 8) return 'alta'
  if (score >= 5) return 'média'
  return 'baixa'
}

/**
 * Análise completa de política
 */
export function analisarPolitica(politica: Politica): AnalisePolitica {
  const { vpl, tir, payback } = calcularMetricasFinanceiras(politica)
  const empregos = estimarEmpregos(politica)
  const pibAdicional = estimarImpactoPIB(politica)
  const cambioImpacto = estimarImpactoCambio(politica)
  const reducaoPerdaBrasil = estimarReducaoPerdaBrasil(politica)
  const roiAno1 = calcularROIPorAno(politica, 1)
  const roiAno3 = calcularROIPorAno(politica, 3)
  const roiAno5 = calcularROIPorAno(politica, 5)

  const analise: Omit<AnalisePolitica, 'viabilidade'> = {
    politica,
    vpl,
    tir,
    payback,
    empregos,
    pibAdicional,
    cambioImpacto,
    reducaoPerdaBrasil,
    roiAno1,
    roiAno3,
    roiAno5,
  }

  return {
    ...analise,
    viabilidade: avaliarViabilidade(analise),
  }
}

/**
 * Análise de todas as políticas
 */
export function analisarTodasPoliticas(): AnalisePolitica[] {
  return politicasPropostas.map((politica) => analisarPolitica(politica))
}

/**
 * Simula impacto cumulativo de todas as políticas
 */
export function simularImpactoCumulativo(): {
  investimentoTotal: number
  empregosCriados: number
  pibAdicional: number
  reducaoPerdaBrasil: number
  cambioFortalecido: number
  prazoImplementacao: number
  scoreGeral: number
} {
  const analises = analisarTodasPoliticas()

  const investimentoTotal = analises.reduce((s, a) => s + a.politica.investimento, 0)
  const empregosCriados = analises.reduce((s, a) => s + a.empregos, 0)
  const pibAdicional = analises.reduce((s, a) => s + a.pibAdicional, 0)
  const reducaoPerdaBrasil = analises.reduce((s, a) => s + a.reducaoPerdaBrasil, 0) * 25 // 25 anos
  const cambioFortalecido = analises.reduce((s, a) => s + a.cambioImpacto, 0)
  const prazoImplementacao = Math.max(...analises.map((a) => a.politica.prazo))

  // Score: combinação de ROI, viabilidade e impacto
  const scoreGeral = analises.reduce((s, a) => {
    const scoreViab = a.viabilidade === 'alta' ? 3 : a.viabilidade === 'média' ? 2 : 1
    const scoreROI = a.roiAno5 > 50 ? 3 : a.roiAno5 > 20 ? 2 : 1
    return s + scoreViab + scoreROI
  }, 0) / analises.length

  return {
    investimentoTotal,
    empregosCriados,
    pibAdicional,
    reducaoPerdaBrasil,
    cambioFortalecido,
    prazoImplementacao,
    scoreGeral,
  }
}

/**
 * Exporta resultado de análise para JSON
 */
export function exportarAnaliseJSON() {
  return {
    analises_individuais: analisarTodasPoliticas(),
    impacto_cumulativo: simularImpactoCumulativo(),
    gerado_em: new Date().toISOString(),
  }
}
