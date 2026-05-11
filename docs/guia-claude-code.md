---
id: guia-claude-code
title: "Desenvolvimento com Claude Code + Supabase"
sidebar_label: "Claude Code + Supabase"
---

# Desenvolvimento com Claude Code + Supabase + Netlify

> Este guia é para quem quer desenvolver sem usar o Lovable — usando o Claude Code (terminal/IDE) como ferramenta principal, combinado com 21st.dev para componentes visuais, Supabase como backend e Netlify para hospedagem.

---

## Quando usar esta abordagem

| Use Claude Code quando... | Use Lovable quando... |
|---|---|
| Quer controle total sobre o código | Está sem computador ou em emergência |
| O projeto tem lógica complexa | Quer iterar visual rapidamente |
| Precisa de rastreabilidade completa | Está aprendendo e quer ver o resultado |
| Vai usar agentes especializados (@dev, @qa) | O projeto é simples e visual |
| Trabalha com repositório existente | Está começando do zero |

---

## O que é cada ferramenta

**Claude Code** — O Claude (IA da Anthropic) instalado no terminal do seu computador. Você conversa com ele diretamente no projeto, ele lê e escreve os arquivos, roda comandos e usa agentes especializados.

**21st.dev** — Biblioteca de componentes de interface prontos e gerados por IA. Em vez de criar botões, formulários e tabelas do zero, você busca ou gera componentes prontos e os adapta.

**Supabase** — Banco de dados PostgreSQL com painel visual, sistema de login, APIs automáticas e Edge Functions (código que roda no servidor). Tudo em um lugar.

**Netlify** — Hospedagem gratuita que publica seu site automaticamente toda vez que você atualiza o código no GitHub.

---

## Instalação do Claude Code

### Pré-requisitos

```bash
# Instalar Node.js (versão 18 ou superior)
# Baixe em: https://nodejs.org

# Verificar instalação
node --version  # deve aparecer v18.x.x ou superior
```

### Instalar Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

### Configurar

```bash
# Fazer login (abre o browser)
claude login

# Verificar
claude --version
```

### Abrir em um projeto

```bash
# Navegar até a pasta do projeto
cd meu-projeto

# Abrir o Claude Code
claude
```

---

## Configuração do projeto

### 1. Criar projeto React com Vite

```bash
npm create vite@latest nome-do-projeto -- --template react-ts
cd nome-do-projeto
npm install
```

### 2. Instalar dependências padrão

```bash
# UI e estilos
npm install tailwindcss @tailwindcss/vite
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react

# Dados e estado
npm install @tanstack/react-query
npm install @supabase/supabase-js

# Formulários e validação
npm install react-hook-form @hookform/resolvers zod

# Roteamento
npm install react-router-dom
```

### 3. Configurar Tailwind

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': '/src' }
  }
})
```

```css
/* src/index.css */
@import "tailwindcss";
```

### 4. Configurar cliente Supabase

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

```bash
# .env.local (nunca commitar este arquivo)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

```bash
# .gitignore — garantir que está incluído
echo ".env.local" >> .gitignore
```

### 5. Configurar TanStack Query

```typescript
// src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos de cache
      retry: 1,
    },
  },
})
```

```tsx
// src/main.tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
```

---

## Usando 21st.dev para componentes

