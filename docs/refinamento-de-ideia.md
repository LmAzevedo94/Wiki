---
id: refinamento-de-ideia
title: "Refinamento de Ideia com IA"
sidebar_label: "Refinamento de Ideia com IA"
---

# Refinamento de Ideia com IA

> Antes de escrever uma linha de código, você precisa transformar sua ideia vaga em uma especificação clara. Este guia ensina a usar Claude ou ChatGPT para fazer isso — e sair com o PROJECT_REQUIREMENTS pronto para a IA desenvolver.

---

## Por que refinar antes de construir?

Quando você manda uma ideia vaga para a IA ("quero um sistema para minha empresa"), ela vai adivinhar o que você quer — e quase sempre vai errar. Cada erro custa tempo e créditos.

Quando você chega com uma especificação clara, a IA vai direto ao ponto e entrega certo na primeira vez.

**Regra de ouro:** 1 hora de refinamento economiza 10 horas de retrabalho.

---

## Fase 1 — Explore a ideia com a IA

Abra o Claude (claude.ai) ou ChatGPT e cole este prompt. Não preencha nada — deixe a IA fazer as perguntas.

```
Vou te descrever uma ideia de sistema que quero construir. Sua missão é 
me ajudar a transformar essa ideia em uma especificação técnica clara.

Para isso:
1. Me faça perguntas uma de cada vez para entender melhor o que eu preciso
2. Não assuma nada — sempre pergunte se tiver dúvida
3. Foque em: quem vai usar, o que vai fazer, quais dados armazena e quais 
   regras de negócio existem
4. Quando você sentir que entendeu o suficiente, me apresente um resumo 
   e pergunte se está correto

Minha ideia é: [descreva em 2-3 frases, sem se preocupar com detalhes técnicos]
```

### O que esperar dessa conversa

A IA vai fazer perguntas como:
- "Quem são os tipos de usuário do sistema?"
- "O que acontece quando [situação X]?"
- "Esse dado precisa ser guardado ou só exibido?"
- "Quem pode ver/editar/excluir esse registro?"
- "Qual é o fluxo principal — o que o usuário faz primeiro?"

**Responda com honestidade.** Se não souber, diga "não sei ainda" — isso também é uma informação importante.

---

## Fase 2 — Valide com perguntas difíceis

Após a conversa inicial, peça para a IA desafiar a ideia:

```
Agora que você entendeu o que quero construir, me faça as perguntas difíceis:

1. Quais são os riscos desta ideia?
2. O que eu não pensei que pode dar errado?
3. Quais funcionalidades estou planejando que não são necessárias no MVP?
4. O que é obrigatório ter no lançamento versus o que pode vir depois?
5. Existe alguma regra de negócio que parece simples mas é complexa de implementar?
```

Isso evita construir coisas que você não precisa e identificar problemas antes de começar.

---

## Fase 3 — Gere o PROJECT_REQUIREMENTS

Quando a conversa estiver madura, cole este prompt para gerar o documento final:

```
Com base em tudo que discutimos, gere um PROJECT_REQUIREMENTS.md completo 
usando exatamente este modelo:

---
# PROJECT_REQUIREMENTS — [Nome do Projeto]

## Identidade do Projeto
- **Nome:** 
- **Empresa/Cliente:** 
- **Objetivo:** (em uma frase)
- **Fase atual:** MVP

## Stack Técnico
- Frontend: React + Vite + TypeScript + Tailwind + shadcn/ui
- Backend: Supabase (PostgreSQL + Edge Functions)
- Auth: Supabase Auth
- Deploy Frontend: Netlify
- Deploy Backend: Supabase

## Quem Usa o Sistema (Perfis de Acesso)

### [Perfil 1]
- O que pode fazer:
- O que NÃO pode fazer:

[repetir para cada perfil]

## Funcionalidades — MVP

### Módulo: [Nome]
- [ ] Funcionalidade 1
- [ ] Funcionalidade 2

## Regras de Negócio
- Regra 1:
- Regra 2:

## Dados que o Sistema Armazena

| Dado | Sensível? | Quem acessa |
|------|-----------|-------------|

## Integrações Externas
- [ ] Nenhuma por enquanto
- [ ] [Nome] — [o que faz]

## Questões em Aberto
- ? [dúvida 1]
- ? [dúvida 2]

## Histórico de Alterações
| Data | O que mudou |
|------|-------------|
| [hoje] | Criação do documento |
---

Preencha cada campo com base na nossa conversa. Se algum campo ainda 
está em aberto, coloque "A definir" e adicione nas Questões em Aberto.
```

