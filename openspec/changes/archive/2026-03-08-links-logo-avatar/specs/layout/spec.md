# layout (delta)

## ADDED Requirements

### Requirement: Header logo and avatar are clickable links

The header SHALL provide quick navigation via the logo and avatar.

- Clicking the **logo** SHALL navigate to the Home page (e.g. `/`).
- Clicking the **avatar** SHALL navigate to the Profile page (e.g. `/profile`).
- Both elements SHALL be clearly clickable (cursor pointer, hover feedback).
- Navigation SHALL use the app's router (SPA, no full page reload).
- If the avatar fails to render (e.g. missing image), the clickable area SHALL still navigate to Profile.
