# Sistema de Design - Mercadô

## Análise da Aplicação Original (connect-alagoas)

Este documento descreve o sistema de design, padrões de layout e estrutura visual da aplicação `connect-alagoas` para replicação no `mercado-next`.

---

## Paleta de Cores

### Cores Principais

#### Background & Foreground
- **Background**: `0 0% 98%` - Fundo quase branco
- **Foreground**: `224 71% 4%` - Texto azul-acinzentado muito escuro
- **Card**: `0 0% 100%` - Cards brancos puros
- **Card Foreground**: `224 71% 4%` - Texto escuro em cards

#### Primary (Laranja Vibrante)
- **Primary**: `24 95% 53%` (#F97316 - orange-500)
- **Primary Foreground**: `0 0% 100%` - Texto branco sobre laranja

#### Secondary (Sidebar Moderno)
- **Secondary**: `220 13% 18%` - Cinza escuro moderno
- **Secondary Foreground**: `0 0% 100%` - Texto branco

#### Muted (Áreas de Fundo Claro)
- **Muted**: `220 14% 96%` - Cinza muito claro
- **Muted Foreground**: `220 9% 46%` - Texto cinza médio

#### Accent (Destaques)
- **Accent**: `32 95% 44%` - Variação de laranja escura
- **Accent Foreground**: `0 0% 100%`

### Cores de Status

- **Warning** (Pendente): `45 93% 47%` (amber-500)
- **Info** (Em rota): `217 91% 60%` (blue-500)
- **Success** (Entregue): `142 69% 58%` (green-500)
- **Destructive**: `0 84% 60%`

### Bordas e Inputs

- **Border**: `220 13% 91%` - Borda cinza claro
- **Input**: `220 13% 91%` - Mesma cor da borda
- **Ring**: `24 95% 53%` - Anel de foco laranja

### Sidebar (Light)

- **Background**: `0 0% 100%` - Fundo branco
- **Foreground**: `224 71% 4%` - Texto escuro
- **Primary**: `24 95% 53%` - Laranja para itens ativos
- **Accent**: `220 14% 96%` - Hover muito claro
- **Border**: `220 13% 91%` - Borda clara

---

## Estilos Globais

### Animações Customizadas

```css
/* fade-in */
0%: { opacity: 0, transform: translateY(4px) }
100%: { opacity: 1, transform: translateY(0) }

/* scale-in */
0%: { transform: scale(0.95), opacity: 0 }
100%: { transform: scale(1), opacity: 1 }

/* slide-in */
0%: { transform: translateX(-4px), opacity: 0 }
100%: { transform: translateX(0), opacity: 1 }
```

### Classes Utilitárias

#### hover-lift
- Transição suave
- Efeito de elevação no hover (`translateY(-0.5)`)
- Sombra aumentada no hover

#### hover-scale
- Transição suave
- Escala de 105% no hover

#### focus-ring
- Sem outline padrão
- Anel de foco com 2px usando `--ring`
- Offset de 2px

---

## Layouts e Componentes

### Home Page

**Estrutura:**
1. **Hero Section**
   - Título grande com gradiente
   - Descrição
   - Destaques com ícones (MapPin, Clock, Truck, Users)
   - CTA principal

2. **Ofertas do Dia (Today's Offers)**
   - Grid de 3 colunas (mobile: 1, tablet: 2, desktop: 3)
   - Cards com:
     - Badge de desconto
     - Botão de favoritar
     - Imagem
     - Rating e tempo de entrega
     - Nome do produto e produtor
     - Localização
     - Preço original vs. oferta
     - Botão de adicionar ao carrinho

3. **Categorias**
   - Grid de 8 itens
   - Ícones grandes
   - Nome da categoria
   - Contador de produtos

4. **Produtos em Destaque**
   - Similar às ofertas
   - Badge de categoria em vez de desconto

5. **CTA Final**
   - Gradiente de fundo (amber/orange)
   - Título e descrição
   - Botão de ação

6. **Footer**
   - Background card
   - Logo centralizado
   - Links

**Características Visuais:**
- Background com gradiente: `bg-gradient-to-br from-amber-50/50 via-background to-orange-50/30`
- Cards com hover suave
- Sombras e bordas arredondadas
- Badges coloridos para status

### Login Page

**Estrutura:**
1. **Container com gradiente de fundo**
   - `bg-gradient-to-br from-muted to-background`

2. **Logo Section**
   - Ícone em um círculo gradiente
   - Título "Mercadô"
   - Descrição

3. **Card de Login**
   - Background card
   - Borda
   - Sombra 2xl com cor primária
   - Backdrop blur

4. **Form**
   - Inputs com ícones à esquerda
   - Labels em foreground
   - Botão primário
   - Link para registro

**Características:**
- Centrado verticalmente e horizontalmente
- Animações fade-in
- Inputs com ícones
- Botões com gradiente

### Products Listing Page

**Estrutura:**
1. **Header**
   - Breadcrumb (navegação)
   - Título e filtros

2. **Sidebar de Filtros**
   - Categorias
   - Range de preço
   - Filtros adicionais

3. **Grid de Produtos**
   - View toggle (grid/list)
   - Ordenação
   - Cards de produtos

4. **Pagination**
   - Navegação de páginas

**Características:**
- Layout responsivo
- Filtros colapsáveis
- View mode alternável
- Cards consistentes com home

### Header (AppHeader)

**Características:**
- Altura: `h-20`
- Border bottom
- Background: `bg-card/80`
- Backdrop blur
- Posição sticky
- Z-index alto (z-50)

**Elementos:**
- Sidebar trigger (mobile)
- Título e descrição
- User menu dropdown

**User Dropdown:**
- Avatar com gradiente
- Nome e role
- Links de ação
- Logout destrutivo

### Cards de Produto

**Estrutura:**
```
- Card (overflow-hidden, hover effects)
  - Container de imagem
    - Imagem ou placeholder
    - Badge de estoque (absoluto)
    - Badge de quantidade no carrinho (absoluto)
  - Info do produto
    - Info do produtor (com MapPin)
    - Nome do produto
    - Descrição (truncada)
    - Preço e estoque
    - Botão de adicionar (hover)
    - Rating (placeholder)
```

**Estados:**
- Em estoque: Badge padrão
- Últimas unidades (≤5): Badge secondary
- Fora de estoque: Badge destructive

**Interações:**
- Click no card → Navega para detalhes
- Click no botão favoritar → Toast
- Click em adicionar → Adiciona ao carrinho + Toast
- Hover → Elevação e sombra

---

## Padrões de Espaçamento

- Container: `container mx-auto px-6`
- Seções: `py-12` (3rem)
- Gaps em grids: `gap-6`
- Padding em cards: `p-4` ou `p-6`
- Espaçamento entre elementos: `mb-8`, `mb-4`, etc.

---

## Tipografia

- Fontes: Inter, system-ui, sans-serif
- Títulos grandes: `text-4xl md:text-6xl`
- Títulos de seção: `text-2xl font-bold`
- Títulos de card: `font-semibold`
- Texto de descrição: `text-muted-foreground`

---

## Componentes UI Padrão

### Button
- Variantes: default, secondary, destructive, outline, ghost, link
- Tamanhos: sm, default, lg, icon
- Hover effects suaves
- Foco com anel laranja

### Card
- Background branco
- Border
- Hover: shadow-lg + translate
- Border radius: var(--radius)

### Badge
- Variantes: default, secondary, destructive, outline
- Arredondado (rounded-full)
- Padding: px-2.5 py-0.5
- Texto pequeno (text-xs)

### Input
- Background card
- Border
- Ícones à esquerda quando necessário
- Focus ring laranja

---

## Gradientes

### Primary Gradient
```css
bg-gradient-to-br from-primary to-accent
```

### Background Gradients
```css
bg-gradient-to-br from-amber-50/50 via-background to-orange-50/30
```

### Card Gradients
```css
bg-gradient-to-br from-amber-100/80 to-orange-100/80
```

---

## Sombras

- Cards padrão: `shadow-md`
- Cards hover: `shadow-lg`
- Header: `backdrop-blur-sm`
- Login card: `shadow-2xl shadow-primary/10`

---

## Dark Mode

- Dark mode mantém as mesmas cores primárias (laranja)
- Backgrounds invertidos
- Textos invertidos
- Sidebar permanece light mesmo no dark mode

---

## Resumo de Padrões

### Cores Dominantes
1. **Laranja** (#F97316) - Primary, CTAs, Highlights
2. **Branco** - Cards, Backgrounds
3. **Cinza claro** - Backgrounds secundários
4. **Azul-acinzentado escuro** - Texto

### Layouts
- Container centralizado com padding
- Grids responsivos (1 col mobile, 2-3 tablet, 3-4 desktop)
- Cards com hover effects
- Sidebar colapsável
- Header sticky

### Interações
- Hover: Elevação, sombra, escala
- Focus: Ring laranja
- Loading states: Skeletons
- Toasts: Sonner

### Spacing
- Seções: py-12
- Cards: p-4 ou p-6
- Gaps: gap-6
- Margins verticais: mb-8, mb-4, mb-2

### Animações
- fade-in: 0.3s ease-out
- hover transitions: 200ms
- scale-in: 0.2s ease-out
- slide-in: 0.2s ease-out

