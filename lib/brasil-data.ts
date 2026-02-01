// Historical data for Brasil Potencia Simulator
// Base year: 2010 = 100 for normalization

export interface YearData {
  year: number
  cambioReal: number // Real/USD exchange rate (actual)
  energia: number // Energy index
  alimentos: number // Food commodities index
  minerios: number // Mining index
  industria: number // Industrial production index
  reservas: number // Foreign reserves (USD billions)
  exportMateriaPrima: number // % raw materials exports
  exportIndustrializado: number // % manufactured exports
  importInsumos: number // % imports for production (intermediates + capital + fuel ~80%)
  importConsumo: number // % final consumer goods imports (~20%)
  exportTotal: number // Total exports (USD billions)
}

// Simulated historical data from 2000 to 2024
// Based on general trends from IBGE, BCB, MDIC
// CLASSIFICAÇÃO RIGOROSA: Produtos de baixo valor agregado (farelo, açúcar, celulose) = matéria-prima
// Import structure: ~77% insumos (intermediários + capital + combustíveis), ~13% consumo final, ~10% outros
export const historicalData: YearData[] = [
  // Anos 2000-2004: Brasil ainda tinha indústria mais diversificada
  { year: 2000, cambioReal: 1.83, energia: 72, alimentos: 65, minerios: 58, industria: 85, reservas: 33, exportMateriaPrima: 58, exportIndustrializado: 42, importInsumos: 75, importConsumo: 15, exportTotal: 55 },
  { year: 2001, cambioReal: 2.35, energia: 74, alimentos: 68, minerios: 55, industria: 83, reservas: 36, exportMateriaPrima: 60, exportIndustrializado: 40, importInsumos: 76, importConsumo: 14, exportTotal: 58 },
  { year: 2002, cambioReal: 2.92, energia: 76, alimentos: 72, minerios: 52, industria: 82, reservas: 38, exportMateriaPrima: 61, exportIndustrializado: 39, importInsumos: 77, importConsumo: 13, exportTotal: 60 },
  { year: 2003, cambioReal: 3.08, energia: 78, alimentos: 78, minerios: 58, industria: 81, reservas: 49, exportMateriaPrima: 62, exportIndustrializado: 38, importInsumos: 77, importConsumo: 13, exportTotal: 73 },
  { year: 2004, cambioReal: 2.93, energia: 82, alimentos: 85, minerios: 72, industria: 88, reservas: 53, exportMateriaPrima: 63, exportIndustrializado: 37, importInsumos: 78, importConsumo: 12, exportTotal: 97 },
  // 2005-2010: Boom das commodities, início da reprimarização
  { year: 2005, cambioReal: 2.44, energia: 86, alimentos: 82, minerios: 85, industria: 90, reservas: 54, exportMateriaPrima: 65, exportIndustrializado: 35, importInsumos: 77, importConsumo: 13, exportTotal: 118 },
  { year: 2006, cambioReal: 2.18, energia: 90, alimentos: 88, minerios: 92, industria: 92, reservas: 86, exportMateriaPrima: 67, exportIndustrializado: 33, importInsumos: 77, importConsumo: 13, exportTotal: 138 },
  { year: 2007, cambioReal: 1.95, energia: 94, alimentos: 95, minerios: 105, industria: 98, reservas: 180, exportMateriaPrima: 68, exportIndustrializado: 32, importInsumos: 76, importConsumo: 14, exportTotal: 161 },
  { year: 2008, cambioReal: 1.83, energia: 98, alimentos: 110, minerios: 125, industria: 101, reservas: 207, exportMateriaPrima: 70, exportIndustrializado: 30, importInsumos: 76, importConsumo: 14, exportTotal: 198 },
  { year: 2009, cambioReal: 2.00, energia: 95, alimentos: 98, minerios: 95, industria: 94, reservas: 239, exportMateriaPrima: 71, exportIndustrializado: 29, importInsumos: 77, importConsumo: 13, exportTotal: 153 },
  { year: 2010, cambioReal: 1.76, energia: 100, alimentos: 100, minerios: 100, industria: 100, reservas: 289, exportMateriaPrima: 71, exportIndustrializado: 29, importInsumos: 77, importConsumo: 13, exportTotal: 202 },
  // 2011-2015: Aprofundamento da dependência de commodities
  { year: 2011, cambioReal: 1.67, energia: 105, alimentos: 115, minerios: 135, industria: 101, reservas: 352, exportMateriaPrima: 73, exportIndustrializado: 27, importInsumos: 76, importConsumo: 14, exportTotal: 256 },
  { year: 2012, cambioReal: 1.95, energia: 108, alimentos: 125, minerios: 118, industria: 99, reservas: 379, exportMateriaPrima: 75, exportIndustrializado: 25, importInsumos: 77, importConsumo: 13, exportTotal: 243 },
  { year: 2013, cambioReal: 2.16, energia: 110, alimentos: 122, minerios: 112, industria: 101, reservas: 376, exportMateriaPrima: 76, exportIndustrializado: 24, importInsumos: 77, importConsumo: 13, exportTotal: 242 },
  { year: 2014, cambioReal: 2.35, energia: 112, alimentos: 118, minerios: 95, industria: 98, reservas: 374, exportMateriaPrima: 78, exportIndustrializado: 22, importInsumos: 78, importConsumo: 12, exportTotal: 225 },
  { year: 2015, cambioReal: 3.33, energia: 108, alimentos: 105, minerios: 72, industria: 90, reservas: 369, exportMateriaPrima: 79, exportIndustrializado: 21, importInsumos: 78, importConsumo: 12, exportTotal: 191 },
  // 2016-2020: Desindustrialização acelerada
  { year: 2016, cambioReal: 3.49, energia: 105, alimentos: 108, minerios: 68, industria: 86, reservas: 372, exportMateriaPrima: 80, exportIndustrializado: 20, importInsumos: 78, importConsumo: 12, exportTotal: 185 },
  { year: 2017, cambioReal: 3.19, energia: 108, alimentos: 115, minerios: 85, industria: 87, reservas: 382, exportMateriaPrima: 81, exportIndustrializado: 19, importInsumos: 77, importConsumo: 13, exportTotal: 218 },
  { year: 2018, cambioReal: 3.65, energia: 115, alimentos: 112, minerios: 88, industria: 88, reservas: 387, exportMateriaPrima: 82, exportIndustrializado: 18, importInsumos: 77, importConsumo: 13, exportTotal: 240 },
  { year: 2019, cambioReal: 3.95, energia: 118, alimentos: 115, minerios: 105, industria: 87, reservas: 367, exportMateriaPrima: 83, exportIndustrializado: 17, importInsumos: 77, importConsumo: 13, exportTotal: 225 },
  { year: 2020, cambioReal: 5.16, energia: 108, alimentos: 125, minerios: 125, industria: 82, reservas: 356, exportMateriaPrima: 84, exportIndustrializado: 16, importInsumos: 78, importConsumo: 12, exportTotal: 210 },
  // 2021-2024: Pico da reprimarização
  { year: 2021, cambioReal: 5.39, energia: 125, alimentos: 145, minerios: 175, industria: 86, reservas: 362, exportMateriaPrima: 84, exportIndustrializado: 16, importInsumos: 77, importConsumo: 13, exportTotal: 281 },
  { year: 2022, cambioReal: 5.17, energia: 145, alimentos: 155, minerios: 145, industria: 88, reservas: 325, exportMateriaPrima: 85, exportIndustrializado: 15, importInsumos: 77, importConsumo: 13, exportTotal: 335 },
  { year: 2023, cambioReal: 4.97, energia: 135, alimentos: 142, minerios: 125, industria: 87, reservas: 355, exportMateriaPrima: 85, exportIndustrializado: 15, importInsumos: 77, importConsumo: 13, exportTotal: 340 },
  { year: 2024, cambioReal: 5.70, energia: 138, alimentos: 148, minerios: 132, industria: 89, reservas: 355, exportMateriaPrima: 85, exportIndustrializado: 15, importInsumos: 77, importConsumo: 13, exportTotal: 337 },
]

