# Nix Imóveis - Frontend

Frontend completo para o sistema de gestão de imóveis Nix Imóveis, desenvolvido com Next.js 14, TypeScript, TailwindCSS e TanStack Query.

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **TanStack Query** (React Query)
- **React Hook Form** + **Zod**
- **Axios**
- **React Hot Toast**

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend da API rodando (Node/Express/MongoDB)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <repo-url>
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
frontend/
├── app/                    # Páginas (App Router)
│   ├── admin/             # Páginas administrativas
│   ├── imoveis/           # Listagem e detalhe de imóveis
│   ├── login/             # Autenticação
│   ├── register/          # Cadastro
│   ├── favoritos/         # Favoritos do usuário
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Home
│   └── globals.css        # Estilos globais
├── components/            # Componentes reutilizáveis
│   ├── Navbar.tsx
│   ├── PropertyCard.tsx
│   ├── FilterBar.tsx
│   ├── Pagination.tsx
│   ├── ImageUploader.tsx
│   ├── ProtectedRoute.tsx
│   └── LoadingSkeleton.tsx
├── hooks/                 # Hooks customizados
│   ├── useAuth.ts
│   ├── useProperties.ts
│   ├── useFavorites.ts
│   └── useLeads.ts
├── lib/                   # Utilitários e configurações
│   ├── api/              # Cliente API
│   ├── auth/             # Gerenciamento de autenticação
│   ├── utils.ts          # Funções utilitárias
│   └── validations.ts    # Schemas Zod
├── services/             # Serviços de API
│   ├── authService.ts
│   ├── propertiesService.ts
│   ├── leadsService.ts
│   └── favoritesService.ts
└── types/                # Tipos TypeScript
    └── index.ts
```

## 🎯 Funcionalidades

### Públicas
- ✅ Homepage com busca rápida
- ✅ Listagem de imóveis com filtros avançados
- ✅ Detalhe do imóvel com galeria
- ✅ Formulário de lead (interesse no imóvel)
- ✅ Login e registro de usuários

### Autenticadas
- ✅ Favoritar/desfavoritar imóveis
- ✅ Visualizar favoritos

### Administrativas
- ✅ Dashboard administrativo
- ✅ CRUD completo de imóveis
- ✅ Upload de múltiplas imagens (até 10)
- ✅ Visualização de leads recebidos

## 🔐 Autenticação

O sistema utiliza JWT armazenado em `localStorage`. O token é automaticamente injetado em todas as requisições via interceptor do Axios.

**Fluxo de autenticação:**
1. Usuário faz login/registro
2. Token é salvo no localStorage
3. Token é adicionado automaticamente no header `Authorization: Bearer <token>`
4. Ao abrir o app, verifica token via `/api/auth/me`
5. Se token inválido (401), limpa sessão e redireciona para login

## 📡 Integração com API

### Endpoints Utilizados

- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Verificar usuário atual
- `GET /api/properties` - Listar imóveis (com filtros e paginação)
- `GET /api/properties/:id` - Detalhe do imóvel
- `POST /api/properties` - Criar imóvel (multipart/form-data)
- `PATCH /api/properties/:id` - Atualizar imóvel
- `DELETE /api/properties/:id` - Excluir imóvel
- `POST /api/leads` - Criar lead
- `GET /api/leads` - Listar leads (admin)
- `POST /api/favorites/:propertyId` - Adicionar favorito
- `GET /api/favorites` - Listar favoritos
- `DELETE /api/favorites/:propertyId` - Remover favorito

### Exemplo de Requisição com Imagens

```typescript
const formData = new FormData()
formData.append('data', JSON.stringify(propertyData))
images.forEach((image) => {
  formData.append('images', image)
})

await apiClient.post('/api/properties', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})
```

## 🎨 Tema e Estilização

O projeto utiliza um tema dark com acentos dourados (Nix):
- **Cor primária**: `#D4AF37` (dourado)
- **Background**: `#1a1a1a` (dark)
- **Cards**: `#2d2d2d` (dark-light)

Classes utilitárias disponíveis:
- `btn-primary` - Botão primário
- `btn-secondary` - Botão secundário
- `input-field` - Campo de input
- `card` - Card container

## 🛠️ Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Linter
```

## 📝 Notas Importantes

1. **CORS**: Certifique-se de que o backend está configurado para aceitar requisições do frontend (CORS_ORIGIN)

2. **Imagens**: As imagens são servidas pelo backend. Configure o `next.config.js` para permitir o domínio das imagens.

3. **Rate Limiting**: O sistema trata erros 429 (rate limit) com mensagens amigáveis.

4. **Validação**: Todos os formulários são validados com Zod, espelhando as validações do backend.

5. **Acessibilidade**: Componentes incluem labels e atributos ARIA básicos.

## 🐛 Troubleshooting

**Erro de CORS:**
- Verifique se `NEXT_PUBLIC_API_URL` está correto
- Confirme que o backend permite requisições do frontend

**Token não persiste:**
- Verifique se localStorage está habilitado no navegador
- Confirme que o token está sendo retornado corretamente pela API

**Imagens não carregam:**
- Verifique se o backend está servindo as imagens corretamente
- Confirme a configuração do `next.config.js` para imagens remotas

## 📄 Licença

Este projeto é privado e de propriedade da Nix Imóveis.
