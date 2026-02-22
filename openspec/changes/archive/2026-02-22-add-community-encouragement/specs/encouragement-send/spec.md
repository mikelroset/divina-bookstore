# encouragement-send (delta)

## ADDED Requirements

### Requirement: Send encouragement from community

The system SHALL allow the current user to send an encouragement to another reader from the Community view. The action SHALL persist the sender identity, the recipient, and the timestamp.

#### Scenario: User sends encouragement from a reader card

- **WHEN** the user clicks the encouragement action (e.g. "Encoratja" button or equivalent) on another reader's card in the Community view
- **THEN** the system SHALL create an encouragement record with the current user as sender, the card's reader as recipient, and the current time
- **AND** the system SHALL persist the record so it can be read by the recipient

#### Scenario: Sender cannot encourage themselves

- **WHEN** the Community view is rendered
- **THEN** the current user's own "Estàs llegint" card SHALL NOT show an encouragement action (or the list SHALL exclude the current user)
- **AND** encouragement actions SHALL only appear on other readers' cards
