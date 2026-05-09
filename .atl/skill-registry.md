# Skill Registry — dataCharts

_Generated: 2026-05-07_
_Project: dataCharts_

## Project Conventions

| File | Type |
|------|------|
| (none found in project root) | — |

> No project-level AGENTS.md, CLAUDE.md, .cursorrules, or GEMINI.md found in `/Users/davidcalderon/Documents/projects/dataCharts`.

## Available Skills

_Source: `~/.config/opencode/skills/`_

### Workflow / SDD

| Name | Trigger |
|------|---------|
| `sdd-init` | When user wants to initialize SDD in a project, or says "sdd init", "iniciar sdd", "openspec init". |
| `sdd-explore` | When the orchestrator launches you to think through a feature, investigate the codebase, or clarify requirements. |
| `sdd-propose` | When the orchestrator launches you to create or update a proposal for a change. |
| `sdd-spec` | When the orchestrator launches you to write or update specs for a change. |
| `sdd-design` | When the orchestrator launches you to write or update the technical design for a change. |
| `sdd-tasks` | When the orchestrator launches you to create or update the task breakdown for a change. |
| `sdd-apply` | When the orchestrator launches you to implement one or more tasks from a change. |
| `sdd-verify` | When the orchestrator launches you to verify a completed (or partially completed) change. |
| `sdd-archive` | When the orchestrator launches you to archive a change after implementation and verification. |
| `sdd-onboard` | When the orchestrator launches you to onboard a user through the full SDD cycle. |

### GitHub / Code Review

| Name | Trigger |
|------|---------|
| `branch-pr` | When creating a pull request, opening a PR, or preparing changes for review. |
| `issue-creation` | When creating a GitHub issue, reporting a bug, or requesting a feature. |
| `judgment-day` | When user says "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen". |

### Testing

| Name | Trigger |
|------|---------|
| `go-testing` | When writing Go tests, using teatest, or adding test coverage. |

### Tooling

| Name | Trigger |
|------|---------|
| `skill-creator` | When user asks to create a new skill, add agent instructions, or document patterns for AI. |
| `skill-registry` | When user says "update skills", "skill registry", "actualizar skills", "update registry", or after installing/removing skills. |
