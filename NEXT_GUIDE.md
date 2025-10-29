# Mercadô – Guia de Desenvolvimento Next.js (App Router, Vercel, RSC por padrão)

Este documento padroniza como construir o front público e admin do Mercadô em Next.js (App Router), com Server Components por padrão, focando em SEO, performance e time-to-market. Foi pensado para reuso e migração incremental a partir do projeto Vite.

## Sumário

1. Decisões de Arquitetura
2. Estrutura de Pastas
3. Convenções e Padrões
4. Configuração Essencial (next.config.ts, Env, Tailwind)
5. Roteamento e Layouts (App Router)
6. Data Fetching, Cache e ISR
7. Server Actions e Revalidação
8. API Routes e Webhooks
9. Imagens e Arquivos
10. Estilo, UI e Componentes
11. Formulários e Validação
12. Estado, Contexto e Client Components
13. Observabilidade, Logs e Erros
14. Testes (Unit, Integração, E2E)
15. Segurança e Boas Práticas
16. Deploy na Vercel
17. Migração a partir do Vite (Checklist)
18. Snippets e Esqueletos Úteis

---

## 1) Decisões de Arquitetura

- App Router (`/src/app`) com **Server Components (RSC) por padrão**.
- Torne um componente Client apenas quando precisar de:
  - Estado local interativo
  - Event handlers (onClick/onChange/submit)
  - Refs DOM
  - Bibliotecas somente-browser (mapas, carrosséis, charts)
  - Contextos de UI que dependem de eventos do usuário
- Dados: fetch no server preferencialmente, usando cache/ISR.
- Imagens: `next/image` sempre.
- Webhooks/endpoints pequenos: `app/api/*/route.ts`.
- Deploy: Vercel com Previews por PR.

## 2) Estrutura de Pastas

```
/src
  /app
    /(public)         # rotas públicas
      /page.tsx
      /produto/[slug]/page.tsx
      /produtor/[slug]/page.tsx
      /busca/page.tsx
      /checkout/page.tsx
    /(admin)          # SPA admin (client-heavy)
      /layout.tsx
      /page.tsx
    /api
      /webhooks
        /payments/route.ts
    /layout.tsx
    /globals.d.ts
  /components         # UI reutilizável (server por padrão)
  /components-client  # componentes marcados com "use client"
  /lib                # clients HTTP, utils, mappers, schemas, cache-tags
  /styles             # globals.css, tokens CSS
/public               # assets estáticos
```

## 3) Convenções e Padrões

- Import alias: `@/*`.
- Nomeação expressiva alinhada ao domínio (produto, produtor, pedido).
- Nada de `use client` no topo por padrão; **adicione somente quando necessário**.
- Funções de dados server-side em `/lib` (ex.: `fetchProduct.ts`).
- Use `revalidateTag` para coerência de cache após mutações.
- Evite `cache: 'no-store'` exceto onde é realmente necessário (ex.: sessão/checkout em tempo real).

## 4) Configuração Essencial

### 4.1 next.config.ts

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: { bodySizeLimit: "2mb" }
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s3.amazonaws.com" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "cdn.seudominio.com" }
    ]
  }
};

export default nextConfig;
```

### 4.2 Variáveis de Ambiente

- Servidor: `.env.local`, `.env.development`, `.env.production`.
- Tudo que for exposto no browser deve ter prefixo `NEXT_PUBLIC_`.

Exemplo:
```
API_URL=https://api.mercado.local
NEXT_PUBLIC_ANALYTICS_ID=...
S3_BUCKET_URL=...
```

### 4.3 Scripts (`package.json`)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "jest -c jest.config.js"
  }
}
```

### 4.4 Tailwind

- Habilitar no `globals.css` e `tailwind.config.ts`.
- Tokens/utilitários centralizados em `src/styles/`.

## 5) Roteamento e Layouts

- `src/app/layout.tsx`: layout global, fonte, `<html lang>`, `<body>`, providers mínimos (evitar providers no global sem necessidade).
- `src/app/(public)/page.tsx`: landing home.
- Segmentos com `loading.tsx` e `error.tsx` quando necessário.
- Metadata via `export const metadata` e `generateMetadata`.

Exemplo de metadata por página:
```ts
export async function generateMetadata({ params }: { params: { slug: string }}) {
  const product = await getProduct(params.slug);
  return {
    title: `${product.name} | Mercadô`,
    description: product.seoDescription,
    openGraph: { images: [product.imageUrl] }
  };
}
```

