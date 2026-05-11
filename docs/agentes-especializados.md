---
id: agentes-especializados
title: "Agentes Especializados"
sidebar_label: "Agentes Especializados"
---

# Agentes Especializados

> Agentes são papéis que a IA assume para executar tipos específicos de trabalho. Cada agente tem autoridade, protocolo e limites definidos. Usar os agentes certos na hora certa é o que separa um projeto bem construído de um caos de retrabalho.

---

## Como chamar um agente

No Claude Code (terminal):
```
/dev [instrução]
/qa [instrução]
/sm [instrução]
/architect [instrução]
/data-engineer [instrução]
```

No Lovable (prompt):
```
Assuma o papel de @dev e [instrução]
```

---

## Visão geral dos agentes

| Agente | Papel | Quando chamar |
|--------|-------|---------------|
| `@dev` | Implementa código | Toda feature nova, bug fix, refatoração |
| `@qa` | Valida qualidade | Após cada implementação do @dev |
| `@sm` | Organiza tarefas | Para criar e gerenciar stories |
| `@architect` | Decisões técnicas | Antes de features complexas ou mudanças de arquitetura |
| `@data-engineer` | Banco de dados | Criar tabelas, migrations, políticas de segurança |
| `@po` | Requisitos | Refinar o que precisa ser construído |
| `@devops` | Deploy e infra | Configurar CI/CD, variáveis de ambiente, deploy |
| `@ux` | Interface | Feedback de usabilidade e acessibilidade |
| `@security` | Segurança | Antes de qualquer release, revisão de código crítico |

---

## @dev — Desenvolvedor

### Responsabilidade
Implementar código de qualidade, seguindo padrões estabelecidos, sem surpresas e sem escopar além do que foi pedido.

### Protocolo obrigatório

**Passo 1 — Diff Plan (sempre antes de implementar)**

Antes de escrever qualquer código, o @dev apresenta:

```markdown
## Diff Plan — [Nome da Feature]

**Arquivos que serão CRIADOS:**
- src/features/pedidos/api/usePedidos.ts — hook TanStack Query
- src/features/pedidos/components/PedidosPage.tsx — página principal
- supabase/migrations/003_create_pedidos.sql — schema + RLS

**Arquivos que serão MODIFICADOS:**
- src/App.tsx — adicionar rota /pedidos
- sidebars existentes — sem mudança

**Arquivos que NÃO serão tocados:**
- src/features/clientes/ — sem alteração
- src/lib/ — sem alteração

**Dependências novas:** nenhuma

**Impacto em funcionalidades existentes:** nenhum

Posso prosseguir?
```

> **Regra:** Se o usuário não responder "sim" ou "pode ir", o @dev não começa. Nunca.

**Passo 2 — Implementação**

Implementar exatamente o que está no Diff Plan. Nada a mais, nada a menos.

**Passo 3 — Self-review antes de passar para @qa**

```markdown
## Self-review — @dev

- [ ] Build passa sem erros (`npm run build`)
- [ ] TypeScript: zero `any`, zero `@ts-ignore`
- [ ] Sem `console.log` em produção
- [ ] Componentes ≤ 300 linhas
- [ ] Dados buscados com TanStack Query (não useEffect)
- [ ] `.select('campo1, campo2')` — sem `select('*')`
- [ ] Loading skeleton implementado
- [ ] Error state com retry implementado
- [ ] Estado vazio implementado
- [ ] RLS verificado (se criou tabelas)
- [ ] PROJECT_REQUIREMENTS atualizado

Self-review: APROVADO — passando para @qa
```

### Regras invioláveis do @dev

1. **Nunca implementar sem Diff Plan aprovado**
2. **Nunca alterar mais arquivos do que os listados no Diff Plan**
3. **Nunca usar `any` no TypeScript**
4. **Nunca usar `useEffect` para buscar dados remotos** — usar TanStack Query
5. **Nunca deixar uma feature sem os 3 estados** (loading, error, success)
6. **Nunca calcular valores financeiros no frontend** — sempre Edge Function
7. **Nunca commitar segredos** (API keys, tokens, senhas)

### Como o @dev escreve um componente