// Base values for normalization (2010 = 100)
export const baseValues = {
  energia: 100,
  alimentos: 100,
  minerios: 100,
  industria: 100,
  reservas: 289,
  cambioBase: 1.76, // 2010 exchange rate
}

// Default weights for ICB calculation
export const defaultPesos = {
  energia: 0.25,
  alimentos: 0.25,
  minerios: 0.20,
  industria: 0.15,
  reservas: 0.15,
}

export interface Pesos {
  energia: number
  alimentos: number
  minerios: number
  industria: number
  reservas: number
}

// Normalize a value to base 100
export function normalizar(valorAtual: number, valorBase: number): number {
  return (valorAtual / valorBase) * 100
}

// Calculate ICB (Indice Cesta Brasil)
export function calcularICB(dados: YearData, pesos: Pesos): number {
  const energiaNorm = normalizar(dados.energia, baseValues.energia) * pesos.energia
  const alimentosNorm = normalizar(dados.alimentos, baseValues.alimentos) * pesos.alimentos
  const mineriosNorm = normalizar(dados.minerios, baseValues.minerios) * pesos.minerios
  const industriaNorm = normalizar(dados.industria, baseValues.industria) * pesos.industria
  const reservasNorm = normalizar(dados.reservas, baseValues.reservas) * pesos.reservas
  
  return energiaNorm + alimentosNorm + mineriosNorm + industriaNorm + reservasNorm
}

// Calculate simulated Real value based on ICB
export function calcularRealSimulado(icbAtual: number, icbBase: number = 100): number {
  // If ICB increased, Real should have appreciated (lower exchange rate)
  const fatorValorizacao = icbAtual / icbBase
  return baseValues.cambioBase / fatorValorizacao
}

// Calculate "Perda Brasil" - estimated loss from not adding value
export function calcularPerdaBrasil(exportTotal: number, percentualMateriaPrima: number): number {
  // Estimate: manufactured products are worth 3-5x more
  const fatorAgregacao = 4 // conservative average
  const valorMateriaPrima = exportTotal * (percentualMateriaPrima / 100)
  const valorPotencial = valorMateriaPrima * fatorAgregacao
  
  return valorPotencial - valorMateriaPrima
}

// Generate chart data with both real and simulated values
export function generateChartData(pesos: Pesos, startYear: number = 2000, endYear: number = 2024) {
  const filteredData = historicalData.filter(d => d.year >= startYear && d.year <= endYear)
  
  return filteredData.map(dados => {
    const icb = calcularICB(dados, pesos)
    const realSimulado = calcularRealSimulado(icb)
    const perdaBrasil = calcularPerdaBrasil(dados.exportTotal, dados.exportMateriaPrima)
    
    return {
      year: dados.year,
      cambioReal: dados.cambioReal,
      cambioSimulado: Number(realSimulado.toFixed(2)),
      icb: Number(icb.toFixed(1)),
      perdaBrasil: Number(perdaBrasil.toFixed(1)),
      exportMateriaPrima: dados.exportMateriaPrima,
      exportIndustrializado: dados.exportIndustrializado,
      importInsumos: dados.importInsumos,
      importConsumo: dados.importConsumo,
      exportTotal: dados.exportTotal,
    }
  })
}

// Get latest data
export function getLatestData(pesos: Pesos) {
  const dados = historicalData[historicalData.length - 1]
  const icb = calcularICB(dados, pesos)
  const realSimulado = calcularRealSimulado(icb)
  const perdaBrasil = calcularPerdaBrasil(dados.exportTotal, dados.exportMateriaPrima)
  
  return {
    ano: dados.year,
    cambioReal: dados.cambioReal,
    cambioSimulado: Number(realSimulado.toFixed(2)),
    icb: Number(icb.toFixed(1)),
    perdaBrasil: Number(perdaBrasil.toFixed(1)),
    exportMateriaPrima: dados.exportMateriaPrima,
    exportIndustrializado: dados.exportIndustrializado,
    importInsumos: dados.importInsumos,
    importConsumo: dados.importConsumo,
    reservas: dados.reservas,
  }
}

// Generate data for export composition pie chart
export function getExportCompositionData(year: number = 2024) {
  const dados = historicalData.find(d => d.year === year) || historicalData[historicalData.length - 1]
  
  return [
    { name: 'Materia-prima', value: dados.exportMateriaPrima, fill: '#ef4444' },
    { name: 'Industrializado', value: dados.exportIndustrializado, fill: '#22c55e' },
  ]
}

// Generate data for import composition pie chart
// Insumos = intermediários + bens de capital + combustíveis (~80%)
// Consumo = bens de consumo final (~20%)
export function getImportCompositionData(year: number = 2024) {
  const dados = historicalData.find(d => d.year === year) || historicalData[historicalData.length - 1]
  
  return [
    { name: 'Insumos (produção)', value: dados.importInsumos, fill: '#22c55e' },
    { name: 'Consumo Final', value: dados.importConsumo, fill: '#ef4444' },
  ]
}

// Country comparison data (for context)
// Classificação rigorosa: produtos de baixo valor agregado = matéria-prima
export const countryComparison = [
  { pais: 'Brasil', materiaPrima: 85, industrializado: 15 },
  { pais: 'Alemanha', materiaPrima: 9, industrializado: 91 },
  { pais: 'China', materiaPrima: 6, industrializado: 94 },
  { pais: 'Coreia do Sul', materiaPrima: 5, industrializado: 95 },
  { pais: 'Mexico', materiaPrima: 20, industrializado: 80 },
  { pais: 'Argentina', materiaPrima: 82, industrializado: 18 },
]

