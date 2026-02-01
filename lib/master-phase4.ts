#!/usr/bin/env node

import {
  politicasPropostas,
  analisarTodasPoliticas,
  simularImpactoCumulativo,
  exportarAnaliseJSON,
} from './policy-analysis'

async function executarFase4() {
  console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                  FASE 4 - ANÁLISE DE POLÍTICAS E ROI                       ║
╚════════════════════════════════════════════════════════════════════════════╝`)

  try {
    const analises = analisarTodasPoliticas()
    const impacto = simularImpactoCumulativo()

    const analiseJSON = exportarAnaliseJSON()
    const fs = await import('fs')
    fs.writeFileSync('analise-politicas.json', JSON.stringify(analiseJSON, null, 2))

    let relatorio = `FASE 4 - ANÁLISE DE POLÍTICAS E ROI
═════════════════════════════════════════════════════════════════

Data de Execução: ${new Date().toLocaleString('pt-BR')}
Políticas analisadas: ${politicasPropostas.length}
Investimento total: US$ ${impacto.investimentoTotal.toFixed(1)} bi
Empregos estimados: ${impacto.empregosCriados.toLocaleString('pt-BR')}
PIB adicional: +${(impacto.pibAdicional * 100).toFixed(2)}%
Redução perda Brasil (25 anos): US$ ${impacto.reducaoPerdaBrasil.toFixed(1)} bi

RANKING (TOP 3)
────────────────
`

    const ranking = [...analises].sort((a, b) => b.roiAno5 - a.roiAno5).slice(0, 3)
    ranking.forEach((a, i) => {
      relatorio += `${i + 1}. ${a.politica.nome} | ROI 5 anos: ${a.roiAno5.toFixed(1)}% | Viabilidade: ${a.viabilidade.toUpperCase()}\n`
    })

    relatorio += `
Arquivo JSON: analise-politicas.json

═════════════════════════════════════════════════════════════════
`

    fs.writeFileSync('RELATORIO_FASE_4.txt', relatorio)

    console.log('✓ analise-politicas.json gerado')
    console.log('✓ RELATORIO_FASE_4.txt gerado')
  } catch (error) {
    console.error('Erro:', error)
    process.exit(1)
  }
}

executarFase4()