O [21st.dev](https://21st.dev) é uma biblioteca de componentes React prontos, gerados e refinados por IA. Funciona como um mercado de componentes.

### Como usar

**Opção 1 — Buscar componente pronto:**
1. Acesse [21st.dev](https://21st.dev)
2. Busque o componente que precisa (ex: "data table", "sidebar nav", "auth form")
3. Copie o código e cole na pasta `src/components/ui/`

**Opção 2 — Gerar com prompt no Claude Code:**
```
Preciso de um componente de [descrição].

Requisitos:
- Usar Tailwind CSS + shadcn/ui
- TypeScript strict (sem any)
- Props tipadas com interface
- Máximo 300 linhas
- Estados: loading, error, empty, data

Gere o componente completo.
```

**Opção 3 — Instalar shadcn/ui (mais recomendado):**
```bash
npx shadcn@latest init

# Adicionar componentes individualmente
npx shadcn@latest add button
npx shadcn@latest add table
npx shadcn@latest add form
npx shadcn@latest add dialog
npx shadcn@latest add toast
```

---

## Workflow de desenvolvimento com Claude Code

### O ciclo correto

```
1. Abrir Claude Code na pasta do projeto (claude)
2. Identificar a tarefa (criar story ou receber story existente)
3. Pedir Diff Plan ao @dev antes de qualquer implementação
4. Aprovar o plano
5. @dev implementa
6. @qa valida
7. Commit + push → Netlify deploya automaticamente
```

### Comandos para chamar agentes

No Claude Code, prefixe com `/` para chamar agentes:

```
/dev implemente a funcionalidade de listagem de clientes com filtro por status

/qa valide a implementação que acabou de ser feita

/sm crie uma story para o módulo de relatórios financeiros

/architect proponha a estrutura de banco para um sistema de agendamentos
```

### Exemplo de sessão completa

```
Você: /sm preciso de uma tela para listar todos os pedidos com filtro por status e data

@sm: Criando STORY-001 — Listagem de Pedidos
[cria o arquivo docs/stories/STORY-001.md com contexto e critérios de aceite]

Você: /dev implemente a STORY-001

@dev: Antes de implementar, apresento o Diff Plan:
- Criar: src/features/pedidos/api/usePedidos.ts
- Criar: src/features/pedidos/components/PedidosPage.tsx
- Criar: src/features/pedidos/components/PedidosTabela.tsx
- Criar: src/features/pedidos/hooks/usePedidosFiltros.ts
- Criar: supabase/migrations/001_create_pedidos.sql
Posso prosseguir?

Você: sim

@dev: [implementa todos os arquivos]
Implementação concluída. Passando para @qa.

@qa: Validando STORY-001...
CA1 ✅ - Listagem exibe pedidos corretamente
CA2 ✅ - Filtro por status funciona
CA3 ✅ - Filtro por data funciona
CA4 ✅ - Estado vazio exibido quando sem resultados
CA5 ✅ - Loading skeleton presente
Gate: PASS — pronto para deploy.
```

---

## Configurar Supabase CLI

```bash
# Instalar
npm install -g supabase

# Fazer login
supabase login

# Inicializar no projeto (cria pasta supabase/)
supabase init

# Linkar ao projeto existente
supabase link --project-ref SEU_PROJECT_REF
# O project-ref está na URL do Supabase: https://app.supabase.com/project/SEU_PROJECT_REF

# Ver diferenças antes de aplicar
supabase db diff

# Aplicar migrations
supabase db push
```

### Estrutura de migrations

```
supabase/
├── migrations/
│   ├── 001_create_users_profiles.sql
│   ├── 002_create_pedidos.sql
│   └── 003_add_status_to_pedidos.sql
└── functions/
    └── processar-pedido/
        └── index.ts
```

### Exemplo de migration segura

```sql
-- supabase/migrations/002_create_pedidos.sql

CREATE TABLE pedidos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id uuid REFERENCES auth.users(id) NOT NULL,
  status text NOT NULL DEFAULT 'pendente'
    CHECK (status IN ('pendente', 'confirmado', 'cancelado', 'entregue')),
  valor_total numeric(10, 2) NOT NULL CHECK (valor_total >= 0),
  criado_em timestamptz DEFAULT now() NOT NULL,
  atualizado_em timestamptz DEFAULT now() NOT NULL
);

-- Segurança obrigatória
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos FORCE ROW LEVEL SECURITY;

-- Políticas por perfil
CREATE POLICY "admin_acesso_total" ON pedidos
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'user_role' = 'admin');

CREATE POLICY "cliente_ve_proprios" ON pedidos
  FOR SELECT TO authenticated
  USING (cliente_id = auth.uid());

-- Índices para performance
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_pedidos_cliente_id ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_criado_em ON pedidos(criado_em DESC);
```

---

## Deploy no Netlify

### Configuração inicial (uma vez)

1. Acesse [netlify.com](https://netlify.com) e crie conta
2. Clique em "Add new site" → "Import an existing project"
3. Conecte seu GitHub e selecione o repositório
4. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Em "Environment variables", adicione:
   - `VITE_SUPABASE_URL` — sua URL do Supabase
   - `VITE_SUPABASE_ANON_KEY` — sua chave anon do Supabase

### Deploy automático

Após configurar, cada `git push origin main` publica automaticamente. Você acompanha em Netlify → Deploys.

### Netlify Functions (alternativa às Edge Functions)

Para lógica que precisa rodar no servidor mas prefere Node.js:

```typescript
// netlify/functions/processar-pagamento.ts
import type { Handler } from '@netlify/functions'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    // lógica aqui
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno' })
    }
  }
}
```

---

## Padrão de autenticação com Supabase

### Hook de autenticação

```typescript
// src/hooks/useAuth.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = () => supabase.auth.signOut()

  return { user, loading, signOut }
}
```

### Rota protegida

```tsx
// src/components/layout/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface Props {
  children: React.ReactNode
  requiredRole?: string
}

export function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, loading } = useAuth()

  if (loading) return <div>Carregando...</div>
  if (!user) return <Navigate to="/login" replace />

  if (requiredRole) {
    const userRole = user.user_metadata?.user_role
    if (userRole !== requiredRole) return <Navigate to="/sem-permissao" replace />
  }

  return <>{children}</>
}
```

### Usar na rota

```tsx
// src/App.tsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/" element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } />
  <Route path="/admin" element={
    <ProtectedRoute requiredRole="admin">
      <AdminPanel />
    </ProtectedRoute>
  } />
</Routes>
```

---

## Checklist de qualidade por commit

Antes de cada `git push`, verifique:

```bash
# 1. Build limpo
npm run build

# 2. Sem erros TypeScript
npx tsc --noEmit

# 3. Testes passando
npm test

# 4. Verificar segurança das dependências
npm audit --audit-level=high
```

Se algum desses falhar, **não faça push**. Corrija primeiro.

---

## Dicas de produtividade com Claude Code

**Dê contexto sempre:**
```
[Claude Code entende o contexto do projeto ao ler CLAUDE.md automaticamente]
"Baseado no PROJECT_REQUIREMENTS, implemente o módulo de relatórios."
```

**Peça revisão antes de aceitar:**
```
"Antes de finalizar, revise se o código segue todos os padrões do AGENTS.md."
```

**Use o @qa para cada entrega:**
```
"@qa, valide a implementação do módulo de pedidos contra os critérios de aceite da STORY-005."
```

**Mantenha o PROJECT_REQUIREMENTS atualizado:**
```
"Atualize o PROJECT_REQUIREMENTS.md para refletir a nova funcionalidade de relatórios que acabamos de implementar."
```

---

## Próximos passos

- [Agentes Especializados](/agentes-especializados) — referência completa de cada agente
- [Guia de Desenvolvimento com IA](/guia-desenvolvimento-ia) — visão geral e templates
