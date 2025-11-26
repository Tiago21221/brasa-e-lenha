# Brasa e Lenha - Sistema de Pedidos

Sistema completo de gerenciamento de pedidos para restaurante desenvolvido com Next.js 15 e Prisma ORM.

## 🚀 Tecnologias

- **Next.js 15** - Framework React com App Router
- **Prisma ORM** - ORM moderno para PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização
- **shadcn/ui** - Componentes UI

## 📦 Instalação

1. Clone o repositório e instale as dependências:

\`\`\`bash
npm install
\`\`\`

2. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto:

\`\`\`env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/brasaelenha"
\`\`\`

3. Execute as migrações do Prisma:

\`\`\`bash
npm run prisma:push
\`\`\`

4. Popule o banco de dados com dados iniciais:

\`\`\`bash
npm run prisma:seed
\`\`\`

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia servidor de produção
- `npm run prisma:generate` - Gera o Prisma Client
- `npm run prisma:migrate` - Executa migrações do banco
- `npm run prisma:push` - Sincroniza schema com banco (dev)
- `npm run prisma:studio` - Abre Prisma Studio (GUI do banco)
- `npm run prisma:seed` - Popula banco com dados iniciais

## 📁 Estrutura do Projeto

\`\`\`
├── app/
│   ├── api/orders/          # API Routes para pedidos
│   ├── admin/               # Painel administrativo
│   ├── cardapio/            # Página do cardápio
│   ├── carrinho/            # Página do carrinho
│   ├── pedido/[id]/         # Página de acompanhamento
│   └── page.tsx             # Homepage
├── components/              # Componentes React
├── lib/
│   ├── prisma.ts           # Cliente Prisma (singleton)
│   └── types.ts            # Tipos TypeScript
├── prisma/
│   ├── schema.prisma       # Schema do banco de dados
│   └── seed.ts             # Script de seed
└── public/                  # Imagens dos produtos
\`\`\`

## 🗄️ Schema do Banco de Dados

### Tabelas Principais

- **categories** - Categorias do cardápio
- **products** - Produtos/pratos disponíveis
- **orders** - Pedidos dos clientes
- **order_items** - Itens de cada pedido
- **customers** - Dados dos clientes

## 🎯 Funcionalidades

### Cliente
- ✅ Visualizar cardápio completo
- ✅ Adicionar produtos ao carrinho
- ✅ Finalizar pedido (sem autenticação)
- ✅ Acompanhar status do pedido em tempo real
- ✅ Escolher forma de pagamento (PIX/Cartão/Dinheiro)

### Admin
- ✅ Visualizar todos os pedidos
- ✅ Filtrar pedidos por status
- ✅ Atualizar status dos pedidos
- ✅ Dashboard com estatísticas
- ✅ Atualização automática a cada 15s

## 🔄 Status dos Pedidos

1. **pending** - Aguardando Confirmação
2. **confirmed** - Pedido Confirmado
3. **preparing** - Preparando
4. **delivering** - Saiu para Entrega
5. **completed** - Entregue
6. **cancelled** - Cancelado

## 🖼️ Imagens

As imagens dos produtos estão na pasta `/public` e os caminhos são armazenados no banco de dados. O sistema mantém a referência das imagens sem necessidade de uploads.

## 📝 Observações

- Não há sistema de autenticação implementado
- O projeto é focado em demonstração de funcionalidades
- As imagens já estão incluídas no projeto
- O sistema usa Prisma ORM para todas as operações de banco de dados

## 🚀 Deploy

Para deploy em produção, certifique-se de:

1. Configurar `DATABASE_URL` com banco PostgreSQL de produção
2. Executar `npm run prisma:push` no servidor
3. Executar `npm run prisma:seed` para popular dados iniciais
4. Executar `npm run build` para criar build otimizado

## 📄 Licença

Este projeto é de demonstração e pode ser utilizado livremente.
