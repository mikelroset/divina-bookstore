# community-management

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

### Requirement: Community-scoped readers and statistics

The community screen SHALL display only readers (and derived statistics) that are **active members** of the currently selected community (activeCommunityId).

- The list of "community readers" (who is reading what) SHALL be filtered to include only users whose ID is in the set of active members of the active community (from `communities/{communityId}/members` with status active).
- All statistics shown on the community screen (e.g. number of active readers, genres, etc.) SHALL be computed from this filtered list only.
- If no community is selected (activeCommunityId is null or missing), the reader list and statistics SHALL be empty or reflect "no community" as appropriate.
