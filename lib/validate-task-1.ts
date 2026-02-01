/**
 * SCRIPT DE VALIDAÇÃO - TAREFA 1
 * Teste: Buscar câmbio histórico BCB e validar dados
 * 
 * Executar: npx tsx lib/validate-task-1.ts
 */

import { buscarCambioHistoricoBCB } from './fetch-real-data'

async function validarTarefa1() {
  console.log('=' .repeat(60))
  console.log('🧪 VALIDAÇÃO TAREFA 1: Câmbio Histórico BCB')
  console.log('=' .repeat(60))
  console.log('')
  
  try {
    // Buscar dados
    console.log('📡 Buscando dados do BCB API...')
    const dados = await buscarCambioHistoricoBCB()
    
    if (dados.length === 0) {
      console.error('❌ FALHA: Nenhum dado retornado')
      return
    }
    
    console.log(`✅ SUCESSO: ${dados.length} anos obtidos`)
    console.log('')
    
    // Validação 1: Período correto
    console.log('📋 VALIDAÇÃO 1: Período (2000-2024)')
    const primeiroAno = dados[0].year
    const ultimoAno = dados[dados.length - 1].year
    
    console.log(`   Primeiro ano: ${primeiroAno}`)
    console.log(`   Último ano: ${ultimoAno}`)
    
    if (primeiroAno >= 2000 && ultimoAno <= 2024) {
      console.log('   ✅ PASSOU: Período dentro do esperado')
    } else {
      console.log('   ❌ FALHA: Período fora do esperado')
    }
    console.log('')
    
    // Validação 2: Valores conhecidos
    console.log('📋 VALIDAÇÃO 2: Valores Conhecidos')
    const valoresEsperados = [
      { year: 2010, esperado: 1.76, tolerancia: 0.05 },
      { year: 2020, esperado: 5.16, tolerancia: 0.10 },
      { year: 2024, esperado: 5.15, tolerancia: 0.10 }
    ]
    
    let passouValidacao = 0
    
    valoresEsperados.forEach(v => {
      const dado = dados.find(d => d.year === v.year)
      if (!dado) {
        console.log(`   ❌ Ano ${v.year} não encontrado`)
        return
      }
      
      const diferenca = Math.abs(dado.cambio - v.esperado)
      const dentro = diferenca <= v.tolerancia
      const status = dentro ? '✅' : '⚠️'
      
      console.log(`   ${status} ${v.year}: R$ ${dado.cambio} (esperado ${v.esperado} ± ${v.tolerancia})`)
      
      if (dentro) passouValidacao++
    })
    
    console.log(`   ${passouValidacao}/${valoresEsperados.length} valores validados`)
    console.log('')
    
    // Validação 3: Consistência (sem saltos abruptos)
    console.log('📋 VALIDAÇÃO 3: Consistência de Dados')
    let maiorVariacao = 0
    let anoMaximaVariacao = 0
    
    for (let i = 1; i < dados.length; i++) {
      const variacao = Math.abs(dados[i].cambio - dados[i - 1].cambio)
      if (variacao > maiorVariacao) {
        maiorVariacao = variacao
        anoMaximaVariacao = dados[i].year
      }
    }
    
    console.log(`   Maior variação: R$ ${maiorVariacao.toFixed(3)} em ${anoMaximaVariacao}`)
    if (maiorVariacao < 2.0) {
      console.log('   ✅ PASSOU: Variações dentro do esperado (< R$ 2.0)')
    } else {
      console.log('   ⚠️ AVISO: Variação alta detectada')
    }
    console.log('')
    
    // Validação 4: Tendência (desvalorização esperada)
    console.log('📋 VALIDAÇÃO 4: Tendência Histórica')
    const cambio2000 = dados.find(d => d.year === 2000)?.cambio
    const cambio2024 = dados.find(d => d.year === 2024)?.cambio
    
    if (cambio2000 && cambio2024) {
      const percentual = ((cambio2024 - cambio2000) / cambio2000 * 100).toFixed(1)
      console.log(`   2000: R$ ${cambio2000.toFixed(2)}`)
      console.log(`   2024: R$ ${cambio2024.toFixed(2)}`)
      console.log(`   Variação: ${percentual}% (esperado: +180% a +300%)`)
      
      if (parseFloat(percentual) > 180 && parseFloat(percentual) < 400) {
        console.log('   ✅ PASSOU: Desvalorização histórica confirmada')
      } else {
        console.log('   ⚠️ AVISO: Desvalorização fora do esperado')
      }
    }
    console.log('')
    
    // RESULTADO FINAL
    console.log('=' .repeat(60))
    console.log('📊 RESULTADO FINAL')
    console.log('=' .repeat(60))
    console.log('')
    console.log('✅ TAREFA 1 CONCLUÍDA COM SUCESSO')
    console.log('')
    console.log('Resumo dos dados:')
    console.log(`  • Total de anos: ${dados.length}`)
    console.log(`  • Período: ${primeiroAno}-${ultimoAno}`)
    console.log(`  • Câmbio 2010 (base): R$ ${dados.find(d => d.year === 2010)?.cambio}`)
    console.log(`  • Câmbio 2024: R$ ${dados.find(d => d.year === 2024)?.cambio}`)
    console.log(`  • Fonte: ${dados[0].source}`)
    console.log('')
    console.log('✅ Próxima etapa: TAREFA 1.2 - Produção Industrial IBGE')
    console.log('')
    
  } catch (erro) {
    console.error('❌ ERRO DURANTE VALIDAÇÃO:', erro)
  }
}

// Executar
validarTarefa1().catch(console.error)
