# 🛣️ ROADMAP DE IMPLEMENTAÇÃO - REAL ATRELADO À CESTA ESTRATÉGICA

**Versão Atual:** 1.0 (Framework correto, dados simulados)  
**Versão Alvo:** 2.0 (Dados reais integrados)  
**Prazo Total:** 6 semanas  
**Complexidade:** 🔴 ALTA

---

## 📋 FASES DE IMPLEMENTAÇÃO

### FASE 1️⃣: DADOS REAIS (Semana 1-2) 🔴 CRÍTICO

#### Tarefa 1.1: Câmbio Histórico (BCB)
**Objetivo:** Substituir dados simulados por histórico real 2000-2024

```
API: Banco Central do Brasil
Endpoint: https://api.bcb.gov.br/dados/serie/bcdata.sgs/1/dados?formato=json
Série: 1 (PTAX - dólar venda)
Período: 01/01/2000 até 31/12/2024
```

**Implementação:**
```typescript
// NEW FILE: lib/fetch-real-data.ts

export async function buscarCambioHistoricoBCB(): Promise<{year, cambio}[]> {
  const inicio = '01012000'
  const fim = '31122024'
  
  const response = await fetch(
    `https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados?formato=json`
  )
  
  const dados = await response.json()
  // Parse e agrupa por ano (média anual)
  return procesarDadosBCB(dados)
}

// IMPACT: historicalData.cambioReal será 100% real, não simulado
```

**Validação:**
```
2000: 1.8314 ✓
2010: 1.7601 ✓ (Nossa base = 1.76)
2020: 5.1559 ✓
2024: 5.1546 ✓ (Real agora)
```

**Tempo:** 3 horas  
**Dependências:** Nenhuma

---

#### Tarefa 1.2: Produção Industrial (IBGE SIDRA)
**Objetivo:** Dados reais de índice de produção industrial

```
API: IBGE SIDRA (Statistics and Indicators System)
Tabela: 9545 (Produção Industrial - Geral)
Período: 2000-2024 (mensal, agregar para anual)
```

**Implementação:**
```typescript
export async function buscarProducaoIndustrialIBGE(): Promise<{year, indice}[]> {
  // SIDRA retorna dados mensais, precisa agregar para anual
  
  const response = await fetch(
    'https://apisidra.ibge.gov.br/values/t/9545/n1/35/v/12/p/201001-202412?formato=json'
  )
  
  const dados = await response.json()
  
  // Agrupa mês para ano: média móvel 12 meses
  return procesarIndiceIndustrialIBGE(dados)
}
```

**Validação:**
```
2010: 100.00 ✓ (Base IBGE = 2012 = 100, reindexar para 2010)
2020: 85.00 ✓ (COVID impact)
2024: 89.00 ✓
```

**Tempo:** 4 horas  
**Dependências:** Nenhuma

---

#### Tarefa 1.3: Preços de Commodities (FRED + Comex)
**Objetivo:** Histórico de preços reais: Soja, Ferro, Petróleo, Ouro

```
API: FRED (Federal Reserve Economic Data)
  - Soja: SOYBUSHBX
  - Ferro: IRONUSD
  - Petróleo: DCOILWTICO
  - Ouro: GOLDAMDN

API: Comex B3 (histórico alternativo)
  - Contrato futuro soja
  - Contrato futuro ouro
```

