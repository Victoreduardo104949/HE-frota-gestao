---
name: project-continuity
description: >
  Garante continuidade entre sessões de desenvolvimento no OpenCode.
  Use esta skill SEMPRE que estiver encerrando uma sessão de trabalho,
  finalizando modificações em um projeto, ou precisando passar contexto
  para outro agente/sessão. Também deve ser usada quando o usuário pede
  "crie um handoff", "escreva as próximas instruções", "passe para o
  próximo agente", "salve o contexto do projeto", "resuma o que foi feito",
  "deixe instruções para continuar depois", "como continuo de onde parou",
  ou qualquer variação. Gera um arquivo AGENT_HANDOFF.md estruturado na
  raiz do projeto com estado atual, decisões, pendências e instruções
  prontas para o próximo agente carregar como contexto.
---

# Project Continuity Skill

Garante que nenhum contexto se perca entre sessões de desenvolvimento. Ao final de qualquer
trabalho em um projeto, esta skill produz um arquivo `AGENT_HANDOFF.md` completo e imediatamente
utilizável pelo próximo agente ou sessão.

## Quando usar

- Ao **encerrar** qualquer sessão de modificação de código
- Quando o usuário pede para "passar para o próximo agente"
- Ao atingir o limite de contexto da janela atual
- Quando uma tarefa complexa precisa ser dividida em sessões
- Antes de trocar de branch ou contexto de trabalho
- Quando outro desenvolvedor (humano ou agente) vai continuar o trabalho

---

## Processo

### Passo 1 — Auditar o Estado Atual

Antes de gerar o handoff, faça um levantamento completo do que foi feito na sessão:

- Ver arquivos modificados (se for repositório git)
- Ver estrutura do projeto

Se não for repositório git, liste os diretórios relevantes manualmente.

### Passo 2 — Coletar Contexto Técnico

Extraia informações do projeto para embasar as instruções:

- Verificar package.json / pyproject.toml / Cargo.toml / go.mod
- Ver scripts disponíveis
- Verificar se há testes, CI, linters

### Passo 3 — Identificar o Que Foi Feito

Para cada arquivo modificado na sessão:
1. Leia o arquivo e entenda a mudança
2. Registre: **o quê** foi alterado, **por quê**, e **qual impacto** tem
3. Identifique dependências entre mudanças

### Passo 4 — Mapear Pendências e Próximos Passos

Classifique o que ainda falta em três categorias:

| Categoria | Descrição |
|-----------|-----------|
| 🔴 **BLOQUEANTE** | Deve ser feito antes de qualquer outra coisa |
| 🟡 **PRIORITÁRIO** | Necessário para fechar o objetivo da sessão |
| 🟢 **DESEJÁVEL** | Melhoria ou refatoração futura |

### Passo 5 — Gerar o AGENT_HANDOFF.md

Escreva o arquivo na raiz do projeto com a estrutura abaixo. O conteúdo deve ser
**específico o suficiente para que um agente recém-iniciado execute sem perguntas**.

---

## Template do AGENT_HANDOFF.md