## 6) Data Fetching, Cache e ISR

- Fetch no server component:
```ts
async function getProduct(slug: string) {
  const res = await fetch(`${process.env.API_URL}/products/${slug}`, {
    next: { revalidate: 300, tags: ["products", `product:${slug}`] }
  });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}
```

- Listas: `revalidate` curto (60–300s).
- Hots de estoque/preço: use tags específicas por item para invalidar seletivamente.
- Evite `no-store` exceto para dados sensíveis e não cacheáveis (ex.: carrinho).

## 7) Server Actions e Revalidação

- Use Server Actions para mutações simples e próximas à UI (ex.: adicionar ao carrinho, calcular frete).
- Sempre revalidar tags afetadas:
```ts
"use server";
import { revalidateTag } from "next/cache";

export async function updateStockAction(input: { sku: string; delta: number }) {
  const res = await fetch(`${process.env.API_URL}/stock`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!res.ok) throw new Error("update stock failed");

  revalidateTag("products");
  revalidateTag(`product:${input.sku}`);
}
```

## 8) API Routes e Webhooks

- Para webhooks, valide assinatura e trate idempotência.
- Preferir runtime `edge` somente quando necessário.

Exemplo:
```ts
// src/app/api/webhooks/payments/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // use 'edge' se precisar de latência/geo
export async function POST(req: NextRequest) {
  const payload = await req.text(); // mantenha texto bruto para HMAC
  // validateSignature(payload, req.headers.get("x-signature")!)
  // processa evento, enfileira, persiste
  return NextResponse.json({ ok: true });
}
```

## 9) Imagens e Arquivos

- Sempre `next/image`:
```tsx
import Image from "next/image";

<Image
  src={product.imageUrl}
  alt={product.name}
  width={600}
  height={600}
  priority
/>
```

- Adicione domínios remotos em `next.config.ts`.
- Uploads: preferir URL assinada (S3/R2) gerada por backend/route handler.

## 10) Estilo, UI e Componentes

- Server Component por padrão em `/components`.
- Componentes explicitamente client em `/components-client` com `"use client"`.
- Evitar dependências pesadas de UI no global; carregue com `dynamic` quando necessário:
```ts
import dynamic from "next/dynamic";
const HeavyCarousel = dynamic(() => import("@/components-client/Carousel"), { ssr: false });
```

## 11) Formulários e Validação

- `react-hook-form` + `zod` + `@hookform/resolvers/zod`.
- Validação no client e server (defesa em profundidade).
- Server Actions para submissões simples; para flows mais complexos, API dedicada.

Exemplo:
```ts
"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  quantity: z.number().min(1),
});

export function QuantityForm({ onSubmitServer }: { onSubmitServer: (data: any) => Promise<void> }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { quantity: 1 }
  });

  return (
    <form onSubmit={handleSubmit(onSubmitServer)}>
      <input type="number" {...register("quantity", { valueAsNumber: true })} />
      {errors.quantity && <span>Quantidade inválida</span>}
      <button type="submit">Adicionar</button>
    </form>
  );
}
```

## 12) Estado, Contexto e Client Components

- Contextos de UI somente quando necessário em client.
- Preferir compor componentes e passar props do server para client.
- Evitar global stores para tudo; use local state e contextos específicos.

## 13) Observabilidade, Logs e Erros

- Tratamento de erro por segmento com `error.tsx` + `reset`.
- Logs estruturados em Server Actions/Routes (console.info/error com contexto).
- Integração com Sentry (SDK Next) recomendada.
- Web Vitals via Vercel Analytics.

```tsx
// src/app/layout.tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## 14) Testes

- Unit: Jest + Testing Library para Client Components.
- Integração: teste de loaders/fetch com mocks de `fetch`.
- E2E: Cypress/Playwright com baseUrl do Next. Use rotas estáveis e seeds previsíveis.

## 15) Segurança e Boas Práticas

- Sanitizar inputs (server e client).
- Nunca expor secrets no client (somente `NEXT_PUBLIC_*`).
- Rate limiting em endpoints sensíveis (via middleware/edge function ou backend).
- CORS correto nos handlers e backend principal.
- Prevenir vazamento de detalhes internos em mensagens de erro.

## 16) Deploy na Vercel

- Conectar repositório → Importar projeto.
- Configurar envs para Development/Preview/Production.
- Habilitar Previews por PR e proteção de Production.
- Opcional `vercel.json` para headers/redirects:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [{ "key": "x-frame-options", "value": "SAMEORIGIN" }]
    }
  ]
}
```

