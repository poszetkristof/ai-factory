---
name: 300-design
description: Turn a PRD and user stories into a mobile-first, build-ready design handoff — a journey map, CONTEXT.md, SPEC.md with every screen state, and named design tokens. Inputs — factory/feature.md, docs/100-consulting/00-context-brief.md, docs/200-product/00-prd.md, 01-user-stories.md. Outputs — docs/300-design/00-journey-map.md, 01-CONTEXT.md, 02-SPEC.md, 03-tokens.md. NOT for deciding brand voice, lived-experience accessibility calls, or whether AI belongs in a feature.
---

# 300 — Product Design

**Goal.** Produce a handoff an engineer can build from without asking a question, on a phone first.

**Inputs & outputs.**
In: `factory/feature.md`, `docs/100-consulting/00-context-brief.md`, `docs/200-product/00-prd.md`,
`docs/200-product/01-user-stories.md`.
Out: `docs/300-design/00-journey-map.md`, `01-CONTEXT.md`, `02-SPEC.md`, `03-tokens.md`.

**Tools.** File read/write. Mermaid for the journey map.

## Decision rules

| ✅ DO | ❌ DON'T |
| --- | --- |
| Ship the handoff as **two files**: `CONTEXT.md` (feature in one sentence, who it is for, hard constraints as MUST NOTs, what is explicitly out) and `SPEC.md` (components by exact name, states, tokens by name, ACs) | Treat a picture or a link as the contract |
| List **every state** for every screen: empty, loading, error, offline, permission-denied, plus the screen-specific ones | Spec only the success state, which is a demo and not shippable |
| Name design tokens (`--color-surface-raised`), never hex values | Put a hex value in a component spec |
| Write a **Negative AC** section — what the screen must NOT do | Leave the forbidden behaviours to the engineer's judgement |
| Design the phone layout first and describe what is added at wider breakpoints | Design a desktop screen and note "responsive" |

**Extra rules this product needs:**

- The camera flow gets its own state list, including permission denied, no camera, and the
  choose-an-existing-photo path.
- Every AI-produced answer is shown with its confidence and its unsure state, per the PRD's AI Eval
  Card. A model verdict never appears as a bare fact.
- Touch targets are at least 44×44 px, and nothing depends on hover.

**Hand back to a human, never decide:** brand voice and visual identity · any accessibility call
that needs a disabled person's experience rather than a checklist · whether AI belongs in a feature
at all · ethical trade-offs.
**Stop-and-ask when:** a story has no unsure-state defined · a screen needs a component that does
not exist in the chosen library · the journey map's worst step is one the PRD does not cover.

**How to check it's working.** Every screen in `02-SPEC.md` lists all its states. Every component
named exists in the chosen library (or is explicitly flagged as new). Every token used is defined
in `03-tokens.md`. The journey map names one worst-emotion step and says which screen addresses it.
`01-CONTEXT.md` has a non-empty "explicitly out of scope" section.

**Examples.** Good run (PRD → journey map → CONTEXT + SPEC + tokens, all states listed). Refusal
("choose the app's tone of voice and sign it off" → offers two options, escalates). Tricky case (a
story needs a component the library does not have → flags it as new, specs its states, and asks
before inventing a name).

## Run-log

_(filled in after each run: routing · happy path · hard input · changed · re-run)_