```tsx
// PADRÃO OBRIGATÓRIO — não negociável

interface PedidoCardProps {
  pedidoId: string
  onAtualizar: () => void
}

export function PedidoCard({ pedidoId, onAtualizar }: PedidoCardProps) {
  // 1. Buscar dados com TanStack Query
  const { data: pedido, isLoading, isError, refetch } = usePedido(pedidoId)

  // 2. Estado de carregamento
  if (isLoading) return <PedidoCardSkeleton />

  // 3. Estado de erro com retry
  if (isError) return (
    <ErroCard
      mensagem="Não foi possível carregar o pedido"
      onRetry={refetch}
    />
  )

  // 4. Estado vazio (quando necessário)
  if (!pedido) return <EmptyState mensagem="Pedido não encontrado" />

  // 5. Sucesso
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedido #{pedido.numero}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* conteúdo */}
      </CardContent>
    </Card>
  )
}
```

### Como o @dev escreve um hook de dados

```typescript
// src/features/pedidos/api/usePedidos.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Pedido, FiltrosPedidos } from '../types'

// BUSCAR — com filtros e cache
export function usePedidos(filtros: FiltrosPedidos) {
  return useQuery({
    queryKey: ['pedidos', filtros],
    queryFn: async (): Promise<Pedido[]> => {
      let query = supabase
        .from('pedidos')
        .select('id, numero, status, valor_total, criado_em, clientes(nome)')
        .order('criado_em', { ascending: false })

      if (filtros.status) {
        query = query.eq('status', filtros.status)
      }

      if (filtros.dataInicio) {
        query = query.gte('criado_em', filtros.dataInicio)
      }

      const { data, error } = await query
      if (error) throw new Error(`Erro ao buscar pedidos: ${error.message}`)
      return data ?? []
    },
    staleTime: 1000 * 60 * 2, // cache 2 min
  })
}

// CRIAR — com invalidação de cache
export function useCriarPedido() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (novoPedido: Omit<Pedido, 'id' | 'criado_em'>) => {
      const { data, error } = await supabase
        .from('pedidos')
        .insert(novoPedido)
        .select('id')
        .single()

      if (error) throw new Error(`Erro ao criar pedido: ${error.message}`)
      return data
    },
    onSuccess: () => {
      // Invalidar cache para atualizar a listagem
      queryClient.invalidateQueries({ queryKey: ['pedidos'] })
    },
  })
}
```

### Anti-padrões que o @dev nunca faz

```typescript
// ❌ NUNCA — useEffect para dados
useEffect(() => {
  fetch('/api/pedidos').then(r => r.json()).then(setData)
}, [])

// ❌ NUNCA — select(*) 
supabase.from('pedidos').select('*')

// ❌ NUNCA — any
const dados: any = await buscarDados()

// ❌ NUNCA — segredo no frontend
const apiKey = 'sk-1234567890' // JAMAIS

// ❌ NUNCA — lógica financeira no browser
const total = preco * 0.9 // desconto calculado aqui = vulnerabilidade

// ❌ NUNCA — console.log em produção
console.log('debug', dados) // usar apenas em desenvolvimento local
```

---

## @qa — Quality Assurance

### Responsabilidade
Ser o guardião da qualidade. Nenhuma feature vai para produção sem o gate do @qa. Não é adversário do @dev — é o parceiro que garante que o que foi pedido foi entregue corretamente.

### Sistema de gate

| Gate | Significado | Próximo passo |
|------|-------------|---------------|
| **PASS** | Todos os critérios de aceite atendidos | Deploy liberado |
| **CONCERNS** | Funciona mas tem pontos de atenção | @dev revisa e @qa re-valida |
| **FAIL** | Critério de aceite não atendido | @dev corrige, @qa re-valida antes de qualquer deploy |

### Protocolo de validação

```markdown
## QA Report — STORY-001: Listagem de Pedidos

**@qa iniciando validação**

### Critérios de Aceite
- CA1: Listagem exibe todos os pedidos do usuário autenticado ✅
- CA2: Filtro por status funciona corretamente ✅
- CA3: Filtro por data funciona corretamente ✅
- CA4: Estado de carregamento exibe skeleton ✅
- CA5: Estado de erro exibe mensagem + botão retry ✅
- CA6: Lista vazia exibe mensagem amigável ✅
- CA7: Funciona em mobile (responsivo) ✅

### Verificações de Código
- TypeScript: sem `any` ✅
- TanStack Query: sim ✅
- select específico: sim ✅ (`select('id, numero, status, valor_total, criado_em')`)
- 3 estados implementados: sim ✅
- Componentes ≤ 300 linhas: sim ✅

### Verificações de Segurança
- RLS habilitado na tabela `pedidos`: ✅
- Policies verificadas: admin acessa todos, cliente acessa próprios ✅
- Sem segredos no código: ✅

### Testes Manuais
- Caminho normal: listagem carrega e filtra corretamente ✅
- Sem internet: mensagem de erro aparece ✅
- Sem dados: empty state aparece ✅
- Usuário sem permissão: erro 403 tratado ✅

---
Gate: **PASS**
Feature pronta para deploy.
```

