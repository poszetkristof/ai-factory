---
name: 400-architecture
description: Turn a PRD and design handoff into three scored options, a chosen direction, a C4 L1+L2 pack in Mermaid, a timed flow, ADRs with Agent-Readable Summaries, NFR budgets with test approaches, and a fresh-session pre-mortem. Inputs — factory/feature.md, docs/100-consulting/00-context-brief.md, docs/200-product/00-prd.md, 01-user-stories.md, docs/300-design/01-CONTEXT.md, 02-SPEC.md. Outputs — docs/400-architecture/*, docs/ADR/*.md. NOT for the final option sign-off, accepting an architectural risk, irreversible migrations, or writing application code.
---

# 400 — Architecture

**Goal.** Turn an ambiguous problem into options, a chosen direction with evidence, and the
decisions and numbers a build can run against.

**Inputs & outputs.**
In: `factory/feature.md`, `docs/100-consulting/00-context-brief.md`, `docs/200-product/00-prd.md`,
`docs/200-product/01-user-stories.md`, `docs/300-design/01-CONTEXT.md`, `02-SPEC.md`.
Out: `docs/400-architecture/00-options.md`, `01-context.mmd`,
`02-containers.mmd`, `03-flow-plant-check.md`, `05-patterns.md`, `06-nfrs.md`,
`07-adversarial.md`, and `docs/ADR/00NN-*.md`.

**Tools.** File read/write. Mermaid for C4 and sequence diagrams. Web for C4 notation, named
patterns, standards and RFCs, and benchmark ranges. Cite the source and the date for anything you
write as fact.

## Decision rules

| ✅ DO | ❌ DON'T |
| --- | --- |
| Generate **≥3 options** that differ on something that really changes the answer (serverless vs container, single-table vs relational, one AI call vs a chain) **before any diagram** | Draw a C4 diagram before a direction is chosen |
| Score options on ≥3 constraints that actually diverge — free-tier fit, cold-start latency, operability by one person, lock-in | Score everything on "scalability" so the winner is arbitrary |
| Give every NFR a number, a window, a **test approach**, and the CI job that enforces it | Ship a band, a "TBD", or a number with nothing checking it |
| Give every ADR an **Agent-Readable Summary** with an explicit "do not" clause | Record an ADR as a label with no constraint |
| Mark a number you could not source as **a guess**, in the table, in writing | Let a guessed number read as a commitment |
| Justify the AI shape against the ladder — plain code → one AI call → fixed chain → agent — and pick the simplest that works | Reach for an agent because the project is about AI |
| Draw diagrams as `.mmd` text in the repo, and check every box has at least one arrow | Describe a connection in prose that no arrow actually draws |
| Write an ADR for every choice that is **hard to undo later**: how sign-in works, where the data lives, which model provider, how the two account types are enforced | Take a technology named in an input as decided, and skip the comparison |
| Research the sign-in choice properly — name the protocol and the flow, say where tokens are stored and why, and cite the standard | Write "we use OAuth2" with no flow, no token storage rule, and no rejected option |

**Two budgets this project cannot skip:** cost per AI call, and how often the answer is right.
Both go in `06-nfrs.md` with a test approach. On a free AWS account, cost is a correctness
property — the account closes rather than billing.

**Hand back to a human, never decide:** the final option choice · accepting an architectural risk ·
any irreversible data migration or cutover · trade-off arbitration when two concerns compete ·
accepting the architecture as ready to build against.
**Stop-and-ask when:** two options score within one point and the choice is not defensible · an NFR
has no test approach · a decision would need money spent · the design needs data the brief says
does not exist.

**How to check it's working.** `00-options.md` holds ≥3 genuinely divergent options, a matrix
scored on ≥3 constraints, and a chosen option with a two-sentence rationale that points back at the
scoring. `02-containers.mmd` matches the chosen option and every box has an arrow. The milliseconds
in `03-flow-plant-check.md` add up to the stated total. Every ADR ends in a "do not". Every NFR row
names its test. There is an ADR for sign-in and an ADR for how the two account types are enforced,
each naming the protocol or the mechanism, the rejected option, and the "do not" clause.

**07-adversarial.md is written by a fresh session.** Hand it only `docs/400-architecture/` with no
conversation history and ask it to break the design. The session that built a design defends it.

**Examples.** Good run (brief → 3 options → choice → C4 → ADRs → NFRs → pre-mortem). Refusal
("commit to option A and sign off the data-retention boundary" → recommends, escalates the sign-off).
Tricky case (the input names DynamoDB already → asks for the access patterns first, generates
options from those, and says out loud which pattern does not fit).

## Run-log

_(filled in after each run: routing · happy path · hard input · changed · re-run)_
