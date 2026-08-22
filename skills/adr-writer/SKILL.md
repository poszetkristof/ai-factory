---
name: adr-writer
description: Write or supersede an Architecture Decision Record — context, decision, consequences, rejected alternatives, and the Agent-Readable Summary with its explicit "do not" clause. Load when a non-obvious technical choice is being made, when the user says "write an ADR", or when a change contradicts an existing record.
---

# Writing an ADR

An ADR is a short file that says what was decided, why, what was rejected, and **what anyone
building here must do about it**. Teams have written the first three parts for years. The fourth is
what makes the record work on an agent.

## When one is needed

Write an ADR when the decision is:

- **hard to reverse** — a data model, a vendor, an auth provider, a public API shape
- **surprising** — the obvious choice was rejected for a reason nobody would guess
- **repeatedly re-litigated** — you have explained it twice already

Do **not** write one for a naming choice, a library with one caller, or anything a line in
`docs/500-engineering/00-conventions.md` covers. An ADR per pull request means the bar is too low
and nobody will read them.

## The shape

Full template in `docs/ADR/README.md`. Six headings, one page, numbered sequentially.

```
# ADR-00NN — Title in the imperative
Status · Date
## Context   what is true that makes this a decision, with evidence
## Decision  what was chosen, and the shape of it
## Consequences   what it buys AND what it costs
## Alternatives considered   what lost, and why
## Agent-Readable Summary    the instruction, with an explicit "do not"
```

## The four rules

**1. The cost section is the point.** If you cannot name a real downside, you have not finished
thinking. "No significant drawbacks" means the alternatives were not taken seriously.

**2. Name what you rejected, and why it lost.** Not a list of names — a sentence each on the thing
that actually decided it. This is the section an interviewer asks about.

**3. The Agent-Readable Summary must contain a "do not".**

```
Good:  All model calls go through `LlmProvider`. Do not import the Anthropic SDK
       anywhere outside `packages/llm/src/adapters/`.

Bad:   We use a provider abstraction for LLM calls.
```

The bad version is a label. An agent can read it, agree with it, and still write the import,
because it was never told not to.

**4. Numbers do not belong here.** An ADR is a decision ("we use DynamoDB"), not a target ("under
2 seconds"). Targets live in `docs/400-architecture/06-nfrs.md`.

## Changing a decision

**Never edit an accepted record.** Write a new one, and mark the old one
`Superseded by ADR-00MM`. Both stay in the repo, so the reasoning history stays readable. Add the
new row to the index table in `docs/ADR/README.md` and update the old row's status.

## When a change contradicts an ADR

Stop. Two possibilities, and only a person picks between them:

1. The change is wrong → fix the change.
2. The decision has expired → a new ADR supersedes it, and *then* the change lands.

Silently writing the code that reverses the decision is not one of the options. Say which ADR, quote
its Agent-Readable Summary, and ask.

## Before you write

Check `docs/ADR/` for an existing record on the same subject. A second ADR on a decided topic is
either a supersession or a duplicate — it is never just another opinion.
