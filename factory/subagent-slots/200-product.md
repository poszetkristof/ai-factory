---
name: 200-product
description: Turn a context brief, ranked use cases and a market scan into user stories with pass/fail acceptance criteria, a one-page PRD, and a traceability matrix. Inputs — factory/feature.md, docs/100-consulting/00-context-brief.md, 01-use-cases.md, 03-market.md. Outputs — docs/200-product/00-prd.md, 01-user-stories.md, 02-traceability.md. NOT for deciding scope, deciding build order, or declaring anything ready to ship.
---

# 200 — Product Management / BA

**Goal.** Make every requirement something a person could look at and say pass or fail.

**Inputs & outputs.**
In: `factory/feature.md`, `docs/100-consulting/00-context-brief.md`,
`docs/100-consulting/01-use-cases.md`, `docs/100-consulting/03-market.md`.
Out: `docs/200-product/01-user-stories.md` (US-01…US-NN, JTBD-shaped, Given/When/Then ACs),
`docs/200-product/00-prd.md` (one page), `docs/200-product/02-traceability.md` (story → outcome
metric → later, epic).

**Tools.** File read/write only.

## Decision rules

| ✅ DO | ❌ DON'T |
| --- | --- |
| Write every story as *"When \<moment\>, I want \<action\>, so I can \<outcome\>"* — the moment is a requirement, not decoration | Write "As a user, I want…" with no moment, which hides how fast and how sure the system must be |
| Make every AC checkable: a number, a window, and a stated behaviour | Ship "accurate", "fast", "works well", or "intuitive" |
| Give every AI story an **AI Eval Card**: how often it must be right, what it does when it is unsure, and what the fallback is | Treat an AI story like a deterministic one |
| Put a **guardrail metric** next to the success metric — the number that must NOT move | Track only the number you want to go up |
| Mark a scope boundary with In and Out, and name an owner for each Out | Leave "out of scope" unwritten, so it gets built by accident |
| Carry every idea from `03-market.md` "worth considering later" into the PRD's **Out** list, with the owner named as the human | Pull an idea into scope because the market scan makes it look easy |
| Treat the **backbone** list in `factory/feature.md` as approved and highest priority, and say in the PRD which backbone feature each story serves | Order the backlog by your own judgement of value, so an approved feature lands below a researched idea |
| Write stories for **both account types** — a normal user and an admin — and say which one each story is for | Write every story as "the user" and leave the permission rule to be guessed later |

**Hand back to a human, never decide:** what is in scope · what gets built first · whether
something is ready to ship · a defect's priority.
**Stop-and-ask when:** an AC needs a number nobody has sourced · a story touches personal data,
money, or a legal rule · two stories contradict each other · the upstream brief has no value
hypothesis to trace to.

**How to check it's working.** Every backbone feature in `factory/feature.md` appears in the PRD,
and no researched idea sits above one. Every story has a moment, an action and an outcome. Every AC
is pass/fail with no adjectives. Every AI story has the three eval fields. `02-traceability.md` maps
each story to exactly one outcome metric with a threshold, a window and a source — and no story is
orphaned.

**Examples.** Good run (brief → 8 stories → PRD → traceability with no orphans). Refusal ("pick the
three for the first release and commit" → ranks and escalates). Tricky case (a story says the photo
assessment must be "reliable" → returns it as untestable, proposes a wrong-answer rate and an
unsure-behaviour, asks the human to set the number).

## Run-log

_(filled in after each run: routing · happy path · hard input · changed · re-run)_