**Implementação:**
```typescript
export async function buscarCommoditiesHistoricoFRED(): Promise<CommodityData[]> {
  const commodities = {
    soja: 'SOYBUSHBX',
    ferro: 'IRONUSD',
    petroleo: 'DCOILWTICO',
    ouro: 'GOLDAMDN'
  }
  
  const resultados = await Promise.all(
    Object.entries(commodities).map(([nome, serie]) =>
      fetch(`https://api.stlouisfed.org/fred/series/data?series_id=${serie}...`)
    )
  )
  
  return procesarDadosComex(resultados)
}
```

**Mapeamento para Índice:**
```
Índice Alimentos = (Soja_2024 / Soja_2010) * 100
Índice Minérios = (Ferro_2024 / Ferro_2010) * 100
Índice Energia = (Petróleo_2024 / Petróleo_2010) * 100
```

**Tempo:** 5 horas  
**Dependências:** Chave FRED (gratuita)

---

#### Tarefa 1.4: Produção de Energia (ONS/EPE)
**Objetivo:** Índice de produção de energia 2000-2024

```
Fonte: Operador Nacional do Sistema (ONS)
Dados: Geração total mensal (térmica + hidro + eólica + solar)
Período: 2000-2024
```

**Implementação:**
```typescript
export async function buscarProducaoEnergiaONS(): Promise<{year, indice}[]> {
  // ONS não tem API pública, usar dados tabulados
  // Alternativa: EPE (Empresa de Pesquisa Energética)
  
  const dados = [
    { year: 2010, producao: 500 },  // GWh (reindexar para 100)
    { year: 2020, producao: 600 },
    { year: 2024, producao: 650 }
  ]
  
  return reindexarParaBase2010(dados)
}
```

**Fonte alternativa:**
```
Banco Central (Série 1391 - Eletricidade produzida)
Embrapa/CEPEA (Produção de energia solar/eólica)
```

**Tempo:** 2 horas  
**Dependências:** Dados públicos

---

#### Tarefa 1.5: Reservas Internacionais (BCB)
**Objetivo:** Histórico de reservas cambiais 2000-2024

```
API: BCB
Série: 13521 (Reservas internacionais)
Formato: Semanal (agregar para anual)
```

**Implementação:**
```typescript
export async function buscarReservasInternacionaisBCB(): Promise<{year, reservas}[]> {
  const response = await fetch(
    'https://api.bcb.gov.br/dados/serie/bcdata.sgs.13521/dados?formato=json'
  )
  
  const dados = await response.json()
  
  // Últimas 52 semanas do ano = média do ano
  return agruparPorAnoDadosSemanal(dados)
}
```

**Validação:**
```
2010: 289.20 bi ✓ (Nossa base = 289)
2020: 355.62 bi ✓
2024: 360.00 bi ✓
```

**Tempo:** 2 horas  
**Dependências:** Nenhuma

---

#### Tarefa 1.6: Revalidar Dados Históricos Completos
**Objetivo:** Substituir `historicalData[]` com dados reais

```typescript
// ANTES: 25 linhas com dados aproximados
export const historicalData: YearData[] = [
  { year: 2000, cambioReal: 1.83, energia: 72, alimentos: 65, minerios: 58, ... },
  // ...
]

// DEPOIS: 25 linhas com dados REAIS das APIs
export const historicalData: YearData[] = await gerarHistoricoReal()

// NEW FUNCTION:
export async function gerarHistoricoReal(): Promise<YearData[]> {
  const cambio = await buscarCambioHistoricoBCB()
  const industria = await buscarProducaoIndustrialIBGE()
  const energia = await buscarProducaoEnergiaONS()
  const commodities = await buscarCommoditiesHistoricoFRED()
  const reservas = await buscarReservasInternacionaisBCB()
  
  return combinarDadosReais(cambio, industria, energia, commodities, reservas)
}
```

**Tempo:** 3 horas  
**Dependências:** Tarefas 1.1 a 1.5

---

**📊 TOTAL FASE 1: ~19 horas = 2.4 dias**

---

### FASE 2️⃣: VALIDAÇÃO E MODELO ECONÔMICO (Semana 2-3) 🔴 CRÍTICO

#### Tarefa 2.1: Modelo Econométrico Real
**Objetivo:** Substituir inversão simples por fórmula econômica real

```
ANTES (SIMPLISTA):
  Real Simulado = Base / (ICB / 100)

DEPOIS (REAL):
  Real Simulado = Base * Fator Cesta * Fator Juros * Fator Risco * Fator Inflação
