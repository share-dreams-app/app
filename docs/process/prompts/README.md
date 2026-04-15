# Prompts de Execução por Fase

Use os prompts abaixo em ordem, abrindo um novo chat para cada fase.

## Ordem recomendada

1. `docs/process/prompts/phase-1-start.md`
2. `docs/process/prompts/phase-2-start.md`
3. `docs/process/prompts/phase-3-start.md`
4. `docs/process/prompts/phase-4-start.md`

## Regra de transição entre fases

Só iniciar a próxima fase quando a fase atual tiver:

1. Exit checks verdes.
2. Handoff note gerado em `docs/superpowers/handoffs/`.
3. Branch da fase publicada.
4. PR aberto para `main` com template preenchido.
5. PR da fase mergeado.

## Premissas globais

- Seguir `AGENTS.md`.
- Seguir `docs/process/guardrails.md`.
- Seguir `docs/process/quality-gates.md`.
- Seguir `docs/process/phase-execution-matrix.md`.
- Seguir `docs/superpowers/plans/2026-04-15-shared-dreams-mvp-implementation.md`.
