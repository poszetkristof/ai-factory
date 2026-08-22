#!/usr/bin/env node
// Prints the AI-native learning note and its sections, so /learn can pick one.
// The note lives in the project, not here. A missing file means someone moved or deleted it.

import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

// The note lives in the project being built, not in the plugin.
const PROJECT_ROOT = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
const NOTE = "docs/learn/ai-native-delivery.md"
const NOTE_PATH = join(PROJECT_ROOT, NOTE)

if (!existsSync(NOTE_PATH)) {
  console.log(`NOT FOUND at ${NOTE}`)
  console.log("Ask the user where the note moved to. Do not create a copy.")
  process.exit(0)
}

const text = readFileSync(NOTE_PATH, "utf8")
const lines = text.split("\n")

console.log(`${NOTE}  (${lines.length} lines)`)
console.log("")
console.log("Sections — add to one of these, never to a new file:")

for (const line of lines) {
  if (line.startsWith("## ")) console.log(`  ${line.slice(3)}`)
}
