# RH System - Central de Controle RH

Painel de controle centralizado para gerenciar projetos de RH com sincronização automática com GitHub.

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev

# Abrir no navegador
open http://localhost:3000
```

## ✨ Principais Funcionalidades

- 📊 Dashboard com estatísticas de projetos
- 🔍 Busca e filtros por setor, status
- 🔗 **Sincronização com GitHub** (NOVO!)
  - Atualiza data de atualização com o último commit
  - Botão "Sincronizar com GitHub" em cada projeto
- 🎨 Tema claro/escuro
- 📱 Design responsivo (mobile-friendly)
- 🗂️ Visualização em grid ou lista

## 🔗 Sincronização com GitHub (NOVO)

### Como Usar

1. **Crie/edite um projeto e adicione a URL do repositório GitHub**
   ```
   URL Base: https://github.com/usuario/repositorio
   ```

2. **Clique no menu (⋮) do card do projeto**

3. **Selecione "Sincronizar com GitHub"**

4. **Veja a data "Atualizado há..." atualizar com o último commit**

### Configuração Opcional com Token

Para aumentar o rate limit (de 60 para 5.000 requisições/hora):

1. Gere um token em https://github.com/settings/tokens
2. Adicione ao `.env.local`:
   ```
   GITHUB_TOKEN=seu_token_aqui
   ```
3. Reinicie o servidor

📚 **Documentação completa**: Ver `GITHUB_SETUP.md`

## 🛠️ Tecnologias

- **Next.js 15.5** - Framework React
- **TypeScript** - Type safety
- **React 19** - UI framework
- **Tailwind CSS 4** - Styling
- **Supabase** - Backend (PostgreSQL)
- **Radix UI** - UI primitives
- **date-fns** - Date manipulation

## 📂 Estrutura de Pastas

```
src/
├── app/
│   ├── page.tsx              # Dashboard principal
│   ├── projetos/page.tsx     # Lista de projetos
│   ├── api/
│   │   └── projetos/         # API endpoints
│   │       ├── route.ts
│   │       └── [id]/
│   │           ├── route.ts
│   │           └── sync-github/route.ts  # ⭐ Sincronização
│   └── configuracoes/        # Settings page
├── components/
│   ├── project-card.tsx      # Card de projeto
│   ├── status-badge.tsx      # Badge de status
│   └── layout/
└── lib/
    ├── supabase.ts           # Cliente Supabase
    └── utils.ts              # Utilitários

```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
GITHUB_TOKEN=seu_token_github  # Opcional
```

## 📚 Documentação Adicional

- **CLAUDE.md** - Guia técnico para desenvolvedores
- **GITHUB_SETUP.md** - Configuração de sincronização com GitHub
- **SYNC_GITHUB_SUMMARY.md** - Resumo técnico da implementação

## 🧪 Testes

```bash
# Testar sincronização com GitHub (via curl)
curl -X POST http://localhost:3000/api/projetos/PROJECT_ID/sync-github
```

## 🚀 Deploy

O projeto está preparado para deploy em **Vercel**:

```bash
# Deploy automático ao fazer push
git push origin main
```

Variáveis de ambiente serão sincronizadas do Supabase.

## 📊 Status do Projeto

- ✅ Dashboard funcional
- ✅ Gerenciamento de projetos
- ✅ Sincronização com GitHub
- ✅ Temas claro/escuro
- ⏳ Autenticação (em desenvolvimento)

## 🤝 Contribuições

Para dúvidas ou sugestões, consulte:
1. Documentação em `CLAUDE.md`
2. FAQs em `GITHUB_SETUP.md`
3. Issues no repositório

## 📄 Licença

Projeto interno da RH System.
