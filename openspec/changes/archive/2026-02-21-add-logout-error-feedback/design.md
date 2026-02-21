# Design: Add logout error feedback

## Context

- `handleLogout` in `App.jsx` already catches errors and logs with `console.error`.
- Login and delete-book handlers use `alert()` for user-facing errors in this codebase.

## Goals / Non-Goals

**Goals:**

- Show the user a clear message when logout fails.
- Stay consistent with existing error UX (alert).

**Non-Goals:**

- No toast/notification system; no refactor of other error handling.
- No retry button; a single message is enough for this change.

## Decisions

### Decision 1: Use alert in catch

Use `alert()` in the catch block, with a short message in Catalan (e.g. "No s'ha pogut tancar la sessió. Torna-ho a intentar."). Matches `handleGoogleLogin` and `handleDeleteConfirm`. Keep `console.error` for developers.
