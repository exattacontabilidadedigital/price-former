# Guia de Gerenciamento do Banco de Dados

## ⚠️ IMPORTANTE - Evitar Perda de Dados

### ❌ NUNCA USE:
```bash
npx prisma db push --force-reset  # APAGA TODOS OS DADOS!
npx prisma migrate reset          # APAGA TODOS OS DADOS!
```

### ✅ Use Comandos Seguros:

#### Para aplicar mudanças no schema SEM perder dados:
```bash
npm run db:push
# ou
npx prisma db push
```

#### Para regenerar o Prisma Client:
```bash
npm run db:generate
# ou
npx prisma generate
```

#### Para visualizar/editar dados:
```bash
npm run db:studio
# ou
npx prisma studio
```

#### Para criar dados de teste (apenas em desenvolvimento):
```bash
npm run db:seed
# ou
node scripts/create-test-data.js
```

## 📋 Workflow Recomendado

### 1. Modificar Schema
Edite o arquivo `prisma/schema.prisma`

### 2. Aplicar Mudanças
```bash
npm run db:push      # Aplica mudanças SEM perder dados
npm run db:generate  # Regenera o cliente Prisma
```

### 3. Verificar Dados
```bash
npm run db:studio    # Abre interface visual
# ou
node scripts/check-data.js  # Verifica via script
```

## 🔄 Migrações (Produção)

Para produção, use migrações ao invés de `db push`:

```bash
# Criar migração
npx prisma migrate dev --name nome_da_migracao

# Aplicar migração em produção
npx prisma migrate deploy
```

## 🛡️ Backup Manual

Antes de operações arriscadas, faça backup:

```bash
# SQLite - copiar arquivo
copy dev.db dev.db.backup

# Restaurar backup
copy dev.db.backup dev.db
```

## 📝 Scripts Úteis

- `check-data.js` - Verifica dados no banco
- `create-test-data.js` - Cria dados de teste
- `get-user-id.js` - Busca ID de usuário
- `update-calculation-userid.js` - Atualiza userId dos cálculos

## 🔍 Verificar Status do Banco

```bash
# Ver estrutura do banco
npx prisma studio

# Verificar dados via script
node scripts/check-data.js
```