## 17) Migração a partir do Vite (Checklist)

- [ ] Criar projeto Next (App Router, TS, Tailwind, alias `@/*`).
- [ ] Mapear rotas do Vite → `src/app/(public)/*/page.tsx`.
- [ ] Migrar layout base (`index.html` → `layout.tsx` + `metadata`).
- [ ] Migrar componentes reutilizáveis para `/components` (server) e marcar client quando necessário.
- [ ] Substituir `<img>` por `next/image`.
- [ ] Migrar chamadas de API para funções em `/lib/*` com `fetch` server e `revalidate`.
- [ ] Implementar páginas: landing, catálogo, produto, produtor, busca, checkout.
- [ ] Implementar webhooks mínimos em `app/api/webhooks/*`.
- [ ] Configurar domínios de imagens em `next.config.ts`.
- [ ] Configurar env vars nos ambientes Vercel.
- [ ] Ajustar formulários com `react-hook-form` + `zod`.
- [ ] Adicionar `loading.tsx`/`error.tsx` onde necessário.
- [ ] Ativar Analytics, Sentry (se aplicável).
- [ ] Remover dependências/plug-ins específicos de Vite no fim da migração.

## 18) Snippets e Esqueletos Úteis

### 18.1 `src/app/layout.tsx`

```tsx
export const metadata = {
  metadataBase: new URL("https://mercado.example.com"),
  title: { default: "Mercadô", template: "%s | Mercadô" },
  description: "Marketplace local com catálogo público"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
```

### 18.2 Home `src/app/(public)/page.tsx`

```tsx
import { getFeaturedProducts } from "@/lib/products";

export default async function HomePage() {
  const products = await getFeaturedProducts();
  return (
    <main>
      <h1>Mercadô</h1>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </main>
  );
}
```

### 18.3 Produto `src/app/(public)/produto/[slug]/page.tsx`

```tsx
import Image from "next/image";
import { getProduct } from "@/lib/products";

export default async function ProductPage({ params }: { params: { slug: string }}) {
  const product = await getProduct(params.slug);
  return (
    <article>
      <h1>{product.name}</h1>
      <Image src={product.imageUrl} alt={product.name} width={800} height={800} />
      <p>{product.description}</p>
    </article>
  );
}
```

### 18.4 Fetchers `src/lib/products.ts`

```ts
export async function getProduct(slug: string) {
  const res = await fetch(`${process.env.API_URL}/products/${slug}`, {
    next: { revalidate: 300, tags: ["products", `product:${slug}`] }
  });
  if (!res.ok) throw new Error("failed to fetch product");
  return res.json();
}

export async function getFeaturedProducts() {
  const res = await fetch(`${process.env.API_URL}/products/featured`, {
    next: { revalidate: 120, tags: ["products"] }
  });
  if (!res.ok) throw new Error("failed to fetch featured products");
  return res.json();
}
```

### 18.5 Server Action `src/app/(public)/checkout/actions.ts`

```ts
"use server";
import { revalidateTag } from "next/cache";

export async function addToCartAction(input: { sku: string; qty: number }) {
  const res = await fetch(`${process.env.API_URL}/cart/add`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!res.ok) throw new Error("add to cart failed");
  revalidateTag(`product:${input.sku}`);
}
```

### 18.6 Client Component mínimo `src/components-client/QuantityStepper.tsx`

```tsx
"use client";
import { useState } from "react";

export function QuantityStepper({ onChange }: { onChange: (qty: number) => void }) {
  const [qty, setQty] = useState(1);
  return (
    <div>
      <button onClick={() => { const v = Math.max(1, qty - 1); setQty(v); onChange(v); }}>-</button>
      <span>{qty}</span>
      <button onClick={() => { const v = qty + 1; setQty(v); onChange(v); }}>+</button>
    </div>
  );
}
```

### 18.7 Webhook `src/app/api/webhooks/payments/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  // TODO: validate HMAC, process
  return NextResponse.json({ ok: true });
}
```

---

## Anexos

- Padrão de Commits: Conventional Commits.
- Lint/Format: ESLint + Prettier; executar em CI.
- Acessibilidade: use semântica HTML e `aria-*` quando necessário.
- Performance: medir LCP/TTFB/CLS; preferir imagens otimizadas e evitar JS no client sem necessidade.