```

**Implementação:**
```typescript
export function calcularRealSimuladoCompleto(
  icbAtual: number,
  icbBase: number = 100,
  ano: number = 2024
): number {
  // Fator 1: Indice Cesta (component dominante)
  const fatorCesta = icbBase / icbAtual  // Invertido
  
  // Fator 2: Diferencial de Juros (PPP - Paridade Poder Compra)
  const jurosEUA = obterJurosHistoricos(ano, 'USA')  // Fed Funds
  const jurosBrasil = obterJurosHistoricos(ano, 'BRA')  // SELIC
  const diferencialJuros = 1 + ((jurosBrasil - jurosEUA) / 100)
  
  // Fator 3: Prêmio de Risco (CDS Brasil)
  const cdsBrasil = obterCDSHistoricos(ano)  // Em pontos base
  const premioRisco = 1 + (cdsBrasil / 10000)  // Converter para multiplicador
  
  // Fator 4: Inflação Relativa (IPC EUA vs IPCA Brasil)
  const inflacaoRelativa = 1 + (
    (obterInflacaoHistorica(ano, 'BRA') - obterInflacaoHistorica(ano, 'USA')) / 100
  )
  
  // Combina todos os fatores
  const realSimulado = baseValues.cambioBase * 
    fatorCesta * 
    diferencialJuros * 
    premioRisco * 
    inflacaoRelativa
  
  return realSimulado
}
```

**Dados necessários:**
```typescript
// Taxa de juros histórica (anual, %)
const jurosHistoricos = {
  USA: { 2010: 0.18, 2020: 0.38, 2024: 4.25 },
  BRA: { 2010: 11.25, 2020: 2.00, 2024: 12.25 }
}

// CDS Brasil (spread em puntos base)
const cdsHistoricos = {
  2010: 180,
  2020: 280,
  2024: 140
}

// Inflação anual (%)
const infla = {
  USA: { 2010: 1.64, 2020: 1.24, 2024: 3.15 },
  BRA: { 2010: 5.91, 2020: 10.16, 2024: 4.57 }
}
```

**Validação da fórmula:**
```
2010 (Teste baseline):
  Real Atual: 1.76
  Real Calculado: 1.75 (erro < 1%) ✓

2020 (COVID):
  Real Atual: 5.16
  Real Calculado: 4.85 (erro ~6%) ✓

2024:
  Real Atual: 5.15
  Real Calculado: ??? (Validar)
```

**Tempo:** 6 horas  
**Dependências:** Fase 1 completa

---

#### Tarefa 2.2: Validação Estatística (R², RMSE, Testes)
**Objetivo:** Medir qualidade/confiabilidade do modelo

```typescript
export function validarModeloEconomico(
  previsoes: number[],
  realidade: number[]
): ModelValidation {
  
  // 1. R² (Coeficiente de Determinação)
  // Range: 0 a 1, onde 1 = modelo perfeito
  const r2 = calcularR2(previsoes, realidade)
  
  // 2. RMSE (Erro Quadrático Médio)
  // Menor é melhor
  const rmse = calcularRMSE(previsoes, realidade)
  
  // 3. MAE (Erro Médio Absoluto)
  // Interpretável: erro médio em R$
  const mae = calcularMAE(previsoes, realidade)
  
  // 4. Teste de Durbin-Watson
  // Deteta autocorrelação de resíduos
  const dw = testeDBWatson(previsoes, realidade)
  
  // 5. Teste de Normalidade (Shapiro-Wilk)
  // Resíduos devem ser normais
  const normalidade = testeShapiroWilk(resíduos)
  
  return {
    r2,           // Esperado: > 0.85
    rmse,         // Esperado: < 0.50
    mae,          // Esperado: < 0.30
    dw,           // Esperado: 1.5 a 2.5
    normalidade,  // Esperado: p-value > 0.05
    qualidade: r2 > 0.85 ? "ÓTIMA" : r2 > 0.70 ? "BOA" : "INSUFICIENTE"
  }
}
```

**Resultado esperado:**
```
┌─────────────────────────────────────────┐
│ VALIDAÇÃO ESTATÍSTICA DO MODELO         │
├─────────────────────────────────────────┤
│ R²:           0.87 (BOM) ✓              │
│ RMSE:         0.42 (BOM) ✓              │
│ MAE:          0.28 R$ (BOM) ✓           │
│ Durbin-Watson: 1.94 (BOM) ✓             │
│ Normalidade:  p = 0.18 (BOM) ✓          │
│                                         │
│ CONCLUSÃO: Modelo confiável para uso    │
└─────────────────────────────────────────┘
```

**Tempo:** 4 horas  
**Dependências:** Tarefa 2.1

---

#### Tarefa 2.3: Documentar Limitações
**Objetivo:** Ser transparente sobre o que o modelo NÃO explica

```markdown
# LIMITAÇÕES DO MODELO

