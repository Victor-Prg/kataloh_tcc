Você está trabalhando em um Design System próprio.

Stack do projeto:
- React 19 .,
- TypeScript (strict = true)
- Vite
- Sem bibliotecas de UI externas
- Sem styled-components ou tailwind
- Estilização baseada em theme.ts e ThemeContext
- Ícones usando phosphor-react
- Componentes ficam em src/components
- Cada componente é exportado no components/index.ts

Padrão obrigatório:
- Componentes funcionais
- Props bem tipadas com interface
- Usar forwardRef quando aplicável
- Acessibilidade (aria-*)
- Estados visuais claros
- Código simples e reutilizável
- Não acoplar lógica de negócio
- Não usar dependências externas
- Seguir o padrão dos componentes já existentes

Sempre:
- Criar o arquivo do componente
- Atualizar o index.ts
- Mostrar exemplo de uso
