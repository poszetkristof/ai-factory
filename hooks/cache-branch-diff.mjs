#!/usr/bin/env node
/**
 * Caches the current branch's diff against its base branch before a code review,
 * so the review skill can inline it instead of spending three tool calls on git.
 *
 * Written in Node rather than a shell script so it behaves the same on Windows,
 * macOS and Linux. Registered as a UserPromptExpansion hook in settings.json,
 * matched on the `code-review` command.
 *
 * Writes into .claude/cache/:
 *   branch.base   the resolved base branch name, or empty if none was found
 *   branch.stat   git diff --stat
 *   branch.files  git diff --name-only
 *   branch.patch  the full patch
 *
 * It never fails a prompt. If git is missing, or the repo has no base branch yet,
 * it writes empty files and exits 0 — the skill falls back to running git itself.
 */

import { execFileSync } from "node:child_process"
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
const cacheDir = join(projectDir, ".claude", "cache")

/** First one that exists wins. `main` for this repo; the others are for forks. */
const BASE_CANDIDATES = ["main", "master", "develop"]

/** Runs git and returns stdout, or "" if git errors for any reason. */
function git(args) {
  try {
    return execFileSync("git", ["-C", projectDir, ...args], {
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    })
  } catch {
    return ""
  }
}

/**
 * A fresh repo may have no base branch yet, and a fork may use a different name.
 * Returning null here is normal, not an error.
 */
function resolveBase() {
  for (const name of BASE_CANDIDATES) {
    if (git(["rev-parse", "--verify", "--quiet", name]).trim()) return name
  }
  return null
}

function main() {
  mkdirSync(cacheDir, { recursive: true })

  const base = resolveBase()
  const range = base ? `${base}...HEAD` : null

  const outputs = {
    "branch.base": base ?? "",
    "branch.stat": range ? git(["diff", range, "--stat"]) : "",
    "branch.files": range ? git(["diff", range, "--name-only"]) : "",
    "branch.patch": range ? git(["diff", range]) : "",
  }

  for (const [name, content] of Object.entries(outputs)) {
    writeFileSync(join(cacheDir, name), content, "utf8")
  }
}

try {
  main()
} catch {
  // A broken hook must never block a prompt.
}

process.exit(0)