// Detailed country data for comparison
export interface CountryDetailData {
  id: string
  nome: string
  bandeira: string
  moeda: string
  exportComposition: { materiaPrima: number; industrializado: number }
  importComposition: { materiaPrima: number; produtoFinal: number }
  principaisExportacoes: string[]
  principaisImportacoes: string[]
  historicalExchange: Array<{
    year: number
    cambioReal: number
    cambioSimulado: number
  }>
  perdaEstimada: number // USD billions
  pibNominal: number // USD trillions
}

export const countryDetailData: CountryDetailData[] = [
  {
    id: 'brasil',
    nome: 'Brasil',
    bandeira: '🇧🇷',
    moeda: 'BRL/USD',
    exportComposition: { materiaPrima: 85, industrializado: 15 },
    importComposition: { materiaPrima: 77, produtoFinal: 13 }, // 77% insumos para produção, 13% consumo final, 10% outros
    principaisExportacoes: [
      'Soja em grao',
      'Minerio de ferro',
      'Petroleo bruto',
      'Carne bovina',
      'Acucar',
      'Cafe',
      'Milho',
      'Celulose'
    ],
    principaisImportacoes: [
      'Circuitos integrados',
      'Medicamentos',
      'Automoveis',
      'Fertilizantes',
      'Pecas de avioes',
      'Gas natural',
      'Pesticidas',
      'Equipamentos telecom'
    ],
    historicalExchange: [
      { year: 2010, cambioReal: 1.76, cambioSimulado: 1.76 },
      { year: 2012, cambioReal: 1.95, cambioSimulado: 1.52 },
      { year: 2014, cambioReal: 2.35, cambioSimulado: 1.65 },
      { year: 2016, cambioReal: 3.49, cambioSimulado: 2.15 },
      { year: 2018, cambioReal: 3.65, cambioSimulado: 1.85 },
      { year: 2020, cambioReal: 5.16, cambioSimulado: 1.45 },
      { year: 2022, cambioReal: 5.17, cambioSimulado: 1.25 },
      { year: 2024, cambioReal: 5.70, cambioSimulado: 1.30 },
    ],
    perdaEstimada: 125,
    pibNominal: 2.17
  },
  {
    id: 'argentina',
    nome: 'Argentina',
    bandeira: '🇦🇷',
    moeda: 'ARS/USD',
    exportComposition: { materiaPrima: 82, industrializado: 18 },
    importComposition: { materiaPrima: 75, produtoFinal: 15 }, // 75% insumos, 15% consumo
    principaisExportacoes: [
      'Farelo de soja',
      'Oleo de soja',
      'Milho',
      'Trigo',
      'Carne bovina',
      'Ouro',
      'Petroleo',
      'Veiculos'
    ],
    principaisImportacoes: [
      'Automoveis',
      'Gas natural',
      'Pecas de veiculos',
      'Telefones',
      'Medicamentos',
      'Equipamentos eletricos',
      'Plasticos',
      'Fertilizantes'
    ],
    historicalExchange: [
      { year: 2010, cambioReal: 3.90, cambioSimulado: 3.90 },
      { year: 2012, cambioReal: 4.55, cambioSimulado: 3.50 },
      { year: 2014, cambioReal: 8.55, cambioSimulado: 4.20 },
      { year: 2016, cambioReal: 15.85, cambioSimulado: 5.80 },
      { year: 2018, cambioReal: 37.81, cambioSimulado: 8.50 },
      { year: 2020, cambioReal: 84.15, cambioSimulado: 15.00 },
      { year: 2022, cambioReal: 140.50, cambioSimulado: 25.00 },
      { year: 2024, cambioReal: 850.00, cambioSimulado: 45.00 },
    ],
    perdaEstimada: 35,
    pibNominal: 0.64
  },
  {
    id: 'mexico',
    nome: 'Mexico',
    bandeira: '🇲🇽',
    moeda: 'MXN/USD',
    exportComposition: { materiaPrima: 20, industrializado: 80 },
    importComposition: { materiaPrima: 70, produtoFinal: 20 }, // México importa insumos para montar produtos
    principaisExportacoes: [
      'Automoveis',
      'Computadores',
      'Televisores',
      'Pecas automotivas',
      'Petroleo',
      'Cerveja',
      'Abacate',
      'Tomates'
    ],
    principaisImportacoes: [
      'Pecas eletronicas',
      'Combustiveis',
      'Pecas de veiculos',
      'Plasticos',
      'Equipamentos medicos',
      'Aco',
      'Milho',
      'Soja'
    ],
    historicalExchange: [
      { year: 2010, cambioReal: 12.64, cambioSimulado: 12.64 },
      { year: 2012, cambioReal: 13.17, cambioSimulado: 11.80 },
      { year: 2014, cambioReal: 13.29, cambioSimulado: 11.50 },
      { year: 2016, cambioReal: 18.66, cambioSimulado: 13.20 },
      { year: 2018, cambioReal: 19.24, cambioSimulado: 12.80 },
      { year: 2020, cambioReal: 21.49, cambioSimulado: 14.50 },
      { year: 2022, cambioReal: 19.41, cambioSimulado: 13.00 },
      { year: 2024, cambioReal: 17.15, cambioSimulado: 12.50 },
    ],
    perdaEstimada: 18,
    pibNominal: 1.81
  },
  {
    id: 'coreia',
    nome: 'Coreia do Sul',
    bandeira: '🇰🇷',
    moeda: 'KRW/USD',
    exportComposition: { materiaPrima: 5, industrializado: 95 },
    importComposition: { materiaPrima: 80, produtoFinal: 10 }, // Coreia importa matéria-prima para processar
    principaisExportacoes: [
      'Semicondutores',
      'Automoveis',
      'Navios',
      'Displays',
      'Computadores',
      'Equipamentos telecom',
      'Plasticos',
      'Baterias'
    ],
    principaisImportacoes: [
      'Petroleo bruto',
      'Gas natural',
      'Minerio de ferro',
      'Semicondutores',
      'Carvao',
      'Aluminio',
      'Cobre',
      'Equipamentos'
    ],
    historicalExchange: [
      { year: 2010, cambioReal: 1156, cambioSimulado: 1156 },
      { year: 2012, cambioReal: 1126, cambioSimulado: 1080 },
      { year: 2014, cambioReal: 1053, cambioSimulado: 1020 },
      { year: 2016, cambioReal: 1161, cambioSimulado: 1050 },
      { year: 2018, cambioReal: 1100, cambioSimulado: 980 },
      { year: 2020, cambioReal: 1180, cambioSimulado: 1020 },
      { year: 2022, cambioReal: 1291, cambioSimulado: 1050 },
      { year: 2024, cambioReal: 1350, cambioSimulado: 1080 },
    ],
    perdaEstimada: -45, // Negative = gain
    pibNominal: 1.71
  },
  {
    id: 'alemanha',
    nome: 'Alemanha',
    bandeira: '🇩🇪',
    moeda: 'EUR/USD',
    exportComposition: { materiaPrima: 9, industrializado: 91 },
    importComposition: { materiaPrima: 65, produtoFinal: 25 }, // Importa matéria-prima, exporta valor agregado
    principaisExportacoes: [
      'Automóveis',
      'Máquinas industriais',
      'Produtos farmacêuticos',
      'Equipamentos médicos',
      'Aviões',
      'Eletrônicos',
      'Químicos',
      'Plásticos'
    ],
    principaisImportacoes: [
      'Petróleo bruto',
      'Gás natural',
      'Peças automotivas',
      'Computadores',
      'Medicamentos',
      'Metais',
      'Equipamentos',
      'Alimentos'
    ],
    historicalExchange: [
      { year: 2010, cambioReal: 0.75, cambioSimulado: 0.75 },
      { year: 2012, cambioReal: 0.78, cambioSimulado: 0.72 },
      { year: 2014, cambioReal: 0.75, cambioSimulado: 0.70 },
      { year: 2016, cambioReal: 0.90, cambioSimulado: 0.75 },
      { year: 2018, cambioReal: 0.85, cambioSimulado: 0.72 },
      { year: 2020, cambioReal: 0.88, cambioSimulado: 0.74 },
      { year: 2022, cambioReal: 1.05, cambioSimulado: 0.80 },
      { year: 2024, cambioReal: 0.92, cambioSimulado: 0.78 },
    ],
    perdaEstimada: -120, // Ganho por agregar valor
    pibNominal: 4.26
  },
  {
    id: 'china',
    nome: 'China',
    bandeira: '🇨🇳',
    moeda: 'CNY/USD',
    exportComposition: { materiaPrima: 6, industrializado: 94 },
    importComposition: { materiaPrima: 75, produtoFinal: 15 }, // Importa commodities do Brasil, exporta manufaturados
    principaisExportacoes: [
      'Eletrônicos',
      'Computadores',
      'Telefones',
      'Máquinas',
      'Roupas',
      'Móveis',
      'Brinquedos',
      'Aço'
    ],
    principaisImportacoes: [
      'Circuitos integrados',
      'Petróleo bruto',
      'Minério de ferro',
      'Soja',
      'Gás natural',
      'Cobre',
      'Ouro',
      'Carvão'
    ],
    historicalExchange: [
      { year: 2010, cambioReal: 6.77, cambioSimulado: 6.77 },
      { year: 2012, cambioReal: 6.31, cambioSimulado: 5.80 },
      { year: 2014, cambioReal: 6.14, cambioSimulado: 5.50 },
      { year: 2016, cambioReal: 6.64, cambioSimulado: 5.80 },
      { year: 2018, cambioReal: 6.61, cambioSimulado: 5.60 },
      { year: 2020, cambioReal: 6.90, cambioSimulado: 5.50 },
      { year: 2022, cambioReal: 6.73, cambioSimulado: 5.20 },
      { year: 2024, cambioReal: 7.10, cambioSimulado: 5.40 },
    ],
    perdaEstimada: -350, // Maior ganho por industrialização massiva
    pibNominal: 17.96
  },
]

