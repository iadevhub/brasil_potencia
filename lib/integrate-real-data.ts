/**
 * SCRIPT PARA INTEGRAR DADOS REAIS NO SISTEMA
 * 
 * Executa todas as tarefas de FASE 1 e salva os dados
 * Executar: npx tsx lib/integrate-real-data.ts
 */

import { 
  buscarCambioHistoricoBCB,
  buscarProducaoIndustrialIBGE,
  buscarCommoditiesHistoricoFRED,
  buscarProducaoEnergiaONS,
  buscarReservasInternacionaisBCB,
  gerarHistoricoReal
} from './fetch-real-data'

// Cores para console
const cores = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

async function integrarDadosReais() {
  console.clear()
  console.log('')
  console.log(`${cores.cyan}${'='.repeat(70)}${cores.reset}`)
  console.log(`${cores.bright}🚀 INTEGRAÇÃO DE DADOS REAIS - FASE 1${cores.reset}`)
  console.log(`${cores.cyan}${'='.repeat(70)}${cores.reset}`)
  console.log('')
  console.log(`${cores.yellow}Objetivo: Substituir dados simulados por dados reais de APIs${cores.reset}`)
  console.log(`${cores.yellow}APIs: BCB, IBGE, FRED, ONS${cores.reset}`)
  console.log('')
  console.log(`${cores.cyan}Início: ${new Date().toLocaleString('pt-BR')}${cores.reset}`)
  console.log('')
  
  const tempoInicio = Date.now()
  
  try {
    // TAREFA 1.1
    console.log(`${cores.bright}[TAREFA 1.1/6]${cores.reset} Buscando Câmbio Histórico BCB...`)
    const cambio = await buscarCambioHistoricoBCB()
    console.log(`${cores.green}✅ CONCLUÍDA${cores.reset}: ${cambio.length} anos`)
    console.log('')
    
    // TAREFA 1.2
    console.log(`${cores.bright}[TAREFA 1.2/6]${cores.reset} Buscando Produção Industrial IBGE...`)
    const industria = await buscarProducaoIndustrialIBGE()
    console.log(`${cores.green}✅ CONCLUÍDA${cores.reset}: ${industria.length} anos`)
    console.log('')
    
    // TAREFA 1.3
    console.log(`${cores.bright}[TAREFA 1.3/6]${cores.reset} Buscando Commodities FRED...`)
    const commodities = await buscarCommoditiesHistoricoFRED()
    console.log(`${cores.green}✅ CONCLUÍDA${cores.reset}: ${commodities.length} anos`)
    console.log('')
    
    // TAREFA 1.4
    console.log(`${cores.bright}[TAREFA 1.4/6]${cores.reset} Buscando Produção de Energia ONS/EPE...`)
    const energia = await buscarProducaoEnergiaONS()
    console.log(`${cores.green}✅ CONCLUÍDA${cores.reset}: ${energia.length} anos`)
    console.log('')
    
    // TAREFA 1.5
    console.log(`${cores.bright}[TAREFA 1.5/6]${cores.reset} Buscando Reservas Cambiais BCB...`)
    const reservas = await buscarReservasInternacionaisBCB()
    console.log(`${cores.green}✅ CONCLUÍDA${cores.reset}: ${reservas.length} anos`)
    console.log('')
    
    // TAREFA 1.6
    console.log(`${cores.bright}[TAREFA 1.6/6]${cores.reset} Consolidando Histórico Real...`)
    const historicoReal = await gerarHistoricoReal()
    console.log(`${cores.green}✅ CONCLUÍDA${cores.reset}: ${historicoReal.length} anos consolidados`)
    console.log('')
    
    // Resumo
    console.log(`${cores.cyan}${'='.repeat(70)}${cores.reset}`)
    console.log(`${cores.green}${cores.bright}📊 RESUMO DE DADOS OBTIDOS${cores.reset}`)
    console.log(`${cores.cyan}${'='.repeat(70)}${cores.reset}`)
    console.log('')
    
    console.log(`${cores.blue}CÂMBIO BCB:${cores.reset}`)
    if (cambio.length > 0) {
      console.log(`  • Anos: ${cambio[0].year} - ${cambio[cambio.length - 1].year}`)
      const c2010 = cambio.find(d => d.year === 2010)
      const c2024 = cambio.find(d => d.year === 2024)
      console.log(`  • 2010: R$ ${c2010?.cambio} (base esperada: 1.76)`)
      console.log(`  • 2024: R$ ${c2024?.cambio}`)
    }
    console.log('')
    
    console.log(`${cores.blue}PRODUÇÃO INDUSTRIAL IBGE:${cores.reset}`)
    if (industria.length > 0) {
      console.log(`  • Anos: ${industria[0].year} - ${industria[industria.length - 1].year}`)
      const i2010 = industria.find(d => d.year === 2010)
      console.log(`  • 2010 (base 100): ${i2010?.indice}`)
    }
    console.log('')
    
    console.log(`${cores.blue}COMMODITIES FRED:${cores.reset}`)
    if (commodities.length > 0) {
      console.log(`  • Anos: ${commodities[0].year} - ${commodities[commodities.length - 1].year}`)
      const com2010 = commodities.find(d => d.year === 2010)
      if (com2010) {
        console.log(`  • 2010 (índice): Soja=${com2010.soja}, Ferro=${com2010.ferro}, Petróleo=${com2010.petroleo}`)
      }
    }
    console.log('')
    
    console.log(`${cores.blue}ENERGIA ONS:${cores.reset}`)
    if (energia.length > 0) {
      console.log(`  • Anos: ${energia[0].year} - ${energia[energia.length - 1].year}`)
      const e2010 = energia.find(d => d.year === 2010)
      console.log(`  • 2010 (base 100): ${e2010?.indice}`)
    }
    console.log('')
    
    console.log(`${cores.blue}RESERVAS CAMBIAIS BCB:${cores.reset}`)
    if (reservas.length > 0) {
      console.log(`  • Anos: ${reservas[0].year} - ${reservas[reservas.length - 1].year}`)
      const r2010 = reservas.find(d => d.year === 2010)
      const r2024 = reservas.find(d => d.year === 2024)
      console.log(`  • 2010: US$ ${r2010?.reservas} bi (base esperada: 289)`)
      console.log(`  • 2024: US$ ${r2024?.reservas} bi`)
    }
    console.log('')
    
    console.log(`${cores.blue}HISTÓRICO CONSOLIDADO:${cores.reset}`)
    if (historicoReal.length > 0) {
      console.log(`  • Total de anos: ${historicoReal.length}`)
      console.log(`  • Período: ${historicoReal[0].year} - ${historicoReal[historicoReal.length - 1].year}`)
      console.log(`  • Status: ${cores.green}✅ PRONTO PARA USAR${cores.reset}`)
    }
    console.log('')
    
    // Tempo total
    const tempoTotal = ((Date.now() - tempoInicio) / 1000).toFixed(2)
    console.log(`${cores.cyan}${'='.repeat(70)}${cores.reset}`)
    console.log(`${cores.yellow}⏱️  Tempo total: ${tempoTotal}s${cores.reset}`)
    console.log(`${cores.cyan}${'='.repeat(70)}${cores.reset}`)
    console.log('')
    
    // Próximas ações
    console.log(`${cores.bright}${cores.green}🎯 PRÓXIMAS AÇÕES:${cores.reset}`)
    console.log('')
    console.log(`${cores.cyan}1. Validar dados com testes${cores.reset}`)
    console.log(`   $ npx tsx lib/validate-task-1.ts`)
    console.log('')
    console.log(`${cores.cyan}2. Integrar histórico real no brasil-data.ts${cores.reset}`)
    console.log(`   - Substitua historicalData[] com dados reais`)
    console.log(`   - Execute testes`)
    console.log('')
    console.log(`${cores.cyan}3. Validar correlações${cores.reset}`)
    console.log(`   - Câmbio vs Commodities: deve ser > 0.70`)
    console.log(`   - Câmbio vs ICB: deve ser > 0.85 (após modelo completo)`)
    console.log('')
    console.log(`${cores.green}${cores.bright}✅ FASE 1 PRONTA PARA INTEGRAÇÃO${cores.reset}`)
    console.log('')
    
  } catch (erro) {
    console.log(`${cores.red}${cores.bright}❌ ERRO DURANTE INTEGRAÇÃO:${cores.reset}`)
    console.error(erro)
  }
}

// Executar
integrarDadosReais().catch(console.error)
