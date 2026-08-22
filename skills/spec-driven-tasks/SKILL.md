---
name: spec-driven-tasks
description: Execute work from TASKS.md one task at a time — claim, read the cited spec, build exactly the listed files, verify, tick, report. Load whenever the user says "next task", "start the implementation", "continue the backlog", "work through TASKS.md", or names a task ID like T-033 or F-2.2.
---

# Spec-driven task execution

You work a backlog, not a feature request. One task done narrowly and verified beats three done
loosely.

Do it **in this session**. There is no task-running subagent. Only a wide `file:line` sweep is
worth delegating, and that is `explore-subagent`.

## The loop

```
1. Pick     lowest-numbered [ ] task whose dependencies are all [x]
2. Claim    set its status to [~] in TASKS.md
3. Read     the ONE spec section it cites — not the whole docs folder
4. Build    exactly the files in its Files list
5. Verify   run its Verify command; it must pass
6. Close    tick every acceptance box, set status to [x]
7. Continue only if the next sub-task is in the same epic. Otherwise report and STOP.
```

## Two kinds of task

- **`T-0NN` setup** — repo, tooling, CI, contracts, plumbing. Verified on its own.
- **`F-N` epic** — one user story end to end, split into `F-N.1 … F-N.M`. **Not done until the
  feature works on a phone.**

## Checkpoints

| Where | Stop after |
| --- | --- |
| Setup tasks (`T-0NN`) | **every task** |
| Epics (`F-N`) | **the epic**, at its last sub-task — not after each one |
| Any `[!]` blocked task | immediately |

Setup is configuration, where one wrong choice spreads into everything after it. Do not roll past a
checkpoint because the next task looks easy.

## Status markers

`[ ]` todo · `[~]` claimed now · `[x]` done and verified · `[!]` blocked, with a `> **Blocked:**`
note. Update `TASKS.md` in the same change as the work.

## Reading a task

| Field | How to treat it |
| --- | --- |
| **Depends on** | Must all be `[x]`. If not, pick another task |
| **Spec** | Read this section. It _is_ the requirement |
| **Files** | Exhaustive. `{a,b}` is brace expansion — one file each |
| **Acceptance** | Tick only when true _and_ covered by a test |
| **Verify** | Run it. Read the output. It must pass |

Infra tasks add `Cost:`, `Learn:` and `Interview answer:`. Fill them in before ticking.

An epic header carries **"Epic done when: …"**. That sentence is the real acceptance test.

## Rules

- **The Files list is a contract.** Needing an unlisted file means you misread the task or the task
  is wrong. Say so; do not expand scope quietly.
- **Read only the cited spec section.** Reading all of `docs/` invents requirements.
- **Never stub a dependency.** If T-033 depends on T-031, that code works already.
- **Tests ship with the task.** No "add tests later".
- **An ADR outranks your judgement.** If the work contradicts one, stop and name it.
- **No adjacent refactoring**, not even one line. Note it; suggest a task.
- **No invented requirements.** No spinner unless the spec asks for one.
- Follow `docs/500-engineering/00-conventions.md`. Load `coding-standards`, and `testing-patterns`
  before any test.
- **Never `git commit` or `git push`.** Output the message; the user commits.

## Blocked

Blocked means the task cannot be done correctly as written: the spec contradicts itself, a
dependency does not deliver what this task assumes, or a human prerequisite is missing.

```markdown
> **Blocked:** CreatePlantSchema has no `roomId`, but AC 4 needs a light warning per room.
> Derive it from the photo (400-architecture §5) or ask the user at creation time?
```

Not blocked: it is hard, a name is unclear, or a small detail is unspecified but has an obvious
answer. Make the call and note the assumption.

## Report at every checkpoint

```
T-033 — Reminder schedule store  [x]

Built:   apps/web/src/features/reminders/{constants,types,store,index}.ts + store.test.ts
Verify:  npm -w apps/web run test -- reminders  → 11 passed
Commit:  feat: T-033 reminder schedule store
Next:    T-034 (Push subscription store)
```

For an epic, list every sub-task, then the "Epic done when" sentence and whether it holds.
Assumptions get one line each. **Never tick a box you did not satisfy** — say which and why.

## Session end

Nothing left `[~]`. Then run each check and read its exit code:

```bash
npm run format:check && npm run lint && npm run type-check && npm run test
```
