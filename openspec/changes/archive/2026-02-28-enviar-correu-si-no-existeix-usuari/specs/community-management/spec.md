# community-management (delta)

## NEW Requirements

### Requirement: Invitation flow with neutral UX and email verification (Fase 1)

When a user invites someone by email to a community, the system SHALL support a secure, neutral UX and prepare for sending an invitation email when the invited person has no account.

- **Neutral message (AC3):** After the invite action, the UI SHALL show a single success message such as: "Hem enviat la invitació si aquest correu és vàlid." It SHALL NOT reveal whether the email exists in the system or whether an email was sent.
- **Idempotency (AC4):** For the same (email, community) within a short period (e.g. 10 minutes), the system SHALL NOT send a second email and SHALL return the same neutral success. Invite documents MAY store `lastEmailSentAt` for this purpose.
- **Invitation token (AC5):** Each invitation SHALL have a unique, non-guessable token stored in the invite document. The invitation link SHALL include this token. The token SHALL be valid only while the invite is pending and not expired (`expiresAt`). Invalid or expired tokens SHALL show a clear error screen with an option to "Tornar a demanar invitació".
- **Accept with email verification (AC6):** When accepting an invite, the system SHALL allow completion only if the authenticated user's email matches the invite's email. If the user is logged in with a different email, the system SHALL block acceptance and show an error ("Aquest enllaç és per a un altre correu."). If the user has no account, the flow SHALL guide them to sign up (prefilling email when possible).
- **Data model:** Invite documents SHALL include `inviteToken` and optionally `lastEmailSentAt` in addition to existing fields (communityId, email, invitedByUserId, status, expiresAt, etc.).

Sending the actual email (when the invited person has no account) SHALL be implemented in a backend (e.g. Cloud Function) so that user existence is not revealed to the client; this is documented as a follow-up phase.