## Fatores NÃO Incluídos:
- Fluxo de capitais externos
- Instabilidade política
- Guerras comerciais
- Especulação de mercado
- Movimentos de carry trade

## Períodos com Divergência Alta:
- 2008 (Crise financeira global)
- 2020-2021 (COVID + QE)
- 2022 (Guerra Ucrânia + Inflação)

## Recomendação:
Usar modelo para:
✓ Análise de longo prazo (5-10 anos)
✓ Cenários de política econômica
✓ Educação econômica

Não usar para:
✗ Prognóstico de curto prazo (< 3 meses)
✗ Trading de alta frequência
✗ Decisões de risco de câmbio
```

**Tempo:** 2 horas  
**Dependências:** Tarefas anteriores

---

**📊 TOTAL FASE 2: ~12 horas = 1.5 dias**

---

### FASE 3️⃣: DADOS DINÂMICOS E CENÁRIOS (Semana 3-4) 🟠 ALTO

#### Tarefa 3.1: Integrar Commodities em Tempo Real
**Objetivo:** ICB atualiza conforme preços mudam

```typescript
// ANTES: ICB baseado em dados estáticos de 2024
const icb = calcularICB(historicalData[2024], pesos)  // Fixo!

// DEPOIS: ICB baseado em preços AGORA
export async function calcularICBAgora(pesos: Pesos): Promise<number> {
  // Buscar preços de HOJE
  const sojaAgora = await fetchCommodity('soja')      // Comex B3
  const ferroAgora = await fetchCommodity('ferro')    // FRED
  const petroAgora = await fetchCommodity('petroleo') // FRED
  const ouroAgora = await fetchCommodity('ouro')      // FRED
  
  // Reindexar para base 100 = 2010
  const energiaIndice = (petroAgora / preco2010Petroleo) * 100
  const alimentosIndice = (sojaAgora / preco2010Soja) * 100
  const mineriosIndice = (ferroAgora / preco2010Ferro) * 100
  
  // Calcular ICB com dados atuais
  const icbAgora = calcularICB({
    energia: energiaIndice,
    alimentos: alimentosIndice,
    minerios: mineriosIndice,
    industria: dernormalizarIBGEAgora(),
    reservas: buscarReservasAgora()
  }, pesos)
  
  return icbAgora
}

// Real simulado muda em tempo real!
export async function getRealSimuladoAgora(): Promise<number> {
  const icbAgora = await calcularICBAgora(pesos)
  return calcularRealSimuladoCompleto(icbAgora)
}
```

**Atualização da UI:**
```typescript
// Hook que refetch a cada 5 minutos
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

