# Prompt - Início da Fase 1

Copie e cole o texto abaixo em um novo chat:

```text
Execute a Fase 1 do projeto Share Dreams usando o plano em /home/leandro-baires/projects/share_dreams/docs/superpowers/plans/2026-04-15-shared-dreams-mvp-implementation.md e o framework em /home/leandro-baires/projects/share_dreams/AGENTS.md.

Regras obrigatórias:
1. Use subagent-driven-development.
2. Siga guard rails de /home/leandro-baires/projects/share_dreams/docs/process/guardrails.md.
3. Siga quality gates de /home/leandro-baires/projects/share_dreams/docs/process/quality-gates.md.
4. Siga matriz de execução de /home/leandro-baires/projects/share_dreams/docs/process/phase-execution-matrix.md.
5. Mantenha escopo estrito da Fase 1 (Tasks 1, 2, 3).
6. Não implemente itens fora de escopo; registre follow-ups no handoff.

Branch da fase:
- Use exatamente: phase/1-foundation-persistence
- Se não existir, crie a partir de main atualizada.

Skills e KB obrigatórias:
- Skills: test-driven-development, subagent-driven-development, verification-before-completion.
- KB: product source of truth, ADR de stack/plataforma e testing policy.

Critérios de saída da fase:
1. npm run test -- tests/api/health.test.ts tests/domain/limits.test.ts tests/domain/permissions.test.ts tests/api/dream-repository.test.ts
2. npx prisma generate && npx prisma db push (Supabase dev)
3. Coverage report configurado para as próximas fases.

Entregáveis obrigatórios:
1. Commits na branch da fase.
2. Handoff em /home/leandro-baires/projects/share_dreams/docs/superpowers/handoffs/2026-04-15-phase-1-handoff.md
3. Push da branch.
4. PR para main com .github/pull_request_template.md preenchido.

No final, retorne:
- Resumo do que foi entregue.
- Resultado dos comandos de validação.
- Riscos abertos.
- Pré-requisitos da Fase 2.
```
