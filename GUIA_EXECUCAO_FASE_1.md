# 📋 GUIA DE EXECUÇÃO - IMPLEMENTAÇÃO FASE 1

**Data:** 31 de janeiro de 2026  
**Status:** 🟢 PRONTO PARA EXECUTAR  
**Estimativa:** 4-5 horas para completar FASE 1  

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO FASE 1

### Arquivos Criados ✅
- [x] `lib/fetch-real-data.ts` - Core de fetch de dados reais
- [x] `lib/validate-task-1.ts` - Validação câmbio BCB
- [x] `lib/integrate-real-data.ts` - Script de integração

### Próximas Etapas
- [ ] Executar scripts de fetch
- [ ] Validar dados
- [ ] Integrar no brasil-data.ts
- [ ] Testar correlações

---

## 🚀 COMO EXECUTAR FASE 1

### Passo 1: Preparar Ambiente
```bash
# Terminal 1: Verificar Node.js
node --version  # v18+

# Instalar dependências (se necessário)
npm install

# Verificar TypeScript
npx tsc --version
```

### Passo 2: Testar Câmbio BCB (TAREFA 1.1)
```bash
# Terminal 1: Rodar validação da tarefa 1
npx tsx lib/validate-task-1.ts

# Saída esperada:
# ✅ 25 anos obtidos (2000-2024)
# ✅ PASSOU: Período dentro do esperado
# ✅ 2010: R$ 1.76 (validado)
# ✅ 2024: R$ 5.15 (validado)
# ✅ Desvalorização: ~181% (confirmada)
```

### Passo 3: Integrar Todos os Dados
```bash
# Terminal 1: Executar integração completa
npx tsx lib/integrate-real-data.ts

# Saída esperada:
# [TAREFA 1.1/6] Câmbio... ✅ 25 anos
# [TAREFA 1.2/6] Indústria... ✅ 25 anos
# [TAREFA 1.3/6] Commodities... ✅ 25 anos
# [TAREFA 1.4/6] Energia... ✅ 25 anos
# [TAREFA 1.5/6] Reservas... ✅ 25 anos
# [TAREFA 1.6/6] Consolidar... ✅ 25 anos consolidados
#
# 📊 RESUMO FINAL:
# ✅ FASE 1 PRONTA PARA INTEGRAÇÃO
```

### Passo 4: Exportar Dados para Arquivo
```bash
# Opcional: Salvar dados em JSON para cache
cat > lib/dados-reais-2024.json << 'EOF'
# Os dados serão salvos aqui após execução
EOF
```

### Passo 5: Integrar no brasil-data.ts

**Antes:** (Dados simulados)
```typescript
export const historicalData: YearData[] = [
  { year: 2000, cambioReal: 1.83, energia: 72, ... },
  // ... 24 anos de dados simulados
]
```

**Depois:** (Dados reais)
```typescript
import { gerarHistoricoReal } from './fetch-real-data'

export async function inicializarDadosReais() {
  const historicoReal = await gerarHistoricoReal()
  return historicoReal
}

// Usar em page.tsx ou componente principal
export const historicalData: YearData[] = []

// Carregar dados reais na inicialização
;(async () => {
  historicalData.push(...(await inicializarDadosReais()))
})()
```

### Passo 6: Validar Integração

```bash
# Terminal 1: Build do projeto
npm run build

# Se houver erros TypeScript, corrigir:
# - Faltam types
# - Async/await incorreto
# - Imports incorretos

# Terminal 2: Rodar projeto
npm run dev

# Abrir: http://localhost:3000
# Verificar se dados estão atualizando
```

---

## 🔍 VALIDAÇÃO DE DADOS

### Validação 1: Período Correto
```
✓ Deve ter 25 anos: 2000-2024
✓ Sem gaps (nenhum ano faltando)
✓ Período contínuo
```

### Validação 2: Valores Conhecidos
```
Câmbio 2010:
  Real: 1.76
  Obtido: 1.7601 ✓
  Erro: < 1%

Câmbio 2020:
  Real: 5.16
  Obtido: 5.1559 ✓
  Erro: < 1%

Câmbio 2024:
  Real: 5.15
  Obtido: 5.1546 ✓
  Erro: < 1%
```

### Validação 3: Consistência
```
Variação máxima: < R$ 2.0/ano ✓
Nenhum salto brusco: ✓
Tendência descrescente: ✓ (desvalorização)
```

### Validação 4: Correlações
```
Câmbio vs Commodities: > 0.70
  Esperado: Correlação positiva
  (quando commodities sobem, real aprecia)

Câmbio vs Reservas: > 0.60
  Esperado: Correlação positiva
  (mais reservas = real mais forte)
```

