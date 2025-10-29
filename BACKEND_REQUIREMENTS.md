# Backend API Requirements - Mercadô

Este documento lista todos os endpoints, contratos e requisitos necessários para a integração completa da aplicação Next.js com o backend.

## 📋 Sumário

1. Autenticação e Autorização
2. Produtos
3. Carrinho e Checkout
4. Pedidos
5. Pagamento
5. Admin/Produtor
7. Rastreamento
8. Mapas/Produtores
9. Webhooks

---

## 1. Autenticação e Autorização

### 1.1 POST /auth/register
**Descrição**: Registrar novo usuário
**Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "CONSUMER" | "PRODUCER" | "DELIVERER"
}
```
**Response**:
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "CONSUMER" | "PRODUCER" | "DELIVERER"
  }
}
```

### 1.2 POST /auth/login
**Descrição**: Login de usuário
**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
**Response**: Igual ao register

### 1.3 GET /auth/me
**Descrição**: Obter usuário autenticado
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "string"
}
```

### 1.4 POST /auth/logout
**Descrição**: Logout (invalidar token)
**Headers**: `Authorization: Bearer <token>`

---

## 2. Produtos

### 2.1 GET /products
**Descrição**: Listar produtos (com paginação/filtros)
**Query Params**: 
- `page`: number
- `limit`: number
- `category`: string (opcional)
- `search`: string (opcional)

**Response**:
```json
{
  "products": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": number,
      "imageUrl": "string",
      "stock": number,
      "producer": {
        "id": "string",
        "name": "string"
      }
    }
  ],
  "total": number,
  "page": number,
  "limit": number
}
```

### 2.2 GET /products/featured
**Descrição**: Obter produtos em destaque
**Response**: Array de produtos (mesmo formato do item acima)

### 2.3 GET /products/:id
**Descrição**: Detalhes de um produto
**Response**:
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": number,
  "imageUrl": "string",
  "stock": number,
  "category": "string",
  "producer": {
    "id": "string",
    "name": "string",
    "address": "string",
    "lat": number,
    "lng": number
  }
}
```

---

## 3. Carrinho e Checkout

### 3.1 GET /cart
**Descrição**: Obter carrinho do usuário
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "items": [
    {
      "productId": "string",
      "name": "string",
      "price": number,
      "quantity": number
    }
  ],
  "totalPrice": number
}
```

### 3.2 POST /cart/add
**Descrição**: Adicionar item ao carrinho
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "productId": "string",
  "quantity": number
}
```

### 3.3 PUT /cart/:productId
**Descrição**: Atualizar quantidade de item
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "quantity": number
}
```

### 3.4 DELETE /cart/:productId
**Descrição**: Remover item do carrinho
**Headers**: `Authorization: Bearer <token>`

### 3.5 POST /checkout
**Descrição**: Finalizar pedido
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "name": "string",
  "address": "string",
  "city": "string",
  "zip": "string",
  "paymentMethod": "PIX" | "CREDIT_CARD"
}
```
**Response**:
```json
{
  "orderId": "string",
  "paymentUrl": "string",
  "qrCode": "string" // Se PIX
}
```

---

## 4. Pedidos

### 4.1 GET /orders/me
**Descrição**: Obter pedidos do usuário autenticado
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "orders": [
    {
      "id": "string",
      "status": "PENDING" | "CONFIRMED" | "DELIVERING" | "DELIVERED" | "CANCELLED",
      "total": number,
      "createdAt": "string",
      "items": [...]
    }
  ]
}
```

### 4.2 GET /orders/:orderId
**Descrição**: Detalhes de um pedido
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "id": "string",
  "status": "string",
  "total": number,
  "items": [...],
  "shipping": {
    "address": "string",
    "city": "string",
    "zip": "string"
  },
  "tracking": {
    "steps": [
      {
        "status": "string",
        "timestamp": "string"
      }
    ]
  }
}
```