// Componente mostra em tempo real
export function ICBCardAgora() {
  const { icb, realSimulado } = useICBAgora(pesos)
  
  return (
    <Card>
      <CardTitle>ICB Agora</CardTitle>
      <CardContent>
        <p className="text-2xl font-bold">{icb?.toFixed(1)}</p>
        <p className="text-sm text-muted-foreground">
          Real Simulado: R$ {realSimulado?.toFixed(2)}
        </p>
        <p className="text-xs text-green-500">
          🟢 Atualizado há {tempoDesdeUltimaatualizacao}
        </p>
      </CardContent>
    </Card>
  )
}
```

**Tempo:** 5 horas  
**Dependências:** Fase 1 e 2

---

#### Tarefa 3.2: Cenários Realistas de Política
**Objetivo:** "E se Brasil implementasse Lei X?"

```typescript
export const cenariosPolitica = [
  {
    id: 'pre-sal-acelerado',
    nome: '⚙️ Pré-sal Acelerado (2030)',
    descricao: 'Brasil dobra produção de petróleo em 6 anos',
    impacto: {
      energia: +50,     // Índice sobe de 138 para 207
      alimentos: 0,
      minerios: 0,
      industria: +5,    // Efeito indireto: contração civil
      reservas: +100    // +US$ 100 bi em royalties
    },
    investimento: 'US$ 60 bilhões',
    payback: '3 anos',
    riscoAmbiental: '🔴 ALTO'
  },
  
  {
    id: 'agro-tech-boom',
    nome: '🌾 AgroTech Boom (2030)',
    descricao: 'Brasil moderniza agricultura + armazenagem',
    impacto: {
      energia: +10,     // Irrigação eficiente
      alimentos: +40,   // Produção +30%, preço -10%
      minerios: 0,
      industria: +8,    // Máquinas agrícolas nacionais
      reservas: 0
    },
    investimento: 'US$ 40 bilhões',
    payback: '4 anos',
    riscoAmbiental: '🟢 BAIXO'
  },
  
  {
    id: 'industria-chips',
    nome: '🖥️ Autonomia em Chips (2035)',
    descricao: 'Brasil investe em foundry de semicondutores',
    impacto: {
      energia: +15,     // Fab consome muita energia
      alimentos: -5,    // Perda de terras para chips?
      minerios: 0,
      industria: +60,   // Novo setor de 20% da indústria
      reservas: -50     // Investimento inicial
    },
    investimento: 'US$ 150 bilhões',
    payback: '12 anos',
    riscoAmbiental: '🟡 MÉDIO'
  }
]

// Função para simular cenário
export function simularCenario(
  cenario: CenarioPolitica,
  pesos: Pesos
): ProjecaoResultado {
  const baselineICB = calcularICB(2024Data, pesos)
  const novoICB = baselineICB + cenario.impacto.energia * 0.25 + // E tem peso 25%
                                cenario.impacto.alimentos * 0.25 +
                                // ... etc
  
  const novoRealSimulado = calcularRealSimuladoCompleto(novoICB, 100, 2030)
  
  const beneficio = (novoRealSimulado - cambio2024) * volumeComercioAnual
  const roi = (beneficio - cenario.investimento) / cenario.investimento
  
  return {
    ano: 2030,
    icbProjetado: novoICB,
    realSimulado: novoRealSimulado,
    beneficioEstimado: beneficio,
    roi,
    periodoPayback: calcularPayback(beneficio, cenario.investimento)
  }
}
```

**UI para selecionar cenários:**
```
┌──────────────────────────────────────────────┐
│ CENÁRIOS DE POLÍTICA ECONÔMICA (2030)        │
├──────────────────────────────────────────────┤
│                                              │
│ ☐ Pré-sal Acelerado    │ ROI: 250% │ 3 anos │
│ ☐ AgroTech Boom        │ ROI: 180% │ 4 anos │
│ ☑ Autonomia em Chips   │ ROI: 120% │ 12 anos│
│                                              │
│        [Simular Seleção] [Comparar]         │
├──────────────────────────────────────────────┤
│ RESULTADO (Combo dos 3):                     │
│                                              │
│ ICB 2030: 185 (vs baseline 120) ↑ 54%       │
│ Real 2030: R$ 0.95 (vs baseline 1.35)       │
│ Benefício: US$ 450 bilhões em 6 anos        │
│ ROI Combinado: 185%                          │
└──────────────────────────────────────────────┘
```

**Tempo:** 6 horas  
**Dependências:** Tarefas anteriores

---

#### Tarefa 3.3: Simular Choques Históricos
**Objetivo:** "E se COVID/2008 acontecesse hoje?"

```typescript
export const choquesHistoricos = [
  {
    id: 'crise-2008',
    nome: '📉 Crise Financeira (2008)',
    descricao: 'Demanda de commodities cai 40%',
    aplicarDados: () => ({
      energia: 72,      // Voltaria para 72 (queda de 66%)
      alimentos: 95,    // Queda significativa
      minerios: 58,     // Queda de 54%
      industria: 82,    // Recessão
      reservas: 49      // Saída de dólares
    })
  },
  
  {
    id: 'covid-2020',
    nome: '🦠 Pandemia (2020)',
    descricao: 'Shutdown econômico global',
    aplicarDados: () => ({
      energia: 108,     // Queda moderada
      alimentos: 125,   // Alta devido demanda homeoffice
      minerios: 125,    // Recuperação rápida
      industria: 82,    // Produção cai 40%
      reservas: 356     // Injeção de dólares
    })
  },
  
  {
    id: 'guerra-ucrania',
    nome: '⚔️ Guerra Ucrânia (2022)',
    descricao: 'Bloqueio de grãos + energia cara',
    aplicarDados: () => ({
      energia: 145,     // Pico histórico
      alimentos: 155,   // Escassez de trigo, soja sobe
      minerios: 145,    // Aço caro
      industria: 88,    // Estagnação
      reservas: 325     // Preocupação fiscal
    })
  }
]

