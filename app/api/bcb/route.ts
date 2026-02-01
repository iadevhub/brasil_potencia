import { NextResponse } from 'next/server'

export const revalidate = 300 // Cache por 5 minutos

// Series do BCB uteis para o simulador
const BCB_SERIES = {
  DOLAR_VENDA: 1,
  PTAX_VENDA: 10813,
  IPCA: 433,
  SELIC_META: 4390,
  RESERVAS_INTERNACIONAIS: 13521,
  PIB_MENSAL: 4380,
  BALANCA_COMERCIAL: 22707,
} as const

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const series = searchParams.get('series') || 'PTAX_VENDA'
  const startDate = searchParams.get('start') || '01/01/2020'
  const endDate = searchParams.get('end') || formatDate(new Date())
  
  const seriesCode = BCB_SERIES[series as keyof typeof BCB_SERIES] || 10813
  
  try {
    const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${seriesCode}/dados?formato=json&dataInicial=${startDate}&dataFinal=${endDate}`
    
    const response = await fetch(url, {
      next: { revalidate: 300 }
    })
    
    if (!response.ok) {
      throw new Error(`BCB API Error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      source: 'Banco Central do Brasil',
      series,
      seriesCode,
      period: `${startDate} - ${endDate}`,
      count: data.length,
      data: data.map((item: { data: string; valor: string }) => ({
        date: item.data,
        value: parseFloat(item.valor)
      }))
    })
  } catch (error) {
    console.error('[v0] BCB API error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: []
    }, { status: 500 })
  }
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}