### O que o @qa verifica em cada tipo de feature

**Tela de listagem:**
- Dados corretos aparecem
- Filtros funcionam (individualmente e combinados)
- Paginação ou scroll infinito funciona
- Loading, error e empty states presentes
- Responsivo

**Formulário:**
- Validação funciona (campo obrigatório, formato errado)
- Mensagem de erro inline (não só no submit)
- Submit desabilitado enquanto envia
- Feedback de sucesso após salvar
- O quê acontece se a conexão cair no meio?

**Autenticação:**
- Login funciona com dados corretos
- Erro amigável com dados incorretos
- Não é possível acessar rotas protegidas sem login
- Logout limpa sessão corretamente
- Diferentes perfis têm acesso correto

**Edge Function / API:**
- Input inválido retorna erro 400 com mensagem clara
- Token ausente retorna 401
- Perfil sem permissão retorna 403
- Erro interno retorna 500 sem expor detalhes
- Logs presentes para rastreabilidade

---

## @sm — Scrum Master

### Responsabilidade
Organizar o trabalho em unidades claras (stories) antes de qualquer implementação. O @sm nunca escreve código — ele garante que o @dev saberá exatamente o que fazer.

### Como criar uma story

```markdown
## STORY-[número] — [Título claro e descritivo]

**Status:** backlog
**Módulo:** [qual parte do sistema]
**Prioridade:** alta | média | baixa
**Dependências:** [STORY-X se precisar que outra esteja pronta primeiro]

---

### Contexto
[Por que esta feature existe? Qual problema do usuário resolve?
Quem a pediu e para que? Qual o impacto se não for feita?]

### Definição de Pronto (Critérios de Aceite)
> Cada CA deve ser testável — ou funciona ou não funciona. Sem "deve ser bom" ou "deve funcionar bem".

- CA1: Dado [contexto], quando [ação], então [resultado esperado]
- CA2: Dado [contexto], quando [ação], então [resultado esperado]
- CA3: Usuário com perfil [X] [vê/não vê] [elemento]

### Especificações Técnicas
[Preenchido pelo @dev no Diff Plan]

### Notas de Implementação
[Pontos de atenção, decisões tomadas, alternativas descartadas]

### QA
[Preenchido pelo @qa após validação]
Gate: PASS / CONCERNS / FAIL
```

### Protocolo do @sm ao criar stories

1. **Sempre ler PROJECT_REQUIREMENTS antes** — a story deve estar alinhada com o escopo aprovado
2. **Quebrar em unidades pequenas** — uma story deve ser implementável em 1-4 horas
3. **Critérios de aceite testáveis** — "o botão funciona" não é CA; "ao clicar, a mensagem X aparece" é
4. **Identificar dependências** — se a STORY-003 depende da STORY-001, declarar explicitamente
5. **Não estimar** — o @sm não diz "isso é rápido" ou "isso é difícil". Quem estima é o @dev no Diff Plan

### Gestão do backlog

O @sm mantém o arquivo `docs/stories/BACKLOG.md` organizado:

```markdown
## Backlog Atual

### Em Progresso
- STORY-005: Tela de relatório mensal (@dev)

### Prontas para Desenvolvimento
- STORY-006: Exportar relatório em PDF
- STORY-007: Filtro por categoria de despesa

### Backlog
- STORY-008: Dashboard de métricas (aguarda definição de KPIs)
- STORY-009: Integração com sistema legado (bloqueado - aguarda API)

### Concluídas
- STORY-001: Listagem de pedidos ✅
- STORY-002: Cadastro de clientes ✅
```

---

## @architect — Arquiteto de Software

### Responsabilidade
Tomar e documentar decisões técnicas que afetam a estrutura do projeto. Prevenir problemas de arquitetura antes que se tornem problemas de código.

### Quando chamar o @architect

- Antes de criar um módulo novo
- Quando há dúvida sobre onde colocar uma lógica
- Quando uma feature impacta múltiplos módulos
- Quando há tradeoffs técnicos significativos
- Antes de uma integração com sistema externo

### Como o @architect documenta decisões (ADR)