// Get country data by id
export function getCountryById(id: string): CountryDetailData | undefined {
  return countryDetailData.find(c => c.id === id)
}

// Calculate exchange rate deviation percentage
export function calcularDesvioPercentual(real: number, simulado: number): number {
  return ((real - simulado) / simulado) * 100
}

// Detailed sector data for exports/imports
export interface SectorData {
  id: string
  nome: string
  categoria: 'materiaPrima' | 'industrializado'
  tipo: 'export' | 'import'
  valorBilhoes: number
  percentualTotal: number
  crescimentoAnual: number
  principaisParceiros: string[]
  potencialAgregacao: number // multiplier for value-added potential
}

export const brazilSectorData: SectorData[] = [
  // EXPORTS - Raw Materials
  {
    id: 'soja',
    nome: 'Soja em Grao',
    categoria: 'materiaPrima',
    tipo: 'export',
    valorBilhoes: 52.8,
    percentualTotal: 15.2,
    crescimentoAnual: 8.5,
    principaisParceiros: ['China', 'Espanha', 'Tailandia'],
    potencialAgregacao: 3.5
  },
  {
    id: 'minerio-ferro',
    nome: 'Minerio de Ferro',
    categoria: 'materiaPrima',
    tipo: 'export',
    valorBilhoes: 38.4,
    percentualTotal: 11.0,
    crescimentoAnual: -2.3,
    principaisParceiros: ['China', 'Malasia', 'Japao'],
    potencialAgregacao: 5.0
  },
  {
    id: 'petroleo-bruto',
    nome: 'Petroleo Bruto',
    categoria: 'materiaPrima',
    tipo: 'export',
    valorBilhoes: 42.1,
    percentualTotal: 12.1,
    crescimentoAnual: 15.2,
    principaisParceiros: ['China', 'EUA', 'Chile'],
    potencialAgregacao: 4.0
  },
  {
    id: 'carne-bovina',
    nome: 'Carne Bovina',
    categoria: 'materiaPrima',
    tipo: 'export',
    valorBilhoes: 12.8,
    percentualTotal: 3.7,
    crescimentoAnual: 5.8,
    principaisParceiros: ['China', 'Hong Kong', 'Egito'],
    potencialAgregacao: 2.5
  },
  {
    id: 'acucar',
    nome: 'Acucar',
    categoria: 'materiaPrima',
    tipo: 'export',
    valorBilhoes: 14.2,
    percentualTotal: 4.1,
    crescimentoAnual: 12.4,
    principaisParceiros: ['India', 'Algeria', 'Bangladesh'],
    potencialAgregacao: 2.0
  },
  {
    id: 'cafe-grao',
    nome: 'Cafe em Grao',
    categoria: 'materiaPrima',
    tipo: 'export',
    valorBilhoes: 9.8,
    percentualTotal: 2.8,
    crescimentoAnual: 6.2,
    principaisParceiros: ['EUA', 'Alemanha', 'Italia'],
    potencialAgregacao: 4.5
  },
  {
    id: 'milho',
    nome: 'Milho',
    categoria: 'materiaPrima',
    tipo: 'export',
    valorBilhoes: 13.5,
    percentualTotal: 3.9,
    crescimentoAnual: 22.1,
    principaisParceiros: ['Ira', 'Egito', 'Japao'],
    potencialAgregacao: 3.0
  },
  {
    id: 'celulose',
    nome: 'Celulose',
    categoria: 'materiaPrima',
    tipo: 'export',
    valorBilhoes: 10.2,
    percentualTotal: 2.9,
    crescimentoAnual: 4.5,
    principaisParceiros: ['China', 'EUA', 'Paises Baixos'],
    potencialAgregacao: 3.5
  },
  {
    id: 'algodao',
    nome: 'Algodao',
    categoria: 'materiaPrima',
    tipo: 'export',
    valorBilhoes: 5.8,
    percentualTotal: 1.7,
    crescimentoAnual: 8.9,
    principaisParceiros: ['China', 'Bangladesh', 'Vietna'],
    potencialAgregacao: 5.0
  },
  {
    id: 'frango',
    nome: 'Carne de Frango',
    categoria: 'materiaPrima',
    tipo: 'export',
    valorBilhoes: 9.2,
    percentualTotal: 2.6,
    crescimentoAnual: 3.2,
    principaisParceiros: ['Arabia Saudita', 'Japao', 'Emirados'],
    potencialAgregacao: 2.0
  },
  // EXPORTS - Industrialized
  {
    id: 'avioes',
    nome: 'Aeronaves',
    categoria: 'industrializado',
    tipo: 'export',
    valorBilhoes: 5.2,
    percentualTotal: 1.5,
    crescimentoAnual: -5.2,
    principaisParceiros: ['EUA', 'Irlanda', 'China'],
    potencialAgregacao: 1.0
  },
  {
    id: 'automoveis',
    nome: 'Automoveis',
    categoria: 'industrializado',
    tipo: 'export',
    valorBilhoes: 4.8,
    percentualTotal: 1.4,
    crescimentoAnual: 12.5,
    principaisParceiros: ['Argentina', 'Mexico', 'Colombia'],
    potencialAgregacao: 1.0
  },
  {
    id: 'motores',
    nome: 'Motores e Turbinas',
    categoria: 'industrializado',
    tipo: 'export',
    valorBilhoes: 3.2,
    percentualTotal: 0.9,
    crescimentoAnual: 8.1,
    principaisParceiros: ['EUA', 'Argentina', 'Mexico'],
    potencialAgregacao: 1.0
  },
  {
    id: 'pecas-veiculos',
    nome: 'Pecas de Veiculos',
    categoria: 'industrializado',
    tipo: 'export',
    valorBilhoes: 4.5,
    percentualTotal: 1.3,
    crescimentoAnual: 6.8,
    principaisParceiros: ['Argentina', 'Mexico', 'EUA'],
    potencialAgregacao: 1.0
  },
  {
    id: 'oleo-soja-exp',
    nome: 'Oleo de Soja',
    categoria: 'industrializado',
    tipo: 'export',
    valorBilhoes: 3.8,
    percentualTotal: 1.1,
    crescimentoAnual: 15.2,
    principaisParceiros: ['India', 'China', 'Bangladesh'],
    potencialAgregacao: 1.0
  },
  {
    id: 'papel',
    nome: 'Papel e Cartao',
    categoria: 'industrializado',
    tipo: 'export',
    valorBilhoes: 2.9,
    percentualTotal: 0.8,
    crescimentoAnual: 4.2,
    principaisParceiros: ['Argentina', 'Chile', 'EUA'],
    potencialAgregacao: 1.0
  },
  // IMPORTS - Raw Materials
  {
    id: 'gas-natural',
    nome: 'Gas Natural',
    categoria: 'materiaPrima',
    tipo: 'import',
    valorBilhoes: 8.5,
    percentualTotal: 3.2,
    crescimentoAnual: 18.5,
    principaisParceiros: ['Bolivia', 'EUA', 'Trinidad e Tobago'],
    potencialAgregacao: 3.0
  },
  {
    id: 'fertilizantes',
    nome: 'Fertilizantes',
    categoria: 'materiaPrima',
    tipo: 'import',
    valorBilhoes: 18.2,
    percentualTotal: 6.8,
    crescimentoAnual: 32.5,
    principaisParceiros: ['Russia', 'China', 'Marrocos'],
    potencialAgregacao: 2.5
  },
  {
    id: 'carvao',
    nome: 'Carvao Mineral',
    categoria: 'materiaPrima',
    tipo: 'import',
    valorBilhoes: 4.8,
    percentualTotal: 1.8,
    crescimentoAnual: 45.2,
    principaisParceiros: ['EUA', 'Colombia', 'Australia'],
    potencialAgregacao: 2.0
  },
  {
    id: 'cobre',
    nome: 'Cobre e Derivados',
    categoria: 'materiaPrima',
    tipo: 'import',
    valorBilhoes: 3.2,
    percentualTotal: 1.2,
    crescimentoAnual: 8.5,
    principaisParceiros: ['Chile', 'Peru', 'EUA'],
    potencialAgregacao: 3.5
  },
  {
    id: 'trigo',
    nome: 'Trigo',
    categoria: 'materiaPrima',
    tipo: 'import',
    valorBilhoes: 2.8,
    percentualTotal: 1.0,
    crescimentoAnual: 25.8,
    principaisParceiros: ['Argentina', 'Paraguai', 'EUA'],
    potencialAgregacao: 2.5
  },
  // IMPORTS - Final Products
  {
    id: 'circuitos',
    nome: 'Circuitos Integrados',
    categoria: 'industrializado',
    tipo: 'import',
    valorBilhoes: 12.5,
    percentualTotal: 4.7,
    crescimentoAnual: 15.2,
    principaisParceiros: ['China', 'Coreia do Sul', 'Taiwa'],
    potencialAgregacao: 1.0
  },
  {
    id: 'medicamentos',
    nome: 'Medicamentos',
    categoria: 'industrializado',
    tipo: 'import',
    valorBilhoes: 11.8,
    percentualTotal: 4.4,
    crescimentoAnual: 12.8,
    principaisParceiros: ['EUA', 'Alemanha', 'Franca'],
    potencialAgregacao: 1.0
  },
  {
    id: 'automoveis-imp',
    nome: 'Automoveis',
    categoria: 'industrializado',
    tipo: 'import',
    valorBilhoes: 8.2,
    percentualTotal: 3.1,
    crescimentoAnual: 22.5,
    principaisParceiros: ['Argentina', 'Mexico', 'Alemanha'],
    potencialAgregacao: 1.0
  },
  {
    id: 'equipamentos-telecom',
    nome: 'Equipamentos Telecom',
    categoria: 'industrializado',
    tipo: 'import',
    valorBilhoes: 6.5,
    percentualTotal: 2.4,
    crescimentoAnual: 8.5,
    principaisParceiros: ['China', 'EUA', 'Coreia do Sul'],
    potencialAgregacao: 1.0
  },
  {
    id: 'pecas-avioes',
    nome: 'Pecas de Aeronaves',
    categoria: 'industrializado',
    tipo: 'import',
    valorBilhoes: 4.8,
    percentualTotal: 1.8,
    crescimentoAnual: -2.5,
    principaisParceiros: ['EUA', 'Franca', 'Reino Unido'],
    potencialAgregacao: 1.0
  },
  {
    id: 'plasticos',
    nome: 'Plasticos e Resinas',
    categoria: 'industrializado',
    tipo: 'import',
    valorBilhoes: 5.2,
    percentualTotal: 1.9,
    crescimentoAnual: 6.8,
    principaisParceiros: ['EUA', 'Alemanha', 'Belgica'],
    potencialAgregacao: 1.0
  },
  {
    id: 'maquinas-industriais',
    nome: 'Maquinas Industriais',
    categoria: 'industrializado',
    tipo: 'import',
    valorBilhoes: 7.8,
    percentualTotal: 2.9,
    crescimentoAnual: 10.2,
    principaisParceiros: ['China', 'Alemanha', 'Italia'],
    potencialAgregacao: 1.0
  },
  {
    id: 'equipamentos-medicos',
    nome: 'Equipamentos Medicos',
    categoria: 'industrializado',
    tipo: 'import',
    valorBilhoes: 4.2,
    percentualTotal: 1.6,
    crescimentoAnual: 14.5,
    principaisParceiros: ['EUA', 'Alemanha', 'China'],
    potencialAgregacao: 1.0
  },
]

