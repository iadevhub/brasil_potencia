#!/usr/bin/env node

import { execSync } from 'child_process'

async function executarTodasAsFases() {
  console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                   🇧🇷 BRASIL POTÊNCIA - EXECUÇÃO COMPLETA 🇧🇷                   ║
╚════════════════════════════════════════════════════════════════════════════╝`)

  const fases = [
    { numero: '2.5', arquivo: 'lib/master-phase25.ts' },
    { numero: '3', arquivo: 'lib/master-phase3.ts' },
    { numero: '4', arquivo: 'lib/master-phase4.ts' },
  ]

  let concluidas = 0

  for (const fase of fases) {
    try {
      console.log(`\n▶ FASE ${fase.numero}`)
      execSync(`npx tsx ${fase.arquivo}`, { stdio: 'inherit' })
      concluidas++
    } catch (error) {
      console.error(`❌ Erro na FASE ${fase.numero}:`, error)
      break
    }
  }

  console.log(`\nFases concluídas: ${concluidas}/${fases.length}`)
}

executarTodasAsFases().catch((error) => {
  console.error('Erro fatal:', error)
  process.exit(1)
})
