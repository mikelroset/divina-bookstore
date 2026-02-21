# Proposal: Add logout error feedback

## Why

When logout fails (e.g. network error, Firebase timeout), the catch in `handleLogout` only logs to the console. The user sees no feedback and may think they are still logged in or that the action was ignored.

## What Changes

- When `logout()` throws, the user sees an error message (alert), consistent with login and delete-book error handling.
- No change to the happy path; only the catch branch is updated.

## Capabilities

### Modified Capabilities

- **auth-session**: The app SHALL inform the user when logout fails, instead of failing silently.

## Impact

- `src/App.jsx`: In `handleLogout` catch block, add `alert()` with a user-facing error message (and keep `console.error` for debugging).
