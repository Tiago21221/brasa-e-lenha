# 🚀 Guia: Como Rodar o Projeto e Ver o Banco Remoto

## 📋 Pré-requisitos

- Node.js instalado (versão 18 ou superior)
- NPM ou Yarn instalado
- Acesso ao banco de dados remoto (URL de conexão)

## 🔧 Passo a Passo

### 1️⃣ Instalar Dependências

Se ainda não instalou, execute:

```bash
npm install
```

### 2️⃣ Configurar Variável de Ambiente

Crie um arquivo `.env` na raiz do projeto (mesmo nível do `package.json`).

Se você tem uma URL de banco remoto (ex: Neon, Supabase, etc.), adicione:

```env
DATABASE_URL="postgresql://usuario:senha@host:porta/banco?sslmode=require"
```

**Exemplo para Neon:**
```env
DATABASE_URL="postgresql://usuario:senha@ep-xxx-xxx.region.aws.neon.tech/brasaelenha?sslmode=require"
```

**Exemplo para Supabase:**
```env
DATABASE_URL="postgresql://postgres:senha@db.xxx.supabase.co:5432/postgres"
```

### 3️⃣ Gerar Prisma Client

Depois de configurar o `.env`, gere o cliente do Prisma:

```bash
npm run prisma:generate
```

### 4️⃣ Sincronizar Schema com o Banco (Opcional)

Se o banco remoto ainda não tiver todas as tabelas, execute:

```bash
npm run prisma:push
```

**⚠️ Cuidado:** Isso vai sincronizar o schema do Prisma com o banco. Se o banco já estiver em produção, pode ser melhor usar migrações.

### 5️⃣ Visualizar o Banco de Dados - Prisma Studio

Para abrir uma interface gráfica e ver/editar os dados do banco:

```bash
npm run prisma:studio
```

Isso abrirá o Prisma Studio no navegador em `http://localhost:5555`

### 6️⃣ Rodar o Projeto em Desenvolvimento

Para iniciar o servidor Next.js:

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 🗄️ Comandos Úteis para o Banco

### Ver o Banco (Prisma Studio)
```bash
npm run prisma:studio
```

### Popular o banco com dados iniciais (seed)
```bash
npm run prisma:seed
```

### Criar uma nova migração
```bash
npm run prisma:migrate
```

### Sincronizar schema sem criar migração (dev apenas)
```bash
npm run prisma:push
```

## 📱 Acessar o Projeto

- **Homepage:** http://localhost:3000
- **Cardápio:** http://localhost:3000/cardapio
- **Admin:** http://localhost:3000/admin
- **Prisma Studio:** http://localhost:5555 (quando rodando)

## 🐛 Troubleshooting

### Erro de conexão com banco
- Verifique se a `DATABASE_URL` está correta no arquivo `.env`
- Verifique se o banco remoto está acessível (firewall, IP permitido, etc.)
- Para bancos na nuvem, certifique-se de que o modo SSL está configurado corretamente

### Erro "Prisma Client not generated"
Execute:
```bash
npm run prisma:generate
```

### Erro ao rodar prisma:studio
- Certifique-se de que a porta 5555 não está em uso
- Verifique se a `DATABASE_URL` está configurada corretamente

### Dados não aparecem
- Execute o seed para popular dados iniciais:
```bash
npm run prisma:seed
```

