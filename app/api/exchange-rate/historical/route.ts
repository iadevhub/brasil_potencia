import { NextResponse } from 'next/server'

export const revalidate = 3600 // Cache por 1 hora para dados historicos

// Gerar dados mock historicos baseados em tendencia realista
function generateMockHistorical(days: number) {
  const data = []
  const baseRate = 5.75
  const today = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Simular variacao realista (+/- 3% ao longo do periodo)
    const progress = (days - i) / days
    const trend = Math.sin(progress * Math.PI * 2) * 0.15
    const noise = (Math.random() - 0.5) * 0.08
    const rate = baseRate + trend + noise
    
    data.push({
      date: date.toISOString().split('T')[0],
      bid: Number(rate.toFixed(4)),
      ask: Number((rate + 0.01).toFixed(4)),
      high: Number((rate + 0.03).toFixed(4)),
      low: Number((rate - 0.03).toFixed(4)),
      change: Number((noise * 100).toFixed(2)),
      changePercent: Number(((noise / rate) * 100).toFixed(2))
    })
  }
  
  return data
}

async function fetchFromBCBSeries(days: number) {
  try {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const formatDate = (d: Date) => 
      `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
    
    // Serie 1 = Taxa de cambio dolar (venda)
    const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados?formato=json&dataInicial=${formatDate(startDate)}&dataFinal=${formatDate(endDate)}`
    
    const response = await fetch(url, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000)
    })
    
    if (!response.ok) return null
    
    const rawData = await response.json()
    
    if (!Array.isArray(rawData) || rawData.length === 0) return null
    
    return rawData.map((item: { data: string; valor: string }) => {
      const rate = parseFloat(item.valor)
      return {
        date: item.data.split('/').reverse().join('-'),
        bid: rate,
        ask: rate + 0.01,
        high: rate + 0.02,
        low: rate - 0.02,
        change: 0,
        changePercent: 0
      }
    })
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const currency = searchParams.get('currency') || 'USD-BRL'
  const days = Math.min(parseInt(searchParams.get('days') || '30'), 360)
  
  // Tentar BCB primeiro para USD-BRL
  if (currency === 'USD-BRL') {
    const bcbData = await fetchFromBCBSeries(days)
    if (bcbData && bcbData.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'BCB',
        currency,
        period: `${days} days`,
        count: bcbData.length,
        data: bcbData
      })
    }
  }
  
  // Fallback para dados mock
  const mockData = generateMockHistorical(days)
  
  return NextResponse.json({
    success: true,
    source: 'simulated',
    currency,
    period: `${days} days`,
    count: mockData.length,
    data: mockData
  })
}
