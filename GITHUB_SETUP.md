# Configuração de Sincronização com GitHub

Este documento descreve como configurar a sincronização automática de projetos com repositórios GitHub.

## 📋 Pré-requisitos

- Projeto deve ter um campo `url_base` apontando para um repositório GitHub
- Formatos válidos:
  - `https://github.com/usuario/repositorio`
  - `https://github.com/usuario/repositorio.git`
  - `git@github.com:usuario/repositorio`

## 🔧 Configuração Básica (Sem Token)

A sincronização funciona sem nenhuma configuração adicional usando o rate limit público do GitHub:
- **Limite**: 60 requisições/hora por endereço IP
- **Sem autenticação** necessária

### Uso:
1. Crie um projeto com `url_base` apontando para um repositório GitHub
2. Clique no menu (três pontos) do card do projeto
3. Selecione "Sincronizar com GitHub"
4. A data de atualização será sincronizada com o último commit

## 🔐 Configuração com GitHub Token (Recomendado)

Para aumentar o rate limit e ter acesso a repositórios privados, configure um Personal Access Token:

### Passo 1: Gerar o Token no GitHub

1. Acesse https://github.com/settings/tokens (você deve estar logado)
2. Clique em "Generate new token" → "Generate new token (classic)"
3. Preencha os dados:
   - **Note**: `RH System GitHub Sync`
   - **Expiration**: Escolha conforme sua política (recomendado: 90 dias)
   - **Scopes**: Selecione apenas `public_repo` (não precisa de acesso a dados privados)
4. Clique "Generate token"
5. **Copie o token** (você só verá uma vez!)

### Passo 2: Configurar no Projeto

1. Abra o arquivo `.env.local` na raiz do projeto
2. Adicione a linha:
   ```
   GITHUB_TOKEN=seu_token_aqui
   ```
   Exemplo:
   ```
   GITHUB_TOKEN=ghp_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
   ```
3. Salve o arquivo

### Passo 3: Reiniciar o Servidor

```bash
# Pare o servidor (Ctrl+C se estiver rodando)
# Depois reinicie:
npm run dev
```

### Resultado:
- **Novo limite**: 5.000 requisições/hora
- **Melhor performance**: Requisições mais rápidas
- **Menos erros**: Menos chance de atingir rate limit

## 📊 Limites do GitHub API

| Recurso | Limite Público | Com Token |
|---------|---|---|
| Requisições por hora | 60 | 5.000 |
| Timeout | 10s | 10s |
| Autenticação | IP-based | Token-based |

## ⚠️ Segurança

- **Nunca** compartilhe seu token em repositórios públicos
- O token em `.env.local` não é versionado (está em `.gitignore`)
- Se vazar o token, regenere-o em https://github.com/settings/tokens
- Use tokens com escopo mínimo necessário (`public_repo`)

## 🐛 Troubleshooting

### "Erro: URL base não é um repositório GitHub válido"
- Verifique se a URL está correta
- Formatos válidos: `https://github.com/user/repo` ou `git@github.com:user/repo`

### "Erro ao buscar commits do repositório"
- Repositório pode ser privado (sem token ou token sem permissão)
- Repositório pode ter sido deletado
- GitHub API pode estar indisponível

### "Rate limit excedido"
- Você atingiu 60 requisições/hora (limite público)
- Configure um GITHUB_TOKEN para aumentar para 5.000/hora
- Aguarde 1 hora para o limite resetar

### Token não está funcionando
1. Verifique se está em `.env.local` (não em `.env`)
2. Reinicie o servidor (`npm run dev`)
3. Verifique no console do navegador se há erros
4. Confira se o token tem escopo `public_repo`

## 📝 Exemplo de Uso

```
Projeto: "API RH"
URL Base: https://github.com/empresa/api-rh

1. Clique no menu (⋮) do card
2. Selecione "Sincronizar com GitHub"
3. Aguarde a sincronização
4. data_atualizacao será atualizada com o timestamp do último commit
5. Exemplo: "Atualizado há 2 dias" (baseado no último commit)
```

## 🔄 Sincronização Manual vs Automática

Atualmente a sincronização é **manual** (clique no botão "Sincronizar com GitHub").

Para fazer sincronização automática, considere adicionar:
- **Webhook do GitHub**: Chamada automática ao commit
- **Cron Job**: Sincronização periódica
- **Vercel Cron**: Se deployado no Vercel

(Documentação de automação em desenvolvimento)