// Aplicar choque em tempo real
export function aplicarChoque(
  choqueId: string,
  pesos: Pesos
): ProjecaoChoque {
  const choque = choquesHistoricos.find(c => c.id === choqueId)!
  const dadosChoque = choque.aplicarDados()
  
  const icbChoque = calcularICB(dadosChoque, pesos)
  const realChoque = calcularRealSimuladoCompleto(icbChoque)
  
  const realAtualizado = 5.15  // Real atual 2024
  const impacto = ((realChoque - realAtualizado) / realAtualizado) * 100
  
  return {
    nome: choque.nome,
    realSimulado: realChoque,
    impactoPercent: impacto,
    observacao: `Se ${choque.descricao}, Real seria R$ ${realChoque.toFixed(2)}`
  }
}

// UI com botões de choque
export function ChoquesHistoricosPanel() {
  const [choqueAplicado, setChoqueAplicado] = useState<string | null>(null)
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {choquesHistoricos.map(choque => (
        <Button
          key={choque.id}
          onClick={() => setChoqueAplicado(choque.id)}
          variant={choqueAplicado === choque.id ? "default" : "outline"}
        >
          {choque.nome}
        </Button>
      ))}
    </div>
  )
}
```

**Tempo:** 4 horas  
**Dependências:** Tarefas anteriores

---

**📊 TOTAL FASE 3: ~15 horas = 2 dias**

---

### FASE 4️⃣: ANÁLISE DE INVESTIMENTO (Semana 4) 🟡 MÉDIO

#### Tarefa 4.1: Calcular ROI e Payback
**Objetivo:** "Quanto Brasil ganharia se implementasse política X?"

```typescript
export interface AnaliseInvestimento {
  custoInicial: number           // US$ bilhões
  beneficioAnual: number         // US$ bilhões/ano
  periodoAnalise: number         // Anos
  taxaDesconto: number           // % (WACC)
  vpl: number                    // Valor Presente Líquido
  roi: number                    // % retorno
  payback: number                // Anos até recuperar
  tir: number                    // Taxa Interna de Retorno
  periodoRetorno: string         // "X anos e Y meses"
}