// Country sector data
export interface CountrySectorProfile {
  countryId: string
  topExportSectors: Array<{ nome: string; percentual: number; categoria: 'materiaPrima' | 'industrializado' }>
  topImportSectors: Array<{ nome: string; percentual: number; categoria: 'materiaPrima' | 'industrializado' }>
  fortalezas: string[]
  fraquezas: string[]
}

export const countrySectorProfiles: CountrySectorProfile[] = [
  {
    countryId: 'brasil',
    topExportSectors: [
      { nome: 'Soja em Grao', percentual: 15.2, categoria: 'materiaPrima' },
      { nome: 'Petroleo Bruto', percentual: 12.1, categoria: 'materiaPrima' },
      { nome: 'Minerio de Ferro', percentual: 11.0, categoria: 'materiaPrima' },
      { nome: 'Carne Bovina', percentual: 3.7, categoria: 'materiaPrima' },
      { nome: 'Acucar', percentual: 4.1, categoria: 'materiaPrima' },
      { nome: 'Aeronaves', percentual: 1.5, categoria: 'industrializado' },
    ],
    topImportSectors: [
      { nome: 'Fertilizantes', percentual: 6.8, categoria: 'materiaPrima' },
      { nome: 'Circuitos Integrados', percentual: 4.7, categoria: 'industrializado' },
      { nome: 'Medicamentos', percentual: 4.4, categoria: 'industrializado' },
      { nome: 'Gas Natural', percentual: 3.2, categoria: 'materiaPrima' },
      { nome: 'Automoveis', percentual: 3.1, categoria: 'industrializado' },
      { nome: 'Maquinas Industriais', percentual: 2.9, categoria: 'industrializado' },
    ],
    fortalezas: ['Agronegocio', 'Mineracao', 'Energia (Pre-sal)'],
    fraquezas: ['Semicondutores', 'Farmaceutica', 'Bens de capital']
  },
  {
    countryId: 'argentina',
    topExportSectors: [
      { nome: 'Farelo de Soja', percentual: 18.5, categoria: 'industrializado' },
      { nome: 'Oleo de Soja', percentual: 8.2, categoria: 'industrializado' },
      { nome: 'Milho', percentual: 12.4, categoria: 'materiaPrima' },
      { nome: 'Trigo', percentual: 6.8, categoria: 'materiaPrima' },
      { nome: 'Veiculos', percentual: 5.2, categoria: 'industrializado' },
      { nome: 'Carne Bovina', percentual: 4.5, categoria: 'materiaPrima' },
    ],
    topImportSectors: [
      { nome: 'Gas Natural', percentual: 8.5, categoria: 'materiaPrima' },
      { nome: 'Automoveis', percentual: 6.2, categoria: 'industrializado' },
      { nome: 'Pecas de Veiculos', percentual: 5.8, categoria: 'industrializado' },
      { nome: 'Telefones', percentual: 4.2, categoria: 'industrializado' },
      { nome: 'Medicamentos', percentual: 3.8, categoria: 'industrializado' },
      { nome: 'Combustiveis', percentual: 3.5, categoria: 'materiaPrima' },
    ],
    fortalezas: ['Processamento de soja', 'Agricultura', 'Pecuaria'],
    fraquezas: ['Energia', 'Eletronica', 'Bens de capital']
  },
  {
    countryId: 'mexico',
    topExportSectors: [
      { nome: 'Automoveis', percentual: 11.2, categoria: 'industrializado' },
      { nome: 'Pecas Automotivas', percentual: 8.5, categoria: 'industrializado' },
      { nome: 'Computadores', percentual: 6.8, categoria: 'industrializado' },
      { nome: 'Televisores', percentual: 5.2, categoria: 'industrializado' },
      { nome: 'Petroleo', percentual: 8.5, categoria: 'materiaPrima' },
      { nome: 'Cerveja', percentual: 2.1, categoria: 'industrializado' },
    ],
    topImportSectors: [
      { nome: 'Pecas Eletronicas', percentual: 12.5, categoria: 'industrializado' },
      { nome: 'Combustiveis', percentual: 8.2, categoria: 'materiaPrima' },
      { nome: 'Pecas de Veiculos', percentual: 6.5, categoria: 'industrializado' },
      { nome: 'Plasticos', percentual: 4.8, categoria: 'industrializado' },
      { nome: 'Aco', percentual: 3.2, categoria: 'materiaPrima' },
      { nome: 'Equipamentos Medicos', percentual: 2.8, categoria: 'industrializado' },
    ],
    fortalezas: ['Manufatura', 'Automotivo', 'Eletronica'],
    fraquezas: ['Energia', 'Componentes base', 'Agricultura']
  },
  {
    countryId: 'coreia',
    topExportSectors: [
      { nome: 'Semicondutores', percentual: 18.5, categoria: 'industrializado' },
      { nome: 'Automoveis', percentual: 8.2, categoria: 'industrializado' },
      { nome: 'Navios', percentual: 6.5, categoria: 'industrializado' },
      { nome: 'Displays', percentual: 5.8, categoria: 'industrializado' },
      { nome: 'Equipamentos Telecom', percentual: 4.2, categoria: 'industrializado' },
      { nome: 'Baterias', percentual: 3.8, categoria: 'industrializado' },
    ],
    topImportSectors: [
      { nome: 'Petroleo Bruto', percentual: 18.5, categoria: 'materiaPrima' },
      { nome: 'Gas Natural', percentual: 8.2, categoria: 'materiaPrima' },
      { nome: 'Minerio de Ferro', percentual: 4.5, categoria: 'materiaPrima' },
      { nome: 'Semicondutores', percentual: 6.8, categoria: 'industrializado' },
      { nome: 'Carvao', percentual: 3.2, categoria: 'materiaPrima' },
      { nome: 'Aluminio', percentual: 2.5, categoria: 'materiaPrima' },
    ],
    fortalezas: ['Alta tecnologia', 'Manufatura avancada', 'P&D'],
    fraquezas: ['Energia', 'Recursos naturais', 'Agricultura']
  }
]

