# 🇧🇷 Brasil Potência - Dashboard Econômico

> Visualização interativa do potencial econômico brasileiro através do Índice Cesta Brasil (ICB)

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 📊 Visão Geral

O **Brasil Potência** é um dashboard interativo que analisa o potencial econômico brasileiro através de:

- **Índice Cesta Brasil (ICB)**: Índice composto que mede a força produtiva do país
- **Simulação de Câmbio**: Comparação entre câmbio real e potencial
- **Análise de Políticas**: ROI de políticas de agregação de valor
- **Projeções 2025-2030**: Cenários pessimista, base e otimista

## 🚀 Quick Start

```bash
# Instalar dependências
pnpm install

# Rodar em desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Executar análises (FASE 2.5, 3, 4)
npx tsx lib/master-all-phases.ts
```

## 📁 Estrutura do Projeto

```
brasil-potencia/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Dashboard principal
│   └── api/               # APIs (BCB, exchange-rate)
├── components/            # Componentes React
│   ├── economic-dashboard.tsx
│   ├── scenarios-panel.tsx
│   ├── policy-recommendations.tsx
│   └── ...
├── lib/                   # Lógica de negócios
│   ├── brasil-data.ts     # Dados históricos 2000-2024
│   ├── dashboard-data.ts  # FASE 3 - Preparação dashboard
│   ├── policy-analysis.ts # FASE 4 - Análise de políticas
│   ├── economic-model.ts  # FASE 2 - Modelo econômico
│   └── master-*.ts        # Orquestradores de fases
└── public/                # Assets estáticos
```

## 📈 Fases do Projeto

| Fase | Descrição | Status |
|------|-----------|--------|
| 1 | Integração de dados reais (BCB, IBGE, FRED) | ✅ Concluída |
| 2 | Modelo econômico (ICB, câmbio simulado) | ✅ Concluída |
| 2.5 | Refinamento (SELIC, risco, inflação) | ✅ Concluída |
| 3 | Dashboard e cenários | ✅ Concluída |
| 4 | Análise de políticas e ROI | ✅ Concluída |

## 🎯 Indicadores Calculados

- **ICB Real**: Índice baseado em energia, alimentos, minérios, indústria e reservas
- **ICB Potencial**: Se Brasil agregasse valor (+9%)
- **Perda Brasil**: Valor não capturado por exportar commodities brutas
- **ROI de Políticas**: Retorno de investimento em 1, 3 e 5 anos

## 🏭 Políticas Analisadas

1. **Hub de Semicondutores** - US$ 15 bi
2. **Complexo de Energia Renovável** - US$ 20 bi
3. **Agro-Tech & Processamento** - US$ 8 bi
4. **Mineração Verde & Lítio** - US$ 12 bi
5. **Complexo de Biocombustíveis** - US$ 5 bi

## 📦 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
docker build -t brasil-potencia .
docker run -p 3000:3000 brasil-potencia
```

## 📄 Arquivos Gerados

Após executar `npx tsx lib/master-all-phases.ts`:

- `dados-dashboard.json` - Dados para visualização
- `analise-politicas.json` - Análise de políticas
- `RELATORIO_FASE_3.txt` - Relatório dashboard
- `RELATORIO_FASE_4.txt` - Relatório políticas

## 🔗 Fontes de Dados

- [Banco Central do Brasil (BCB)](https://www.bcb.gov.br/)
- [IBGE SIDRA](https://sidra.ibge.gov.br/)
- [FRED (Federal Reserve)](https://fred.stlouisfed.org/)
- [ONS - Operador Nacional do Sistema](https://www.ons.org.br/)

## 👤 Autor

**Arildo Stepenovski**

Objetivo: Educação econômica e debate sobre soberania nacional

## 📜 Licença

MIT License - Uso livre para fins educacionais
