# 📋 PLANO DE TAREFAS - IMPLEMENTAÇÃO COMPLETA
## Real Atrelado à Cesta Produtiva Estratégica

**Data Início:** 31 de janeiro de 2026  
**Data Alvo:** 14 de março de 2026 (6 semanas)  
**Total Tarefas:** 15 principais + subtarefas  
**Status:** 🔴 NÃO INICIADO

---

## 📊 ESTRUTURA DO PLANO

```
FASE 1: DADOS REAIS (Semana 1-2)
├─ ✓ [1] Fetch Câmbio Histórico BCB
├─ ✓ [2] Fetch Produção Industrial IBGE
├─ ✓ [3] Fetch Commodities FRED
├─ ✓ [4] Fetch Energia ONS/EPE
├─ ✓ [5] Fetch Reservas BCB
└─ ✓ [6] Consolidar Histórico Real

FASE 2: MODELO ECONÔMICO (Semana 2-3)
├─ ✓ [7] Implementar Modelo Completo
├─ ✓ [8] Validação Estatística
└─ ✓ [9] Corrigir Pesos da Cesta

FASE 3: DINÂMICO + CENÁRIOS (Semana 3-4)
├─ ✓ [10] APIs Dinâmicas
├─ ✓ [11] Cenários de Política
└─ ✓ [12] Choques Históricos

FASE 4: ANÁLISE (Semana 4)
├─ ✓ [13] ROI/Payback
└─ ✓ [14] Dashboard Comparação

VALIDAÇÃO FINAL
└─ ✓ [15] Testes + Deploy
```

---

# 🔴 FASE 1: DADOS REAIS
## Objetivo: Substituir dados simulados por dados reais

---

## ✅ TAREFA 1: Fetch Câmbio Histórico BCB
**Prioridade:** 🔴 CRÍTICA  
**Tempo:** 3 horas  
**Status:** ⏳ NÃO INICIADO

### Descrição
Buscar histórico completo de câmbio (Real/USD) de 2000 a 2024 do Banco Central do Brasil.

### Entrega
- Arquivo: `lib/fetch-real-data.ts` (NEW)
- Função: `buscarCambioHistoricoBCB()`
- Formato: Array de {year, cambio}

### Especificação Técnica
```typescript
// URL: https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados?formato=json
// Série: 1 = PTAX - Dólar Venda (oficial)
// Período: 01/01/2000 a 31/12/2024
// Método: GET (não requer autenticação)

// Output esperado:
[
  { year: 2000, cambio: 1.8314 },
  { year: 2001, cambio: 2.3507 },
  ...
  { year: 2024, cambio: 5.1546 }
]
```

### Subtarefas
- [ ] Criar arquivo `lib/fetch-real-data.ts`
- [ ] Implementar função `buscarCambioHistoricoBCB()`
- [ ] Parser de resposta JSON BCB
- [ ] Agrupamento mensal → anual (média)
- [ ] Error handling + retry logic
- [ ] Validação: Comparar 2010 (1.76) com dados BCB
- [ ] Teste: Rodar função e verificar dados

### Validação de Sucesso
```
✓ 2000: 1.8314
✓ 2010: 1.7601 (vs nosso base 1.76)
✓ 2020: 5.1559
✓ 2024: 5.1546
```

---

## ✅ TAREFA 2: Fetch Produção Industrial IBGE
**Prioridade:** 🔴 CRÍTICA  
**Tempo:** 4 horas  
**Status:** ⏳ NÃO INICIADO

### Descrição
Buscar índice de produção industrial do Brasil (2000-2024) do IBGE SIDRA.

### Entrega
- Função: `buscarProducaoIndustrialIBGE()`
- Formato: Array de {year, indice}
- Base: 2012 = 100, reindexar para 2010 = 100

### Especificação Técnica
```
API: IBGE SIDRA (Statistics and Indicators System)
URL: https://apisidra.ibge.gov.br/values
Tabela: 9545 (Produção Industrial - Índice Geral)
Período: 201001 a 202412 (mensal)
Variável: 12 (Índice)
```

### Subtarefas
- [ ] Consultar IBGE SIDRA API
- [ ] Parser de dados mensais
- [ ] Converter base 2012 = 100 → 2010 = 100
- [ ] Agregar mensal → anual (média móvel 12m)
- [ ] Error handling

### Validação de Sucesso
```
✓ 2010: 100 (base)
✓ 2020: ~85 (COVID impact)
✓ 2024: ~89
```

