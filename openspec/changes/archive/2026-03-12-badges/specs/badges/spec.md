# badges (delta)

## ADDED Requirements

### Requirement: Badges section in profile

When an authenticated user accesses their profile, the system SHALL display a section named "Badges". The section SHALL list all badges available in the app.

### Requirement: Badge visual state

When a badge is unlocked, the system SHALL display it in full color. When a badge is locked, the system SHALL display it in grayscale.

### Requirement: Badge information display

Each badge SHALL display: name, icon (image), description, and unlock condition. On desktop, hovering over a badge SHALL show this information. On mobile, tapping a badge SHALL show this information in a tooltip or modal.

### Requirement: Automatic badge unlock

When a user fulfills a badge's condition, the system SHALL unlock the badge automatically. The system SHALL persist: badge id, user id, and unlock timestamp.

### Requirement: Unlock notification

When a user unlocks a badge, the system SHALL show a visual notification (popup or toast) containing: badge icon, name, and a celebration message (e.g. "Has desbloquejat un nou badge!").

### Requirement: Badge persistence

Once a badge is unlocked, it SHALL remain unlocked permanently. Unlocked badges SHALL NOT be revoked if the user's progress later decreases (e.g. deleted books, corrected pages).

### Requirement: No duplicate badges

When a user fulfills a condition for a badge they already have, the system SHALL NOT create a duplicate unlock.

### Requirement: Badge ordering

Badges SHALL be displayed: (1) unlocked first, then locked; (2) within each group, by category and then by difficulty.

### Requirement: Retroactive computation

When the badge system is first activated for an existing user, the system SHALL compute and unlock all badges the user already qualifies for, based on their accumulated progress.

### Requirement: Meta-badge (Arquitecte de Biblioteca)

When a user fulfills all of: 100 completed books, 10,000 pages read, 10 different genres, the system SHALL unlock the "Arquitecte de Biblioteca" badge.
