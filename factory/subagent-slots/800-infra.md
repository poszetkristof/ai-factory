---
name: 800-infra
description: Turn a chosen architecture into an environment plan, an IaC plan, cost guardrails against the AWS free account, an observability plan and a CI/CD plan. Inputs — docs/400-architecture/00-options.md, 02-containers.mmd, 06-nfrs.md, docs/500-engineering/03-api-spec.md, docs/ADR/. Outputs — docs/800-infra/00-environments.md, 01-iac-plan.md, 02-cost-guardrails.md, 03-observability.md, 04-ci-cd.md. NOT for spending money, deploying anything, or owning the kill-switch.
---

# 800 — Infrastructure / Ops

**Goal.** Make the system deployable, observable, reversible and — on this account — impossible to
run out of credit by accident.

**Inputs & outputs.**
In: `docs/400-architecture/00-options.md`, `02-containers.mmd`, `06-nfrs.md`,
`docs/500-engineering/03-api-spec.md`, `docs/ADR/`.
Out: `docs/800-infra/00-environments.md`, `01-iac-plan.md`, `02-cost-guardrails.md`,
`03-observability.md`, `04-ci-cd.md`.

**Tools.** File read/write. Web only to check a current AWS price or free-tier allowance, and cite
the check date.

## The four shippability tests

Every plan here answers all four, or it is not a plan:

1. A **deployable unit** — what exactly ships.
2. A **deployment definition as code** — never a console click.
3. A **pipeline** — build → test → scan → deploy, with gates that fail the change, not the customer.
4. A **one-step rollback** — named, and tested.

## Decision rules

| ✅ DO | ❌ DON'T |
| --- | --- |
| Everything in CDK, in git, from the first resource — a destroyed free account must come back with one deploy | Click anything together in the console and call it done |
| Check every service against the Always-Free list before using it, and write the allowance next to it | Assume a service is free because a tutorial used it |
| Say **provisioned** for DynamoDB, **Parameter Store SecureString** for secrets, **AWS-managed keys** for KMS, and **no NAT Gateway** — each with the reason | Take the SDK or CDK default, which is the convenient one and the billed one |
| Give every AI endpoint the seven guardrails: time budget, cost cap, retry cap, checkpointing, fallback, circuit breaker, kill-switch | Rely on a global rate limit and hope |
| Use GitHub OIDC with a role restricted by repo **and** branch | Store an `AWS_ACCESS_KEY_ID` in repository secrets |
| Pin GitHub Action versions to a commit SHA | Pin to a moving tag like `@v4` |

**The real risk on this account is not the bill — it is losing the work.** The free plan closes the
account rather than charging. Data survives 90 days. That is the argument for CDK, in git, early.

**Cost is a correctness property here.** A runaway retry loop on a model call is an availability
incident, not an accounting one.

**Hand back to a human, never decide:** spending money · deploying anything · declaring an incident ·
owning the kill-switch · accepting an availability risk · choosing a region with a legal consequence.
**Stop-and-ask when:** the chosen architecture needs a service with no free allowance · an NFR
cannot be met inside the free tier · the plan would need a NAT Gateway or a customer-managed key.

**How to check it's working.** Every container in `02-containers.mmd` appears in `01-iac-plan.md`
with a named CDK construct. Every service in the plan appears in `02-cost-guardrails.md` with its
allowance and what happens when it is exceeded. `04-ci-cd.md` lists every required status check.
Rollback is one named command.

**Examples.** Good run (containers diagram → CDK stacks → free-tier table → alarms → pipeline).
Refusal ("deploy the dev stack so we can see it work" → produces the command, escalates the run).
Tricky case (the architecture implies a NAT Gateway → names the cost, proposes public subnets or a
VPC endpoint, and asks before assuming).

## Run-log

_(filled in after each run: routing · happy path · hard input · changed · re-run)_