---

## ✅ TAREFA 3: Fetch Commodities FRED
**Prioridade:** 🔴 CRÍTICA  
**Tempo:** 5 horas  
**Status:** ⏳ NÃO INICIADO

### Descrição
Buscar histórico de preços de commodities (Soja, Ferro, Petróleo, Ouro) do FRED.

### Entrega
- Função: `buscarCommoditiesHistoricoFRED()`
- Commodities: 
  - Soja: SOYBUSHBX (US$/bushel)
  - Ferro: IRONUSD (US$/ton)
  - Petróleo: DCOILWTICO (US$/barrel)
  - Ouro: GOLDAMDN (US$/oz)
- Formato: Array de {year, soja, ferro, petroleo, ouro}

### Especificação Técnica
```
API: Federal Reserve Economic Data (FRED)
URL: https://api.stlouisfed.org/fred/series/data
Chave: process.env.FRED_API_KEY (gratuita em stlouisfed.org)
Dados: Diários, agregar para anual (média)
```

### Subtarefas
- [ ] Registrar em https://fredaccount.stlouisfed.org para chave API
- [ ] Implementar fetch para cada commodity
- [ ] Agregar diário → anual
- [ ] Normalizar para índice (2010 = 100)
- [ ] Validação cruzada com dados históricos conhecidos

### Validação de Sucesso
```
✓ Soja 2010: R$ X/sc (verificar com CEPEA)
✓ Ferro 2010: R$ Y/ton (verificar com USGS)
✓ Correlação com histórico: > 0.90
```

---

## ✅ TAREFA 4: Fetch Energia ONS/EPE
**Prioridade:** 🔴 CRÍTICA  
**Tempo:** 2 horas  
**Status:** ⏳ NÃO INICIADO

### Descrição
Buscar índice de produção de energia do Brasil (Hidro + Térmica + Eólica + Solar).

### Entrega
- Função: `buscarProducaoEnergiaONS()`
- Formato: Array de {year, indice}
- Base: 2010 = 100

### Especificação Técnica
```
Fonte 1: ONS (Operador Nacional do Sistema)
- Não tem API pública, usar dados tabulados
- Alternativamente: EPE (Empresa de Pesquisa Energética)

Fonte 2: BCB Série 1391 (Eletricidade produzida)

Fonte 3: INMET (Dados de irradiação solar)
```

### Subtarefas
- [ ] Buscar arquivo de histórico ONS/EPE
- [ ] Parsing de dados (Excel → JSON)
- [ ] Normalizar para índice 2010 = 100
- [ ] Incluir eólica + solar (crescimento recente)

### Validação de Sucesso
```
✓ 2010: 100 (base)
✓ 2020: ~120 (crescimento energias renováveis)
✓ 2024: ~140
```

---

## ✅ TAREFA 5: Fetch Reservas BCB
**Prioridade:** 🔴 CRÍTICA  
**Tempo:** 2 horas  
**Status:** ⏳ NÃO INICIADO

### Descrição
Buscar histórico de reservas internacionais do Brasil (US$ bi).

### Entrega
- Função: `buscarReservasInternacionaisBCB()`
- Formato: Array de {year, reservas}
- Unidade: US$ bilhões

### Especificação Técnica
```
API: BCB
URL: https://api.bcb.gov.br/dados/serie/bcdata.sgs.13521/dados?formato=json
Série: 13521 (Reservas internacionais)
Período: 2000-2024 (semanal, agregar para anual)
```

### Subtarefas
- [ ] Fetch API BCB série 13521
- [ ] Agregar semanal → anual (fim do período)
- [ ] Converter formato (valores em string → number)

### Validação de Sucesso
```
✓ 2010: 289 bi (nosso base = 289)
✓ 2020: 355 bi
✓ 2024: 360 bi
```

---

## ✅ TAREFA 6: Consolidar Histórico Real
**Prioridade:** 🔴 CRÍTICA  
**Tempo:** 3 horas  
**Status:** ⏳ NÃO INICIADO

### Descrição
Combinar dados de todas as 5 tarefas anteriores em um histórico único validado.

### Entrega
- Função: `gerarHistoricoReal()`
- Saída: Array de `YearData[]` com dados reais
- Arquivo: `lib/dados-reais-2024.json` (cache)

