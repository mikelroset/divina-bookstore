# gamification (delta)

## MODIFIED Requirements

### Requirement: Community leaderboard

The community page SHALL display a leaderboard block with: member name, points, position. The block SHALL support tabs for period: Weekly, Monthly, All time. The block SHALL follow the same visual style as other blocks.

**Clarification (bug fix):** The leaderboard SHALL display points for **all active members** of the selected community, not only the logged-in user. Because Firestore rules restrict read access to `users/{uid}/prefs/gamification` to the owning user only, the leaderboard SHALL be computed server-side (e.g. via a Cloud Function with admin privileges) that aggregates gamification data for all community members and returns the sorted ranking. The client SHALL call this server endpoint rather than attempting to read other users' gamification documents directly.