### 4.3 GET /rastrear/:orderId
**Descrição**: Rastrear pedido (público)
**Response**: Similar ao GET /orders/:orderId

---

## 5. Pagamento PIX

### 5.1 GET /payments/pix/:orderId
**Descrição**: Obter dados do pagamento PIX
**Response**:
```json
{
  "orderId": "string",
  "amount": number,
  "qrCode": "string",
  "paymentCode": "string",
  "expiresAt": "string"
}
```

### 5.2 GET /payments/status/:orderId
**Descrição**: Status do pagamento
**Response**:
```json
{
  "status": "PENDING" | "PAID" | "EXPIRED"
}
```

---

## 6. Admin/Produtor

### 6.1 GET /admin/products
**Descrição**: Listar produtos do produtor
**Headers**: `Authorization: Bearer <token>` (role: ADMIN ou PRODUCER)
**Response**: Array de produtos

### 6.2 POST /admin/products
**Descrição**: Criar produto
**Headers**: `Authorization: Bearer <token>` (role: ADMIN ou PRODUCER)
**Request Body**:
```json
{
  "name": "string",
  "description": "string",
  "price": number,
  "stock": number,
  "category": "string",
  "imageUrl": "string"
}
```

### 6.3 GET /admin/orders
**Descrição**: Listar pedidos (admin/produtor)
**Headers**: `Authorization: Bearer <token>` (role: ADMIN ou PRODUCER)

### 6.4 GET /admin/deliveries
**Descrição**: Listar entregas (admin/entregador)
**Headers**: `Authorization: Bearer <token>` (role: ADMIN ou DELIVERER)

### 6.5 GET /admin/dashboard
**Descrição**: Dashboard com estatísticas
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "totalSales": number,
  "totalOrders": number,
  "totalProducts": number,
  "recentOrders": [...]
}
```

---

## 7. Mapa de Produtores

### 7.1 GET /producers/map
**Descrição**: Obter produtores com coordenadas
**Response**:
```json
{
  "producers": [
    {
      "id": "string",
      "name": "string",
      "lat": number,
      "lng": number,
      "address": "string"
    }
  ]
}
```

---

## 8. Webhooks

### 8.1 POST /webhooks/payments
**Descrição**: Webhook de notificação de pagamento
**Headers**: 
- `x-signature`: string (HMAC signature)
- `Content-Type`: application/json

**Request Body**:
```json
{
  "orderId": "string",
  "status": "PAID" | "FAILED",
  "paymentId": "string",
  "timestamp": "string"
}
```

**Observações**:
- Implementar validação HMAC
- Idempotência via `paymentId`
- Retornar `200 OK` mesmo em caso de erro interno

---

## 🔐 Autenticação

Todos os endpoints protegidos requerem:
```
Authorization: Bearer <token>
```

**Token JWT deve conter**:
- `userId`: string
- `role`: string
- `exp`: timestamp

---

## ⚠️ Validações Importantes

1. **Estoque**: Verificar disponibilidade antes de adicionar ao carrinho
2. **Preços**: Validar na confirmação do pedido
3. **Tokens**: Validar expiração e assinatura
4. **Roles**: Verificar permissões para endpoints admin
5. **Quantidade**: Garantir > 0 e <= stock disponível

---

## 📊 Schemas Zod (exemplo para validação)

```typescript
// Product Schema
const ProductSchema = z.object({
  name: z.string().min(3),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  description: z.string().optional(),
});

// Order Schema
const OrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive()
  })),
  shipping: z.object({
    address: z.string().min(5),
    city: z.string().min(2),
    zip: z.string().min(4)
  })
});
```

---

## 🚀 Variáveis de Ambiente Necessárias

```
API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

---

## 📝 Notas para Implementação

1. Implementar rate limiting em endpoints sensíveis
2. CORS configurado para domínios permitidos
3. Logging estruturado para debugging
4. Tratamento de erros padronizado
5. Versionamento da API (`/v1`)