### Especificação Técnica
```typescript
export async function gerarHistoricoReal(): Promise<YearData[]> {
  const cambio = await buscarCambioHistoricoBCB()
  const industria = await buscarProducaoIndustrialIBGE()
  const energia = await buscarProducaoEnergiaONS()
  const commodities = await buscarCommoditiesHistoricoFRED()
  const reservas = await buscarReservasInternacionaisBCB()
  
  // Combinar todos em um array único
  // Validar correlações: cambio vs commodities
  // Exportar como JSON para cache
  
  return historicoCombinado
}
```

### Subtarefas
- [ ] Sincronizar períodos (todos 2000-2024)
- [ ] Validar consistência de dados
- [ ] Calcular correlações (câmbio vs commodities)
- [ ] Exportar JSON cache
- [ ] Atualizar `historicalData` em brasil-data.ts

### Validação de Sucesso
```
✓ Todos os anos 2000-2024 presentes
✓ Correlação câmbio vs commodities: > 0.70
✓ Nenhum valor nulo/undefined
✓ Banco de dados salvo em cache
```

---

# 🟠 FASE 2: MODELO ECONÔMICO
## Objetivo: Implementar modelo economicamente correto

---

## ✅ TAREFA 7: Implementar Modelo Econômico Completo
**Prioridade:** 🔴 CRÍTICA  
**Tempo:** 6 horas  
**Status:** ⏳ NÃO INICIADO

### Descrição
Substituir fórmula simples por modelo econométrico completo que inclui:
- Diferencial de Juros (SELIC vs Fed Funds)
- Prêmio de Risco (CDS Brasil)
- Inflação Relativa (Brasil vs EUA)

### Entrega
- Função: `calcularRealSimuladoCompleto(icb, ano)`
- Fórmula: Real = Base × FatorICB × FatorJuros × FatorRisco × FatorInflacao
- Localização: `lib/brasil-data.ts`

### Especificação Técnica
```typescript
export function calcularRealSimuladoCompleto(
  icbAtual: number,
  icbBase: number = 100,
  ano: number = 2024
): number {
  // Fator 1: Índice Cesta (dominante)
  const fatorCesta = icbBase / icbAtual
  
  // Fator 2: Diferencial de Juros (PPP)
  const jurosEUA = obterJurosHistoricos(ano, 'USA')  // Fed Funds
  const jurosBrasil = obterJurosHistoricos(ano, 'BRA')  // SELIC
  const diferencialJuros = 1 + ((jurosBrasil - jurosEUA) / 100)
  
  // Fator 3: Prêmio de Risco (CDS)
  const cdsBrasil = obterCDSHistoricos(ano)
  const premioRisco = 1 + (cdsBrasil / 10000)
  
  // Fator 4: Inflação Relativa
  const inflacaoRelativa = 1 + (
    (obterInflacaoHistorica(ano, 'BRA') - 
     obterInflacaoHistorica(ano, 'USA')) / 100
  )
  
  return baseValues.cambioBase * 
    fatorCesta * 
    diferencialJuros * 
    premioRisco * 
    inflacaoRelativa
}
```

### Subtarefas
- [ ] Criar constantes históricas de juros (SELIC, Fed Funds)
- [ ] Criar constantes históricas de CDS Brasil
- [ ] Criar constantes históricas de inflação
- [ ] Implementar funções de lookup
- [ ] Testes unitários para cada fator
- [ ] Validar em anos conhecidos (2010, 2020, 2024)

### Dados Necessários
```typescript
// Taxas de Juros Anuais (%)
const jurosHistoricos = {
  USA: {
    2000: 6.24, 2005: 3.22, 2010: 0.18, 2015: 0.13, 2020: 0.38, 2024: 4.25
  },
  BRA: {
    2000: 19.00, 2005: 18.00, 2010: 11.25, 2015: 13.75, 2020: 2.00, 2024: 12.25
  }
}

// CDS Brasil (basis points)
const cdsHistoricos = {
  2000: 850, 2005: 350, 2010: 180, 2015: 220, 2020: 280, 2024: 140
}

// Inflação Anual (%)
const inflaHistorica = {
  USA: { 2000: 3.39, 2010: 1.64, 2020: 1.24, 2024: 3.15 },
  BRA: { 2000: 9.32, 2010: 5.91, 2020: 10.16, 2024: 4.57 }
}
```

