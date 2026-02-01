#!/usr/bin/env node

import { historicalData, baseValues } from './brasil-data'
import { gerarSimulacoesRefinadas, validarModeloRefinado } from './economic-model-refined'

async function executarFase25() {
  console.log(`\n╔════════════════════════════════════════════════════════════════════════════╗
║                    FASE 2.5 - REFINAMENTO DO MODELO                       ║
║         Integração de SELIC, Risco País e Inflação na simulação           ║
╚════════════════════════════════════════════════════════════════════════════╝`)

  try {
    console.log('\n📊 Carregando dados históricos...')
    const dadosOriginais: any[] = []
    for (let year = 2000; year <= 2024; year++) {
      const dado = historicalData.find((d) => d.year === year)
      if (dado) {
        const icbReal = (dado.energia / baseValues.energia) * 100 * 0.25 +
          (dado.alimentos / baseValues.alimentos) * 100 * 0.25 +
          (dado.minerios / baseValues.minerios) * 100 * 0.2 +
          (dado.industria / baseValues.industria) * 100 * 0.15 +
          (dado.reservas / baseValues.reservas) * 100 * 0.15
        dadosOriginais.push({
          year,
          icbReal,
          cambioOficial: dado.cambio,
          cambioSimulado: dado.cambio * 0.95,
          selic: 0,
          riscoPais: 0,
          inflacao: 0,
          ponderacaoSelic: 0,
          ponderacaoRisco: 0,
          ponderacaoInflacao: 0,
        })
      }
    }
    console.log(`✓ ${dadosOriginais.length} anos carregados`)

    console.log('\n🔧 Gerando simulações refinadas...')
    const simulacoesRefinadas = gerarSimulacoesRefinadas(2000, 2024)
    console.log(`✓ ${simulacoesRefinadas.length} simulações geradas`)

    console.log('\n📈 Validando modelo refinado...')
    const validacao = validarModeloRefinado(dadosOriginais, simulacoesRefinadas)
    console.log(`R² Original:  ${validacao.r2_original.toFixed(4)}`)
    console.log(`R² Refinado:  ${validacao.r2_refinado.toFixed(4)}`)
    console.log(`Melhoria:     ${validacao.melhoria_r2.toFixed(4)}`)

    console.log(`\n╔════════════════════════════════════════════════════════════════════════════╗
║                      FASE 2.5 CONCLUÍDA COM SUCESSO                        ║
╚════════════════════════════════════════════════════════════════════════════╝\n`)
  } catch (error) {
    console.error('Erro:', error)
    process.exit(1)
  }
}

executarFase25()