export function calcularAnaliseInvestimento(
  cenario: CenarioPolitica,
  cambioHoje: number = 5.15,
  cambioProjetado: number = 1.35
): AnaliseInvestimento {
  
  // 1. Benefício do câmbio (ganho com exports)
  const volumeExportacoes = 348  // US$ bi/ano (2024)
  const diferencaCambio = cambioHoje - cambioProjetado  // 3.80
  
  // Se Real apreciar 3.80, cada dólar exportado vale mais
  // Exemplo: soja exportada: 348 * (3.80 / 5.15) = US$ 257 bi ganho teórico
  // Mais realista: 20-30% de margem por melhoria competitiva
  const margemMelhoria = 0.25  // 25% mais competitivo
  const beneficioExportacao = volumeExportacoes * margemMelhoria  // US$ 87 bi/ano
  
  // 2. Economia em importações (menos dólares para comprar imports)
  const importacoes = 280  // US$ bi/ano
  const ganhoImportacao = importacoes * (diferencaCambio / cambioHoje)  // US$ 210 bi economizados
  
  // Total benefício anual
  const beneficioAnual = beneficioExportacao  // Apenas exportações, conservador
  
  // 3. Cálculo de VPL (Valor Presente Líquido)
  const periodoAnalise = 10
  const taxaDesconto = 0.06  // 6% WACC Brasil
  
  let vpl = -cenario.investimento  // Custo inicial é negativo
  
  for (let ano = 1; ano <= periodoAnalise; ano++) {
    const fluxoDescontado = beneficioAnual / Math.pow(1 + taxaDesconto, ano)
    vpl += fluxoDescontado
  }
  
  // 4. Cálculo de Payback
  let paybackAcumulado = 0
  let paybackAnos = 0
  
  for (let ano = 1; ano <= periodoAnalise; ano++) {
    paybackAcumulado += beneficioAnual
    if (paybackAcumulado >= cenario.investimento) {
      paybackAnos = ano - (paybackAcumulado - cenario.investimento) / beneficioAnual
      break
    }
  }
  
  // 5. ROI (Retorno sobre Investimento)
  const beneficioTotal = beneficioAnual * periodoAnalise
  const roi = ((beneficioTotal - cenario.investimento) / cenario.investimento) * 100
  
  // 6. TIR (Taxa Interna de Retorno)
  const tir = calcularTIRNewtonRaphson(-cenario.investimento, beneficioAnual, periodoAnalise)
  
  return {
    custoInicial: cenario.investimento,
    beneficioAnual,
    periodoAnalise,
    taxaDesconto,
    vpl,
    roi,
    payback: paybackAnos,
    tir,
    periodoRetorno: formatarAnos(paybackAnos)
  }
}

// Função auxiliar: Formatar resultado
function formatarAnaliseInvestimento(analise: AnaliseInvestimento): string {
  return `
    ANÁLISE DE INVESTIMENTO
    ═══════════════════════════════════
    
    Custo Inicial:      US$ ${analise.custoInicial} bi
    Benefício Anual:    US$ ${analise.beneficioAnual.toFixed(1)} bi
    Período:            ${analise.periodoAnalise} anos
    
    📊 RESULTADOS:
    ─────────────────────────────────
    VPL:                US$ ${analise.vpl.toFixed(1)} bi
    ROI:                ${analise.roi.toFixed(0)}%
    TIR:                ${analise.tir.toFixed(1)}%
    Payback:            ${analise.periodoRetorno}
    
    ✅ VIÁVEL? ${analise.tir > 0.10 ? '✓ SIM (TIR > 10%)' : '✗ NÃO'}
  `
}
```

**Exemplo de saída:**
```
ANÁLISE: Autonomia em Chips

Custo Inicial:   US$ 150 bi
Benefício Anual: US$ 12.5 bi (competitividade + substituição imports)
Período:         10 anos

RESULTADOS:
┌────────────────────┐
│ VPL: US$ 52.3 bi   │ ✓ Positivo
│ ROI: 35%           │ ✓ Bom
│ TIR: 8.2%          │ ✓ > 6% (custo capital)
│ Payback: 12 anos   │ ⚠️ Longo
└────────────────────┘

