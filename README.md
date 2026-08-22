# ai-factory

A **Claude Code plugin**. It holds a delivery line of eight role subagents that turn one feature
description into a full specification pack, before any code is written.

The line is the reusable part of the method. It knows nothing about any one product, so it can run
on any project. The product it was built for lives in a separate repository.

## What is in here

```
agents/              The eight roles, plus a search helper. GENERATED — never edit by hand
commands/            /start /factory-run /run-role /next-task /spec-check /learn
skills/              adr-writer, code-review, root-cause, spec-driven-tasks
hooks/               cache-branch-diff.mjs, wired in hooks.json
factory/             The source of truth
  handoff-map.yaml     Run order, and who may read whose output
  subagent-registry.yaml  Who writes which file
  subagent-slots/      The eight role contracts. Edit these, not the agents
  runs/_templates/     Blank forms for a run record, seam ledger and human gates
scripts/             The checks and the generator
```

## The eight roles

`100-consulting → 200-product → 300-design → 400-architecture → 500-engineering → 800-infra →
900-security → 600-qa`

Run order is role order, not number order. Infra runs before Security because Security reviews the
infra surface. QA runs last because a real test plan needs the engineering, infra and security
documents already written.

A role reads **only** the files listed under its `reads:` key in `handoff-map.yaml`. That is the
point. A gap upstream becomes a visible stop, not a silently invented guess.

## Install it into a project

Add the plugin, then commit one file so every clone gets it:

```json
// .claude/settings.json in the project repo
{ "enabledPlugins": ["ai-factory"] }
```

The project repo still needs its own `CLAUDE.md`. A plugin cannot supply one.

## The two run inputs

Every run starts from two files that live in the **project**, not here:

- `factory/feature.md` — the one feature this run covers
- `initial-plan.md` — the starting context

## Working on the line

**Never edit `agents/*.md`.** They are generated from `factory/subagent-slots/` and
`factory/handoff-map.yaml`. Edit the source, then regenerate:

```bash
node scripts/derive-agents.mjs         # regenerate agents/ from the slot contracts
node scripts/check-wiring.mjs          # single writer, no dangling reads, correct order
node scripts/line-state.mjs            # which roles have run, what stage the project is in
node scripts/role-inputs.mjs <id>      # what one role may read, and what is missing
```

CI runs the first two on every push and fails if `agents/` is out of date.

Inside this repo, run the wiring check with `--wiring-only`. The run inputs live in a project, so
they are correctly absent here:

```bash
node scripts/check-wiring.mjs --wiring-only
```

## Two roots

The scripts read from two places, and both fall back to the working directory:

| Variable | Points at | Holds |
| --- | --- | --- |
| `CLAUDE_PLUGIN_ROOT` | this plugin | the handoff map, the slot contracts, the agents |
| `CLAUDE_PROJECT_DIR` | the project being built | `docs/`, `TASKS.md`, `factory/feature.md`, the run folders |

That split is why one line can run on many projects.
