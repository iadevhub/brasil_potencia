#!/usr/bin/env node

import {
  gerarSerieDashboard,
  calcularIndicadores,
  gerarCenariosProjetados,
  exportarDadosJSON,
} from './dashboard-data'

async function executarFase3() {
  console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                     FASE 3 - PAINEL BRASIL POTÊNCIA                        ║
╚════════════════════════════════════════════════════════════════════════════╝`)

  try {
    const serie = gerarSerieDashboard(2000, 2024)
    const indicadores = calcularIndicadores()
    const cenarios = gerarCenariosProjetados()

    const dadosJSON = exportarDadosJSON()
    const fs = await import('fs')
    fs.writeFileSync('dados-dashboard.json', JSON.stringify(dadosJSON, null, 2))

    const relatorio = `FASE 3 - PAINEL BRASIL POTÊNCIA
═════════════════════════════════════════════════════════════════

Data de Execução: ${new Date().toLocaleString('pt-BR')}
Período Histórico: 2000-2024 (25 anos)

ICB Médio: ${indicadores.icbMedio.toFixed(2)}
Câmbio Médio: R$ ${indicadores.cambioMedio.toFixed(2)}/USD
Perda Brasil Total: US$ ${indicadores.perdaBrasilTotal.toFixed(2)} bi
Tendência: ${indicadores.tendencia.toUpperCase()}

CENÁRIOS (2025-2030)
───────────────────
Pessimista: Câmbio 2030 R$ ${cenarios[0].cambio2030.toFixed(2)}/USD | PIB +${(
      cenarios[0].pibAdicional * 100
    ).toFixed(1)}%
Base:       Câmbio 2030 R$ ${cenarios[1].cambio2030.toFixed(2)}/USD | PIB +${(
      cenarios[1].pibAdicional * 100
    ).toFixed(1)}%
Otimista:   Câmbio 2030 R$ ${cenarios[2].cambio2030.toFixed(2)}/USD | PIB +${(
      cenarios[2].pibAdicional * 100
    ).toFixed(1)}%

Total série histórica: ${serie.length} pontos
Arquivo JSON: dados-dashboard.json

═════════════════════════════════════════════════════════════════
`

    fs.writeFileSync('RELATORIO_FASE_3.txt', relatorio)

    console.log('✓ dados-dashboard.json gerado')
    console.log('✓ RELATORIO_FASE_3.txt gerado')
  } catch (error) {
    console.error('Erro:', error)
    process.exit(1)
  }
}

executarFase3()
