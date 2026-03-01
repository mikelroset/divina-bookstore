# community-management (delta)

## NEW Requirements

### Requirement: Community-scoped readers and statistics

The community screen SHALL display only readers (and derived statistics) that are **active members** of the currently selected community (activeCommunityId).

- The list of "community readers" (who is reading what) SHALL be filtered to include only users whose ID is in the set of active members of the active community (from `communities/{communityId}/members` with status active).
- All statistics shown on the community screen (e.g. number of active readers, genres, etc.) SHALL be computed from this filtered list only.
- If no community is selected (activeCommunityId is null or missing), the reader list and statistics SHALL be empty or reflect "no community" as appropriate.
