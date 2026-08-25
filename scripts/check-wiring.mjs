#!/usr/bin/env node
// Checks the factory wiring before a run. A dangling read or a double-written file looks like a
// subagent mistake three hours later, so catch it here.
//
//   node scripts/check-wiring.mjs

import { readFileSync, readdirSync, existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

// The line's own files sit next to this script. Find them from here, not from
// CLAUDE_PLUGIN_ROOT: that is substituted into command text but never exported to the process.
// The run inputs come from the project being built.
// --wiring-only skips the run-input check, for CI in this repo where no project is present.
const FACTORY_ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const PROJECT_ROOT = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
const wiringOnly = process.argv.includes("--wiring-only")

const reg = readFileSync(join(FACTORY_ROOT, "factory/subagent-registry.yaml"), "utf8")
const map = readFileSync(join(FACTORY_ROOT, "factory/handoff-map.yaml"), "utf8")

const problems = []
const note = (m) => problems.push(m)

/** `- item` lines directly under `key:`, at a given indent. */
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

function blockFor(text, marker) {
  const at = text.indexOf(marker)
  return at === -1 ? "" : text.slice(at)
}

const order = listUnder(map, "execution_order", 0)
const runInputs = listUnder(map, "run_inputs", 0)
const ids = [...reg.matchAll(/^ {2}- id: "(.+)"$/gm)].map((m) => m[1])

// 1 — the three lists agree
for (const id of ids) if (!order.includes(id)) note(`registry has "${id}" but execution_order does not`)
for (const id of order) if (!ids.includes(id)) note(`execution_order has "${id}" but the registry does not`)
for (const id of ids) {
  if (!existsSync(join(FACTORY_ROOT, `factory/subagent-slots/${id}.md`))) note(`"${id}": slot file missing`)
  if (!existsSync(join(FACTORY_ROOT, `agents/${id}.md`))) note(`"${id}": adapter missing — run derive-agents.mjs`)
}
for (const f of readdirSync(join(FACTORY_ROOT, "factory/subagent-slots"))) {
  const id = f.replace(/\.md$/, "")
  if (f.endsWith(".md") && !ids.includes(id)) note(`slot file "${f}" is not in the registry`)
}

// 2 — run inputs are the only files nobody produces, so they must exist on disk
if (!wiringOnly) {
  for (const r of runInputs) {
    if (!existsSync(join(PROJECT_ROOT, r))) note(`run input "${r}" does not exist — nothing will supply it`)
  }
}
if (runInputs.length === 0) note("run_inputs is empty — the first slot has nothing to read")

// 3 — single writer
const writers = new Map()
for (const id of ids) {
  for (const file of listUnder(blockFor(reg, `- id: "${id}"`), "writes", 4)) {
    if (writers.has(file)) note(`"${file}" is written by both "${writers.get(file)}" and "${id}"`)
    writers.set(file, id)
  }
}

// 4 — no dangling reads, and no reading from a slot that runs later
const produced = (file) => {
  for (const [pattern, owner] of writers) {
    if (pattern === file) return owner
    // A read of a whole folder ("docs/ADR/") is satisfied by anything written inside it.
    if (file.endsWith("/") && pattern.startsWith(file)) return owner
    const rx = new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*")}$`)
    if (rx.test(file)) return owner
  }
  return null
}
for (const id of ids) {
  const anchor = map.indexOf(`\n  "${id}":`)
  if (anchor === -1) {
    note(`"${id}" has no reads: entry in handoff-map.yaml`)
    continue
  }
  const reads = []
  for (const line of map.slice(anchor + 1).split("\n").slice(1)) {
    if (line.trim() === "" || line.trim().startsWith("#")) continue
    if (!line.startsWith("    - ")) break
    reads.push(line.slice(6).trim().replace(/^"|"$/g, ""))
  }
  for (const r of reads) {
    if (runInputs.includes(r)) continue
    const owner = produced(r.endsWith("/") ? r : r)
    if (!owner) {
      note(`"${id}" reads "${r}", which no slot writes and which is not a run input`)
      continue
    }
    if (order.indexOf(owner) >= order.indexOf(id)) {
      note(`"${id}" reads "${r}" from "${owner}", which runs at the same time or later`)
    }
  }
}

// 5 — a slot with {feature} in any of its paths must be able to resolve it, so it has to be given
// factory/feature.md. Without this the role writes a literal "{feature}" folder, or guesses.
for (const id of ids) {
  const writes = listUnder(blockFor(reg, `- id: "${id}"`), "writes", 4)
  const anchor = map.indexOf(`\n  "${id}":`)
  const reads = []
  if (anchor !== -1) {
    for (const line of map.slice(anchor + 1).split("\n").slice(1)) {
      if (line.trim() === "" || line.trim().startsWith("#")) continue
      if (!line.startsWith("    - ")) break
      reads.push(line.slice(6).trim().replace(/^"|"$/g, ""))
    }
  }
  const usesSlug = [...writes, ...reads].some((p) => p.includes("{feature}"))
  if (usesSlug && !reads.includes("factory/feature.md")) {
    note(`"${id}" has {feature} paths but does not read factory/feature.md, so it cannot resolve the slug`)
  }
}

// 6 — every declared edge is real in both directions
// The file value is quoted because a path may contain {feature}, and inside a flow map { and }
// are YAML indicators — unquoted, the parser reads a nested map and the rest of the file breaks.
for (const m of map.matchAll(/- \{ from: "(.+?)", to: "(.+?)", file: "(.+?)" \}/g)) {
  const [, from, to, file] = m
  if (produced(file) !== from) note(`edge ${from} → ${to}: "${file}" is written by ${produced(file) ?? "nobody"}`)
  const anchor = map.indexOf(`\n  "${to}":`)
  if (anchor !== -1 && !map.slice(anchor, anchor + 2000).includes(file)) {
    note(`edge ${from} → ${to}: "${file}" is not in ${to}'s reads: list`)
  }
}

if (problems.length === 0) {
  console.log(`wiring ok — ${ids.length} slots, ${writers.size} owned files, no dangling reads`)
  process.exit(0)
}
console.error(`${problems.length} wiring problem(s):`)
for (const p of problems) console.error(`  - ${p}`)
process.exit(1)
