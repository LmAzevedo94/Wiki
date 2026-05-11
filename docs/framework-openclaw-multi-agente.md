---
id: framework-openclaw-multi-agente
title: Framework OpenClaw Multi-Agente
sidebar_label: Framework OpenClaw Multi-Agente
---

# Framework de Referência: Arquitetura Multi-Agente para OpenClaw

## Propósito

Este documento consolida as melhores práticas da arquitetura OpenClaw com os princípios operacionais do framework Iris (Viver de IA) em um modelo unificado, aplicável a qualquer instalação OpenClaw independente de nicho, setor ou caso de uso.

O objetivo é transformar o OpenClaw de "assistente pessoal que responde perguntas" em um sistema multi-agente com hierarquia clara, memória estruturada, skills modulares e camada de validação, operando como um sócio executivo digital.

---

## 1. Princípios Fundacionais

### 1.1 Separação entre decisão e execução

O agente de entrada (orquestrador) nunca executa tarefas de domínio. Ele recebe o input do owner, interpreta a intenção, decompõe em subtarefas quando necessário e delega para agentes especialistas. Somente o orquestrador se comunica diretamente com o owner. Agentes especialistas (Heads) recebem tarefas e devolvem outputs ao orquestrador, nunca ao usuário final.

Isso resolve dois problemas recorrentes: sobrecarga cognitiva do prompt principal (que tenta ser generalista e especialista ao mesmo tempo) e perda de controle sobre o que é entregue ao owner.

### 1.2 Identidade como camada estratégica

O SOUL.md não é decoração. É a camada que define como o sistema se posiciona perante o owner. A diferença entre um agente que o owner usa esporadicamente e um que se torna indispensável está no posicionamento. O agente deve falar a língua do owner (empresário, gestor, criador de conteúdo), não a língua do desenvolvedor.

Recomendação: definir no SOUL.md um papel claro com metáfora de negócio. Exemplos: "Diretor de Operações", "Sócio Executivo", "Chief of Staff Digital". Evitar: "Assistente de IA", "Bot", "Agente".

### 1.3 Loop ReAct como base de raciocínio

Todo agente no sistema deve operar no ciclo: pensar (analisar o pedido e o contexto disponível), agir (executar a tarefa ou acionar uma tool), observar (avaliar o resultado), iterar (refinar se necessário). Esse ciclo deve estar explícito no AGENTS.md como protocolo padrão de operação, não implícito no comportamento do LLM.

---

## 2. Estrutura de Arquivos do Workspace

A estrutura abaixo expande o padrão de 8 arquivos do OpenClaw com a adição de camadas de skills e documentação sob demanda.

```
~/.openclaw/workspace/
├── SOUL.md              # Identidade, tom, valores, limites
├── IDENTITY.md          # Nome, emoji, avatar (curto)
├── AGENTS.md            # Regras operacionais, boot sequence, protocolos
├── USER.md              # Perfil do owner (contexto de negócio, preferências)
├── TOOLS.md             # Configuração de ferramentas disponíveis
├── HEARTBEAT.md         # Tarefas agendadas (cron em linguagem natural)
├── MEMORY.md            # Memória de longo prazo (max 10k chars)
├── memory/
│   ├── YYYY-MM-DD.md    # Logs diários (hoje + ontem auto-carregados)
│   └── archive/         # Logs antigos (30+ dias)
├── skills/
│   ├── skill-analise-competitiva/
│   │   └── SKILL.md
│   ├── skill-pipeline-review/
│   │   └── SKILL.md
│   ├── skill-content-strategy/
│   │   └── SKILL.md
│   └── skill-financial-review/
│       └── SKILL.md
├── docs/
│   ├── processos-detalhados.md
│   ├── referencias-tecnicas.md
│   └── historico-decisoes.md
└── checklists/
    ├── deploy-agent.md
    ├── onboarding-cliente.md
    └── revisao-semanal.md
```

**Regra de ouro**: somente o que precisa estar em contexto em toda sessão fica nos 8 arquivos raiz. Todo o resto vai para skills/ (carregado por trigger), docs/ (carregado sob demanda) ou checklists/ (carregado por referência no AGENTS.md).

---

## 3. Hierarquia de Agentes

### 3.1 Camada 1: Orquestrador (agente de entrada)

Função: receber inputs do owner, interpretar intenção, decompor tarefas, delegar, consolidar respostas e entregar.

**O orquestrador deve ter no SOUL.md:**

- Posicionamento claro (papel de negócio, não técnico)
- Limites explícitos do que ele faz e do que ele delega
- Tom de comunicação calibrado para o perfil do owner
- Regra absoluta: nunca fabricar informação, sempre delegar para o Head competente quando o tema sair do escopo geral

**O orquestrador deve ter no AGENTS.md:**