// Calculate sector contribution to "Perda Brasil"
export function calcularPerdaSetorial(sector: SectorData): number {
  if (sector.categoria === 'industrializado' || sector.tipo === 'import') {
    return 0
  }
  return sector.valorBilhoes * (sector.potencialAgregacao - 1)
}

// Get sectors sorted by loss contribution
export function getSetoresPorPerda(): SectorData[] {
  return brazilSectorData
    .filter(s => s.tipo === 'export' && s.categoria === 'materiaPrima')
    .sort((a, b) => calcularPerdaSetorial(b) - calcularPerdaSetorial(a))
}

// Future projection calculation
export interface FutureScenario {
  ano: number
  energia: number
  alimentos: number
  minerios: number
  industria: number
  reservas: number
}

export interface ProjectionResult {
  ano: number
  icbProjetado: number
  cambioProjetado: number
  cambioAtualProjetado: number
  diferencaPercentual: number
}

export function calcularProjecaoFutura(
  cenarios: FutureScenario[],
  pesosPersonalizados: Pesos
): ProjectionResult[] {
  return cenarios.map(cenario => {
    const dadosFicticios: YearData = {
      year: cenario.ano,
      cambioReal: 5.15 * (1 + (cenario.ano - 2024) * 0.02), // 2% annual depreciation trend
      energia: cenario.energia,
      alimentos: cenario.alimentos,
      minerios: cenario.minerios,
      industria: cenario.industria,
      reservas: cenario.reservas,
      exportMateriaPrima: 70,
      exportIndustrializado: 30,
      importInsumos: 80,
      importConsumo: 20,
      exportTotal: 350
    }
    
    const icb = calcularICB(dadosFicticios, pesosPersonalizados)
    const cambioProjetado = calcularRealSimulado(icb)
    const cambioAtualProjetado = dadosFicticios.cambioReal
    const diferencaPercentual = ((cambioAtualProjetado - cambioProjetado) / cambioProjetado) * 100
    
    return {
      ano: cenario.ano,
      icbProjetado: Number(icb.toFixed(1)),
      cambioProjetado: Number(cambioProjetado.toFixed(2)),
      cambioAtualProjetado: Number(cambioAtualProjetado.toFixed(2)),
      diferencaPercentual: Number(diferencaPercentual.toFixed(1))
    }
  })
}

