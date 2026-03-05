# community-management (delta)

## NEW Requirements

### Requirement: Avatar placeholder

When a user has no avatar (photoURL) or the avatar image fails to load, the UI SHALL display a placeholder that maintains the same size as a real avatar. The placeholder MAY show user initials (from displayName) when available, or a generic user icon otherwise. Images (real or placeholder) SHALL have appropriate alt text: "Avatar de {nom}" or "Avatar no disponible". Avatar load errors SHALL be handled with fallback to placeholder. This applies to the community readers list, header, profile, and any other place where user avatars are shown.
