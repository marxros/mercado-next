# Mercadô - Next.js App

Marketplace local com catálogo público e painel administrativo.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Installation

```bash
npm install
```

### Environment Variables

Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Configure as variáveis:

- `API_URL` - URL da API do backend
- `NEXT_PUBLIC_API_URL` - URL da API para uso no client
- Outras variáveis conforme necessário

### Development

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## 📁 Project Structure

```
/src
  /app                  # Next.js App Router
    /admin              # Admin routes (protected)
    /api                # API routes
  /components            # Server Components
  /components-client     # Client Components
  /lib                   # Utilities, fetchers
  /shared                # Shared providers, contexts
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **React**: 19
- **TypeScript**: Strict mode
- **Styling**: Tailwind CSS v4
- **State**: React Query, Context API
- **Forms**: react-hook-form + zod
- **Icons**: lucide-react
- **Maps**: Leaflet (client-only)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Key Features

- Server Components por padrão
- Data fetching com cache/revalidação
- Formulários com validação (zod)
- Autenticação e autorização
- Mapa de produtores
- Carrinho persistente (localStorage)
- Webhooks para pagamentos

## 📚 Documentation

Ver `NEXT_GUIDE.md` para guia completo de desenvolvimento.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and lint
4. Submit a pull request

## 📄 License

[Your License Here]