### Validação de Sucesso
```
2010 (Baseline):
  Real Atual: 1.76
  Real Calculado: ~1.75
  Erro: < 1% ✓

2020 (COVID):
  Real Atual: 5.16
  Real Calculado: ~4.80
  Erro: ~7% ✓
```

---

## ✅ TAREFA 8: Validação Estatística
**Prioridade:** 🔴 CRÍTICA  
**Tempo:** 4 horas  
**Status:** ⏳ NÃO INICIADO

### Descrição
Calcular métricas de qualidade do modelo (R², RMSE, MAE, Durbin-Watson).

### Entrega
- Função: `validarModeloEconomico()`
- Resultado: Relatório com R², RMSE, normalidade
- Saída: Arquivo `VALIDACAO_MODELO_ESTATISTICA.md`

### Especificação Técnica
```typescript
export function validarModeloEconomico(
  previsoes: number[],
  realidade: number[]
): ModelValidation {
  const r2 = calcularR2(previsoes, realidade)
  const rmse = calcularRMSE(previsoes, realidade)
  const mae = calcularMAE(previsoes, realidade)
  const dw = testeDBWatson(previsoes, realidade)
  const normalidade = testeShapiroWilk(resíduos)
  
  return {
    r2,           // Esperado: > 0.85
    rmse,         // Esperado: < 0.50
    mae,          // Esperado: < 0.30 R$
    dw,           // Esperado: 1.5 a 2.5
    normalidade,  // Esperado: p-value > 0.05
    qualidade: r2 > 0.85 ? "ÓTIMA" : r2 > 0.70 ? "BOA" : "INSUFICIENTE"
  }
}
```

### Subtarefas
- [ ] Implementar cálculo de R² (coeficiente determinação)
- [ ] Implementar cálculo de RMSE (raiz erro quadrático médio)
- [ ] Implementar cálculo de MAE (erro médio absoluto)
- [ ] Implementar teste Durbin-Watson (autocorrelação)
- [ ] Implementar teste Shapiro-Wilk (normalidade)
- [ ] Gerar gráfico: Previsão vs Realidade
- [ ] Documentar limitações do modelo

### Validação de Sucesso
```
R²: > 0.80 (modelo explica 80%+ da variação)
RMSE: < R$ 0.50 (erro médio aceitável)
MAE: < R$ 0.30 (erro absoluto aceitável)
Modelo: ✓ APROVADO se critérios atingidos
```

---

## ✅ TAREFA 9: Corrigir Pesos da Cesta
**Prioridade:** 🔴 CRÍTICA  
**Tempo:** 3 horas  
**Status:** ⏳ NÃO INICIADO

### Descrição
Baseado em dados reais de exportação, corrigir os pesos da cesta (atualmente arbitrários).

### Entrega
- Novo objeto: `pesosRealistas`
- Baseado em: Composição real das exportações 2024
- Localização: `lib/brasil-data.ts`

### Especificação Técnica
```typescript
// PESOS ATUAIS (ARBITRÁRIOS):
export const defaultPesos = {
  energia: 0.25,
  alimentos: 0.25,
  minerios: 0.20,
  industria: 0.15,
  reservas: 0.15
}

// PESOS CORRETOS (BASEADOS EM DADOS):
export const pesosRealistas = {
  alimentos: 0.35,   // 35% das exportações
  industria: 0.22,   // 22% das exportações
  minerios: 0.20,    // 20% das exportações
  energia: 0.15,     // 15% das exportações
  reservas: 0.08     // 8% das reservas totais
}
```

### Subtarefas
- [ ] Buscar dados de exportação 2024 (MDIC/Comex)
- [ ] Calcular % real por categoria
- [ ] Justificar pesos com fontes
- [ ] Simular: Qual é o impacto de mudar pesos?
- [ ] Documentar diferenças

### Validação de Sucesso
```
Real Simulado com pesos antigos: R$ 1.35
Real Simulado com pesos novos: R$ 2.15
Diferença: 60% (mostra importância dos pesos)

Pesos novos tem justificativa técnica: ✓ SIM
```

---

# 🟡 FASE 3: DINÂMICO + CENÁRIOS
## Objetivo: Tornar dashboard dinâmico com APIs e cenários realistas

---

## ✅ TAREFA 10: APIs Dinâmicas Commodities
**Prioridade:** 🟠 ALTA  
**Tempo:** 5 horas  
**Status:** ⏳ NÃO INICIADO

### Descrição
Integrar APIs em tempo real para que ICB atualize conforme preços de commodities mudam.

