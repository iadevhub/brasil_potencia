import useSWR from 'swr'

interface ExchangeRateData {
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

interface ExchangeRateResponse {
  success: boolean
  source: string
  timestamp: string
  data: Record<string, ExchangeRateData>
  error?: string
}

interface HistoricalData {
  date: string
  bid: number
  ask: number
  high: number
  low: number
  change: number
  changePercent: number
}

interface HistoricalResponse {
  success: boolean
  source: string
  currency: string
  period: string
  count: number
  data: HistoricalData[]
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

/**
 * Hook para buscar cotacao em tempo real
 * Atualiza automaticamente a cada 60 segundos
 */
export function useExchangeRate(currencies: string[] = ['USD-BRL']) {
  const currencyParam = currencies.join(',')
  
  const { data, error, isLoading, mutate } = useSWR<ExchangeRateResponse>(
    `/api/exchange-rate?currencies=${currencyParam}`,
    fetcher,
    {
      refreshInterval: 60000, // Atualiza a cada 60 segundos
      revalidateOnFocus: true,
      dedupingInterval: 30000,
    }
  )
  
  return {
    data: data?.data,
    source: data?.source,
    timestamp: data?.timestamp,
    isLoading,
    isError: error || !data?.success,
    error: error?.message || data?.error,
    refresh: mutate
  }
}

/**
 * Hook para buscar dados historicos
 * Cache mais longo pois dados nao mudam frequentemente
 */
export function useHistoricalExchangeRate(
  currency: string = 'USD-BRL',
  days: number = 30
) {
  const { data, error, isLoading } = useSWR<HistoricalResponse>(
    `/api/exchange-rate/historical?currency=${currency}&days=${days}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000, // 1 hora
    }
  )
  
  return {
    data: data?.data || [],
    source: data?.source,
    period: data?.period,
    count: data?.count || 0,
    isLoading,
    isError: error || !data?.success,
  }
}

/**
 * Hook para buscar dados historicos de um periodo especifico
 */
export function useHistoricalPeriod(
  currency: string = 'USD-BRL',
  startDate: string,
  endDate: string
) {
  const { data, error, isLoading } = useSWR<HistoricalResponse>(
    `/api/exchange-rate/historical?currency=${currency}&start_date=${startDate}&end_date=${endDate}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000,
    }
  )
  
  return {
    data: data?.data || [],
    source: data?.source,
    period: data?.period,
    count: data?.count || 0,
    isLoading,
    isError: error || !data?.success,
  }
}

/**
 * Hook para buscar series do Banco Central
 */
export function useBCBSeries(
  series: string = 'PTAX_VENDA',
  startDate?: string,
  endDate?: string
) {
  const params = new URLSearchParams({ series })
  if (startDate) params.set('start', startDate)
  if (endDate) params.set('end', endDate)
  
  const { data, error, isLoading } = useSWR<{
    success: boolean
    source: string
    series: string
    data: Array<{ date: string; value: number }>
  }>(
    `/api/bcb?${params.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutos
    }
  )
  
  return {
    data: data?.data || [],
    source: data?.source,
    series: data?.series,
    isLoading,
    isError: error || !data?.success,
  }
}
