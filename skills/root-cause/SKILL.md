---
name: root-cause
description: Diagnose a bug and state the hypothesis BEFORE editing anything. Use when the user reports a bug, a failing test, or unexpected behaviour and you need to know why before you fix it.
---

# Root cause

BUG: $ARGUMENTS

The rule: **understand before you edit.** A fix applied at the wrong layer usually works and leaves
the real defect in place, ready to reappear somewhere else.

## Rules

1. **No edits until the diagnosis is stated.** Reading and running read-only commands is fine.
2. **No `lint:fix`, no formatter.** They rewrite files and destroy the evidence.
3. **No guessing.** If you cannot trace it, say what you would need to see.

## Steps

**1. Restate the symptom precisely.** What was expected, what happened, where observed. "It's
broken" is not a symptom.

**2. Reproduce it.** A failing test, an exact request, or an exact sequence of clicks. If you
cannot reproduce it, that is the first finding — say so.

**3. Trace the data.** Follow the value from where it enters to where it goes wrong. Name each hop
with `file:line`. The bug lives at the hop where an invariant first breaks — not where it becomes
visible.

Boundaries worth checking in this repo:

| Boundary                | Common failure                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------ |
| URL → validation pipe   | coercion or default not applied; reading the raw query instead of the parsed one     |
| pipe → service          | schema allows something the business rule does not                                   |
| service → repository    | date/ISO conversion, or a rule that leaked into the repository                       |
| API → client            | error not problem+json, so the error helper finds nothing to show                    |
| server → client boundary | data fetched on the server but the component is `"use client"`, so it refetches      |
| model → parser          | the response did not match the schema and the fallback swallowed it silently         |
| sign-out → next session | state not cleared, so the next user sees the previous one's data                     |
| test → test             | a mock or a timer not restored, so it leaks forward                                  |

**4. Name the layer.** Say explicitly which layer is wrong. If the symptom is in the view but the
cause is in the schema, fix the schema.

**5. For a failing test:** decide whether the test or the source is wrong, and say which before
touching either. Default in this repo is that the **test** is wrong — unless the user says
otherwise.

## Output

```markdown
## Root cause — <symptom>

**Symptom:** expected X, got Y, at `path:line`.

**Reproduction:** exact steps or the failing test.

**Trace**

1. `apps/web/src/views/…:31` — value enters as …
2. `apps/api/src/middleware/validate.ts:18` — parsed to …
3. `apps/api/src/modules/…/service.ts:44` — **invariant breaks here**: …

**Root cause:** one sentence.

**Wrong layer?** Where the symptom shows vs where the defect is.

**Proposed fix:** smallest change that fixes the cause, plus the test that would have caught it.

**Awaiting approval.**
```

## Anti-patterns

- Fixing the symptom at the point of display.
- Adding a defensive guard to hide a value that should never have arrived.
- Editing three files at once and hoping.
- Rerunning the test with a longer `await` until it passes.
