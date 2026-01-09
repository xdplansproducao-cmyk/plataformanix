# Nix Imóveis - Backend API

API REST completa para sistema imobiliário desenvolvida com Node.js, Express e MongoDB.

## 📋 Descrição

Sistema backend para gestão de imóveis, usuários, leads, favoritos e autenticação. Desenvolvido seguindo boas práticas de arquitetura em camadas, com validações robustas, segurança e documentação completa.

## 🚀 Tecnologias

- **Node.js 18+**
- **Express.js** - Framework web
- **MongoDB + Mongoose** - Banco de dados
- **JWT** - Autenticação
- **Zod** - Validação de dados
- **Multer** - Upload de imagens
- **Helmet** - Segurança HTTP
- **CORS** - Controle de origem
- **Rate Limiting** - Proteção contra abuso

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <repo-url>
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://localhost:27017/nix_imoveis
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=120
UPLOAD_DIR=uploads
```

4. Certifique-se de que o MongoDB está rodando

5. Execute o seed (opcional) para criar dados de exemplo:
```bash
npm run seed
```

6. Inicie o servidor:
```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

## 📜 Scripts NPM

- `npm run dev` - Inicia servidor em modo desenvolvimento com nodemon
- `npm start` - Inicia servidor em produção
- `npm run lint` - Executa ESLint
- `npm run format` - Formata código com Prettier
- `npm run seed` - Popula banco com dados de exemplo

## 🔌 Endpoints Principais

### Autenticação

#### Registrar usuário
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@nix.com",
    "password": "Admin@123"
  }'
```

#### Obter usuário atual
```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

### Imóveis

#### Listar imóveis (com filtros)
```bash
curl "http://localhost:4000/api/properties?city=São Paulo&type=apartment&minPrice=300000&maxPrice=500000&page=1&limit=12"
```

#### Obter imóvel por ID
```bash
curl http://localhost:4000/api/properties/<propertyId>
```

#### Criar imóvel (admin/agent)
```bash
curl -X POST http://localhost:4000/api/properties \
  -H "Authorization: Bearer <token>" \
  -F "data={\"title\":\"Novo Apartamento\",\"description\":\"Descrição...\",\"type\":\"apartment\",\"status\":\"sale\",\"price\":300000,\"bedrooms\":2,\"bathrooms\":1,\"parkingSpots\":1,\"area\":70,\"address\":{\"city\":\"São Paulo\",\"neighborhood\":\"Centro\",\"street\":\"Rua Teste\",\"number\":\"123\",\"state\":\"SP\"}}" \
  -F "images=@/caminho/para/imagem1.jpg" \
  -F "images=@/caminho/para/imagem2.jpg"
```

#### Atualizar imóvel
```bash
curl -X PATCH http://localhost:4000/api/properties/<propertyId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"price": 320000}'
```

#### Deletar imóvel
```bash
curl -X DELETE http://localhost:4000/api/properties/<propertyId> \
  -H "Authorization: Bearer <token>"
```

### Leads

#### Criar lead (público)
```bash
curl -X POST http://localhost:4000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@example.com",
    "phone": "11999999999",
    "message": "Tenho interesse neste imóvel",
    "propertyId": "<propertyId>"
  }'
```

#### Listar leads (admin/agent)
```bash
curl -X GET http://localhost:4000/api/leads \
  -H "Authorization: Bearer <token>"
```

### Favoritos

#### Adicionar favorito
```bash
curl -X POST http://localhost:4000/api/favorites/<propertyId> \
  -H "Authorization: Bearer <token>"
```

#### Listar favoritos do usuário
```bash
curl -X GET http://localhost:4000/api/favorites \
  -H "Authorization: Bearer <token>"
```

#### Remover favorito
```bash
curl -X DELETE http://localhost:4000/api/favorites/<propertyId> \
  -H "Authorization: Bearer <token>"
```

### Health Check

```bash
curl http://localhost:4000/health
```

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Após o login, inclua o token no header:

```
Authorization: Bearer <seu-token>
```

## 🎯 Filtros de Imóveis

A rota `GET /api/properties` aceita os seguintes parâmetros de query:

- `q` - Busca textual (título, descrição, bairro)
- `city` - Cidade
- `neighborhood` - Bairro
- `type` - Tipo: `apartment`, `house`, `commercial`, `land`
- `status` - Status: `sale`, `rent`
- `minPrice` - Preço mínimo
- `maxPrice` - Preço máximo
- `bedrooms` - Número mínimo de quartos
- `bathrooms` - Número mínimo de banheiros
- `parkingSpots` - Número mínimo de vagas
- `featured` - Boolean (true/false)
- `sort` - Campo para ordenar: `price`, `createdAt`
- `order` - Ordem: `asc`, `desc`
- `page` - Página (padrão: 1)
- `limit` - Itens por página (padrão: 12, máximo: 100)

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/          # Configurações (DB, env)
│   ├── models/          # Modelos Mongoose
│   ├── controllers/     # Controladores
│   ├── services/        # Lógica de negócio
│   ├── routes/          # Rotas
│   ├── middlewares/     # Middlewares (auth, error, etc)
│   ├── validations/     # Schemas Zod
│   ├── utils/           # Utilitários
│   ├── app.js           # Configuração Express
│   └── server.js        # Entrada do servidor
├── uploads/             # Imagens enviadas
├── .env.example         # Exemplo de variáveis
├── package.json
└── README.md
```

## 🔒 Segurança

- Helmet para headers de segurança
- CORS configurável
- Rate limiting em endpoints sensíveis
- Sanitização contra NoSQL injection
- Validação de dados com Zod
- Senhas hasheadas com bcrypt
- JWT para autenticação

## 📤 Upload de Imagens

As imagens são salvas localmente na pasta `uploads/` por padrão. O sistema está preparado para migração futura para S3/Cloudinary através de um adapter simples.

Para criar/editar imóvel com imagens, use `multipart/form-data`:
- Campo `data`: JSON string com dados do imóvel
- Campo `images`: Arquivos de imagem (máximo 10)

## 🚢 Deploy

### Render / Azure / Heroku

1. Configure as variáveis de ambiente no painel do serviço
2. Certifique-se de que `NODE_ENV=production`
3. Configure `MONGODB_URI` com sua string de conexão
4. Configure `CORS_ORIGIN` com a URL do frontend
5. Para uploads em produção, considere usar S3/Cloudinary

## 📝 Versionamento

Este projeto segue versionamento semântico:
- **MAJOR**: Mudanças incompatíveis na API
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs compatíveis

## 🐛 Tratamento de Erros

A API retorna erros padronizados:

```json
{
  "success": false,
  "message": "Mensagem de erro",
  "errors": ["Detalhes adicionais"]
}
```

## 📄 Licença

ISC

---

## 👨‍💻 Créditos

**Criado pela XD Plans**

Desenvolvimento e Arquitetura: **David Xavier (XD Plans)**

---

Para mais informações, consulte o arquivo `CREDITS.md`.
