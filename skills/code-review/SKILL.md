---
name: code-review
description: Read-only seven-lens review of the current branch's diff against main. Optional focus area and optional spec file to cross-check. Never runs tests, lint or typecheck, and never edits files.
argument-hint: "[bugs|security|accessibility|idioms|tests|contracts|all] [path/to/spec.md]"
---

# Code review

FOCUS: $1 (default `all`) · SPEC: $2 (optional)

## Hard rules

1. **No edits.** Not one character.
2. **No tooling.** No tests, lint, type-check or build. You are reading.
3. **Diff scope only.** Old problems in untouched code are out of scope.
4. **Every finding starts with `path/file.ts:line`.**
5. **If this session wrote the diff, say so at the top.** A fresh session reviews better.

## The diff

The `cache-branch-diff` hook fills these first. If `branch.base` is empty the hook found no base
branch — say so and stop, rather than reviewing nothing.

Base: !`node -e "const fs=require('fs');try{process.stdout.write(fs.readFileSync('.claude/cache/branch.base','utf8')||'(none found)')}catch{process.stdout.write('(no cache)')}"`

Files: !`node -e "const fs=require('fs');try{process.stdout.write(fs.readFileSync('.claude/cache/branch.files','utf8'))}catch{}"`

Stat: !`node -e "const fs=require('fs');try{process.stdout.write(fs.readFileSync('.claude/cache/branch.stat','utf8'))}catch{}"`

Patch: !`node -e "const fs=require('fs');try{process.stdout.write(fs.readFileSync('.claude/cache/branch.patch','utf8'))}catch{}"`

No cache at all? Fall back to `git diff $(git rev-parse --verify --quiet main || echo master)...HEAD`.

## Load as the diff requires — say which you loaded

| Diff touches | Load |
| --- | --- |
| Any `.ts` / `.tsx` | `coding-standards` |
| Auth, uploads, user input, AI calls | `security` |
| JSX, ARIA, forms, dialogs | `accessibility` |
| Any test | `testing-patterns` |
| `packages/contracts` | `docs/500-engineering/01-contracts.md` |
| `infra/` | `docs/800-infra/02-cost-guardrails.md` |

Need to know if a pattern appears elsewhere? Use `explore-subagent`. Do not read twenty files.

## The seven lenses — work in order

1. **Behaviour preservation.** What did this quietly stop doing? Ask of every deletion: what was it
   for?
2. **Hidden assumptions.** A hardcoded number, an assumed order, an assumed non-empty array, an
   assumed image size. Each is a bug or a missing line in the spec.
3. **Spec and ADR conflict.** Does it contradict a spec section or an ADR's "do not" line? Name the ADR.
4. **Independent tests.** Were tests written from the requirement or from the code? A test that
   mirrors the code proves nothing. **Most skipped, most valuable.**
5. **Edge cases.** Empty, one, many. Null, zero, empty string. Offline, timeout, concurrent calls.
6. **Security and tool surface.** New input reaching an old sink. A client check with no server
   counterpart. **A new tool the model can call is an architecture change, not a feature.**
7. **Over-engineering.** Abstraction with one caller, wrapper adding nothing, premature generic.

## Also check

- **Bugs** — off-by-one, wrong operator, unhandled null, floating promise, missing `await`, stale
  closure, race between concurrent requests.
- **Types** — `any`, unsound cast, `!` hiding a real null, bare string where a const object exists,
  `interface` instead of `type`, wire type outside `packages/contracts`.
- **Layers** — service importing `Request`/`Response` or the data client · controller reaching past
  the service · component importing `lib/api` · `"use client"` on a whole tree · a model call not
  going through `LlmProvider` · a frontend check with no server counterpart.
- **Errors** — a `catch` ending outside the two funnels, 5xx detail reaching a user, a stack or ARN
  in a response body.
- **Cost** — an AI call with no rate limit, timeout or token cap. A DynamoDB `Scan`. Here cost is
  correctness: the free account closes rather than billing.
- **Change size** — unrelated changes bundled together. Say so.

## Severity

| | Meaning |
| --- | --- |
| 🔴 **Critical** | Breaks production, leaks data, bypasses auth, or drains the account. Verify the path first |
| 🟡 **Major** | Wrong behaviour in a realistic case, or a boundary break that will spread |
| 🔵 **Minor** | Style, naming, a missing test on a low-risk path |
| ✅ **Good** | Worth naming. Say why |

Cannot show the failing input? It is Major at most, never Critical.

## Output

```markdown
## Review — <branch>

Skills loaded: … · Written by this session: yes/no

**Summary** — one paragraph: what it does, and whether it is sound.
**Spec coverage** — only if a spec was given. Requirement → covered / partial / missing.

### 🔴 Critical
**`apps/api/src/modules/plants/plants.service.ts:42`** — no per-user rate limit, so one account can
spend the whole monthly model budget in a minute.
_Failing case:_ 500 `POST /plants/<id>/assess` in a loop → 500 model calls, no throttle.
_Fix:_ the per-user limiter from 800-infra §3 and the daily cap from 06-nfrs row 4.
_Lens:_ 6.

### 🟡 Major / 🔵 Minor / ✅ Good
…

**Verdict:** Approve / Approve with changes / Needs work — one line why.
```

Nothing wrong? Say so plainly and keep the ✅ section. Do not invent findings.
