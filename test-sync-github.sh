#!/bin/bash

# Script para testar a sincronização com GitHub
# Uso: ./test-sync-github.sh <project_id> [base_url]

PROJECT_ID=${1:-}
BASE_URL=${2:-"http://localhost:3000"}

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Erro: Project ID é obrigatório"
    echo ""
    echo "Uso: ./test-sync-github.sh <project_id> [base_url]"
    echo ""
    echo "Exemplos:"
    echo "  ./test-sync-github.sh 123e4567-e89b-12d3-a456-426614174000"
    echo "  ./test-sync-github.sh 123e4567-e89b-12d3-a456-426614174000 http://localhost:3000"
    exit 1
fi

echo "🔄 Testando sincronização com GitHub..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "URL: $BASE_URL"
echo "Project ID: $PROJECT_ID"
echo ""

# Fazer requisição de sincronização
response=$(curl -s -X POST \
    "$BASE_URL/api/projetos/$PROJECT_ID/sync-github" \
    -H "Content-Type: application/json")

echo "📋 Response:"
echo "$response" | jq '.' 2>/dev/null || echo "$response"

# Verificar se foi sucesso
if echo "$response" | grep -q '"success":true'; then
    echo ""
    echo "✅ Sincronização bem-sucedida!"
    echo ""
    
    # Extrair a nova data
    new_date=$(echo "$response" | jq -r '.data_atualizacao' 2>/dev/null)
    if [ ! -z "$new_date" ]; then
        echo "📅 Nova data_atualizacao: $new_date"
    fi
else
    echo ""
    echo "❌ Erro na sincronização"
    
    # Tentar extrair mensagem de erro
    error_msg=$(echo "$response" | jq -r '.error' 2>/dev/null)
    if [ ! -z "$error_msg" ] && [ "$error_msg" != "null" ]; then
        echo "💬 Mensagem: $error_msg"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
