# Prompt - Início da Fase 2

Copie e cole o texto abaixo em um novo chat:

```text
Execute a Fase 2 do projeto Share Dreams usando o plano em /home/leandro-baires/projects/share_dreams/docs/superpowers/plans/2026-04-15-shared-dreams-mvp-implementation.md e o framework em /home/leandro-baires/projects/share_dreams/AGENTS.md.

Regras obrigatórias:
1. Use subagent-driven-development.
2. Siga guard rails de /home/leandro-baires/projects/share_dreams/docs/process/guardrails.md.
3. Siga quality gates de /home/leandro-baires/projects/share_dreams/docs/process/quality-gates.md.
4. Siga matriz de execução de /home/leandro-baires/projects/share_dreams/docs/process/phase-execution-matrix.md.
5. Mantenha escopo estrito da Fase 2 (Tasks 4, 5, 6, 7).
6. Não implemente itens fora de escopo; registre follow-ups no handoff.

Branch da fase:
- Use exatamente: phase/2-core-product-loop
- Crie a branch a partir de main atualizada.

Skills e KB obrigatórias:
- Skills: test-driven-development, systematic-debugging, subagent-driven-development, verification-before-completion.
- KB: product source of truth, API contracts e testing policy.

Critérios de saída da fase:
1. npm run test -- tests/api/me-auth.test.ts tests/api/dreams-create-limit.test.ts tests/api/tasks-create-limit.test.ts tests/api/invite-flow.test.ts tests/api/collaboration-permission.test.ts tests/api/checkin.test.ts tests/api/inactivity-reminder.test.ts
2. Cobertura global >= 90% (statements, branches, functions, lines).

Entregáveis obrigatórios:
1. Commits na branch da fase.
2. Handoff em /home/leandro-baires/projects/share_dreams/docs/superpowers/handoffs/2026-04-15-phase-2-handoff.md
3. Push da branch.
4. PR para main com .github/pull_request_template.md preenchido.

No final, retorne:
- Resumo do que foi entregue.
- Resultado dos comandos de validação.
- Cobertura global e por arquivos alterados.
- Riscos abertos.
- Pré-requisitos da Fase 3.
```
