# Como usar paletas diferentes por página

## Sistema de Paletas

O BaseSystem agora suporta definir paletas diferentes para cada página. Isso permite criar experiências visuais únicas mantendo a consistência do design system.

## Paletas Disponíveis

- **NTX** - Paleta oficial (roxo vibrante)
- **Brand** - Identidade forte (roxo intenso)
- **Neutral** - Corporativo/versátil (tons neutros)
- **SoftPurple** - Branding leve (roxo suave)
- **Editorial** - Leitura/conteúdo (minimalista)
- **DeepPurple** - Intenso/criativo (roxo profundo)
- **Graphite** - Técnico/SaaS (tons de grafite)

## Como definir paleta em uma página

### Método 1: No useEffect (recomendado)

```tsx
import { useEffect } from 'react'
import { useTheme } from '../composables/useTheme'

export default function MinhaPage() {
  const { palette, setPalette } = useTheme()
  
  // Define a paleta ao montar o componente
  useEffect(() => {
    setPalette('Brand') // Troque para a paleta desejada
  }, [])
  
  return (
    <div>
      {/* Seu conteúdo */}
    </div>
  )
}
```

### Método 2: Seletor dinâmico

```tsx
import { useTheme } from '../composables/useTheme'
import type { PaletteName } from '../composables/ThemeContext'

export default function ConfigPage() {
  const { palette, setPalette } = useTheme()
  const palettes: PaletteName[] = ['NTX', 'Brand', 'Neutral', 'SoftPurple']
  
  return (
    <div>
      <select 
        value={palette} 
        onChange={(e) => setPalette(e.target.value as PaletteName)}
      >
        {palettes.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
  )
}
```

## Exemplos de uso

### Dashboard (PlusDashboard.tsx) - Paleta NTX
```tsx
useEffect(() => {
  setPalette('NTX')
}, [])
```

### Página de Showcase - Paleta Brand
```tsx
useEffect(() => {
  setPalette('Brand')
}, [])
```

### Página de Configurações - Paleta Neutral
```tsx
useEffect(() => {
  setPalette('Neutral')
}, [])
```

## Persistência

A paleta selecionada é automaticamente salva no `localStorage` e permanece entre sessões. Para resetar:

```javascript
localStorage.removeItem('palette')
```

## Combinação com Dark/Light Mode

O sistema suporta tanto troca de paleta quanto dark/light mode simultaneamente:

```tsx
const { palette, setPalette, isDark, toggleTheme } = useTheme()

// Trocar paleta
setPalette('DeepPurple')

// Trocar modo
toggleTheme()
```

Cada paleta tem variantes para light e dark mode automaticamente!
