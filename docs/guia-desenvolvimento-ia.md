---
id: guia-desenvolvimento-ia
title: "Guia de Desenvolvimento com IA"
sidebar_label: "Guia de Desenvolvimento com IA"
---

# Guia de Desenvolvimento com IA

> **Como usar este guia:** Você não precisa saber programar. Você vai ter uma ideia, preencher alguns documentos (tem modelo para copiar aqui) e a IA vai desenvolver o projeto para você com qualidade profissional. Siga os passos na ordem.

---

## O que você vai precisar

Antes de começar, instale:

- **[Lovable](https://lovable.dev)** — onde você descreve sua ideia e a IA constrói o site/app
- **[Supabase](https://supabase.com)** — banco de dados gratuito para o seu projeto
- **[Netlify](https://netlify.com)** — hospedagem gratuita para o site ficar no ar
- **[GitHub](https://github.com)** — guarda o código do projeto

> Todos têm plano gratuito suficiente para começar.

---

## Por que Supabase e Netlify?

| O quê | Por quê usar |
|---|---|
| **Supabase** | Banco de dados pronto, login de usuários, regras de segurança — tudo em um lugar. Gratuito para começar. |
| **Netlify** | Seu site fica no ar em minutos. Atualiza sozinho quando o código muda. Gratuito. |
| **Lovable** | Você descreve o que quer em português, a IA constrói. Conecta direto com Supabase. |

---

## Passo 1 — Defina sua ideia em 3 perguntas

Antes de abrir qualquer ferramenta, responda no papel:

1. **O que o sistema faz?** (em uma frase)
   > Exemplo: "Um sistema para minha clínica controlar agendamentos de pacientes."

2. **Quem vai usar?** (tipos de usuário)
   > Exemplo: "Recepcionista, médico e paciente."

3. **Quais são as 3 telas mais importantes?**
   > Exemplo: "Agenda do dia, cadastro de paciente, histórico de consultas."

---

## Passo 2 — Preencha o PROJECT_REQUIREMENTS

Este é o documento mais importante. A IA vai ler ele toda vez que você pedir algo novo. Copie o modelo abaixo e preencha com os dados do seu projeto.

:::tip Como usar
Crie um arquivo chamado `PROJECT_REQUIREMENTS.md` na raiz do seu projeto e cole este conteúdo preenchido.
:::

```markdown
# PROJECT_REQUIREMENTS — [Nome do Projeto]

## Identidade do Projeto
- **Nome:** [nome do sistema]
- **Empresa/Cliente:** [nome da empresa]
- **Objetivo:** [em uma frase o que o sistema resolve]
- **Fase atual:** MVP

## Stack Técnico
- Frontend: React + Vite + TypeScript + Tailwind + shadcn/ui
- Backend: Supabase (PostgreSQL + Edge Functions)
- Auth: Supabase Auth
- Deploy Frontend: Netlify
- Deploy Backend: Supabase

## Quem Usa o Sistema (Perfis de Acesso)

### [Perfil 1 — ex: Admin]
- O que pode fazer: [descreva]
- O que NÃO pode fazer: [descreva]

### [Perfil 2 — ex: Operador]
- O que pode fazer: [descreva]
- O que NÃO pode fazer: [descreva]

### [Perfil 3 — ex: Cliente/Visitante]
- O que pode fazer: [descreva]
- O que NÃO pode fazer: [descreva]

## Funcionalidades — MVP (Versão 1)

### Módulo: [Nome do Módulo 1]
- [ ] [Funcionalidade 1]
- [ ] [Funcionalidade 2]
- [ ] [Funcionalidade 3]

### Módulo: [Nome do Módulo 2]
- [ ] [Funcionalidade 1]
- [ ] [Funcionalidade 2]

## Regras de Negócio Importantes
> Liste as regras que a IA precisa saber para não errar.

- Regra 1: [ex: Um paciente só pode ter uma consulta por dia]
- Regra 2: [ex: Somente o admin pode excluir registros]
- Regra 3: [ex: Pagamentos devem ser calculados pelo servidor, nunca pelo browser]

## Dados que o Sistema Armazena
> Liste as informações que serão salvas no banco.

| Dado | Sensível? | Quem acessa |
|------|-----------|-------------|
| Nome do usuário | Não | Todos autenticados |
| CPF | Sim | Somente admin |
| Histórico financeiro | Sim | Admin + financeiro |

## Integrações Externas (se houver)
- [ ] Nenhuma por enquanto
- [ ] [Nome da integração] — [o que faz]

## Questões em Aberto
> Dúvidas que ainda precisam de resposta antes de implementar.

- ?  [dúvida 1]
- ?  [dúvida 2]

## Histórico de Alterações
| Data | O que mudou |
|------|-------------|
| [data] | Criação do documento |
```

---

## Passo 3 — Configure os Agentes Especializados

Agentes são "papéis" que a IA assume para fazer diferentes tipos de trabalho. Copie o arquivo abaixo e salve como `AGENTS.md` na raiz do projeto.

:::tip O que são agentes?
Pense em agentes como funcionários especializados. O agente `dev` programa. O agente `qa` testa. O agente `sm` organiza as tarefas. Você chama cada um pelo nome quando precisar de algo específico.
:::

```markdown
# AGENTS.md — Instruções para IA

## Identidade do Projeto
Leia PROJECT_REQUIREMENTS.md antes de qualquer ação.
Leia CLAUDE.md para entender regras do projeto.

## Agentes Disponíveis

### @dev — Desenvolvedor
Responsável por implementar código.
- Sempre propor um Diff Plan antes de implementar
- Aguardar aprovação antes de começar
- Máximo 300 linhas por componente
- Nunca usar `any` no TypeScript
- Nunca usar `select('*')` no Supabase — especificar campos

### @qa — Qualidade
Responsável por validar o que foi implementado.
- Verificar cada Critério de Aceite da story
- Emitir gate: PASS / CONCERNS / FAIL
- PASS = pode fazer deploy
- FAIL = @dev deve corrigir antes de qualquer deploy

### @sm — Scrum Master
Responsável por organizar tarefas.
- Criar stories com contexto, critérios de aceite e especificações
- Manter backlog atualizado
- Nunca implementar código

### @architect — Arquiteto
Responsável por decisões técnicas.
- Avaliar impacto de mudanças na arquitetura
- Registrar decisões em architecture.md
- Sempre considerar segurança e escalabilidade

### @data-engineer — Banco de Dados
Responsável por estrutura de dados.
- Criar migrations do Supabase
- Configurar RLS em TODAS as tabelas
- Nunca deixar tabela sem política de segurança

## As 5 Regras Invioláveis

1. **Diff Plan obrigatório** — nunca implementar sem plano aprovado
2. **RLS em toda tabela** — sem exceção, mesmo tabelas internas
3. **TanStack Query para dados** — NUNCA useEffect + setState para buscar dados
4. **3 estados obrigatórios** — loading (skeleton), error (com retry), success
5. **Documentação é código** — atualizar PROJECT_REQUIREMENTS ao fim de cada mudança

## Padrões de Código

### Estrutura de Pasta
```
src/
├── features/[nome-da-feature]/
│   ├── api/          → chamadas ao Supabase
│   ├── components/   → componentes visuais
│   ├── hooks/        → estado local
│   ├── types/        → tipos TypeScript
│   └── utils/        → funções auxiliares
├── components/ui/    → shadcn/ui (não editar)
├── components/layout/→ Navbar, Sidebar
├── hooks/            → hooks compartilhados
└── lib/              → configurações (supabase.ts, etc)
```

### Componente Correto
```typescript
function MeuComponente() {
  const { data, isLoading, isError, refetch } = useMeusDados();

  if (isLoading) return <Skeleton />;
  if (isError) return <Erro onRetry={refetch} />;
  return <Conteudo data={data} />;
}
```

### Busca de Dados Correta
```typescript
export function useMeusDados() {
  return useQuery({
    queryKey: ['meus-dados'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tabela')
        .select('id, campo1, campo2')  // nunca select('*')
        .order('criado_em');
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });
}
```

## Segurança Obrigatória

Em TODA tabela criada no Supabase:
```sql
ALTER TABLE nome_tabela ENABLE ROW LEVEL SECURITY;
ALTER TABLE nome_tabela FORCE ROW LEVEL SECURITY;
```

Nunca colocar chaves secretas no código frontend.
Nunca calcular valores financeiros no browser — sempre no servidor.
Sempre validar input com Zod nas Edge Functions.

## Definition of Done
Antes de considerar qualquer tarefa concluída, verificar:
- [ ] Build passa (`npm run build`)
- [ ] Sem `any` no TypeScript
- [ ] Sem `console.log` em produção
- [ ] Loading + Error + Success implementados
- [ ] RLS verificado (se criou tabelas)
- [ ] PROJECT_REQUIREMENTS atualizado
- [ ] Testes manuais: caminho feliz, erro, sem dados
```

---

## Passo 4 — Configure o CLAUDE.md

Este arquivo diz para a IA como ela deve se comportar neste projeto específico. Salve como `CLAUDE.md` na raiz do projeto.

```markdown
# CLAUDE.md — Configuração do Projeto para IA

## Visão Geral
Leia PROJECT_REQUIREMENTS.md para entender o projeto completo.
Leia AGENTS.md para entender os padrões de código e segurança.

## Stack
- React 18 + Vite + TypeScript (strict: true, zero `any`)
- TanStack Query v5 para dados remotos
- Supabase (PostgreSQL + Auth + Edge Functions)
- Tailwind CSS + shadcn/ui
- Deploy: Netlify (frontend) + Supabase (backend)

## Perfis de Usuário
[Cole aqui os perfis do PROJECT_REQUIREMENTS]
- admin: acesso total
- [outros perfis]: [permissões]

## Variáveis de Ambiente
```
VITE_SUPABASE_URL=sua-url-aqui
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

## Comandos Importantes
```bash
npm run dev          # Desenvolvimento local
npm run build        # Build de produção
npm test             # Testes
supabase db push     # Aplicar migrations no banco
supabase functions deploy [nome]  # Publicar Edge Function
```

## Deploy
- Frontend: automático via Netlify ao fazer push na branch main
- Banco: `supabase db push` (SEMPRE fazer backup antes)
- Edge Functions: `supabase functions deploy`

## Regras Especiais deste Projeto
[Liste aqui regras específicas do seu projeto]
- [regra 1]
- [regra 2]

## O que NÃO fazer
- Nunca editar arquivos em `components/ui/` (shadcn gerencia)
- Nunca colocar segredos no código frontend
- Nunca fazer `select('*')` no Supabase
- Nunca deixar tabela sem RLS habilitado
```

---

## Passo 5 — Como usar o Lovable com qualidade

### Fluxo correto (não pule etapas)

```
Fase 1 → Layout e navegação (sem banco de dados)
Fase 2 → Componentes com dados falsos
Fase 3 → Conectar Supabase (só quando o visual estiver bom)
Fase 4 → Login e permissões de usuário
Fase 5 → Lógica complexa e Edge Functions
```

> **Por que essa ordem?** Mexer no banco antes do visual estar definido gera retrabalho. Primeiro decida como vai parecer, depois conecte os dados reais.

### Como escrever prompts que funcionam

**Estrutura de prompt que funciona:**

```
Contexto: [onde estamos no projeto]
Objetivo: [o que precisa ser feito]
Restrições: [o que não pode mudar]
Critério de sucesso: [como saber que funcionou]
```

### Prompts prontos — copie e adapte

**Para criar uma tela nova:**
```
Contexto: Estou construindo [nome do projeto]. Leia o PROJECT_REQUIREMENTS.md 
e o AGENTS.md antes de começar.

Objetivo: Criar a tela de [nome da tela] que permite ao usuário [o que faz].

Esta tela deve ter:
- [elemento 1]
- [elemento 2]
- [elemento 3]

Restrições:
- Máximo 300 linhas por componente
- Loading skeleton obrigatório
- Estado de erro com botão de tentar novamente
- Sem dados hardcoded — tudo virá do Supabase depois

Antes de implementar, me mostre o plano de arquivos que serão criados/alterados.
```

**Para conectar ao banco de dados:**
```
Contexto: A tela de [nome] está pronta visualmente.

Objetivo: Conectar ao Supabase. Preciso que:
1. Crie a tabela `[nome]` com os campos: [liste os campos]
2. Habilite RLS com as seguintes políticas:
   - [perfil admin] pode fazer tudo
   - [perfil operador] pode ler e inserir, nunca excluir
3. Crie o hook `use[Nome]` usando TanStack Query
4. Conecte o hook ao componente existente

Antes de implementar, mostre o plano.
```

**Para adicionar login:**
```
Contexto: O sistema [nome] precisa de autenticação.

Objetivo: Implementar login e controle de acesso com Supabase Auth.

Perfis existentes:
- [perfil 1]: [o que pode]
- [perfil 2]: [o que pode]

Preciso de:
1. Tela de login com email e senha
2. Rota protegida (redireciona para login se não autenticado)
3. Logout
4. Exibir nome do usuário no header

Antes de implementar, mostre o plano.
```

**Para corrigir um bug:**
```
Contexto: Na tela de [nome], ao [fazer X], acontece [Y] em vez de [Z esperado].

Antes de corrigir:
1. Explique sua hipótese sobre a causa raiz
2. Mostre quais arquivos pretende alterar
3. Aguarde minha aprovação

Não altere comportamentos que já funcionam.
```

**Para criar uma Edge Function (lógica segura no servidor):**
```
Contexto: Preciso de uma Edge Function no Supabase para [o que faz].

Esta função deve:
- Receber: [campos do input]
- Validar com Zod: [campos obrigatórios e tipos]
- Verificar JWT do usuário autenticado
- Verificar que o usuário tem papel: [perfil necessário]
- Executar: [lógica de negócio]
- Retornar: [o que retorna no sucesso]
- Retornar erro padronizado em caso de falha

Siga o template seguro de Edge Function do AGENTS.md.
Antes de implementar, mostre o plano.
```

---

## Passo 6 — Segurança (a IA deve aplicar automaticamente)

Estes padrões devem estar nos seus arquivos `AGENTS.md` e `CLAUDE.md`. A IA os aplicará automaticamente.

### Toda tabela criada deve ter:

```sql
-- Habilitar segurança por linha
ALTER TABLE nome_tabela ENABLE ROW LEVEL SECURITY;
ALTER TABLE nome_tabela FORCE ROW LEVEL SECURITY;

-- Quem pode ler
CREATE POLICY "leitura_autenticados" ON nome_tabela
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'user_role' IN ('admin', 'operador'));

-- Quem pode criar registros
CREATE POLICY "inserir_operador" ON nome_tabela
  FOR INSERT TO authenticated
  WITH CHECK (auth.jwt() ->> 'user_role' IN ('admin', 'operador'));

-- Quem pode excluir (geralmente só admin)
CREATE POLICY "excluir_admin" ON nome_tabela
  FOR DELETE TO authenticated
  USING (auth.jwt() ->> 'user_role' = 'admin');
```

### Template de Edge Function segura:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://seu-site.netlify.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Defina o que a função aceita como entrada
const InputSchema = z.object({
  id: z.string().uuid(),
  // adicione outros campos aqui
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 204 });
  }

  const reqId = crypto.randomUUID().slice(0, 8);

  try {
    // 1. Verificar que o usuário está logado
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return erro(401, 'Não autorizado', reqId);

    const supaUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    const { data: { user }, error: authErr } = await supaUser.auth.getUser();
    if (authErr || !user) return erro(401, 'Token inválido', reqId);

    // 2. Verificar perfil do usuário
    const userRole = user.user_metadata?.user_role;
    if (!['admin', 'operador'].includes(userRole ?? '')) {
      return erro(403, 'Sem permissão', reqId);
    }

    // 3. Validar o que foi enviado
    const input = InputSchema.parse(await req.json());

    // 4. Sua lógica aqui (usando supaAdmin para operações privilegiadas)
    const supaAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // ... lógica de negócio ...

    // 5. Retornar resultado
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ title: 'Dados inválidos', errors: e.errors, reqId }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    console.error(`[${reqId}] Erro:`, e);
    return erro(500, 'Erro interno', reqId);
  }
});

function erro(status: number, detail: string, reqId: string): Response {
  return new Response(
    JSON.stringify({ status, detail, reqId }),
    { status, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  );
}
```

---

## Passo 7 — Checklist antes de considerar algo pronto

A IA deve usar este checklist automaticamente. Você pode pedir: *"faça o checklist de Definition of Done antes de concluir"*.

### Código
- [ ] Build passa sem erros (`npm run build`)
- [ ] Sem `any` no TypeScript
- [ ] Sem `console.log` esquecido
- [ ] Nenhum componente com mais de 300 linhas

### Dados
- [ ] TanStack Query para buscar dados (sem useEffect para dados remotos)
- [ ] Campos específicos no select (nunca `select('*')`)
- [ ] Listas grandes com paginação ou virtualização

### Visual
- [ ] Loading com skeleton (não spinner genérico)
- [ ] Estado de erro com botão "Tentar novamente"
- [ ] Estado vazio (quando não há dados)
- [ ] Funciona em celular (responsivo)

### Segurança
- [ ] Toda tabela nova com RLS habilitado
- [ ] Políticas definidas por perfil de usuário
- [ ] Nenhum segredo no código frontend
- [ ] Valores financeiros calculados no servidor

### Documentação
- [ ] PROJECT_REQUIREMENTS.md atualizado
- [ ] Mudanças importantes registradas

### Testes manuais
- [ ] Caminho normal funciona
- [ ] O que acontece com internet lenta? (loading aparece)
- [ ] O que acontece com erro? (mensagem de erro aparece)
- [ ] O que acontece sem dados? (tela vazia aparece)

---

## Passo 8 — Como organizar tarefas (Stories)

Uma "story" é uma unidade de trabalho. Cada funcionalidade nova deve ser uma story. Copie e use este modelo:

```markdown
# STORY-001 — [Título da funcionalidade]

**Status:** backlog | em-progresso | em-review | concluido
**Módulo:** [nome do módulo]
**Prioridade:** alta | média | baixa

## Contexto
[Por que essa funcionalidade é necessária? Que problema resolve?]

## O que precisa funcionar (Critérios de Aceite)
- CA1: Ao clicar em [X], deve acontecer [Y]
- CA2: Se [situação], então [resultado esperado]
- CA3: O usuário com perfil [X] deve [ver/não ver] este recurso

## Especificações Técnicas
[A IA preenche esta seção ao fazer o plano]

## Resultado da Implementação
[A IA preenche com o que foi feito]

## QA — Resultado dos Testes
Gate: PASS / CONCERNS / FAIL
- CA1: ✅ / ❌
- CA2: ✅ / ❌
- CA3: ✅ / ❌
```

---

## Como iniciar um projeto do zero — Roteiro completo

Siga esta ordem. Não pule etapas.

### Preparação (15 minutos)
1. Crie conta em: GitHub, Supabase, Netlify, Lovable
2. Crie projeto no Supabase (escolha região: São Paulo)
3. Crie projeto no Lovable e conecte ao GitHub
4. No Lovable, conecte o projeto ao Supabase
5. Crie site no Netlify apontando para o repositório GitHub

### Documentação (30 minutos — faça antes de programar)
6. Copie e preencha o `PROJECT_REQUIREMENTS.md`
7. Copie o `AGENTS.md` (ajuste apenas os perfis de usuário)
8. Copie o `CLAUDE.md` (ajuste stack e regras específicas)
9. Faça commit desses 3 arquivos no GitHub

### Desenvolvimento
10. No Lovable, use o prompt abaixo para começar:

```
Você vai desenvolver [nome do projeto].

Antes de qualquer ação:
1. Leia o PROJECT_REQUIREMENTS.md
2. Leia o AGENTS.md
3. Leia o CLAUDE.md

Com base nisso, me mostre:
a) Sua compreensão do projeto (resumo em 5 linhas)
b) As 3 primeiras telas que você propõe criar
c) A estrutura de pastas que vai usar

Aguarde minha aprovação antes de começar a criar código.
```

---

## Prompt de início rápido — copie e use

Quando quiser que a IA comece um projeto novo, cole este prompt (preenchendo as partes em colchetes):

```
Você vai me ajudar a desenvolver [descreva sua ideia em 2-3 frases].

Antes de começar, leia os arquivos:
- PROJECT_REQUIREMENTS.md
- AGENTS.md  
- CLAUDE.md

Após ler, me apresente:
1. Sua compreensão do projeto (o que vai fazer, para quem, principais funcionalidades)
2. As primeiras 3 telas que propõe criar no MVP
3. Quais tabelas no banco de dados serão necessárias
4. Alguma dúvida que você tem antes de começar

Aguarde minha resposta antes de escrever qualquer código.
```

---

## Perguntas frequentes

**Preciso saber programar?**
Não. Você precisa saber explicar sua ideia com clareza. Quanto mais detalhado você for nos documentos, melhor a IA vai trabalhar.

**Quanto custa?**
Supabase, Netlify e GitHub têm planos gratuitos generosos para projetos pequenos e médios. Lovable tem plano pago para mais uso.

**E se a IA errar?**
Diga o que está errado e peça para ela corrigir. Use o prompt de bug da seção de Lovable. Sempre peça o plano antes de implementar.

**Posso usar outro banco de dados?**
Pode, mas Supabase já vem com login de usuários, segurança por linha (RLS), banco de dados e API prontos. Para projetos novos, é a escolha mais rápida.

**Preciso de um desenvolvedor humano?**
Para projetos simples, não. Para projetos grandes com integrações complexas, um dev pode ajudar a revisar a arquitetura.

---

## Recursos

- [Supabase — Documentação](https://supabase.com/docs)
- [Netlify — Começar](https://docs.netlify.com)
- [Lovable — Guia](https://docs.lovable.dev)
- [shadcn/ui — Componentes](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query/latest)
