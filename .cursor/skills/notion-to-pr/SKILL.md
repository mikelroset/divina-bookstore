---
name: notion-to-pr
description: Create OpenSpec change and PR from a Notion page (fetch → branch → OpenSpec → apply → archive → commit → push → PR)
license: MIT
metadata:
  author: divina-bookstore
  version: "1.2"
---

Create a new OpenSpec change from a Notion page: fetch content, create a git branch, scaffold the change, fill proposal/design/tasks from the page, **apply** the change (implement tasks), **archive** it (sync specs, move to archive), then commit, push, and open a PR.

**Input**
- Notion page **URL** or **page ID** (provided by the user or by the command).
- Environment: `NOTION_API_KEY` must be set. `gh` (GitHub CLI) is optional for creating the PR; if missing, output the manual PR link and installation instructions.

**Expected Notion page structure**
Map page content to OpenSpec artifacts as follows:
- **Title** → change name (convert to kebab-case, e.g. "Add user auth" → `add-user-auth`).
- **Why** (or "Context" / "Problem") → `proposal.md` motivation and context.
- **What** (or "Solution" / "Scope") → `proposal.md` scope and high-level solution.
- **Design** (optional) → `design.md` (architecture, flows, decisions).
- **Requirements** (optional) → used for `specs/` or spec sections if the schema uses them.
- **Acceptance criteria** / **Tasks** → `tasks.md` (checklist items become tasks).

If the page uses different headings, infer the mapping from context (e.g. "Problem" → Why, "Solution" → What).

**Steps**

1. **Fetch Notion page content**
   - Run: `node scripts/notion-fetch-page.mjs "<page-id-or-url>"` (or equivalent path).
   - Load env from `.env` if present (e.g. `dotenv` or `source .env` and export) so `NOTION_API_KEY` is available.
   - The script prints: a first line `TITLE: <title>`, then block content as markdown-like text.
   - If the script fails (missing key, invalid page, not shared with integration), stop and report the error.

2. **Derive change name**
   - From the script output, take the title (after `TITLE: `).
   - Convert to kebab-case (e.g. "Limit encouragements to 3 days" → `limit-encouragements-to-3-days`).
   - Use this as `<name>` for the rest of the steps.

3. **Create git branch**
   - Ensure working tree is clean (or user accepts committing current state).
   - Create and checkout: `git checkout -b feature/<name>`.

4. **Scaffold OpenSpec change**
   - Run: `openspec new change "<name>"` (use default schema unless user requested another).
   - This creates `openspec/changes/<name>/` with artifact placeholders.

5. **Fill artifacts from Notion content**
   - Using the fetched text and the mapping above:
     - Write `openspec/changes/<name>/proposal.md`: Why + What (and any extra context from the page).
     - If Design section exists, write `openspec/changes/<name>/design.md`.
     - Write `openspec/changes/<name>/tasks.md`: acceptance criteria / tasks as checklist items.
   - If the schema includes other artifacts (e.g. specs), create them from "Requirements" or equivalent sections when present.
   - Run `openspec status --change "<name>"` and create any remaining required artifacts so the change is ready for implementation.
   - **Multi-perspective review**: Read [PERSONAS.md](PERSONAS.md) and apply the checklists for PO, Designer, Frontend, and Backend. Refine proposal, design, and tasks if gaps are found (add missing acceptance criteria, edge cases, UX considerations, or data model details as relevant).

6. **Apply OpenSpec change**
   - Follow the apply flow for change `<name>`: read context files from `openspec instructions apply --change "<name>" --json`, implement each pending task, mark tasks complete in `tasks.md`.
   - **Multi-perspective review during implementation**: Apply the implementation criteria from [PERSONAS.md](PERSONAS.md) as you implement—PO (covers acceptance criteria), Designer (UI consistency, accessibility), Frontend (components, state, performance), Backend (validation, errors, security). Adjust code if gaps are found.
   - If a task is blocked or unclear, stop and report; do not commit half-done.
   - Verification-only tasks (e.g. "Revisar visualment") may be left unchecked; the user can confirm later.

7. **Archive the change**
   - Sync delta specs to main specs (apply the delta spec content to `openspec/specs/<capability>/spec.md` as per the archive flow).
   - Move the change to archive: `mv openspec/changes/<name> openspec/changes/archive/YYYY-MM-DD-<name>` (use current date for YYYY-MM-DD). If the target already exists, fail and suggest renaming or another date.
   - Do not skip sync if the change has delta specs; archiving implies the change is done and main specs are up to date.

8. **Commit and push**
   - Stage all relevant changes: implementation files (e.g. under `src/`), `openspec/specs/**` (if synced), and the archive directory (new path) plus removal of `openspec/changes/<name>/` (if git sees it as renames, that is fine).
   - Commit: `git commit -m "feat|fix|chore(scope): <short description>; arxiva canvi <name> i sync spec"` (or similar). Include both the implementation and the archive in one commit (or split into two commits if preferred: one for implementation, one for archive + spec sync).
   - Push: `git push -u origin feature/<name>`.

9. **Create PR**
   - If **`gh` is available**: run `gh pr create --title "<human-readable title from Notion>" --body "<body>"`. Body should include: link to the Notion page, short summary (e.g. from proposal), and "Implements OpenSpec change: \<name\> (applied and archived)."
   - If **`gh` is not available**: do not fail. After push, GitHub often prints a one-time URL to create the PR; output it. Otherwise tell the user to open the repo on GitHub and use "Compare & pull request" for branch `feature/<name>`. Add: "Per crear PRs des de la terminal: instal·la gh (ex. sudo snap install gh) i gh auth login."

**Output**
- Summarize: branch name, change name, link to the new PR (or manual PR link if no `gh`), and that implementation and archive are already done (next step: review and merge).

**Guardrails**
- Do not skip steps; do not create the PR before pushing.
- Do not store or log `NOTION_API_KEY`.
- If `openspec` is not available, stop and tell the user what to install or configure.
- If `gh` is not available, continue after push and provide the manual PR link and installation hint; do not block the flow.
