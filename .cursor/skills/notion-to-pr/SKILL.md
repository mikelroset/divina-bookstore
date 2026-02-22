---
name: notion-to-pr
description: Create OpenSpec change and PR from a Notion page (fetch page → branch → OpenSpec artifacts → commit → push → PR)
license: MIT
metadata:
  author: divina-bookstore
  version: "1.0"
---

Create a new OpenSpec change from a Notion page: fetch content, create a git branch, scaffold the change, fill proposal/design/tasks from the page, commit, push, and open a PR.

**Input**
- Notion page **URL** or **page ID** (provided by the user or by the command).
- Environment: `NOTION_API_KEY` must be set; `gh` must be installed and authenticated.

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

6. **Commit and push**
   - Stage: `git add openspec/changes/<name>/` and any new files.
   - Commit: `git commit -m "chore(openspec): add change <name> from Notion"` (or similar).
   - Push: `git push -u origin feature/<name>`.

7. **Create PR**
   - Run: `gh pr create --title "<human-readable title from Notion>" --body "<body>"`.
   - Body should include: link to the Notion page, short summary (e.g. from proposal), and optionally "Implements OpenSpec change: \<name\>".

**Output**
- Summarize: branch name, change name, link to the new PR, and next step (e.g. "Run `/opsx:apply` to implement tasks").

**Guardrails**
- Do not skip steps; do not create the PR before pushing.
- Do not store or log `NOTION_API_KEY`.
- If `openspec` or `gh` is not available, stop and tell the user what to install or configure.
