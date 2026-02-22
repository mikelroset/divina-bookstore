# encouragement-inbox (delta)

## ADDED Requirements

### Requirement: Show received encouragements on Home

The system SHALL display encouragements received by the current user on the Home screen. Each item SHALL show a message of the form "[Sender name] t'anima a seguir llegint".

#### Scenario: Home shows encouragements for current user

- **WHEN** the user opens the Home screen and they have at least one received encouragement
- **THEN** the system SHALL load encouragements where the recipient is the current user (from persisted storage)
- **AND** the system SHALL display each encouragement with the sender's display name and the text "t'anima a seguir llegint" (e.g. "Maria t'anima a seguir llegint")

#### Scenario: Home shows nothing when no encouragements

- **WHEN** the user opens the Home screen and they have no received encouragements
- **THEN** the system SHALL NOT show an encouragements section (or SHALL show an empty state)
- **AND** the rest of the Home content (stats, progress, current book) SHALL be unchanged