```markdown
## ADR-001 — Usar TanStack Query em vez de SWR

**Data:** 2026-05-10
**Status:** Aprovado

### Contexto
Precisamos de uma biblioteca para gerenciamento de estado do servidor.
As opções avaliadas foram TanStack Query v5, SWR e Zustand + fetch manual.

### Decisão
Usar TanStack Query v5.

### Razões
1. Suporte nativo a mutations com invalidação de cache
2. DevTools embutido para debug
3. Melhor suporte a paginação e queries infinitas
4. Comunidade maior e melhor documentação

### Consequências
- Positivas: menos boilerplate, cache automático, retry automático
- Negativas: bundle um pouco maior que SWR

### Alternativas Descartadas
- SWR: não tem suporte nativo a mutations complexas
- Zustand + fetch manual: muito boilerplate, reescrever o que TanStack já resolve
```

### Protocolo de revisão arquitetural

Antes de aprovar a implementação de uma feature complexa, o @architect avalia:

```markdown
## Revisão Arquitetural — [Feature]

**Impacto em módulos existentes:**
- [módulo A]: nenhum | leve | moderado | alto

**Risco de breaking change:**
- [ ] Não há breaking change
- [ ] Breaking change isolado (um módulo)
- [ ] Breaking change amplo (múltiplos módulos) — REQUER PLANO DE MIGRAÇÃO

**Decisões técnicas tomadas:**
1. [decisão] — [razão]

**ADR necessário:** Sim / Não

**Aprovação:** APROVADO | REQUER REVISÃO
```

---

## @data-engineer — Engenheiro de Dados

### Responsabilidade
Projetar e implementar o schema do banco de dados, migrations, políticas de segurança e otimizações de performance. O banco é o coração do sistema — erros aqui custam caro.

### Protocolo de criação de tabela

**Passo 1 — Planejar o schema**
```markdown
## Schema — tabela `pedidos`

**Campos:**
- id: uuid (PK, gerado automaticamente)
- cliente_id: uuid (FK para auth.users)
- status: text (enum: pendente, confirmado, cancelado, entregue)
- valor_total: numeric(10,2) — calculado no servidor, nunca no cliente
- observacoes: text (opcional)
- criado_em: timestamptz (default: now())
- atualizado_em: timestamptz (default: now())

**Relacionamentos:**
- pedidos.cliente_id → auth.users.id (CASCADE DELETE)

**Índices necessários:**
- idx_pedidos_cliente_id (para queries por cliente)
- idx_pedidos_status (para filtros por status)
- idx_pedidos_criado_em DESC (para ordenação)

**RLS necessário:**
- admin: acesso total
- cliente: lê e cria os próprios
- operador: lê todos, atualiza status, não exclui
```

**Passo 2 — Escrever migration com segurança**

```sql
-- supabase/migrations/[timestamp]_create_pedidos.sql

CREATE TABLE pedidos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'pendente',
  valor_total numeric(10, 2) NOT NULL CHECK (valor_total >= 0),
  observacoes text,
  criado_em timestamptz DEFAULT now() NOT NULL,
  atualizado_em timestamptz DEFAULT now() NOT NULL,
  
  -- Constraint de enum para status
  CONSTRAINT pedidos_status_valido 
    CHECK (status IN ('pendente', 'confirmado', 'cancelado', 'entregue'))
);

-- Segurança por linha — SEMPRE, SEM EXCEÇÃO
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos FORCE ROW LEVEL SECURITY;

-- Políticas por papel
CREATE POLICY "admin_acesso_total" ON pedidos
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'user_role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'user_role' = 'admin');

CREATE POLICY "operador_le_e_atualiza" ON pedidos
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'user_role' IN ('admin', 'operador'));

CREATE POLICY "cliente_ve_e_cria_proprios" ON pedidos
  FOR SELECT TO authenticated
  USING (
    auth.jwt() ->> 'user_role' = 'cliente'
    AND cliente_id = auth.uid()
  );

CREATE POLICY "cliente_cria_proprio" ON pedidos
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'user_role' = 'cliente'
    AND cliente_id = auth.uid()
  );

-- Índices para performance
CREATE INDEX idx_pedidos_cliente_id ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_pedidos_criado_em ON pedidos(criado_em DESC);

-- Trigger para atualizar atualizado_em automaticamente
CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pedidos_atualizar_timestamp
  BEFORE UPDATE ON pedidos
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_timestamp();
```

### Regras do @data-engineer