// ==================== DEPENDÊNCIA TECNOLÓGICA ====================

export interface TechDependencyData {
  id: string
  categoria: 'semicondutores' | 'fertilizantes'
  importPercentual: number // % importado
  importValue: number // valor em US$ bilhões/ano
  producaoNacional: number // produção local em US$ bilhões
  emprego: number // empregos diretos
  principaisSupridores: Array<{ pais: string; percentual: number }>
  nivelRisco: 'crítico' | 'alto' | 'médio' | 'baixo'
  metricas: Record<string, number | string>
  projecao2033?: number
}

export interface GlobalInvestmentData {
  pais: string
  bandeira: string
  investimentoUSD: number // em bilhões USD
  periodo: string
  fonte: string
  tipo: 'chips' | 'semicondutores' | 'fertilizantes'
}

export interface GeopoliticalRisk {
  id: string
  categoria: string
  risco: string
  impacto: 'crítico' | 'alto' | 'médio' | 'baixo'
  vulnerabilidade: number // 0-100
  descricao: string
}

// Dados de Dependência Tecnológica do Brasil
export const techDependencyData: TechDependencyData[] = [
  {
    id: 'semicondutores',
    categoria: 'semicondutores',
    importPercentual: 92,
    importValue: 5,
    producaoNacional: 1,
    emprego: 2500,
    principaisSupridores: [
      { pais: 'China', percentual: 35 },
      { pais: 'Coreia do Sul', percentual: 25 },
      { pais: 'Taiwan', percentual: 20 },
      { pais: 'EUA', percentual: 15 },
      { pais: 'Outros', percentual: 5 }
    ],
    nivelRisco: 'crítico',
    metricas: {
      'Chips Encapsulados': '200 milhões/ano',
      'Déficit Eletrônicos': 'US$ 38,6 bi (2022)',
      'População Empregada': '2.500 pessoas',
      'Capacidade Produção': 'US$ 1 bilhão/ano'
    },
    projecao2033: 15
  },
  {
    id: 'fertilizantes',
    categoria: 'fertilizantes',
    importPercentual: 85,
    importValue: 18.2,
    producaoNacional: 7.7,
    emprego: 5800,
    principaisSupridores: [
      { pais: 'Rússia', percentual: 23 },
      { pais: 'China', percentual: 18 },
      { pais: 'Canadá', percentual: 15 },
      { pais: 'Marrocos', percentual: 14 },
      { pais: 'Belarus', percentual: 10 },
      { pais: 'Outros', percentual: 20 }
    ],
    nivelRisco: 'crítico',
    metricas: {
      'Nitrogênio Importado': '77%',
      'Fósforo Importado': '55%',
      'Potássio Importado': '97%',
      'Demanda Anual': '45 milhões toneladas'
    }
  }
]

