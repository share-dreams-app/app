# Prompt - Início da Fase 4

Copie e cole o texto abaixo em um novo chat:

```text
Execute a Fase 4 do projeto Share Dreams usando o plano em /home/leandro-baires/projects/share_dreams/docs/superpowers/plans/2026-04-15-shared-dreams-mvp-implementation.md e o framework em /home/leandro-baires/projects/share_dreams/AGENTS.md.

Regras obrigatórias:
1. Use subagent-driven-development.
2. Siga guard rails de /home/leandro-baires/projects/share_dreams/docs/process/guardrails.md.
3. Siga quality gates de /home/leandro-baires/projects/share_dreams/docs/process/quality-gates.md.
4. Siga matriz de execução de /home/leandro-baires/projects/share_dreams/docs/process/phase-execution-matrix.md.
5. Mantenha escopo estrito da Fase 4 (Task 10 + integração final).
6. Não implemente itens fora de escopo; registre follow-ups no handoff.

Branch da fase:
- Use exatamente: phase/4-ux-analytics-release-gate
- Crie a branch a partir de main atualizada.

Skills e KB obrigatórias:
- Skills: test-driven-development, subagent-driven-development, verification-before-completion, requesting-code-review.
- KB: product source of truth, testing policy e release/rollback.

Critérios de saída da fase:
1. npm run test
2. npm run test:e2e
3. npm run build
4. npm run deploy:preview
5. Cobertura global >= 90% (statements, branches, functions, lines).
6. Readiness de release documentado no handoff.

Entregáveis obrigatórios:
1. Commits na branch da fase.
2. Handoff em /home/leandro-baires/projects/share_dreams/docs/superpowers/handoffs/2026-04-15-phase-4-handoff.md
3. Push da branch.
4. PR para main com .github/pull_request_template.md preenchido.

No final, retorne:
- Resumo do que foi entregue.
- Resultado dos comandos de validação.
- Cobertura global e por arquivos alterados.
- Riscos remanescentes.
- Checklist de release.
```
