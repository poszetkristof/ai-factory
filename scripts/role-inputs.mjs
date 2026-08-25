#!/usr/bin/env node
// Prints what one role slot is allowed to read, and whether each input is on disk. Used by /run-role.
//
//   node scripts/role-inputs.mjs 400-architecture

import { readFileSync, existsSync, readdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

// The handoff map sits next to this script; the inputs it checks for live in the project.
const FACTORY_ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const PROJECT_ROOT = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
const MAP_PATH = join(FACTORY_ROOT, "factory/handoff-map.yaml")
const REG_PATH = join(FACTORY_ROOT, "factory/subagent-registry.yaml")

// {feature} in a path is the run slug, e.g. `001-photo-assessment`. It lives in the project's
// factory/feature.md so one line changes every per-feature path at once.
function runSlug() {
  const f = join(PROJECT_ROOT, "factory/feature.md")
  if (!existsSync(f)) return null
  return readFileSync(f, "utf8").match(/\*\*Run slug:\*\*\s*`([^`]+)`/)?.[1] ?? null
}
const SLUG = runSlug()
const resolve = (p) => (SLUG ? p.replaceAll("{feature}", SLUG) : p)

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
  reads.push(line.slice(6).trim().replace(/^"|"$/g, ""))
}

const present = (rel) => {
  const p = join(PROJECT_ROOT, rel)
  return rel.endsWith("/") ? existsSync(p) && readdirSync(p).length > 0 : existsSync(p)
}

const needsSlug = [...reads, ...(() => [])()].some((r) => r.includes("{feature}"))
if (SLUG) {
  console.log(`run slug: ${SLUG}   (from factory/feature.md)\n`)
} else if (needsSlug) {
  console.error(
    `This slot has per-feature paths but factory/feature.md has no \`**Run slug:** \\\`nnn-name\\\`\` line.\n` +
      `Add one — for example: **Run slug:** \`001-photo-assessment\`\n` +
      `Without it every {feature} path is unresolved and the role would overwrite another run's files.`,
  )
  process.exit(1)
}

console.log(`${id} may read ${reads.length} input(s):`)
let missing = 0
for (const r of reads) {
  const path = resolve(r)
  const ok = present(path)
  if (!ok) missing += 1
  console.log(`  ${ok ? "ok     " : "MISSING"} ${path}`)
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
  writes.push(line.slice(8).trim().replace(/^"|"$/g, ""))
}
console.log(`\nand writes only:`)
for (const w of writes) console.log(`  ${resolve(w)}`)
if (writes.some((w) => w.includes("{feature}")) && !SLUG) {
  console.log(`  (unresolved — factory/feature.md has no **Run slug:** line)`)
}

console.log(
  missing === 0
    ? `\nAll inputs present. Safe to run.`
    : `\n${missing} input(s) MISSING. That is a seam, not a reason to improvise — record it and stop.`
)