// Investimentos Globais em Semicondutores (2024-2033)
export const globalInvestmentsData: GlobalInvestmentData[] = [
  {
    pais: 'China',
    bandeira: '🇨🇳',
    investimentoUSD: 1400,
    periodo: 'Projetado até 2033',
    fonte: 'WSTS / Gazeta do Povo 2024',
    tipo: 'chips'
  },
  {
    pais: 'EUA',
    bandeira: '🇺🇸',
    investimentoUSD: 280,
    periodo: 'Até 2030 (CHIPS Act)',
    fonte: 'CHIPS and Science Act',
    tipo: 'chips'
  },
  {
    pais: 'EUA (Subsídio Direto)',
    bandeira: '🇺🇸',
    investimentoUSD: 52,
    periodo: 'Direto (incluído)',
    fonte: 'CHIPS Act',
    tipo: 'chips'
  },
  {
    pais: 'União Europeia',
    bandeira: '🇪🇺',
    investimentoUSD: 47,
    periodo: 'Próxima década',
    fonte: 'European Chips Act',
    tipo: 'chips'
  },
  {
    pais: 'Coreia do Sul',
    bandeira: '🇰🇷',
    investimentoUSD: 28,
    periodo: 'K-Chips Act',
    fonte: 'TrendsCE',
    tipo: 'chips'
  },
  {
    pais: 'Brasil',
    bandeira: '🇧🇷',
    investimentoUSD: 5,
    periodo: 'Até 2035',
    fonte: 'Lei 14.968/2024 / Brasil Semicon',
    tipo: 'chips'
  },
  {
    pais: 'Brasil (Incentivos)',
    bandeira: '🇧🇷',
    investimentoUSD: 4.2,
    periodo: 'Até 2026',
    fonte: 'Lei 14.968/2024',
    tipo: 'chips'
  }
]

// Riscos Geopolíticos e Vulnerabilidades
export const geopoliticalRisksData: GeopoliticalRisk[] = [
  {
    id: 'taiwan',
    categoria: 'Semicondutores',
    risco: 'Taiwan produz 50% dos chips avançados do mundo',
    impacto: 'crítico',
    vulnerabilidade: 95,
    descricao: 'Invasão chinesa desabilitaria 50% produção global, cortaria suprimentos do Brasil'
  },
  {
    id: 'china-restricoes',
    categoria: 'Semicondutores',
    risco: 'China concentra 35% das importações de chips do Brasil',
    impacto: 'crítico',
    vulnerabilidade: 88,
    descricao: 'Possíveis sanções EUA poderiam bloquear chips com tecnologia americana'
  },
  {
    id: 'russia-fertilizantes',
    categoria: 'Fertilizantes',
    risco: 'Rusia fornece 55% das importações de fertilizantes do Brasil',
    impacto: 'crítico',
    vulnerabilidade: 92,
    descricao: 'Sanções podem aumentar custos ou criar escassez - impacto crítico na agricultura'
  },
  {
    id: 'concentracao-fornecedores',
    categoria: 'Geral',
    risco: '80% da produção de chips mundial concentrada na Ásia',
    impacto: 'alto',
    vulnerabilidade: 85,
    descricao: 'Qualquer desastre (terremoto, guerra) afetaria suprimentos globais'
  },
  {
    id: 'dependencia-importacao',
    categoria: 'Geral',
    risco: 'Brasil importa 92% dos chips que consome e 85% dos fertilizantes',
    impacto: 'crítico',
    vulnerabilidade: 90,
    descricao: 'Dupla dependência crítica compromete soberania tecnológica e alimentar'
  }
]

// Índice de Vulnerabilidade Soberana do Brasil
export const sovereigntyVulnerabilityIndex = {
  semicondutores: 92,
  fertilizantes: 85,
  maquinarioIndustrial: 70,
  farmaceuticos: 80,
  componentesEletronicos: 88,
  media: 83,
  classificacao: '🔴 CRÍTICO - Dependência Colonial de Tecnologia',
  tendencia: 'piorando' as const,
  alertas: [
    'Brasil investe 280x menos que China em semicondutores',
    'Rusia pode cortar 55% do fornecimento de fertilizantes a qualquer momento',
    'Taiwan concentra 50% dos chips avançados - risco geopolítico extremo',
    'Sem chips, Brasil não fabrica carros elétricos, celulares ou máquinas agrícolas',
    'Sem fertilizantes, colapso na produção de alimentos para 200 milhões de pessoas'
  ]
}

// Função: Calcular Índice de Vulnerabilidade Soberana
export function calcularIndiceVulnerabilidade(): number {
  const valores = Object.entries(sovereigntyVulnerabilityIndex)
    .filter(([key]) => typeof sovereigntyVulnerabilityIndex[key as keyof typeof sovereigntyVulnerabilityIndex] === 'number')
    .map(([, value]) => value as number)
  
  return valores.length > 0 ? valores.reduce((a, b) => a + b, 0) / valores.length : 0
}

// Função: Obter investimentos globais com comparação
export function getInvestimentosGlobaisComparacao() {
  const brasil = globalInvestmentsData.find(d => d.pais === 'Brasil' && d.tipo === 'chips')?.investimentoUSD || 5
  const china = globalInvestmentsData.find(d => d.pais === 'China')?.investimentoUSD || 1400
  
  return {
    brasil,
    china,
    razao: Math.round(china / brasil),
    mensagem: `China investe ${Math.round(china / brasil)}x MAIS que o Brasil`
  }
}

// Função: Obter dados de risco ordenados por criticidade
export function getRiscosOrdernadosPorCriticidade() {
  return geopoliticalRisksData.sort((a, b) => {
    const ordem = { 'crítico': 3, 'alto': 2, 'médio': 1, 'baixo': 0 }
    return ordem[b.impacto] - ordem[a.impacto]
  })
}

// Função: Calcular "Perda Brasil" por dependência tecnológica
export function calcularPerdaByTechDependency(): number {
  // Estimativa conservadora: Brasil perde US$ 15-20 bilhões/ano por não produzir
  // Semicondutores: diferença entre importação (5 bi) e potencial de produção local
  // Fertilizantes: diferença entre importação (18.2 bi) e insumos mais caros
  const perdaSemicondutores = 5 * 2.5 // 2.5x valor agregado
  const perdaFertilizantes = 18.2 * 0.8 // 80% de custo adicional por importação
  return perdaSemicondutores + perdaFertilizantes
}

// Função: Obter dados para gráfico de dependência
export function getDadosGraficoDependencia() {
  return techDependencyData.map(d => ({
    categoria: d.id.charAt(0).toUpperCase() + d.id.slice(1),
    importado: d.importPercentual,
    nacional: 100 - d.importPercentual,
    valor: d.importValue,
    risco: d.nivelRisco
  }))
}

// Função: Obter dados para gráfico de investimentos (escala logarítmica)
export function getDadosGraficoInvestimentos() {
  const chipsData = globalInvestmentsData.filter(d => d.tipo === 'chips')
  return chipsData.map(d => ({
    pais: d.pais,
    bandeira: d.bandeira,
    investimento: d.investimentoUSD,
    log: Math.log10(Math.max(d.investimentoUSD, 0.1)), // log para visualizar escala
    fonte: d.fonte
  }))
}
