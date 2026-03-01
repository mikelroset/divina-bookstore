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

### Requirement: Invitation flow with neutral UX and email verification (Fase 1)

When a user invites someone by email to a community, the system SHALL support a secure, neutral UX and prepare for sending an invitation email when the invited person has no account.

- **Neutral message (AC3):** After the invite action, the UI SHALL show a single success message such as: "Hem enviat la invitació si aquest correu és vàlid." It SHALL NOT reveal whether the email exists in the system or whether an email was sent.
- **Idempotency (AC4):** For the same (email, community) within a short period (e.g. 10 minutes), the system SHALL NOT send a second email and SHALL return the same neutral success. Invite documents MAY store `lastEmailSentAt` for this purpose.
- **Invitation token (AC5):** Each invitation SHALL have a unique, non-guessable token stored in the invite document. The invitation link SHALL include this token. The token SHALL be valid only while the invite is pending and not expired (`expiresAt`). Invalid or expired tokens SHALL show a clear error screen with an option to "Tornar a demanar invitació".
- **Accept with email verification (AC6):** When accepting an invite, the system SHALL allow completion only if the authenticated user's email matches the invite's email. If the user is logged in with a different email, the system SHALL block acceptance and show an error ("Aquest enllaç és per a un altre correu."). If the user has no account, the flow SHALL guide them to sign up (prefilling email when possible).
- **Data model:** Invite documents SHALL include `inviteToken` and optionally `lastEmailSentAt` in addition to existing fields (communityId, email, invitedByUserId, status, expiresAt, etc.).

Sending the actual email (when the invited person has no account) SHALL be implemented in a backend (e.g. Cloud Function) so that user existence is not revealed to the client; this is documented as a follow-up phase.
