/**
 * Brasil Potencia - Servicos de API em Tempo Real
 * 
 * Este modulo centraliza as integracoes com APIs brasileiras oficiais
 * e servicos de terceiros para dados economicos em tempo real.
 */

// =============================================================================
// TIPOS E INTERFACES
// =============================================================================

export interface ExchangeRateData {
  code: string
  codein: string
  name: string
  high: string
  low: string
  varBid: string
  pctChange: string
  bid: string
  ask: string
  timestamp: string
  create_date: string
}

export interface HistoricalExchangeRate {
  date: string
  bid: number
  ask: number
  high: number
  low: number
}

export interface BCBPTAXResponse {
  cotacaoCompra: number
  cotacaoVenda: number
  dataHoraCotacao: string
}

export interface CommodityPrice {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  unit: string
  lastUpdate: string
}

export interface TradeBalanceData {
  year: number
  month: number
  exports: number
  imports: number
  balance: number
}

// =============================================================================
// 1. AWESOME API - Cotacoes em Tempo Real (GRATUITA, SEM LIMITE)
// Documentacao: https://docs.awesomeapi.com.br/api-de-moedas
// =============================================================================

const AWESOME_API_BASE = 'https://economia.awesomeapi.com.br'

/**
 * Busca cotacao atual do dolar em tempo real
 * Atualizado a cada minuto (cache de 1 min sem API key)
 */
export async function getExchangeRateRealTime(
  currencies: string[] = ['USD-BRL']
): Promise<Record<string, ExchangeRateData>> {
  const pairs = currencies.join(',')
  const response = await fetch(`${AWESOME_API_BASE}/json/last/${pairs}`)
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar cotacao: ${response.status}`)
  }
  
  return response.json()
}

/**
 * Busca historico de fechamento dos ultimos N dias
 * Maximo: 360 dias
 */
export async function getExchangeRateDaily(
  currency: string = 'USD-BRL',
  days: number = 30
): Promise<HistoricalExchangeRate[]> {
  const response = await fetch(
    `${AWESOME_API_BASE}/json/daily/${currency}/${Math.min(days, 360)}`
  )
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar historico: ${response.status}`)
  }
  
  const data = await response.json()
  
  return data.map((item: ExchangeRateData) => ({
    date: item.create_date,
    bid: parseFloat(item.bid),
    ask: parseFloat(item.ask),
    high: parseFloat(item.high),
    low: parseFloat(item.low),
  }))
}

/**
 * Busca historico de um periodo especifico
 * Formato de data: YYYYMMDD
 */
export async function getExchangeRatePeriod(
  currency: string = 'USD-BRL',
  startDate: string,
  endDate: string
): Promise<HistoricalExchangeRate[]> {
  const response = await fetch(
    `${AWESOME_API_BASE}/json/daily/${currency}/?start_date=${startDate}&end_date=${endDate}`
  )
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar periodo: ${response.status}`)
  }
  
  const data = await response.json()
  
  return data.map((item: ExchangeRateData) => ({
    date: item.create_date,
    bid: parseFloat(item.bid),
    ask: parseFloat(item.ask),
    high: parseFloat(item.high),
    low: parseFloat(item.low),
  }))
}

// =============================================================================
// 2. BANCO CENTRAL (BCB) - PTAX Oficial via OData
// Documentacao: https://dadosabertos.bcb.gov.br/
// =============================================================================

const BCB_OLINDA_BASE = 'https://olinda.bcb.gov.br/olinda/servico'

/**
 * Busca cotacao PTAX oficial do BCB para uma data especifica
 * Formato de data: MM-DD-YYYY (americano)
 */
export async function getPTAXByDate(date: Date): Promise<BCBPTAXResponse | null> {
  const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}`
  
  const url = `${BCB_OLINDA_BASE}/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${formattedDate}'&$format=json`
  
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar PTAX: ${response.status}`)
  }
  
  const data = await response.json()
  
  if (data.value && data.value.length > 0) {
    return data.value[0]
  }
  
  return null
}

/**
 * Busca serie historica PTAX de um periodo
 */
export async function getPTAXPeriod(
  startDate: Date,
  endDate: Date
): Promise<BCBPTAXResponse[]> {
  const formatDate = (d: Date) => 
    `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}`
  
  const url = `${BCB_OLINDA_BASE}/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='${formatDate(startDate)}'&@dataFinalCotacao='${formatDate(endDate)}'&$format=json`
  
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar PTAX periodo: ${response.status}`)
  }
  
  const data = await response.json()
  return data.value || []
}

