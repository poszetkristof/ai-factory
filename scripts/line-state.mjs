#!/usr/bin/env node
// Prints the real state of the delivery line, read off disk. Used by /start and /factory-run.
//
//   node scripts/line-state.mjs

import { readFileSync, readdirSync, existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

// The line sits next to this script; the state it reports belongs to the project.
const FACTORY_ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const PROJECT_ROOT = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
const inProject = (p) => existsSync(join(PROJECT_ROOT, p))

const map = readFileSync(join(FACTORY_ROOT, "factory/handoff-map.yaml"), "utf8")
const reg = readFileSync(join(FACTORY_ROOT, "factory/subagent-registry.yaml"), "utf8")

// Per-feature outputs live under the run slug. Without this every such role reads as not done,
// and /start names a role that already ran as the next one.
const SLUG = existsSync(join(PROJECT_ROOT, "factory/feature.md"))
  ? (readFileSync(join(PROJECT_ROOT, "factory/feature.md"), "utf8").match(/\*\*Run slug:\*\*\s*`([^`]+)`/)?.[1] ?? null)
  : null
const resolve = (p) => (SLUG ? p.replaceAll("{feature}", SLUG) : p)

/** `- item` lines directly under `key:`, stopping at the first line that is not one. */
function listUnder(text, key, indent) {
  const pad = " ".repeat(indent)
  const start = text.indexOf(`${pad}${key}:`)
  if (start === -1) return []
  const out = []
  for (const line of text.slice(start).split("\n").slice(1)) {
    if (line.trim() === "" || line.trim().startsWith("#")) continue
    if (!line.startsWith(`${pad}  - `)) break
    out.push(line.slice(pad.length + 4).trim().replace(/^"|"$/g, ""))
  }
  return out
}

const order = listUnder(map, "execution_order", 0)

console.log("Roles:")
let nextRole = null
for (const id of order) {
  const at = reg.indexOf(`- id: "${id}"`)
  const writes = listUnder(reg.slice(at), "writes", 4).filter((p) => !p.includes("*"))
  const done = writes.length > 0 && writes.every((p) => inProject(resolve(p)))
  if (!done && nextRole === null) nextRole = id
  console.log(`  ${done ? "[x]" : "[ ]"} ${id}`)
}

const has = (p) => (inProject(p) ? "yes" : "no")
console.log(`\nBuild stage:\n  TASKS.md: ${has("TASKS.md")}   README.md: ${has("README.md")}   package.json: ${has("package.json")}`)

let runs = []
try {
  runs = readdirSync(join(PROJECT_ROOT, "factory/runs")).filter((x) => x !== "_templates")
} catch {
  /* no runs folder yet */
}
console.log(`\nRun folders: ${runs.length ? runs.join(", ") : "(none yet)"}`)

// File existence only proves run 1. Later runs edit the same files, so it cannot see their progress.
if (nextRole) {
  console.log(`\nNext role to run: ${nextRole}`)
} else if (runs.length > 1) {
  console.log(
    `\nRun 1 is complete. This script cannot tell how far a later run has got,` +
      ` because a later run edits the same files.` +
      `\nTrack it in factory/runs/${runs[runs.length - 1]}/run-record.md.`,
  )
} else {
  console.log(`\nNext role to run: (run 1 complete — every role has written its outputs)`)
}
