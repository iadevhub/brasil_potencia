# Guia de Contribuição - Brasil Potência

## Como Contribuir

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Faça commit: `git commit -m 'Adiciona minha feature'`
4. Push: `git push origin feature/minha-feature`
5. Abra um Pull Request

## Estrutura de Código

### Componentes (`components/`)
- Use TypeScript estrito
- Componentes funcionais com hooks
- Props tipadas com interface

### Lib (`lib/`)
- Funções puras quando possível
- Documentação JSDoc
- Testes para funções críticas

## Padrões

```typescript
// Exemplo de componente
"use client"

import { useState } from "react"

interface Props {
  data: DataType
}

export function MeuComponente({ data }: Props) {
  // ...
}
```

## Scripts Úteis

```bash
# Desenvolvimento
pnpm dev

# Build
pnpm build

# Executar fases
npx tsx lib/master-all-phases.ts

# Lint
pnpm lint
```

## Commits

Use Conventional Commits:
- `feat:` Nova feature
- `fix:` Correção de bug
- `docs:` Documentação
- `refactor:` Refatoração
- `test:` Testes
