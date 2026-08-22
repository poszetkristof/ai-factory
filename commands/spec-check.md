---
description: Audit the code against the specs — where they no longer match, dead links, untraced stories, leakage.
argument-hint: "[docs/NNN-role/00-some-spec.md]"
---

Audit the implementation against the documentation. **Read-only — report, do not fix.**

SCOPE: $ARGUMENTS (empty means all of `docs/`)

This project is built from documents, so the main failure is `docs/` and `src/` no longer saying
the same thing. Nothing else catches it.

Check, in order:

**1. Mismatches.** For each rule a spec states, does the code follow it? Report as
`docs/NNN-role/00-x.md#anchor` → `apps/…/file.ts:line`, and say which side is wrong.

**2. Dangling links.** Every markdown link in `docs/`, `README.md` and `TASKS.md` points at a file
that exists, and every `#anchor` matches a real heading.

**3. Traceability.** Every user story in `docs/200-product/01-user-stories.md` maps to at least one
`TASKS.md` entry, and every epic maps back to a story. Every task cites a spec anchor that exists.

**4. Dependency sanity.** `TASKS.md` dependencies form a DAG — every `Depends on` is an earlier
task, and nothing depends on a task marked `[!]`.

**5. Undocumented code.** Anything substantial in `src/` that no spec section describes. Either the
spec needs a paragraph or the code should not exist.

**6. Leakage.** No PII, no real hostnames, no employer names, no ticket prefixes anywhere in
`docs/` or committed code.

**7. NFR chain.** Every number in `docs/400-architecture/06-nfrs.md` names the check that enforces
it and the CI job that runs it. A number with nothing checking it is a wish, and it counts here.

**8. Factory wiring.** Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/check-wiring.mjs"` and report its output. A file with two
writers, or a read of something no slot produces, is a wiring bug that will look like a subagent
mistake later.

Use the `explore-subagent` for the sweeps — you need `file:line`, not whole files.

Output:

```markdown
## Spec check

**Mismatches**

- `docs/500-engineering/02-web-spec.md#71-api-modules` vs `apps/web/src/lib/api/plants.ts:18` — response not
  parsed with the contract schema

**Dangling links** — file:line → missing target
**Untraced** — user stories with no task, or epics with no story
**Undocumented** — code with no spec section
**Leakage** — file:line
**NFR chain** — numbers with no enforcing check
**Wiring** — output of `check-wiring.mjs`

**Verdict:** everything matches / N mismatches to fix
```

Nothing to report in a section? Write `none` and move on.
