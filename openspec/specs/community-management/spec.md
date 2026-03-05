# community-management

## Requirements

### Requirement: Default community and migration (AC1)

On deployment of this feature, a default community SHALL exist with name "Homenatge a la Divina" (private). The user with ID `6g9VBE4EagT5yk8PuSZRHZGwAuH2` SHALL be the Owner and Administrator of this community.

All existing users SHALL become members of the default community (via lazy migration: when a user loads the app, if they do not have an active community or membership, they SHALL be added to the default community). User personal data (books, statistics, streak) SHALL remain unchanged and SHALL NOT regress.

### Requirement: Multi-community membership and selector (AC2)

A user SHALL be able to belong to one or more communities. The app SHALL store an "active" community for the user (e.g. activeCommunityId in user prefs). On the community screen, a selector SHALL display the communities the user belongs to; changing the selection SHALL update the active community and SHALL refresh community-specific statistics and context.

### Requirement: Community data model (Firestore)

- **communities/{communityId}:** name, description, visibility (open | private), ownerUserId, status (active | dissolved), timestamps.
- **communities/{communityId}/members/{userId}:** role (owner | admin | participant), status (active | banned | left), joinedAt, updatedAt; MAY include optional email, displayName, photoURL for display.
- User prefs (or equivalent) SHALL include activeCommunityId so the active community is persisted.

### Requirement: Member list shows email (not uid)

The community members list SHALL display a human-readable identifier for each member, preferring **email** when available. Member documents MAY store an optional `email` field; when adding or updating a member (join, accept invite, create community, ensure default community), the client SHALL pass the user's email when available and the service SHALL persist it. The UI SHALL show for each member: email (if present), otherwise displayName, otherwise userId.

### Requirement: Community-scoped readers and statistics

The community screen SHALL display only readers (and derived statistics) that are **active members** of the currently selected community (activeCommunityId).

- The list of "community readers" (who is reading what) SHALL be filtered to include only users whose ID is in the set of active members of the active community (from `communities/{communityId}/members` with status active).
- All statistics shown on the community screen (e.g. number of active readers, genres, etc.) SHALL be computed from this filtered list only.
- If no community is selected (activeCommunityId is null or missing), the reader list and statistics SHALL be empty or reflect "no community" as appropriate.

### Requirement: Invitation flow with neutral UX and email verification (Fase 1)

When a user invites someone by email to a community, the system SHALL support a secure, neutral UX and prepare for sending an invitation email when the invited person has no account.

- **Neutral message (AC3):** After the invite action, the UI SHALL show a single success message such as: "Hem enviat la invitació si aquest correu és vàlid." It SHALL NOT reveal whether the email exists in the system or whether an email was sent.
- **Idempotency (AC4):** For the same (email, community) within a short period (e.g. 10 minutes), the system SHALL NOT send a second email and SHALL return the same neutral success. Invite documents MAY store `lastEmailSentAt` for this purpose.
- **Invitation token (AC5):** Each invitation SHALL have a unique, non-guessable token stored in the invite document. The invitation link SHALL include this token. The token SHALL be valid only while the invite is pending and not expired (`expiresAt`). Invalid or expired tokens SHALL show a clear error screen with an option to "Tornar a demanar invitació".
- **Accept with email verification (AC6):** When accepting an invite, the system SHALL allow completion only if the authenticated user's email matches the invite's email. If the user is logged in with a different email, the system SHALL block acceptance and show an error ("Aquest enllaç és per a un altre correu."). If the user has no account, the flow SHALL guide them to sign up (prefilling email when possible).
- **Data model:** Invite documents SHALL include `inviteToken` and optionally `lastEmailSentAt` in addition to existing fields (communityId, email, invitedByUserId, status, expiresAt, etc.).

Sending the actual email (when the invited person has no account) SHALL be implemented in a backend (e.g. Cloud Function) so that user existence is not revealed to the client; this is documented as a follow-up phase.

### Requirement: Multiple books in progress per user on community screen

The community screen SHALL show, for each member, **all** books that the member has in "Llegint" (reading) status, not only one. The document `community/{userId}` SHALL support a `currentBooks` array (list of books in progress). Each item SHALL include at least: id, title, author (optional), coverUrl (optional), currentPage, pages, startDate, and lastUpdatedAt for ordering. The client SHALL sync all books with status "reading" to this array; it SHALL NOT run this sync while the books list is still loading, so as not to overwrite with an empty array before data is available. For each user, the UI SHALL display a list of all books in progress; progress that is inconsistent (negative or > 100%) SHALL be displayed as "—" or 0%. Books SHALL be ordered by most recent activity (lastUpdatedAt or startDate descending), or alphabetically by title if no date is available. If a user has no books in progress, their module SHALL still appear with the message "Ara mateix no està llegint cap llibre."
### Requirement: Invite flow responsive on mobile

The invite acceptance screen (route `/community/invite/:inviteId`) and the invite form section on the Community screen SHALL be responsive on mobile viewports. There SHALL be no horizontal scroll; all content SHALL fit within the viewport width. The app content wrapper MAY use `overflow-x-hidden` to prevent horizontal overflow from child content.
