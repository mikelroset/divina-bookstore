# auth-session (delta)

## ADDED Requirements

### Requirement: Logout error feedback

The app SHALL inform the user when the logout action fails (e.g. network or server error), so that the user knows the session may still be active.

#### Scenario: Logout fails

- **WHEN** the user taps "Tancar Sessió" and the logout request fails (e.g. throws)
- **THEN** the user SHALL see an error message (e.g. alert or toast) indicating that logout failed
- **AND** the error SHALL be logged to the console for debugging