### Entrega
- Função: `calcularICBAgora(pesos)`
- Hook: `useICBAgora(pesos)`
- Atualização: A cada 5 minutos
- Componente: Nova card mostrando ICB em tempo real

### Especificação Técnica
```typescript
export async function calcularICBAgora(pesos: Pesos): Promise<number> {
  // Buscar preços AGORA
  const sojaAgora = await fetchCommodity('soja')      // Comex
  const ferroAgora = await fetchCommodity('ferro')    // FRED
  const petroAgora = await fetchCommodity('petroleo') // FRED
  const ouroAgora = await fetchCommodity('ouro')      // FRED
  
  // Reindexar para base 2010 = 100
  const energiaIndice = (petroAgora / preco2010Petroleo) * 100
  const alimentosIndice = (sojaAgora / preco2010Soja) * 100
  const mineriosIndice = (ferroAgora / preco2010Ferro) * 100
  
  // Calcular ICB
  const icbAgora = calcularICB({
    energia: energiaIndice,
    alimentos: alimentosIndice,
    minerios: mineriosIndice,
    industria: dernormalizarIBGEAgora(),
    reservas: buscarReservasAgora()
  }, pesos)
  
  return icbAgora
}

export function useICBAgora(pesos: Pesos) {
  const [icb, setICB] = useState<number | null>(null)
  const [realSimulado, setRealSimulado] = useState<number | null>(null)
  
  useEffect(() => {
    const atualizarICB = async () => {
      const icbAtual = await calcularICBAgora(pesos)
      const realAtual = await getRealSimuladoAgora()
      setICB(icbAtual)
      setRealSimulado(realAtual)
    }
    
    atualizarICB()
    const interval = setInterval(atualizarICB, 5 * 60 * 1000)  // 5 min
    
    return () => clearInterval(interval)
  }, [pesos])
  
  return { icb, realSimulado }
}
```

### Subtarefas
- [ ] Criar endpoint: `/api/icb-agora`
- [ ] Integrar Comex API (soja)
- [ ] Integrar FRED API (ferro, petróleo, ouro)
- [ ] Integrar IBGE API (produção industrial)
- [ ] Integrar BCB API (reservas)
- [ ] Cache de 5 minutos
- [ ] Criar hook `useICBAgora()`
- [ ] Criar componente `ICBCardAgora`

### Validação de Sucesso
```
✓ ICB atualiza a cada 5 minutos
✓ Real simulado recalcula automaticamente
✓ Mostra hora da última atualização
✓ Fallback se API falhar
```

---

## ✅ TAREFA 11: Cenários de Política Real
**Prioridade:** 🟠 ALTA  
**Tempo:** 6 horas  
**Status:** ⏳ NÃO INICIADO

### Descrição
Criar 3-5 cenários realistas baseados em políticas que Brasil poderia implementar.

### Entrega
- Array: `cenariosPolitica[]` com 5 cenários
- Função: `simularCenario(cenario, pesos)`
- Componente: UI para selecionar e comparar cenários

### Especificação Técnica
```typescript
export const cenariosPolitica = [
  {
    id: 'pre-sal-acelerado',
    nome: '⚙️ Pré-sal Acelerado (2030)',
    descricao: 'Brasil dobra produção de petróleo em 6 anos',
    impacto: {
      energia: +50,
      alimentos: 0,
      minerios: 0,
      industria: +5,
      reservas: +100
    },
    investimento: 60,  // US$ bi
    payback: 3  // anos
  },
  {
    id: 'agro-tech',
    nome: '🌾 AgroTech Boom',
    descricao: 'Modernizar agricultura + armazenagem',
    impacto: { ... }
  },
  {
    id: 'autonomia-chips',
    nome: '🖥️ Autonomia em Chips',
    descricao: 'Investir em foundry de semicondutores',
    impacto: { ... }
  }
]

export function simularCenario(
  cenario: CenarioPolitica,
  pesos: Pesos
): ProjecaoResultado {
  // Aplicar impactos aos índices
  // Calcular novo ICB
  // Calcular novo Real simulado
  // Retornar projeção
}
```

### Subtarefas
- [ ] Pesquisar políticas reais brasileiras
- [ ] Quantificar impactos de cada política
- [ ] Criar 5 cenários distintos
- [ ] Implementar função `simularCenario()`
- [ ] UI para seleção múltipla
- [ ] Comparação lado-a-lado
- [ ] Gráfico de impacto comparado

