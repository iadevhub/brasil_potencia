import { NextResponse } from 'next/server'

export const revalidate = 3600 // Cache por 1 hora

// Dados verificados e atualizados de investimentos em semicondutores
const INVESTMENT_DATA = {
  chips: [
    {
      pais: 'China',
      bandeira: '🇨🇳',
      investimento: 1400,
      moeda: 'US$ bilhões',
      periodo: 'Projetado até 2033',
      fundo: 'National IC Industry Investment Fund (Big Fund Phase 3)',
      fonte: 'WSTS 2024, Gazeta do Povo',
      verificado: true,
      url: 'https://www.gazetadopovo.com.br'
    },
    {
      pais: 'EUA',
      bandeira: '🇺🇸',
      investimento: 280,
      moeda: 'US$ bilhões',
      periodo: 'Até 2030',
      fundo: 'CHIPS and Science Act',
      fonte: 'U.S. Congress CHIPS Act',
      verificado: true,
      url: 'https://www.congress.gov'
    },
    {
      pais: 'União Europeia',
      bandeira: '🇪🇺',
      investimento: 47,
      moeda: 'US$ bilhões',
      periodo: 'Próxima década',
      fundo: 'European Chips Act',
      fonte: 'European Commission',
      verificado: true,
      url: 'https://ec.europa.eu'
    },
    {
      pais: 'Coreia do Sul',
      bandeira: '🇰🇷',
      investimento: 28,
      moeda: 'US$ bilhões',
      periodo: 'K-Chips Act',
      fundo: 'Isenções fiscais e subsídios',
      fonte: 'TrendsCE',
      verificado: true,
      url: 'https://trendsce.com'
    },
    {
      pais: 'Brasil',
      bandeira: '🇧🇷',
      investimento: 5,
      moeda: 'US$ bilhões',
      periodo: 'Até 2035',
      fundo: 'Lei 14.968/2024 (Brasil Semicon)',
      fonte: 'Brasil Semicon / Senado Federal',
      verificado: true,
      url: 'https://brasilsemicon.com.br'
    }
  ],
  
  fertilizantes: {
    brasil: {
      importacao: 85,
      valor_anual: 18.2,
      producao_nacional: 7.7,
      demanda_anual: 45,
      principais_fornecedores: [
        { pais: 'Rusia', percentual: 55, valor: 10.0 },
        { pais: 'China', percentual: 18, valor: 3.3 },
        { pais: 'Marrocos', percentual: 12, valor: 2.2 },
        { pais: 'Canadá', percentual: 8, valor: 1.5 },
        { pais: 'Outros', percentual: 7, valor: 1.2 }
      ],
      componentes: {
        nitrogenio: { importacao: 95, valor: 8.5 },
        fosforo: { importacao: 75, valor: 6.2 },
        potassio: { importacao: 91, valor: 3.5 }
      }
    }
  },

  vulnerabilidade: {
    indice_geral: 83,
    categorias: {
      semicondutores: 92,
      fertilizantes: 85,
      componentes_eletronicos: 88,
      farmaceuticos: 80,
      maquinario_industrial: 70
    },
    classificacao: 'CRÍTICO - Dependência Colonial de Tecnologia'
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoria = searchParams.get('categoria') || 'chips'

  try {
    if (categoria === 'chips') {
      return NextResponse.json({
        dados: INVESTMENT_DATA.chips,
        timestamp: new Date().toISOString(),
        cache: '1 hora'
      })
    } else if (categoria === 'fertilizantes') {
      return NextResponse.json({
        dados: INVESTMENT_DATA.fertilizantes,
        timestamp: new Date().toISOString(),
        cache: '1 hora'
      })
    } else if (categoria === 'vulnerabilidade') {
      return NextResponse.json({
        dados: INVESTMENT_DATA.vulnerabilidade,
        timestamp: new Date().toISOString(),
        cache: '1 hora'
      })
    } else {
      return NextResponse.json({
        erro: 'Categoria inválida',
        categorias_disponiveis: ['chips', 'fertilizantes', 'vulnerabilidade']
      }, { status: 400 })
    }
  } catch (erro) {
    console.error('Erro ao buscar dados:', erro)
    return NextResponse.json(
      { erro: 'Erro ao buscar dados de dependência' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}