- Boot sequence (ler SOUL, USER, MEMORY, daily notes)
- Protocolo de decomposição de tarefas
- Mapa de roteamento (qual Head responde qual tipo de pedido)
- Protocolo de consolidação (como unificar respostas de múltiplos Heads)
- Protocolo de fallback (o que fazer quando nenhum Head cobre o escopo)

### 3.2 Camada 2: Heads (agentes especialistas)

Cada Head opera em um domínio específico com seu próprio workspace (em setup multi-agent) ou com skills dedicadas (em setup single-agent). Exemplos de Heads por contexto:

- Head de Marketing/Conteúdo
- Head Comercial/Pipeline
- Head Financeiro
- Head de Operações/Processos

Cada Head deve carregar apenas as skills relevantes ao seu domínio. Isso reduz consumo de tokens e aumenta precisão.

### 3.3 Camada 3: Validador (camada de auditoria)

Antes de qualquer output ser entregue ao owner, passa por validação. A camada de validação confere:

- **Cobertura**: a resposta endereça o que foi perguntado?
- **Consistência**: está alinhada com o contexto do owner (USER.md)?
- **Restrições**: respeita as regras definidas no SOUL.md?
- **Formatação**: segue o padrão de comunicação esperado?

Implementação prática no OpenClaw: adicionar no AGENTS.md um bloco de "self-check" que o agente executa antes de responder. Em setups mais avançados, usar um modelo mais leve (Gemini Flash, Haiku) como validador, chamado via tool antes da entrega final.

---

## 4. Skills: Camada de Conhecimento Modular

### 4.1 Conceito

Skills são pacotes de conhecimento especializado separados das tools (ações concretas). Uma skill ensina o agente o que saber sobre um domínio. Uma tool permite que ele execute algo nesse domínio.

Exemplo: a skill "análise de pipeline" contém frameworks de qualificação (BANT, SPIN), métricas de referência e critérios de priorização. A tool "CRM" permite que ele consulte dados reais do pipeline. São camadas distintas.

### 4.2 Estrutura de um SKILL.md

```yaml
---
name: pipeline-review
description: Análise e revisão de pipeline comercial com frameworks de qualificação
triggers:
  - pipeline
  - funil de vendas
  - forecast
  - qualificação de leads
head: comercial
tools_required:
  - web_search
  - memory_search
---
```

Após o frontmatter, o corpo do SKILL.md contém:

- Contexto do domínio (frameworks, métricas de referência, definições)
- Protocolo de análise (passo a passo que o agente deve seguir)
- Restrições específicas (o que nunca fazer nesse domínio)
- Formato de output esperado

### 4.3 Regras de gestão de skills

- Cada skill deve ter um trigger claro e específico. Triggers vagos causam ativações indevidas.
- Revisar skills mensalmente. Promover regras recorrentes do MEMORY.md para a skill relevante.
- Manter skills abaixo de 5.000 caracteres. Acima disso, dividir em sub-skills ou mover detalhes para docs/.
- Testar cada skill isoladamente antes de integrar ao workspace.

---

## 5. Sistema de Memória Estruturado

### 5.1 Três camadas de memória

**Camada 1 (sempre carregada)**: MEMORY.md. Fatos duráveis, preferências confirmadas, regras aprendidas. Limite recomendado: 8.000 a 10.000 caracteres. Tudo que estiver aqui consome tokens em toda sessão.

**Camada 2 (contexto diário)**: memory/YYYY-MM-DD.md. Logs do dia, observações brutas, decisões em andamento. Hoje e ontem carregam automaticamente. Não curar excessivamente: servem como registro operacional.

**Camada 3 (conhecimento profundo)**: docs/ e skills/. Acessados via memory_search ou memory_get quando relevante. Não carregam por padrão.

### 5.2 Protocolo de higiene

**Diário**: o flush pré-compaction do OpenClaw salva contexto importante automaticamente. Nenhuma ação manual necessária.

**Semanal**: revisar logs dos últimos 7 dias. Promover decisões e regras duráveis para MEMORY.md. Remover conteúdo obsoleto. Pode ser automatizado via HEARTBEAT.md com instrução para o agente fazer a curadoria.

**Mensal**: auditoria de MEMORY.md. Regras maduras que se tornaram permanentes devem migrar para SOUL.md (se comportamentais) ou para a SKILL.md relevante (se operacionais). Isso mantém o MEMORY.md enxuto.

### 5.3 Separação de memória por contexto

Memória pessoal carrega apenas em sessões privadas (DMs). Em grupos, o agente opera com regras mais restritas e sem acesso ao contexto pessoal do owner. Isso previne vazamento de informação em canais compartilhados. Configurar no AGENTS.md: "Main session only: Read MEMORY.md e USER.md".

---

## 6. Segurança e Governança

### 6.1 Controle de acesso

- dmPolicy: "pairing" como padrão (código único para novos contatos)
- allowFrom: lista explícita de números/contas autorizadas
- Grupos: requireMention ativado (agente só responde quando mencionado)
- Gateway: bind em loopback (127.0.0.1), nunca em 0.0.0.0 sem firewall