### Validação de Sucesso
```
✓ 5 cenários criados
✓ Impactos tem justificativa técnica
✓ Interface permite comparar
✓ Resultados são plausíveis
```

---

## ✅ TAREFA 12: Simular Choques Históricos
**Prioridade:** 🟡 MÉDIO  
**Tempo:** 4 horas  
**Status:** ⏳ NÃO INICIADO

### Descrição
Permitir simular "E se a Crise de 2008 / COVID / Guerra acontecesse hoje?"

### Entrega
- Array: `choquesHistoricos[]` com 3-4 choques
- Função: `aplicarChoque(choqueId, pesos)`
- Componente: Botões para aplicar cada choque

### Especificação Técnica
```typescript
export const choquesHistoricos = [
  {
    id: 'crise-2008',
    nome: '📉 Crise Financeira (2008)',
    descricao: 'Demanda de commodities cai 40%',
    aplicarDados: () => ({
      energia: 72,
      alimentos: 95,
      minerios: 58,
      industria: 82,
      reservas: 49
    })
  },
  // ... mais choques
]

export function aplicarChoque(
  choqueId: string,
  pesos: Pesos
): ProjecaoChoque {
  const choque = choquesHistoricos.find(c => c.id === choqueId)!
  const dadosChoque = choque.aplicarDados()
  const icbChoque = calcularICB(dadosChoque, pesos)
  const realChoque = calcularRealSimuladoCompleto(icbChoque)
  
  return {
    nome: choque.nome,
    realSimulado: realChoque,
    impactoPercent: ((realChoque - realAtual) / realAtual) * 100
  }
}
```

### Subtarefas
- [ ] Mapear 3 choques históricos
- [ ] Quantificar dados de cada choque
- [ ] Implementar função `aplicarChoque()`
- [ ] UI com botões de choque
- [ ] Mostrar impacto em tempo real
- [ ] Permitir combinar choques

### Validação de Sucesso
```
✓ 3-4 choques implementados
✓ Dados baseados em dados históricos reais
✓ Interface permite simular
✓ Impactos são realistas
```

---

# 🟢 FASE 4: ANÁLISE DE INVESTIMENTO
## Objetivo: Adicionar análise de ROI, Payback, TIR

---

## ✅ TAREFA 13: ROI e Payback
**Prioridade:** 🟠 ALTA  
**Tempo:** 5 horas  
**Status:** ⏳ NÃO INICIADO

### Descrição
Calcular análise de investimento para cada cenário (VPL, ROI, Payback, TIR).

### Entrega
- Função: `calcularAnaliseInvestimento(cenario)`
- Resultado: VPL, ROI, Payback, TIR
- Saída: Tabela visual com resultados

### Especificação Técnica
```typescript
export interface AnaliseInvestimento {
  custoInicial: number
  beneficioAnual: number
  periodoAnalise: number
  vpl: number
  roi: number
  payback: number
  tir: number
}

export function calcularAnaliseInvestimento(
  cenario: CenarioPolitica
): AnaliseInvestimento {
  // 1. Benefício das exportações
  const volumeExportacoes = 348  // US$ bi/ano
  const beneficioExportacao = volumeExportacoes * 0.25  // 25% ganho
  
  // 2. VPL (Valor Presente Líquido)
  const taxaDesconto = 0.06
  const periodoAnalise = 10
  let vpl = -cenario.investimento
  for (let ano = 1; ano <= periodoAnalise; ano++) {
    vpl += beneficioExportacao / Math.pow(1 + taxaDesconto, ano)
  }
  
  // 3. Payback
  let payback = cenario.investimento / beneficioExportacao
  
  // 4. ROI
  const roi = ((beneficioExportacao * periodoAnalise - cenario.investimento) / cenario.investimento) * 100
  
  // 5. TIR
  const tir = calcularTIR(cenario.investimento, beneficioExportacao, periodoAnalise)
  
  return { custoInicial: cenario.investimento, beneficioAnual: beneficioExportacao, periodoAnalise, vpl, roi, payback, tir }
}
```

### Subtarefas
- [ ] Implementar cálculo de VPL (Valor Presente Líquido)
- [ ] Implementar cálculo de ROI (Retorno sobre Investimento)
- [ ] Implementar cálculo de Payback (período retorno)
- [ ] Implementar cálculo de TIR (Taxa Interna de Retorno)
- [ ] Criar tabela de resultados
- [ ] Formatação: moeda, porcentagem, anos

