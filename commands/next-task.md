---
description: Execute the next unblocked task from TASKS.md — or a specific one by ID.
argument-hint: "[T-0NN | F-N.M]"
---

Execute a backlog task.

TASK: $ARGUMENTS (empty means "the next unblocked one")

Backlog state:

!`node -e 'const l=require("fs").readFileSync("TASKS.md","utf8").split("\n").filter(x=>x.startsWith("- **Status:**"));const c=(m)=>l.filter(x=>x.includes("["+m+"]")).length;console.log("done "+c("x")+" | in progress "+c("~")+" | blocked "+c("!")+" | todo "+c(" ")+" | total "+l.length)'`

Next open tasks:

!`node -e 'const t=require("fs").readFileSync("TASKS.md","utf8");const m=[...t.matchAll(/^### ((?:T-\d+|F-\d+\.\d+)) — ([^\n]+)\n- \*\*Status:\*\* .\[ \]/gm)].slice(0,5);m.forEach(x=>console.log(x[1]+"  "+x[2]))'`

Load the **`spec-driven-tasks`** skill and work the task here, in this session — there is no
task-running subagent.

The loop, in short:

1. Pick the lowest-numbered `[ ]` task whose dependencies are all `[x]` — or the one named above,
   after checking its dependencies.
2. Set its status to `[~]`.
3. Read **only** the spec section that task cites.
4. Create exactly the files in its Files list, with their tests.
5. Run the Verify command; it must pass.
6. Tick the acceptance boxes, set the status to `[x]`.
7. **Checkpoint:** mid-epic (`F-N.M` → `F-N.M+1`) means carry straight on. A `T-0NN` task, or the
   final sub-task of an epic, means report and stop.

Do **not** commit. Report the task ID, the files built, the verify output, the commit message to
use, and the next unblocked task.
