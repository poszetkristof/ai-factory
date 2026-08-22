---
name: 500-engineering
description: Turn a chosen architecture and design handoff into the specs a build runs against — conventions, the shared contracts package, the web spec and the API spec, plus the warm context file. Inputs — docs/200-product/01-user-stories.md, docs/300-design/02-SPEC.md, 03-tokens.md, docs/400-architecture/00-options.md, 02-containers.mmd, 06-nfrs.md, docs/ADR/. Outputs — docs/500-engineering/00-conventions.md, 01-contracts.md, 02-web-spec.md, 03-api-spec.md, docs/context/stack.md. NOT for writing application code, accepting a new dependency, or reversing an ADR.
---

# 500 — Engineering

**Goal.** Write the specs precisely enough that a coding agent building from them does not have to
guess, and a reviewer who was not in the session can tell whether the result is correct.

**Inputs & outputs.**
In: `docs/200-product/01-user-stories.md`, `docs/300-design/02-SPEC.md`, `03-tokens.md`,
`docs/400-architecture/00-options.md`, `02-containers.mmd`, `06-nfrs.md`, `docs/ADR/`.
Out: `docs/500-engineering/00-conventions.md`, `01-contracts.md`, `02-web-spec.md`,
`03-api-spec.md`, `docs/context/stack.md`.

**Tools.** File read/write.

## Decision rules

| ✅ DO | ❌ DON'T |
| --- | --- |
| Put every wire type in `packages/contracts` as a Zod schema, and say so as a rule with no exceptions | Let an app declare a response type of its own |
| Write the layer boundaries as **import-permission tables**, and name the lint rule that enforces each | Write "keep layers clean" and hope |
| Spec the failure path of every external call — timeout, retry cap, fallback, what the user sees | Spec only the success path |
| Keep `docs/context/stack.md` (warm layer) complete and short: language, framework versions, build tool, test runner, the architectural constraints, and the known gotchas | Let repo facts leak into a skill, which is supposed to work on any repo |
| Point at the ADR whenever a rule exists because of a decision | Restate a decision, so the two stop matching |

**The per-feature flow this project builds by:** `spec → plan → tasks → implementation`, one review
checkpoint each. Materialised as `specs/<feature>/{spec.md, plan.md, nfr.yml}`. `nfr.yml` is
machine-readable so CI can read the targets rather than a human remembering them.

**The living-spec test:** could a reviewer who was not in the session read the spec and tell whether
the pull request is correct? If not, the spec is not done.

**Hand back to a human, never decide:** accepting a new dependency · adding any new tool the model
may call · reversing an ADR · anything that changes the public API shape after it ships.
**Stop-and-ask when:** the design spec needs an API the architecture does not have · two ADRs
conflict · an NFR has no place in the code where it could be enforced.

**How to check it's working.** Every user story maps to at least one endpoint in `03-api-spec.md`
and one screen in `02-web-spec.md`. Every schema in `01-contracts.md` is used by both sides. Every
NFR from `06-nfrs.md` has a named enforcement point. `docs/context/stack.md` fits on two screens
and contains no rule that belongs in a skill.

**Examples.** Good run (architecture + design → four specs with no orphaned story). Refusal ("add
a queue library and spec it in" → names it as a new dependency, escalates). Tricky case (design
needs a field the contracts do not have → adds it to the contract spec and flags the change as
crossing the wire, rather than adding it app-side).

## Run-log

_(filled in after each run: routing · happy path · hard input · changed · re-run)_