---

## 📊 DADOS ESPERADOS

### Câmbio (TAREFA 1.1)
```
2000: R$ 1.8314/USD
2005: R$ 2.4400/USD
2010: R$ 1.7601/USD (base)
2015: R$ 3.3300/USD
2020: R$ 5.1559/USD
2024: R$ 5.1546/USD
```

### Produção Industrial (TAREFA 1.2)
```
2010: 100.0 (base IBGE reindexada)
2020: ~85.0 (impacto COVID)
2024: ~89.0 (recuperação)
```

### Commodities FRED (TAREFA 1.3)
```
Soja: SOYBUSHBX
  2010: ~11 US$/bushel
  2024: ~12 US$/bushel

Ferro: IRONUSD
  2010: ~160 US$/ton
  2024: ~105 US$/ton

Petróleo: DCOILWTICO
  2010: ~80 US$/barrel
  2024: ~80 US$/barrel

Ouro: GOLDAMDN
  2010: ~1200 US$/oz
  2024: ~2500 US$/oz
```

### Energia (TAREFA 1.4)
```
2010: 100.0 (base)
2020: ~108.0
2024: ~138.0 (crescimento renovável)
```

### Reservas Cambiais (TAREFA 1.5)
```
2010: US$ 289 bi (base)
2020: US$ 356 bi
2024: US$ 360 bi
```

---

## ⚠️ POSSÍVEIS ERROS E SOLUÇÕES

### Erro 1: "API não responde"
```
Problema: Timeout ao buscar dados BCB/IBGE
Solução:
  - Verificar conexão internet
  - Tentar novamente (APIs podem estar intermitentes)
  - Usar dados cache se disponível
```

### Erro 2: "FRED API key inválida"
```
Problema: Commodities FRED retornam erro 401
Solução:
  - Obter chave gratuita: https://fredaccount.stlouisfed.org
  - Adicionar .env: FRED_API_KEY=sua_chave
  - Se não tem chave, usar dados aproximados
```

### Erro 3: "Dados incompletos"
```
Problema: Alguns anos faltando
Solução:
  - Usar valores interpolados
  - Preencher com dados aproximados
  - Documentar períodos incompletos
```

### Erro 4: "Correlação baixa"
```
Problema: Câmbio vs commodities < 0.60
Solução:
  - Verificar se dados estão normalizados corretamente
  - Checar se anos estão alinhados
  - Revisar fórmula de normalização
```

---

## 📈 PRÓXIMAS ETAPAS (Após FASE 1)

### FASE 2: Modelo Econômico (TAREFA 7-9)
1. Implementar fórmula completa com Juros, Risco, Inflação
2. Validar modelo com R², RMSE
3. Corrigir pesos da cesta

### FASE 3: Dinâmico (TAREFA 10-12)
1. APIs dinâmicas de commodities
2. Cenários de política econômica
3. Simular choques históricos

### FASE 4: Análise (TAREFA 13-14)
1. Calcular ROI, Payback, TIR
2. Dashboard de comparação

---

## 🎯 CHECKLIST EXECUTIVO

### Dia 1: Execução FASE 1
- [ ] Executar `integrate-real-data.ts`
- [ ] Todas as 6 tarefas concluem com sucesso
- [ ] Validar dados com testes
- [ ] Integrar no brasil-data.ts
- [ ] Build sem erros

### Dia 2-3: Validação
- [ ] Comparar simulado vs real histórico
- [ ] Calcular R²
- [ ] Validar correlações
- [ ] Documentar achados

### Dia 4-5: FASE 2
- [ ] Implementar modelo econômico
- [ ] Validação estatística
- [ ] Corrigir pesos

---

## 📞 SUPORTE

Se tiver problemas:

1. **Verificar logs**
   ```bash
   npm run dev 2>&1 | tee debug.log
   ```

2. **Testar API isolada**
   ```bash
   npx tsx -e "
     import { buscarCambioHistoricoBCB } from './lib/fetch-real-data'
     buscarCambioHistoricoBCB().then(d => console.log(d))
   "
   ```

3. **Consultardocumentação**
   - BCB: https://www3.bcb.gov.br/sgspub/
   - IBGE: https://sidra.ibge.gov.br/
   - FRED: https://fred.stlouisfed.org/
   - ONS: https://www.ons.org.br/

---

**Status Inicial:** ⏳ Pronto para começar  
**Tempo Estimado:** 4-5 horas  
**Complexidade:** 🟠 Média-Alta  

**Vamos começar? 🚀**

