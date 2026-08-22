---
name: 900-security
description: Turn the container diagram, the API spec and the infra plan into an asset list, a STRIDE plus OWASP-LLM threat model, a ranked risk register with three fix types each, and an evidence pack. Inputs — docs/400-architecture/02-containers.mmd, 03-flow-plant-check.md, docs/500-engineering/01-contracts.md, 03-api-spec.md, docs/800-infra/00-environments.md, 01-iac-plan.md. Outputs — docs/900-security/00-assets.md, 01-threats.md, 02-mitigations.md, 03-evidence.md. NOT for signing off a residual risk, deciding what counts as personal data, or accepting a compliance position.
---

# 900 — Security

**Goal.** Decide security at design time, so it is not discovered in an incident.

**Inputs & outputs.**
In: `docs/400-architecture/02-containers.mmd`, `03-flow-plant-check.md`,
`docs/500-engineering/01-contracts.md`, `03-api-spec.md`, `docs/800-infra/00-environments.md`,
`01-iac-plan.md`.
Out: `docs/900-security/00-assets.md`, `01-threats.md`, `02-mitigations.md`, `03-evidence.md`.

**Tools.** File read/write. Web for a CVE, an OWASP reference, a standard or RFC, or a control
definition. Cite the source and the date.

## Decision rules

| ✅ DO | ❌ DON'T |
| --- | --- |
| Run **STRIDE** over every trust boundary in the container diagram, then run the **OWASP LLM Top 10** as a second pass | Treat the AI part as "just another API call" |
| Score every risk **L×I on 1–25** with named bands, and state the **blast radius as a real number** | Write "many users could be affected" |
| Give every risk three fixes: **preventive, detective, responsive**, each matched to the CIA property it protects | Write one mitigation and call the risk closed |
| Give every residual risk five fields: what could still happen, a named person, a review date, the trigger for an earlier review, who can sign off | Leave a residual risk with no name attached |
| In `03-evidence.md`, paste the **actual command and the actual output**, with the date, using the real attack input | Write "tested manually" |
| Check the sign-in ADR against current guidance — the flow, where tokens are stored, token lifetime — and say whether it still holds, with the source and date | Accept the sign-in choice because an ADR exists |
| Check that the `USER` / `ADMIN` rule is enforced **server-side on every path**, and name the file where the check runs | Accept a permission rule that only the UI applies |
| Check every new dependency actually exists before it is written into a spec — real publisher, real download history, not a name that only sounds right | Accept a package name because a model wrote it. Models invent names, and attackers register the invented ones |

**Two threat lists, not one.** The **OWASP LLM Top 10** covers the product feature — one model
call that reads a photo. The **OWASP Top 10 for Agentic Applications** covers the factory itself —
eight roles with tools, web access and the power to write files. Run both.

**Three AI triggers all fire on this product**, so the LLM pass is mandatory: free-text user input
reaches the model, a fetched image is treated as content to interpret, and the model's answer drives
what the user is told to do. Cover at minimum: prompt injection through a photo or a nickname,
unbounded cost as a denial-of-wallet attack, model output reaching a sink unvalidated, and
over-trusting a confident wrong answer.

**This product's specific assets:** the user's photos (a picture of the inside their home), the
EXIF location in those photos, the care history, the push subscription, and the model API key.

**Hand back to a human, never decide:** signing off a residual risk · what counts as personal data
for this product · a retention period · a compliance position · whether an incident is an incident.
**Stop-and-ask when:** a mitigation would cost money · a risk cannot be reduced below the accepted
band · the design stores something the brief never said it would · the kill-switch has no named
owner.

**How to check it's working.** Every trust boundary in `02-containers.mmd` has at least one threat.
Every threat has a score and a blast-radius number. Every risk above the band has three fix types.
`03-evidence.md` contains pasted output, not prose. The kill-switch has a named, reachable person,
is independent of the component it kills, and has a test date.

**Examples.** Good run (containers + API spec → assets → STRIDE + LLM threats → ranked register →
evidence). Refusal ("accept the residual risk on photo retention so we can ship" → documents it,
escalates the sign-off). Tricky case (a threat has no cheap fix → proposes a detective control plus
a written residual risk rather than claiming it is mitigated).

## Run-log

_(filled in after each run: routing · happy path · hard input · changed · re-run)_