```markdown
# 🤝 Agent Handoff — [Nome do Projeto]

> Gerado em: [data/hora]  
> Sessão encerrada por: [nome da tarefa ou objetivo]

---

## 🎯 Objetivo Desta Sessão

[Uma frase clara: o que esta sessão estava tentando fazer]

**Status:** [✅ Concluído | 🔄 Em progresso | ⚠️ Parcialmente concluído]

---

## ✅ O Que Foi Feito

### [Arquivo ou componente 1]
- **Mudança:** [descrição objetiva do que foi alterado]
- **Motivo:** [por que essa mudança foi necessária]
- **Impacto:** [o que isso afeta no sistema]

### [Arquivo ou componente 2]
- **Mudança:** ...
- **Motivo:** ...
- **Impacto:** ...

---

## 🚨 Problemas Encontrados

> Liste qualquer bug, limitação ou workaround feito durante a sessão.

- **[Problema 1]:** [descrição] → [como foi resolvido ou por que não foi]
- **[Problema 2]:** ...

Se nenhum: `Nenhum problema crítico identificado.`

---

## 📋 Próximos Passos

### 🔴 Bloqueante (faça primeiro)
1. [ ] [tarefa com contexto suficiente para executar]
   - Arquivo: `path/to/file.ts`
   - Contexto: [por que é bloqueante]

### 🟡 Prioritário
2. [ ] [próxima tarefa importante]
3. [ ] [outra tarefa]

### 🟢 Desejável (pode deixar para depois)
4. [ ] [refatoração ou melhoria]

---

## 🧠 Contexto Técnico Crítico

> Informações que o próximo agente PRECISA saber para não cometer erros.

### Decisões de Arquitetura
- [Decisão tomada e por quê — inclua alternativas descartadas se relevante]

### Convenções do Projeto
- [padrão de nomenclatura, estrutura de pastas, etc.]

### Gotchas e Armadilhas
- [algo que pode dar errado se ignorado]

### Variáveis de Ambiente / Configuração
- `VARIAVEL_X`: [para que serve, valor esperado]

---

## 🛠️ Como Continuar

### Setup (se necessário)
```
npm install          # ou pip install -r requirements.txt, etc.
npm run dev          # comando para iniciar
```

### Primeira Ação Recomendada
```
[Instrução literal para o próximo agente começar, ex:]
"Abra o arquivo `src/services/auth.ts` e implemente o método `refreshToken`
seguindo o padrão do método `login` já existente. Veja os comentários TODO
na linha 47."
```

### Comandos de Verificação
```
npm test
npm run lint
npm run build
```

---

## 📁 Arquivos Relevantes

| Arquivo | Relevância |
|---------|-----------|
| `path/to/main.ts` | Ponto de entrada, modificado nesta sessão |
| `path/to/config.ts` | Configuração central — não alterar sem revisar dependências |
| `path/to/types.ts` | Interfaces compartilhadas — adicionados N tipos novos |

---

## 💬 Prompt de Contexto Rápido

> Copie e cole isso no início da próxima sessão do OpenCode:

```
Estou continuando o desenvolvimento de [Nome do Projeto].
Leia o arquivo AGENT_HANDOFF.md na raiz do projeto e confirme que entendeu
o estado atual antes de começar qualquer modificação.
Objetivo da próxima sessão: [próximo passo bloqueante].
```

---

*Este arquivo foi gerado automaticamente pelo skill `project-continuity`.*
*Mantenha-o atualizado ao final de cada sessão.*
```

---

## Regras de Qualidade

O AGENT_HANDOFF.md gerado DEVE:

- ✅ Ter **caminhos de arquivo completos** (ex: `src/components/Button.tsx`, não só `Button`)
- ✅ Ter **números de linha** quando referenciar algo específico
- ✅ Incluir **comandos executáveis** prontos para rodar (não pseudocódigo)
- ✅ Explicar **decisões** tomadas, não só ações
- ✅ Ser **específico ao projeto** — sem linguagem genérica vaga
- ✅ Listar **dependências entre tarefas** (B depende de A estar feito)
- ✅ Incluir o **prompt de contexto rápido** no final (copiável)

O AGENT_HANDOFF.md NÃO deve:

- ❌ Ser genérico a ponto de servir para qualquer projeto
- ❌ Omitir problemas ou workarounds encontrados
- ❌ Usar linguagem ambígua como "melhorar X" sem especificar como
- ❌ Assumir que o próximo agente tem contexto desta sessão

---

## Finalização

Após salvar o `AGENT_HANDOFF.md`, avise o usuário:

> "O arquivo `AGENT_HANDOFF.md` foi salvo na raiz do projeto.
> Na próxima sessão do OpenCode, peça ao agente para ler o `AGENT_HANDOFF.md`."

Se necessário, sugira adicionar `AGENT_HANDOFF.md` ao `.gitignore` se contiver
informações sensíveis.

---

## Modo Compacto (Sessões Frequentes)

Quando o usuário pede um handoff rápido ou a sessão foi curta, use o template compacto:

```markdown
# Handoff Rápido — [data]

**Objetivo:** [uma linha]
**Status:** [✅/🔄/⚠️]

**Feito:**
- [item]

**Próximo:**
1. [ ] [ação imediata com arquivo e contexto]

**Contexto crítico:** [uma observação importante]

**Para continuar:** `[comando ou instrução literal]`
```

Use o modo compacto quando:
- A sessão durou menos de 30 minutos
- Poucas mudanças foram feitas (1-3 arquivos)
- O usuário pede "handoff rápido" ou "resumo curto"

Use o template completo para tudo mais.
