# 📡 INTEGRAÇÃO DE APIS REAIS - Brasil Potência

**Atualizado:** 31 de janeiro de 2026

## 🔌 APIs Implementadas

### 1. **Exchange Rates em Tempo Real**

#### Sources Ativas:
```
✅ ExchangeRate-API (Free Tier)
   - URL: https://api.exchangerate-api.com/v4/latest/{currency}
   - Atualização: Em tempo real
   - Limit: 1.500 req/mês (free)
   - Suporta: USD-BRL, EUR-BRL, etc.

✅ Banco Central do Brasil (BCB)
   - URL: https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados
   - Atualização: Diária
   - Limit: Ilimitado
   - Dados: Câmbio USD/BRL, PTAX, etc.

✅ Alpha Vantage (Configurável)
   - Requer: NEXT_PUBLIC_ALPHA_VANTAGE_KEY
   - URL: https://www.alphavantage.co/query
   - Suporta: Dados históricos, forex
```

#### Fallback Strategy:
```
1. Tenta ExchangeRate-API (sem autenticação)
2. Se falhar, tenta BCB (dados históricos)
3. Se falhar, usa cache local
4. Atualiza a cada 30 segundos
```

---

### 2. **Dados de Commodities**

#### FRED (Federal Reserve Economic Data)
```typescript
API: https://api.stlouisfed.org/fred/series/observations
Variáveis mapeadas:
- Soja: WPU01411331
- Minério de Ferro: IRONUSD
- Petróleo: GASREGCOVW
- Ouro: GOLDAMDN

Requer: NEXT_PUBLIC_FRED_API_KEY
Limite: 400 requisições/dia (free)
```

#### CEPEA/ESALQ (em planejamento)
```
URL: https://www.cepea.esalq.usp.br
Dados: Índices agrícolas brasileiros
Status: Requer web scraping ou contato direto
```

---

### 3. **Dados Brasileiros Oficiais**

#### BCB (Banco Central)
```typescript
// Câmbio
https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados

// PTAX (média diária)
https://api.bcb.gov.br/dados/serie/bcdata.sgs.10813/dados

// Reservas Internacionais
https://api.bcb.gov.br/dados/serie/bcdata.sgs.3546/dados

// Taxa SELIC
https://api.bcb.gov.br/dados/serie/bcdata.sgs.4390/dados
```

#### IBGE (Instituto Brasileiro de Geografia e Estatística)
```typescript
// SIDRA - Produção Industrial
https://apisidra.ibge.gov.br/values/t/8159/n1/35/v/11597/p/2024

Tabelas:
- 8159: Índice de Produção Industrial
- 6784: Índice de Receita Nominal de Vendas
```

#### MDIC (Comex Stat)
```typescript
// Exportações/Importações (em desenvolvimento)
https://comexstat.mdic.gov.br/api
Requer: Verificar autenticação
```

---

### 4. **Dados de Investimentos em Chips**

#### Novo Endpoint Local
```typescript
GET /api/tech-dependency?categoria=chips
GET /api/tech-dependency?categoria=fertilizantes
GET /api/tech-dependency?categoria=vulnerabilidade

Response:
{
  dados: Array<GlobalInvestmentData>,
  timestamp: ISO8601,
  cache: "1 hora"
}

Fontes verificadas:
✅ WSTS (World Semiconductor Trade Statistics)
✅ CHIPS and Science Act (U.S. Congress)
✅ European Commission
✅ Brasil Semicon / Lei 14.968/2024
✅ TrendsCE
```

---

## 🔄 Status de Implementação

### ✅ IMPLEMENTADO (Rodando)

| Dados | API | Status | Atualização |
|-------|-----|--------|------------|
| USD/BRL | ExchangeRate-API + BCB | ✅ Ativo | 30s |
| EUR/BRL | ExchangeRate-API | ✅ Ativo | 30s |
| Investimentos Chips | Local API | ✅ Ativo | Manual |
| Dependência Tech | Local API | ✅ Ativo | Manual |
| Gráficos | Recharts | ✅ Ativo | Real-time |

### 🔶 EM DESENVOLVIMENTO

| Dados | API | Status | ETA |
|-------|-----|--------|-----|
| Soja/Milho/Café | FRED/CEPEA | 🔶 Parcial | Fev |
| Minério de Ferro | FRED | 🔶 Parcial | Fev |
| Produção Industrial | IBGE SIDRA | 🔶 Parcial | Fev |
| Comex (Exp/Imp) | MDIC Comex | 🔶 Fila | Mar |
| Reservas Internacionais | BCB | 🔶 Planejado | Mar |

### ❌ NÃO IMPLEMENTADO

