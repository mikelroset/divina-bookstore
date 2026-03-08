# gamification (delta)

## MODIFIED Requirements

### Requirement: Levels

The system SHALL compute a level from total points. The level SHALL be visible on the profile.

**Clarification:** The UI SHALL display the level with an attractive **name** (e.g. "Cavaller de les Històries — Or"), not a raw number. The system SHALL maintain a catalog of 71 levels with format: *Role name — Mineral rank* (Ferro, Bronze, Plata, Or, Platí, Esmeralda, Diamant). Level 71 SHALL display as "Llegenda Divina". Each mineral rank SHALL have an associated color for quick visual identification. The internal progression SHALL remain based on numeric level ID; names are a presentation layer. If the computed level is outside 1–71 (e.g. data error), the system SHALL clamp to 1 or 71 and display the corresponding name.