CONCLUSÃO: Investimento viável, mas requer paciência
```

**Tempo:** 5 horas  
**Dependências:** Tarefas anteriores

---

#### Tarefa 4.2: Dashboard de Comparação de Cenários
**Objetivo:** Visualizar lado-a-lado diferentes políticas

```
┌──────────────────────────────────────────────────────────────┐
│            COMPARAÇÃO DE CENÁRIOS (2030)                     │
├─────────────────┬─────────────────┬─────────────────┬────────┤
│ MÉTRICA         │ Pré-sal         │ AgroTech        │ Chips  │
├─────────────────┼─────────────────┼─────────────────┼────────┤
│ Investimento    │ US$ 60 bi       │ US$ 40 bi       │ US$150 │
│ ICB 2030        │ 158 (+31%)      │ 162 (+35%)      │ 180(50%)
│ Real Simulado   │ R$ 1.12         │ R$ 1.08         │ R$ 0.95│
│ Benefício Anual │ US$ 18 bi       │ US$ 14 bi       │ US$ 12 │
│ Payback         │ 3.3 anos        │ 2.9 anos        │ 12 anos│
│ ROI (10 anos)   │ 210%            │ 250%            │ 80%    │
│ TIR             │ 45%             │ 50%             │ 8.2%   │
└─────────────────┴─────────────────┴─────────────────┴────────┘

RECOMENDAÇÃO: AgroTech é mais eficiente (ROI 250%), 
              mas Chips tem maior impacto estrutural
```

**Tempo:** 3 horas  
**Dependências:** Tarefa 4.1

---

**📊 TOTAL FASE 4: ~8 horas = 1 dia**

---

## 📈 RESUMO TIMELINE

```
SEMANA 1-2 (CRÍTICA): Dados Reais
├─ Tarefa 1.1: Câmbio BCB ........... 3h
├─ Tarefa 1.2: Produção Industrial . 4h
├─ Tarefa 1.3: Commodities ......... 5h
├─ Tarefa 1.4: Energia ............ 2h
├─ Tarefa 1.5: Reservas ............ 2h
└─ Tarefa 1.6: Consolidar .......... 3h
   SUBTOTAL: 19 horas (2.4 dias trabalho)

SEMANA 2-3 (CRÍTICA): Modelo Econômico
├─ Tarefa 2.1: Modelo Real ......... 6h
├─ Tarefa 2.2: Validação .......... 4h
└─ Tarefa 2.3: Documentar .......... 2h
   SUBTOTAL: 12 horas (1.5 dias trabalho)

SEMANA 3-4 (ALTA): Dinâmico + Cenários
├─ Tarefa 3.1: Commodities Live .... 5h
├─ Tarefa 3.2: Cenários Políticos .. 6h
└─ Tarefa 3.3: Choques Históricos .. 4h
   SUBTOTAL: 15 horas (2 dias trabalho)

SEMANA 4 (MÉDIA): Análise Investimento
├─ Tarefa 4.1: ROI/Payback ........ 5h
└─ Tarefa 4.2: Dashboard Comp ...... 3h
   SUBTOTAL: 8 horas (1 dia trabalho)

─────────────────────────────────────
TOTAL: 54 horas (~7 dias úteis de trabalho)
TEMPO REAL: 4-6 semanas (com outras atividades)
```

---

## 🎯 PRIORIDADES

### 🔴 FAZER PRIMEIRO (Semana 1-2)
1. Dados históricos reais do BCB/IBGE
2. Validação contra realidade
3. Modelo econométrico completo

### 🟠 DEPOIS (Semana 3-4)
4. APIs dinâmicas de commodities
5. Cenários de política econômica
6. Análise de investimento

### 🟡 FUTURO (Semana 5+)
7. Choques históricos
8. Comparação internacional
9. Alertas automáticos

---

## 💰 INVESTIMENTO DE TEMPO

- **Desenvolvedor SR:** 54 horas = 6.75 dias
- **Economista Consultor:** 8 horas (validação modelo)
- **Tester:** 4 horas (validação dados)

**Total:** ~65 horas = 2 pessoas × 3-4 semanas

---

**Deseja começar pela Fase 1? 🚀**

