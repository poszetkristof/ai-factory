---
description: Write what was just learned into the right learning-notes file.
argument-hint: "[what to write about]"
---

TOPIC: $ARGUMENTS (empty means "whatever we just finished in this session")

The AI-native note, and its sections:

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/learn-note.mjs" 2>&1 || true`

Project learning log:

!`node -e "const fs=require('fs');console.log(fs.existsSync('README.md')?'  README.md exists':'  README.md does not exist yet — it is written when the backlog is generated')"`

## Pick one place, then write

| What was learned | Goes to |
| --- | --- |
| How the AI-native process works — the line, seams, gates, the documents | the right **section** of the note above |
| Why **this project** is built the way it is — the stack, a package, a pattern | `README.md` here |
| A fact about an AWS service | the AWS study notes (see `.claude/memory/where-things-are.md`) |

The AI-native note is **one file**. Add to the section that fits; do not start a second file. If no
section fits, say which is closest and ask first.

## How to write it

Follow `.claude/memory/learning-style.md`. The short version:

1. Open with one or two plain sentences: what the thing is, and what problem it solves.
2. Then bullets. Each bullet is a full sentence that carries its own consequence.
3. Real names and real values from this repo. Never a placeholder.
4. Name the option that was **not** picked, and why it lost.
5. Two to five sentences per entry. Longer means it wants its own note.
6. No pasted code. Point at the file path.

## Two rules that are easy to break

- **New details replace, they do not stack.** Tighten or cut something else in the same section. A
  file that only grows stops being read.
- **The note never talks to the user.** No "as you asked". In six months the question is gone.

When done, say which file changed and what was cut to make room.
