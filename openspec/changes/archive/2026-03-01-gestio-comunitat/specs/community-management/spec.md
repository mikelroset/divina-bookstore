# community-management (new capability)

## Requirements

### Requirement: Default community and migration (AC1)

On deployment of this feature, a default community SHALL exist with name "Homenatge a la Divina" (private). The user with ID `6g9VBE4EagT5yk8PuSZRHZGwAuH2` SHALL be the Owner and Administrator of this community.

All existing users SHALL become members of the default community (via lazy migration: when a user loads the app, if they do not have an active community or membership, they SHALL be added to the default community). User personal data (books, statistics, streak) SHALL remain unchanged and SHALL NOT regress.

### Requirement: Multi-community membership and selector (AC2)

A user SHALL be able to belong to one or more communities. The app SHALL store an "active" community for the user (e.g. activeCommunityId in user prefs). On the community screen, a selector SHALL display the communities the user belongs to; changing the selection SHALL update the active community and SHALL refresh community-specific statistics and context.

### Requirement: Community data model (Firestore)

- **communities/{communityId}:** name, description, visibility (open | private), ownerUserId, status (active | dissolved), timestamps.
- **communities/{communityId}/members/{userId}:** role (owner | admin | participant), status (active | banned | left), joinedAt, updatedAt.
- User prefs (or equivalent) SHALL include activeCommunityId so the active community is persisted.
