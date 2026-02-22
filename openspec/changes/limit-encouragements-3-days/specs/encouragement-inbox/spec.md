# encouragement-inbox (delta)

## MODIFIED Requirements

### Requirement: Show received encouragements on Home

The system SHALL display encouragements received by the current user on the Home screen that were created within the last 3 days. Each item SHALL show a message that includes the sender's name and the book title, e.g. "[Sender name] t'anima a seguir llegint [Book title]". Encouragements older than 3 days SHALL NOT be shown.

#### Scenario: Home shows encouragements for current user (within 3 days)

- **WHEN** the user opens the Home screen and they have at least one received encouragement with createdAt within the last 3 days
- **THEN** the system SHALL load encouragements where the recipient is the current user and SHALL filter to only those with createdAt within the last 3 days
- **AND** the system SHALL display each such encouragement with the sender's display name and the book title in the form "[Sender name] t'anima a seguir llegint [Book title]" (e.g. "Maria t'anima a seguir llegint El Quixot")

#### Scenario: Home shows nothing when no encouragements or all older than 3 days

- **WHEN** the user opens the Home screen and they have no received encouragements, or all their received encouragements are older than 3 days
- **THEN** the system SHALL NOT show the encouragements section (or SHALL show an empty state)
- **AND** the rest of the Home content (stats, progress, current book) SHALL be unchanged

#### Scenario: Encouragements disappear after 3 days

- **WHEN** an encouragement was created more than 3 days ago
- **THEN** the system SHALL NOT include it in the list shown to the recipient on Home
- **AND** the sender SHALL be allowed to send a new encouragement to that recipient for that book (per encouragement-send)
