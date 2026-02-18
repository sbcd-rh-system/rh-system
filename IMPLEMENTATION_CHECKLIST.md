# ✅ Checklist de Implementação - Sincronização com GitHub

Use este checklist para validar se a implementação está funcionando corretamente.

## 📋 Verificação de Arquivos

- [ ] `/src/app/api/projetos/route.ts` - Criado
- [ ] `/src/app/api/projetos/[id]/route.ts` - Criado
- [ ] `/src/app/api/projetos/[id]/sync-github/route.ts` - Criado ⭐
- [ ] `/src/components/status-badge.tsx` - Criado
- [ ] `/src/components/project-card.tsx` - Atualizado
- [ ] `.env.local` - Atualizado com GITHUB_TOKEN
- [ ] `CLAUDE.md` - Atualizado com documentação
- [ ] `GITHUB_SETUP.md` - Criado (guia de configuração)

## 🔧 Configuração Inicial

- [ ] Node.js/npm instalado
- [ ] Dependências instaladas: `npm install`
- [ ] `.env.local` existe com variáveis Supabase
- [ ] Servidor está rodando: `npm run dev`
- [ ] Dashboard acessível: `http://localhost:3000`

## 🧪 Teste Básico (Sem Token)

1. [ ] Acesse o dashboard (`http://localhost:3000`)
2. [ ] Crie um projeto de teste:
   - [ ] Nome: "Teste Sync"
   - [ ] Setor: "Tecnologia"
   - [ ] URL Base: `https://github.com/facebook/react` (repositório público)
3. [ ] No card do projeto, clique no menu (⋮)
4. [ ] Clique em "Sincronizar com GitHub"
5. [ ] Aguarde a sincronização
6. [ ] Verifique se:
   - [ ] Apareça "Sincronizando..." com spinner
   - [ ] Após sucesso, apareca alert "Sincronizado com sucesso!"
   - [ ] Página recarregue
   - [ ] A data "Atualizado há..." mude para o último commit

## 🔑 Teste com GitHub Token (Opcional)

1. [ ] Gere um token em https://github.com/settings/tokens
   - [ ] Note: "RH System Sync"
   - [ ] Scope: `public_repo`
2. [ ] Adicione ao `.env.local`: `GITHUB_TOKEN=seu_token`
3. [ ] Reinicie o servidor: `npm run dev`
4. [ ] Teste novamente:
   - [ ] Sincronize um projeto privado (se houver)
   - [ ] Verifique que funciona mais rápido (rate limit maior)

## 🔗 Teste com Diferentes URLs GitHub

- [ ] HTTPS: `https://github.com/usuario/repo`
- [ ] HTTPS com .git: `https://github.com/usuario/repo.git`
- [ ] SSH: `git@github.com:usuario/repo` (se o repositório estiver acessível)

## ⚠️ Teste de Erros

1. [ ] URL inválida:
   - [ ] Adicione URL Base: `https://invalid-url.com`
   - [ ] Clique "Sincronizar"
   - [ ] Deve aparecer: "URL base não é um repositório GitHub válido"

2. [ ] Sem URL Base:
   - [ ] Crie projeto sem URL Base
   - [ ] Clique "Sincronizar"
   - [ ] Deve aparecer: "Este projeto não tem uma URL base configurada"

3. [ ] Repositório inexistente:
   - [ ] URL Base: `https://github.com/xyz/nonexistent-repo-12345`
   - [ ] Clique "Sincronizar"
   - [ ] Deve aparecer erro de 404/não encontrado

## 📊 Validação no Banco de Dados

1. [ ] Abra Supabase Dashboard
2. [ ] Vá para tabela `projetos`
3. [ ] Procure pelo projeto que sincronizou
4. [ ] Verifique:
   - [ ] Campo `data_atualizacao` foi atualizado
   - [ ] Timestamp corresponde ao último commit do repositório

## 🌐 Teste da API Direto

Execute em um terminal (substituir `PROJECT_ID`):

```bash
# Teste com curl
curl -X POST http://localhost:3000/api/projetos/PROJECT_ID/sync-github

# Ou use o script de teste
./test-sync-github.sh PROJECT_ID
```

Deve retornar:
```json
{
  "success": true,
  "message": "Sincronizado com sucesso",
  "data_atualizacao": "2024-12-18T10:30:45Z",
  "projeto": { ... }
}
```

## 📈 Performance e Rate Limiting

- [ ] Primeira sincronização leva < 2 segundos
- [ ] Sincronizações subsequentes são mais rápidas (cache do navegador)
- [ ] Sem token: máximo 60 requisições/hora
- [ ] Com token: máximo 5.000 requisições/hora

## 🚀 Deploy em Produção

Antes de fazer deploy:

- [ ] `GITHUB_TOKEN` está configurado em variáveis de ambiente (não em .env)
- [ ] `.env.local` está no `.gitignore`
- [ ] Repositórios GitHub são públicos ou token tem permissão
- [ ] Documentação atualizada para equipe
- [ ] Testes de sincronização executados com sucesso

## 📝 Documentação para Usuários Finais

Criar/atualizar:
- [ ] Manual de usuário mencionando "Sincronizar com GitHub"
- [ ] FAQ: "Por que a data mudou?"
- [ ] Instrução: "Como configurar URL do repositório"

## 🎉 Conclusão

Quando todos os checkboxes estiverem marcados ✅:

- Sincronização com GitHub está **100% funcional**
- Pode ser usado em **produção**
- Equipe está **capacitada** para usar e manter

---

**Última verificação**: ___/___/________

**Responsável**: _______________________

**Status**: [ ] Aprovado | [ ] Precisa ajustes
