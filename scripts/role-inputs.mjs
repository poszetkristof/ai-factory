#!/usr/bin/env node
// Prints what one role slot is allowed to read, and whether each input is on disk. Used by /run-role.
//
//   node scripts/role-inputs.mjs 400-architecture

import { readFileSync, existsSync, readdirSync } from "node:fs"
import { join } from "node:path"

// The handoff map comes from the plugin; the inputs it checks for live in the project.
const FACTORY_ROOT = process.env.CLAUDE_PLUGIN_ROOT ?? process.cwd()
const PROJECT_ROOT = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
const MAP_PATH = join(FACTORY_ROOT, "factory/handoff-map.yaml")
const REG_PATH = join(FACTORY_ROOT, "factory/subagent-registry.yaml")

const id = process.argv[2]
if (!id) {
  console.log("no slot given. Slots, in run order:")
  const map = readFileSync(MAP_PATH, "utf8")
  const start = map.indexOf("execution_order:")
  for (const line of map.slice(start).split("\n").slice(1)) {
    if (line.trim() === "" || line.trim().startsWith("#")) continue
    if (!line.startsWith("  - ")) break
    console.log(`  ${line.slice(4).trim().replace(/^"|"$/g, "")}`)
  }
  process.exit(0)
}

const map = readFileSync(MAP_PATH, "utf8")
const anchor = map.indexOf(`\n  "${id}":`)
if (anchor === -1) {
  console.error(`"${id}" has no reads: entry in factory/handoff-map.yaml`)
  process.exit(1)
}

const reads = []
for (const line of map.slice(anchor + 1).split("\n").slice(1)) {
  if (line.trim() === "" || line.trim().startsWith("#")) continue
  if (!line.startsWith("    - ")) break
  reads.push(line.slice(6).trim())
}

const present = (rel) => {
  const p = join(PROJECT_ROOT, rel)
  return rel.endsWith("/") ? existsSync(p) && readdirSync(p).length > 0 : existsSync(p)
}

console.log(`${id} may read ${reads.length} input(s):`)
let missing = 0
for (const r of reads) {
  const ok = present(r)
  if (!ok) missing += 1
  console.log(`  ${ok ? "ok     " : "MISSING"} ${r}`)
}

const reg = readFileSync(REG_PATH, "utf8")
const at = reg.indexOf(`- id: "${id}"`)
const writes = []
for (const line of reg.slice(at).split("\n").slice(1)) {
  if (line.trim() === "" || line.trim().startsWith("#")) continue
  if (line.includes("writes:")) continue
  if (!line.startsWith("      - ")) {
    if (writes.length > 0) break
    continue
  }
  writes.push(line.slice(8).trim())
}
console.log(`\nand writes only:`)
for (const w of writes) console.log(`  ${w}`)

console.log(
  missing === 0
    ? `\nAll inputs present. Safe to run.`
    : `\n${missing} input(s) MISSING. That is a seam, not a reason to improvise — record it and stop.`
)
