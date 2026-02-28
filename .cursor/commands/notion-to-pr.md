---
name: /notion-to-pr
id: notion-to-pr
category: Workflow
description: Create OpenSpec change and PR from a Notion page (Notion → branch → OpenSpec → apply → archive → push → PR)
---

Create a new change from a Notion page: fetch the page, create a git branch, run the OpenSpec flow (proposal, design, tasks), **apply** the change (implement tasks), **archive** it (sync specs, move to archive), then commit, push, and open a PR.

**Input**: The user must provide the **Notion page URL** or **page ID** (e.g. `https://notion.so/MyWorkspace/Page-Title-abc123...` or `abc123def456...`). You may ask for it if not provided.

**Steps**

1. **Obtain Notion page identifier**
   - If the user provided a URL or page ID, use it. Otherwise ask: "Share the Notion page URL or page ID for the change you want to turn into a PR."
   - Extract the page ID from the URL if needed (typically the last path segment or the 32-char ID in the URL).

2. **Read and follow the notion-to-pr skill**
   - Read `.cursor/skills/notion-to-pr/SKILL.md` and follow its steps exactly.
   - The skill will direct you to: fetch Notion content, derive change name, create branch, run OpenSpec, fill artifacts, **apply** the change (implement tasks), **archive** it (sync specs, move to archive), then commit, push, and create the PR.

3. **Environment requirements**
   - Ensure `NOTION_API_KEY` is set (e.g. in `.env` or environment). If missing, stop and tell the user to add it and share the Notion page with their integration.
   - For creating the PR: **GitHub CLI (`gh`)** is optional. If `gh` is installed and authenticated, the skill will run `gh pr create`. If not, the skill will output the GitHub "new PR" URL for the branch and how to install `gh` for next time (e.g. `sudo snap install gh`, then `gh auth login`).

**Guardrails**
- Do not store or log the Notion API key.
- If any step fails (Notion fetch, openspec, apply, archive, git), stop and report the error clearly.
- Use the default OpenSpec schema (spec-driven) unless the user requests otherwise.
