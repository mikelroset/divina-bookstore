# community-management (delta)

## NEW Requirements

### Requirement: Member list shows email (not uid)

The community members list (when viewing a community and its members) SHALL display a human-readable identifier for each member, preferring **email** when available.

- Member documents in `communities/{communityId}/members/{userId}` MAY store an optional `email` field. When adding or updating a member (join, accept invite, create community, ensure default community), the client SHALL pass the user's email in the profile when available, and the service SHALL persist it.
- The UI SHALL show for each member: email (if present), otherwise displayName, otherwise userId, so that users see emails (e.g. mikelroset@gmail.com) rather than raw Firebase uids where possible.