---

## Fase 4 — Valide o documento gerado

Leia o PROJECT_REQUIREMENTS gerado e faça estas perguntas a si mesmo:

**Sobre os usuários:**
- [ ] Todos os tipos de pessoa que usam o sistema estão listados?
- [ ] As permissões de cada perfil estão claras?
- [ ] Alguém pode fazer algo que não deveria segundo as regras de negócio?

**Sobre as funcionalidades:**
- [ ] O MVP tem só o essencial para lançar?
- [ ] Tem alguma coisa "legal ter" que pode esperar a versão 2?
- [ ] Cada funcionalidade tem um propósito claro?

**Sobre os dados:**
- [ ] Todos os dados que o sistema precisa guardar estão listados?
- [ ] Dados sensíveis (CPF, financeiro, saúde) estão identificados?

**Sobre as regras:**
- [ ] Existe alguma regra de negócio que a IA precisa saber mas não está documentada?
- [ ] Alguém poderia burlar uma regra por descuido da implementação?

Se algo estiver errado, volte para o Claude/ChatGPT e corrija antes de iniciar o desenvolvimento.

---

## Exemplos de conversas de refinamento

### Exemplo 1 — Sistema de agendamento

**Usuário:** Quero um sistema para minha clínica de fisioterapia marcar consultas.

**IA:** Entendi! Vou te fazer algumas perguntas para entender melhor:

*Quem vai usar o sistema? Só você como administradora, ou pacientes também vão acessar para marcar as próprias consultas?*

**Usuário:** Os dois. Eu e minha secretária usamos no computador, e os pacientes vão agendar pelo celular.

**IA:** *Ótimo! Então temos pelo menos 3 perfis: secretária, fisioterapeuta e paciente. Sobre os agendamentos: existe limite de horários por dia? Cada fisioterapeuta tem sua própria agenda ou é uma agenda geral?*

**Usuário:** Cada fisioterapeuta tem a agenda separada. Tenho 3 fisioterapeutas na clínica.

**IA:** *Entendido. Quando um paciente agenda, ele escolhe qual fisioterapeuta quer ou qualquer um disponível?*

... e assim por diante até a especificação estar completa.

---

### Exemplo 2 — Sistema financeiro interno

**Usuário:** Quero controlar as finanças da minha empresa, pagamentos a receber e a pagar.

**IA:** *Vou entender melhor. Você já usa algum sistema hoje (Excel, outro software)? Isso me ajuda a entender o nível de complexidade que você precisa.*

**Usuário:** Só Excel. É uma empresa pequena, 5 funcionários.

**IA:** *Perfeito. Sobre os lançamentos financeiros: você precisa categorizar por tipo de despesa/receita? E sobre aprovações: algum pagamento precisa de aprovação antes de ser confirmado?*

---

## Dicas para uma boa conversa de refinamento

**Seja específico sobre exceções.** Em vez de "o admin pode fazer tudo", diga "o admin pode excluir registros mas não pode alterar registros já aprovados."

**Pense no que não pode dar errado.** Geralmente são os casos que mais importam: o que acontece se dois usuários tentam editar o mesmo registro? O que acontece se o pagamento falhar?

**Não tente resolver tudo no MVP.** Pergunte à IA: "Isso é necessário no lançamento ou pode esperar?" Você vai se surpreender com o quanto pode postergar.

**Documente as decisões.** Quando decidir algo, peça para a IA anotar nas "Regras de Negócio" para não esquecer.

---

## Prompt de refinamento rápido (versão curta)

Se você já tem uma ideia razoavelmente clara e quer ir mais rápido:

```
Preciso criar um sistema de [descreva em 1-2 frases].

Os usuários são:
- [Tipo 1]: [o que faz]
- [Tipo 2]: [o que faz]

As funcionalidades principais são:
- [funcionalidade 1]
- [funcionalidade 2]
- [funcionalidade 3]

Com base nisso, gere um PROJECT_REQUIREMENTS.md completo usando o modelo padrão.
Identifique as questões em aberto que eu ainda preciso responder antes de 
começar a desenvolver.
```

---

## Próximo passo

Com o PROJECT_REQUIREMENTS pronto, volte para o [Guia de Desenvolvimento com IA](/guia-desenvolvimento-ia) e siga a partir do Passo 3 (configurar agentes).