### 6.2 Gestão de tools

Habilitar apenas as tools necessárias para o caso de uso. Cada tool habilitada expande a superfície de ataque. Filesystem, shell e browser são poderosos, mas perigosos se mal configurados.

Regras recomendadas no AGENTS.md:

- Nunca executar comandos destrutivos (rm, delete, drop) sem confirmação
- Nunca enviar e-mails sem aprovação de draft
- Nunca assumir a data atual sem verificar
- Nunca fazer operações bulk sem aprovação explícita

### 6.3 Auditoria de skills de terceiros

Tratar toda skill do ClawHub como código não confiável. Ler o SKILL.md e scripts antes de habilitar. O OpenClaw já roda um dangerous-code scanner, mas a revisão manual é insubstituível para skills com acesso a dados sensíveis.

### 6.4 Rotina de saúde

Rodar `openclaw doctor` após qualquer mudança de config. Rodar `openclaw security audit` semanalmente. Monitorar custos de API via ai_usage_costs ou equivalente do provider.

---

## 7. Otimização de Custos

### 7.1 Roteamento por complexidade

Configurar model fallback no openclaw.json: modelo principal forte (Claude Opus/Sonnet) para tarefas de raciocínio e modelo secundário leve (Haiku, Gemini Flash) para tarefas simples (classificação, formatação, validação).

### 7.2 Controle de tokens

- Skills com trigger específico reduzem tokens injetados por sessão (só carrega o que é relevante)
- MEMORY.md enxuto evita consumo fixo alto
- Docs sob demanda em vez de carregamento automático
- Prompt caching: manter workspace files estáveis entre sessões (cada alteração invalida o cache e gera custo extra)

### 7.3 Monitoramento

Configurar no HEARTBEAT.md um check semanal de custos acumulados com alerta se ultrapassar threshold definido pelo owner.

---

## 8. Checklist de Implementação

### Fase 1: Fundação (Dia 1-3)

- [ ] Instalar OpenClaw e rodar onboard
- [ ] Configurar canal principal (Telegram ou WhatsApp)
- [ ] Escrever SOUL.md com posicionamento claro
- [ ] Escrever USER.md com contexto do owner
- [ ] Escrever AGENTS.md com boot sequence e regras básicas
- [ ] Configurar dmPolicy e allowFrom
- [ ] Rodar openclaw doctor e security audit

### Fase 2: Especialização (Dia 4-10)

- [ ] Criar 2-3 skills iniciais para os domínios prioritários
- [ ] Configurar HEARTBEAT.md com tarefas agendadas básicas
- [ ] Definir protocolo de memória (o que vai para MEMORY.md vs. daily notes)
- [ ] Testar cada skill isoladamente
- [ ] Configurar model fallback para otimização de custos

### Fase 3: Maturação (Dia 11-30)

- [ ] Adicionar camada de validação no AGENTS.md
- [ ] Configurar decomposição automática de tarefas multi-domínio
- [ ] Criar checklists para operações de alto risco
- [ ] Implementar rotina semanal de higiene de memória
- [ ] Configurar backup via git do workspace
- [ ] Primeira auditoria completa de skills, memória e custos

### Fase 4: Escala (Mês 2+)

- [ ] Avaliar setup multi-agent se a complexidade justificar
- [ ] Promover regras maduras do MEMORY.md para SOUL.md ou skills
- [ ] Adicionar canais secundários
- [ ] Refinar triggers de skills com base em falsos positivos
- [ ] Documentar decisões arquiteturais em docs/historico-decisoes.md

---

## 9. Anti-padrões a Evitar

1. **Colocar tudo no prompt do SOUL.md.** Separe identidade (SOUL) de operação (AGENTS) de conhecimento (skills).

2. **Usar MEMORY.md como lixeira.** Ele carrega em toda sessão. Cada linha custa tokens.

3. **Habilitar todas as tools "por precaução".** Cada tool é superfície de ataque e ruído no prompt.

4. **Instalar skills de terceiros sem ler o código.** Um SKILL.md malicioso herda todas as permissões do Gateway.

5. **Ignorar o `/context list`.** Se um arquivo não aparece no context, ele não existe para o agente.

6. **Deixar o Gateway exposto em 0.0.0.0 sem autenticação.** Mais de 30.000 instâncias foram encontradas expostas publicamente.

7. **Tratar o agente como chatbot.** O valor está na autonomia estruturada, não na conversa.

---

## Referências

- Documentação oficial OpenClaw: https://docs.openclaw.ai/
- OpenClaw Skills: https://docs.openclaw.ai/tools/skills
- OpenClaw Memory: https://docs.openclaw.ai/concepts/memory
- OpenClaw Security: https://nebius.com/blog/posts/openclaw-security
- OpenClaw Handbook: https://github.com/codextech/openclaw-handbook
- Framework Iris (Viver de IA): https://framework.viverdeai.ai (acesso restrito a membros)