### Validação de Sucesso
```
✓ Todos os 4 indicadores calculados
✓ Valores são plausíveis (TIR > 0)
✓ Payback realista (3-15 anos)
✓ Tabela legível
```

---

## ✅ TAREFA 14: Dashboard Comparação Cenários
**Prioridade:** 🟠 ALTA  
**Tempo:** 3 horas  
**Status:** ⏳ NÃO INICIADO

### Descrição
Criar visualização comparando lado-a-lado: Cenários vs Métricas.

### Entrega
- Componente: `ComparadorCenarios`
- Tabela: Compara 2-5 cenários simultaneamente
- Gráficos: Barra para cada métrica

### Especificação Técnica
```
Tabela:
┌─────────────────┬─────────────┬─────────────┬────────────┐
│ MÉTRICA         │ Pré-sal     │ AgroTech    │ Chips      │
├─────────────────┼─────────────┼─────────────┼────────────┤
│ Investimento    │ US$ 60 bi   │ US$ 40 bi   │ US$ 150 bi │
│ ICB 2030        │ 158 (+31%)  │ 162 (+35%)  │ 180 (+50%) │
│ Real Simulado   │ R$ 1.12     │ R$ 1.08     │ R$ 0.95    │
│ Benefício Anual │ US$ 18 bi   │ US$ 14 bi   │ US$ 12 bi  │
│ Payback         │ 3.3 anos    │ 2.9 anos    │ 12 anos    │
│ ROI (10 anos)   │ 210%        │ 250%        │ 80%        │
│ TIR             │ 45%         │ 50%         │ 8.2%       │
└─────────────────┴─────────────┴─────────────┴────────────┘
```

### Subtarefas
- [ ] Criar componente `ComparadorCenarios`
- [ ] Implementar seleção múltipla de cenários
- [ ] Criar tabela dinâmica
- [ ] Formatação condicional (cores por performance)
- [ ] Gráficos de comparação
- [ ] Exportar como imagem/PDF

### Validação de Sucesso
```
✓ Mostra 2-5 cenários lado-a-lado
✓ Todas as métricas visíveis
✓ Cores facilitam comparação
✓ Interface responsiva
```

---

# 🔵 VALIDAÇÃO FINAL
## Objetivo: Testar, validar e preparar para deploy

---

## ✅ TAREFA 15: Testes + Deploy
**Prioridade:** 🔴 CRÍTICA  
**Tempo:** 4 horas  
**Status:** ⏳ NÃO INICIADO

### Descrição
Testes de integração, validação de dados, build final e deploy.

### Entrega
- Build: `npm run build` sem erros
- Tests: Testes unitários passando
- Deploy: Projeto funcional em produção

### Subtarefas
- [ ] Testes de integração de todas as APIs
- [ ] Validar dados reais importados
- [ ] TypeScript: zero erros
- [ ] Lint: zero warnings
- [ ] Performance: load time < 3s
- [ ] Responsividade: testar mobile/tablet/desktop
- [ ] Build production: `npm run build`
- [ ] Deploy em servidor
- [ ] Verificar dados em tempo real
- [ ] Criar documentação final

### Validação de Sucesso
```
✓ Build completa sem erros
✓ Testes passam 100%
✓ Load time < 3 segundos
✓ Dados atualizando em tempo real
✓ Dashboard responsivo
✓ Deploy bem-sucedido
```

---

# 📊 RESUMO DE TAREFAS

```
FASE 1 (Semana 1-2):  6 tarefas  = 19 horas
FASE 2 (Semana 2-3):  3 tarefas  = 12 horas
FASE 3 (Semana 3-4):  3 tarefas  = 15 horas
FASE 4 (Semana 4):    2 tarefas  = 8 horas
VALIDAÇÃO (Semana 5): 1 tarefa   = 4 horas

TOTAL: 15 tarefas = 58 horas
TEMPO REAL: 4-6 semanas (com outras atividades)
```

---

# 🎯 PRÓXIMAS AÇÕES

1. ✅ Marcar TAREFA 1 como "in-progress"
2. ✅ Começar a implementar `lib/fetch-real-data.ts`
3. ✅ Buscar dados BCB de câmbio histórico
4. ✅ Validar correlação com 2010 = 1.76

---

**Última atualização:** 31 de janeiro de 2026

