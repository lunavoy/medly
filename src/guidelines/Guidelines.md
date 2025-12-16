## Sistema de Estilo — Resumo

Este documento descreve a estética, usabilidade e padrões de componentes baseados em `src/styles/globals.css`.
Use estas diretrizes para manter consistência visual e acessibilidade em toda a aplicação.

**Tokens principais**
- **Cores:** Definidas por variáveis CSS: `--background`, `--foreground`, `--primary`, `--secondary`, `--accent`, `--muted`, `--destructive`, etc.
- **Radius:** `--radius` e variações de `--radius-sm|md|lg|xl` para cantos.
- **Tipografia:** font-size base em `--font-size` (16px) e peso `--font-weight-normal|medium`.
- **Tema escuro:** ativado pela classe `.dark` que sobrescreve os tokens.

## Botões

Padrões principais de botão usados:

- **Primário (Primary)**
  - Uso: ação principal por seção (submit, confirmar).
  - Visual: fundo em `--primary`, texto em `--primary-foreground`.
  - States: hover/darken, active/press; foco com `outline`/`ring` usando `--ring`.
  - Acessibilidade: fornecer `aria-label` quando o texto não for explícito.

- **Secundário (Secondary)**
  - Uso: ações alternativas.
  - Visual: fundo transparente ou `--accent`, borda em `--border` e texto em `--secondary-foreground`.

- **Tertiário / Text Button**
  - Uso: ações de menor importância (links, ações auxiliares).
  - Visual: texto simples com `color: var(--primary)` ou `var(--secondary)`.

**Tamanhos**
- `small`, `default`, `large` — manter altura mínima de 36–48px para acessibilidade. Use classes utilitárias como `.clickable-large` para alvos maiores.

**Estados e foco**
- `:focus-visible` deve expor um anel com `--ring` (aplicar `.focus-visible-enhanced` quando quiser foco forte).
- Usar transições suaves para hover/active (0.1–0.2s) para feedback visual.

## Componentes e padrões de usabilidade

- **Inputs / Forms**
  - Background: `--input-background` / `--input`.
  - Borda: `--border`. Indicadores de erro devem usar `--destructive`.
  - Placeholder e label: cores reduzidas (`--muted-foreground`).

- **Cartões (Cards)**
  - Fundo: `--card`, texto `--card-foreground`.
  - Sombra leve e radius `--radius` para separar conteúdo.

- **Popover / Tooltip / Modal**
  - Fundo: `--popover`, texto `--popover-foreground`.
  - Animações: uso de classes `.animate-fade-in` `.animate-scale-in` para entrada; `.animate-slide-in-right` para panes deslizantes.

- **Sidebar / Navigation**
  - Tokens: `--sidebar`, `--sidebar-foreground`, com destaque em `--sidebar-primary`/`--sidebar-accent`.
  - Estado ativo: contraste maior, indicador lateral ou border com `--sidebar-ring`.

- **Acessibilidade**
  - Foco clara e ampliado: `.focus-visible-enhanced` para usuários que navegam por teclado.
  - Modo alto contraste: `.high-contrast` ativa uma paleta de alto contraste para usuários com baixa visão.
  - Font-size utilities: `.text-large` (125%) e `.text-xlarge` (150%) para aumentar legibilidade.
  - Alvos de interação aumentados: `.clickable-large` (mínimo 48×48px).

## Animações e transições

- Pré-definições: `slideInRight`, `fadeIn`, `scaleIn` usadas com classes utilitárias (`.animate-*`).
- Recomendações: usar animações curtas (≤300ms) e respeitar preferências `prefers-reduced-motion` (desativar animações quando solicitado pelo usuário).

## Temas e tokens

- A troca de tema é feita adicionando/removendo a classe `.dark` no elemento raiz; todas as variáveis mudam automaticamente.
- Evitar cores hard-coded em componentes — consumir as variáveis CSS (`var(--color-*)` ou `var(--*)`).

## Utilitários CSS relevantes

- `@layer base` define tipografia e resets; `@layer utilities` contém utilitários específicos (foco, alto-contraste, tamanhos de texto).
- Preferir classes utilitárias para alterações rápidas de acessibilidade (ex.: `.high-contrast`, `.text-large`).

## Diretrizes de implementação de componentes

- **Separação de preocupações:** cada componente deve expor propriedades para estado (disabled, loading, active) e aceitar classes adicionais.
- **States visuais:** sempre prever estados: default, hover, focus, active, disabled, loading.
- **Testes visuais:** verificar contrastes com ferramentas (WCAG AA mínimo para texto normal).

## Exemplos rápidos

- Botão primário:

```html
<button class="btn btn-primary focus-visible-enhanced">Salvar</button>
```

- Input com erro:

```html
<label>
  Email
  <input class="input" aria-invalid="true" />
  <span class="text-destructive">Formato inválido</span>
</label>
```

## Notas finais

- Mantenha consistência usando os tokens em `src/styles/globals.css`.
- Atualize este arquivo se adicionar novas variáveis, utilitários ou componentes com estilos próprios.
- Se quiser, posso gerar um conjunto de classes CSS/React utilities para padronizar `btn-primary`, `btn-secondary`, `input`, `card` automaticamente.

--
Arquivo gerado a partir de `src/styles/globals.css` — última revisão automática.