/**
 * Busca serie temporal do BCB por codigo
 * Series uteis:
 * - 1: Taxa de cambio - Dolar (venda)
 * - 10813: Taxa de cambio - Dolar (PTAX venda)
 * - 433: IPCA
 * - 4390: SELIC meta
 * - 13521: Reservas internacionais
 */
export async function getBCBTimeSeries(
  seriesCode: number,
  startDate: string, // DD/MM/YYYY
  endDate: string    // DD/MM/YYYY
): Promise<Array<{ data: string; valor: number }>> {
  const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${seriesCode}/dados?formato=json&dataInicial=${startDate}&dataFinal=${endDate}`
  
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar serie BCB: ${response.status}`)
  }
  
  return response.json()
}

// =============================================================================
// 3. IBGE SIDRA - Dados de Comercio Exterior
// Documentacao: https://apisidra.ibge.gov.br/
// =============================================================================

const SIDRA_BASE = 'https://apisidra.ibge.gov.br'

/**
 * Busca dados agregados do SIDRA
 * Exemplo: Balanca comercial, PIB, etc.
 */
export async function getSIDRAData(
  tableId: string,
  params: Record<string, string>
): Promise<unknown[]> {
  const queryParams = new URLSearchParams(params).toString()
  const url = `${SIDRA_BASE}/values/t/${tableId}/n1/all${queryParams ? `?${queryParams}` : ''}`
  
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar SIDRA: ${response.status}`)
  }
  
  return response.json()
}

// =============================================================================
// 4. COMEX STAT (MDIC) - Estatisticas de Comercio Exterior
// Documentacao: https://comexstat.mdic.gov.br/
// =============================================================================

// Nota: ComexStat requer integracao mais complexa via portal
// Para dados brutos, usar Base dos Dados ou scraping autorizado

// =============================================================================
// 5. ROUTE HANDLERS PARA NEXT.JS
// =============================================================================

/**
 * Cria um route handler para proxy das APIs
 * Evita problemas de CORS e permite caching no servidor
 */
export function createAPIRouteConfig() {
  return {
    // Cache por 1 minuto para cotacoes em tempo real
    revalidate: 60,
    
    // Headers CORS para APIs externas
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    }
  }
}

// =============================================================================
// 6. MOCK DATA PARA DESENVOLVIMENTO
// =============================================================================

export const MOCK_EXCHANGE_RATE: ExchangeRateData = {
  code: 'USD',
  codein: 'BRL',
  name: 'Dolar Americano/Real Brasileiro',
  high: '5.18',
  low: '5.12',
  varBid: '-0.03',
  pctChange: '-0.58',
  bid: '5.15',
  ask: '5.16',
  timestamp: String(Date.now() / 1000),
  create_date: new Date().toISOString()
}

export const MOCK_COMMODITIES: CommodityPrice[] = [
  {
    symbol: 'SOYBEAN',
    name: 'Soja (Bushel)',
    price: 12.45,
    change: 0.15,
    changePercent: 1.22,
    unit: 'USD/bu',
    lastUpdate: new Date().toISOString()
  },
  {
    symbol: 'IRON_ORE',
    name: 'Minerio de Ferro',
    price: 118.50,
    change: -2.30,
    changePercent: -1.90,
    unit: 'USD/ton',
    lastUpdate: new Date().toISOString()
  },
  {
    symbol: 'BRENT',
    name: 'Petroleo Brent',
    price: 82.35,
    change: 1.20,
    changePercent: 1.48,
    unit: 'USD/bbl',
    lastUpdate: new Date().toISOString()
  },
  {
    symbol: 'COFFEE',
    name: 'Cafe Arabica',
    price: 185.20,
    change: 3.40,
    changePercent: 1.87,
    unit: 'USD/lb',
    lastUpdate: new Date().toISOString()
  },
  {
    symbol: 'SUGAR',
    name: 'Acucar',
    price: 21.85,
    change: -0.45,
    changePercent: -2.02,
    unit: 'USD/lb',
    lastUpdate: new Date().toISOString()
  }
]
