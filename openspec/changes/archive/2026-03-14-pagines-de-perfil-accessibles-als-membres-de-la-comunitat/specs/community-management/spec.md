# community-management (delta)

## Requirements

### Requirement: Member profile page accessible from community (AC1–AC7)

Members of a community SHALL be able to view the **public profile** of other members of the same community. Access SHALL be restricted to members of the active community only.

- **AC1 Access:** From the community members list, a user SHALL be able to select a member (click name or avatar) and navigate to that member's public profile.
- **AC2 Library info:** The public profile SHALL display: total books in library, total books completed.
- **AC3 Badges:** Only unlocked badges SHALL be shown; locked badges SHALL NOT be displayed.
- **AC4 Level system:** The profile SHALL show: total points, current level, progress bar to next level.
- **AC5 Annual goal:** If the member has an annual goal, the profile SHALL show: annual book goal, current progress, progress bar.
- **AC6 Read-only mode:** When viewing another member's profile, the user SHALL NOT see options to: edit profile, modify settings, change goals.
- **AC7 Own profile:** When a user visits their own profile (route `/profile`), the usual edit options SHALL remain available.

### Requirement: Member profile route and authorization

- **Route:** `/community/member/:userId` SHALL display the public profile of the specified user.
- **Authorization:** Access SHALL be granted only if the target user is an active member of the viewer's active community. If not, the system SHALL block access and redirect to the community screen with an appropriate message.
- **Own profile redirect:** If `userId === currentUser.uid`, the app SHALL redirect to `/profile`.

### Requirement: Member profile edge cases

- **Empty activity (AC X):** If a member has no reading activity, the profile SHALL show: 0 books, 0 completed, and the message "Aquest membre encara no ha registrat activitat de lectura".
- **No annual goal (AC X):** If the member has not set an annual goal, the profile SHALL show the message "Aquest membre encara no ha definit un objectiu de lectura".
- **User outside community (AC X):** If the viewer tries to access the profile of a user who is not in their active community, the system SHALL block access.
- **Inactive or deleted user (AC X):** If the profile belongs to an inactive or deleted user, the profile SHALL display "Usuari no disponible".