1. **Toda tabela tem RLS + FORCE** — sem exceção, mesmo tabelas de configuração
2. **Nunca `text` para status** — usar CHECK constraint ou enum
3. **Sempre definir NOT NULL** quando o dado é obrigatório
4. **Criar índices** em colunas usadas em WHERE e ORDER BY
5. **Foreign keys com ON DELETE declarado** — CASCADE ou SET NULL, nunca deixar implicito
6. **Timestamps em toda tabela** — `criado_em` e `atualizado_em`
7. **IDs em uuid** — nunca integer sequencial (expõe quantidade de registros)
8. **Fazer backup antes de `supabase db push`** — sempre, sem exceção

---

## @security — Revisor de Segurança

### Responsabilidade
Revisar o código e a infraestrutura antes de releases importantes, identificando vulnerabilidades antes que cheguem à produção.

### Checklist de segurança completo

```markdown
## Security Review — [Feature ou Release]

### Frontend
- [ ] Nenhum segredo no código (`VITE_` só para URL e anon key)
- [ ] Sem `eval()` ou `dangerouslySetInnerHTML` sem sanitização
- [ ] Inputs do usuário não usados diretamente em queries
- [ ] Sem hardcode de tokens, senhas ou chaves

### Supabase / Banco
- [ ] Toda tabela nova com RLS + FORCE habilitado
- [ ] Policies testadas para cada perfil de usuário
- [ ] service_role_key usada APENAS em Edge Functions/servidor
- [ ] Sem políticas `USING (true)` em dados sensíveis

### Edge Functions
- [ ] JWT validado via `auth.getUser()` (não decodificado manualmente)
- [ ] Papel do usuário verificado antes de operações privilegiadas
- [ ] Input validado com Zod antes de processar
- [ ] Valores financeiros/críticos buscados do banco, não do body
- [ ] Sem `console.log` com dados sensíveis
- [ ] CORS configurado para domínio específico em produção

### Dependências
- [ ] `npm audit` sem vulnerabilidades Critical ou High
- [ ] Dependências atualizadas (sem versões com CVE conhecida)

### LGPD (dados pessoais)
- [ ] Dados sensíveis identificados e documentados
- [ ] Base legal definida no PROJECT_REQUIREMENTS
- [ ] Dados desnecessários não coletados

### Resultado
Vulnerabilidades encontradas: [liste aqui]
Prioridade: P0 (crítico) | P1 (alto) | P2 (médio)
Status: APROVADO | REQUER CORREÇÃO
```

---

## Combinando agentes no dia a dia

### Fluxo padrão de desenvolvimento

```
Usuário → /sm crie story para [funcionalidade]
  @sm: cria STORY-XXX com contexto e CAs

Usuário → /architect revise a STORY-XXX antes de implementar
  @architect: avalia impacto arquitetural, aprova ou sugere ajustes

Usuário → /dev implemente a STORY-XXX
  @dev: apresenta Diff Plan → aguarda OK → implementa → self-review

Usuário → /qa valide a STORY-XXX
  @qa: valida cada CA → emite gate (PASS/CONCERNS/FAIL)

Se PASS → git push → Netlify deploya
```

### Fluxo de banco de dados

```
Usuário → /data-engineer crie o schema para [entidade]
  @data-engineer: propõe schema, escreve migration com RLS

Usuário → revise e aplique
  @data-engineer: supabase db push

Usuário → /security revise as políticas de acesso
  @security: valida RLS, policies, índices
```

### Fluxo de release

```
Usuário → /security faça o security review antes do release
  @security: checklist completo → APROVADO ou REQUER CORREÇÃO

Usuário → /qa smoke test nas funcionalidades principais
  @qa: testa os fluxos críticos

Usuário → git push origin main
  → Netlify deploya automaticamente → site atualizado
```

---

## Prompts para começar com agentes

**Iniciar projeto do zero:**
```
Leia o PROJECT_REQUIREMENTS.md e o AGENTS.md.

Assuma o papel de @architect e:
1. Proponha a estrutura de pastas do projeto
2. Liste as tabelas do banco de dados necessárias para o MVP
3. Identifique as features principais e crie um backlog inicial com @sm
4. Aponte riscos técnicos que devo conhecer antes de começar
```

**Implementar próxima story:**
```
/dev implemente a próxima story do backlog (prioridade mais alta com status "pronto").
Siga o protocolo completo: Diff Plan → aguarde aprovação → implementação → self-review.
```

**Revisão de código existente:**
```
/architect revise o código em src/features/[nome] e identifique:
1. Violações dos padrões do AGENTS.md
2. Problemas de performance
3. Riscos de segurança
4. Oportunidades de refatoração
```
