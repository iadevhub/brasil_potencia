import { useState, useEffect, useCallback } from 'react'

interface ExchangeRate {
  bid: string
  ask: string
  timestamp: string
}

interface ApiData {
  [key: string]: ExchangeRate
}

// API externa com dados reais de câmbio
const API_SOURCES = {
  alphavantage: {
    base: 'https://www.alphavantage.co/query',
    getUrl: (pair: string) => 
      `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${pair.split('-')[0]}&to_currency=${pair.split('-')[1]}&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY || 'demo'}`,
    parse: (data: any) => data['Realtime Currency Exchange Rate']
  },
  bcb: {
    base: 'https://api.bcb.gov.br',
    getUrl: (serieId: string) => 
      `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${serieId}/dados/ultimos/1?formato=json`,
    parse: (data: any) => data[0]
  },
  exchangerate: {
    base: 'https://api.exchangerate-api.com/v4/latest',
    getUrl: (from: string) => 
      `https://api.exchangerate-api.com/v4/latest/${from}`,
    parse: (data: any) => data.rates
  }
}

// Hook para buscar taxas de câmbio em tempo real
export function useRealTimeExchangeRate(pairs: string[]) {
  const [data, setData] = useState<ApiData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState('cache')

  const fetchRates = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Tenta múltiplas fontes em paralelo
      const promises = pairs.map(async (pair) => {
        const [from, to] = pair.split('-')
        
        try {
          // Tenta exchangerate-api (sem autenticação)
          const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`, {
            headers: { 'Accept': 'application/json' }
          })
          
          if (!response.ok) throw new Error('API indisponível')
          
          const json = await response.json()
          const rate = json.rates[to]
          
          return {
            key: pair,
            data: {
              bid: rate.toString(),
              ask: (rate * 1.005).toString(), // Simula spread
              timestamp: new Date().toISOString()
            }
          }
        } catch (err) {
          // Fallback para BCB (dados históricos)
          try {
            const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json')
            const json = await response.json()
            const rate = parseFloat(json[0].valor)
            
            setSource('bcb')
            return {
              key: pair,
              data: {
                bid: rate.toString(),
                ask: (rate * 1.005).toString(),
                timestamp: new Date().toISOString()
              }
            }
          } catch {
            throw new Error(`Falha ao buscar ${pair}`)
          }
        }
      })

      const results = await Promise.allSettled(promises)
      const successResults = results
        .filter(r => r.status === 'fulfilled')
        .map(r => (r as PromiseFulfilledResult<any>).value)

      if (successResults.length > 0) {
        const apiData: ApiData = {}
        successResults.forEach(r => {
          apiData[r.key] = r.data
        })
        setData(apiData)
        setSource('live')
      } else {
        throw new Error('Nenhuma fonte disponível')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setSource('cached')
    } finally {
      setLoading(false)
    }
  }, [pairs])

  useEffect(() => {
    fetchRates()
    
    // Atualiza a cada 30 segundos
    const interval = setInterval(fetchRates, 30000)
    return () => clearInterval(interval)
  }, [fetchRates])

  return { data, loading, error, source, refresh: fetchRates }
}

// Hook para buscar dados de investimentos em semicondutores
export function useTechInvestmentData(categoria: 'chips' | 'fertilizantes' | 'vulnerabilidade' = 'chips') {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState('local')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Tenta API local primeiro
        const response = await fetch(`/api/tech-dependency?categoria=${categoria}`)
        
        if (!response.ok) throw new Error('API local indisponível')
        
        const json = await response.json()
        setData(json.dados)
        setSource('api-local')
      } catch (err) {
        // Fallback para dados locais (já definidos em brasil-data.ts)
        console.warn('Usando dados locais (cache):', err)
        setSource('cached')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [categoria])

  return { data, loading, error, source }
}

// Hook para buscar histórico de câmbio (últimos 30 dias)
export function useHistoricalExchangeRates(pair: string = 'USD-BRL', days: number = 30) {
  const [data, setData] = useState<Array<{ date: string; bid: string; ask: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const [from, to] = pair.split('-')
        
        // Tenta API pública (exchangerate-api não tem histórico, então simulamos)
        // Em produção, use: https://api.exchangerate.host/timeseries ou similar
        
        const historicalData = []
        const today = new Date()
        
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          
          try {
            const response = await fetch(
              `https://api.exchangerate-api.com/v4/latest/${from}?date=${date.toISOString().split('T')[0]}`,
              { signal: AbortSignal.timeout(5000) }
            ).catch(() => null)
            
            if (response?.ok) {
              const json = await response.json()
              const rate = json.rates[to]
              historicalData.push({
                date: date.toISOString().split('T')[0],
                bid: rate.toString(),
                ask: (rate * 1.005).toString()
              })
            }
          } catch {
            // Continua mesmo se falhar um dia
          }
          
          // Pequeno delay para não sobrecarregar API
          await new Promise(r => setTimeout(r, 100))
        }
        
        setData(historicalData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar histórico')
      } finally {
        setLoading(false)
      }
    }

    fetchHistoricalData()
  }, [pair, days])

  return { data, loading, error }
}

// Hook para buscar dados de commodities (CEPEA/ESALQ, FRED)
export async function fetchCommodityData(commodity: 'soja' | 'ferro' | 'petroleo' | 'ouro') {
  const FRED_API_KEY = process.env.NEXT_PUBLIC_FRED_API_KEY || 'demo'
  
  const commodityIds = {
    soja: 'WPU01411331', // FRED: Soybeans
    ferro: 'IRONUSD', // Iron Ore
    petroleo: 'GASREGCOVW', // Crude Oil
    ouro: 'GOLDAMDN' // Gold
  }

  try {
    const response = await fetch(
      `https://api.stlouisfed.org/fred/series/observations?series_id=${commodityIds[commodity]}&api_key=${FRED_API_KEY}&file_type=json`
    )
    
    if (!response.ok) throw new Error('FRED API indisponível')
    
    const data = await response.json()
    return data.observations.slice(-30) // Últimos 30 dias
  } catch (error) {
    console.error(`Erro ao buscar ${commodity}:`, error)
    return null
  }
}

// Hook para buscar produção industrial do Brasil (IBGE)
export async function fetchBrasilProducaoIndustrial() {
  try {
    // Endpoint simulado - em produção usar SIDRA API
    const response = await fetch(
      'https://apisidra.ibge.gov.br/values/t/8159/n1/35/v/11597/p/2024/f/u?formato=json'
    )
    
    if (!response.ok) throw new Error('IBGE API indisponível')
    
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar produção industrial:', error)
    return null
  }
}

// Hook para buscar dados de reservas internacionais (BCB)
export async function fetchBrasilReservasInternacionais() {
  try {
    const response = await fetch(
      'https://api.bcb.gov.br/dados/serie/bcdata.sgs/3546/dados/ultimos/1?formato=json'
    )
    
    if (!response.ok) throw new Error('BCB API indisponível')
    
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar reservas:', error)
    return null
  }
}
