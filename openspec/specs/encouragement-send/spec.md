# encouragement-send Specification

## Purpose
Send encouragement from Community view for a specific book; 3-day cooldown per (recipient, book).

## Requirements

### Requirement: Send encouragement from community

The system SHALL allow the current user to send an encouragement to another reader from the Community view for a specific book the reader is currently reading. The action SHALL persist the sender identity, the recipient, the book (identifier and title), and the timestamp. The system SHALL allow at most one encouragement from the same sender to the same recipient for the same book within any 3-day window; after 3 days have passed since that encouragement, the sender SHALL be allowed to send again for that same book.

#### Scenario: User sends encouragement from a reader card

- **WHEN** the user clicks the encouragement action (e.g. "Encoratja" button) on another reader's card in the Community view (each card representing one reader and one book)
- **THEN** the system SHALL create an encouragement record with the current user as sender, the card's reader as recipient, the card's book (id and title), and the current time
- **AND** the system SHALL persist the record so it can be read by the recipient

#### Scenario: Sender cannot encourage themselves

- **WHEN** the Community view is rendered
- **THEN** the current user's own "Estàs llegint" card SHALL NOT show an encouragement action (or the list SHALL exclude the current user)
- **AND** encouragement actions SHALL only appear on other readers' cards

#### Scenario: Cooldown per recipient and book

- **WHEN** the sender has already sent an encouragement to the same recipient for the same book within the last 3 days
- **THEN** the system SHALL NOT allow sending another encouragement for that (recipient, book) combination (e.g. the button SHALL be disabled or show that the action is not available)
- **AND** the sender SHALL be allowed to send an encouragement to the same recipient for a different book (if the recipient is reading multiple books)

#### Scenario: Cooldown resets after 3 days

- **WHEN** more than 3 days have passed since the sender last sent an encouragement to a given recipient for a given book
- **THEN** the system SHALL allow the sender to send a new encouragement to that recipient for that book
- **AND** the UI SHALL offer the encouragement action again for that reader's card (for that book)