| Dados | Razão | Alternativa |
|-------|-------|------------|
| ENS/CCEE (Preço MWh) | Requer autenticação | Usar média histórica |
| ONS (Geração Elétrica) | Requer web scraping | Usar dados ANEEL |
| ANP (Petróleo) | API limitada | Usar FRED + OPEC |

---

## 🚀 Como Usar as APIs

### 1. Exchange Rates
```typescript
import { useRealTimeExchangeRate } from '@/hooks/use-real-time-data'

export function MyComponent() {
  const { data, loading, error, source } = useRealTimeExchangeRate(['USD-BRL', 'EUR-BRL'])
  
  if (loading) return <div>Carregando...</div>
  
  return (
    <div>
      <p>USD/BRL: {data?.['USD-BRL']?.bid}</p>
      <p>Fonte: {source}</p>
    </div>
  )
}
```

### 2. Tech Investment Data
```typescript
import { useTechInvestmentData } from '@/hooks/use-real-time-data'

export function InvestmentChart() {
  const { data, loading } = useTechInvestmentData('chips')
  
  return <Chart data={data} loading={loading} />
}
```

### 3. Fetch Direto
```typescript
// Commodities
const sojaData = await fetchCommodityData('soja')

// Brasil
const producaoIndustrial = await fetchBrasilProducaoIndustrial()
const reservas = await fetchBrasilReservasInternacionais()
```

---

## 🔐 Variáveis de Ambiente Necessárias

```env
# Alpha Vantage (opcional)
NEXT_PUBLIC_ALPHA_VANTAGE_KEY=your_key_here

# FRED - Federal Reserve Economic Data
NEXT_PUBLIC_FRED_API_KEY=your_key_here

# Outras (reservadas para futuro)
NEXT_PUBLIC_QUANDL_KEY=your_key_here
NEXT_PUBLIC_WORLD_BANK_KEY=your_key_here
```

---

## 📊 Estratégia de Dados para Cada Componente

### IndexCards
```
Fonte 1: ExchangeRate-API (USD/BRL tempo real)
Fonte 2: BCB (fallback)
Atualização: 30 segundos
Cache: 5 minutos
```

### HistoricalChart
```
Fonte: Dados locais historicalData (2000-2024)
Simulação: Baseada em tendências IBGE/BCB/MDIC
Cache: 1 hora
Realtime: Não aplicável
```

### LiveDataPanel
```
Fonte 1: ExchangeRate-API
Fonte 2: BCB
Histórico: Último mês
Atualização: Contínua
```

### TechDependencyPanel
```
Fonte: API Local (/api/tech-dependency)
Dados: WSTS, CHIPS Act, Lei 14.968/2024
Atualização: Manual (fontes verificadas)
Cache: 1 hora
```

---

## 📈 Dados Que Faltam (Próximas Fases)

### Fase 2 (Fevereiro 2026)
- [ ] Preços de commodities em tempo real (FRED)
- [ ] Produção industrial IBGE
- [ ] Histórico de câmbio 30 dias

### Fase 3 (Março 2026)
- [ ] Balança comercial (MDIC)
- [ ] Reservas internacionais (BCB)
- [ ] Taxa SELIC (BCB)

### Fase 4 (Abril 2026)
- [ ] Web scraping CEPEA
- [ ] ONS (geração elétrica)
- [ ] ENS/CCEE (preço MWh)

---

## 🐛 Troubleshooting

### Erro: "API indisponível"
```typescript
// Verificar fonte
console.log('Fonte:', source) // mostra qual API foi usada

// Fallback automático
// Se ExchangeRate-API falhar → tenta BCB → usa cache
```

### Taxa não atualiza
```
Verificar:
1. CORS headers (apenas GET/OPTIONS)
2. Rate limit da API
3. Intervalo de refresh (30 segundos)
4. Status do navegador: Network tab
```

### Dados históricos faltando
```
Causa: Historicalexchangerates não suporta free tier
Solução: Usar API com cache local ou upgrade
```

---

## 🎯 Recomendações Finais

### ✅ Implementar Agora
- [x] ExchangeRate-API para USD/BRL (feito)
- [x] BCB como fallback (feito)
- [x] TechDependencyPanel API (feito)

### ⏳ Implementar em Fevereiro
- [ ] FRED para commodities
- [ ] IBGE para produção industrial
- [ ] Cache estratégico

### 🔮 Implementar em Março
- [ ] MDIC Comex para real balança comercial
- [ ] Dashboard de investimentos com atualização semanal
- [ ] Alertas de risco geopolítico

---

*Documentação mantida atualizada a cada deploy. Última atualização: 31/01/2026*
