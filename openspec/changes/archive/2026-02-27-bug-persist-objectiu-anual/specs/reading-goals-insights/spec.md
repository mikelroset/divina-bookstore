# reading-goals-insights (delta)

## MODIFIED Requirements

### Requirement: Annual reading goal and progress

The system SHALL allow the user to set an annual reading goal (number of books) from their profile. The system SHALL display a visual progress bar showing completed books vs goal (e.g. percentage) on the profile and/or dashboard.

**Clarification (bug fix):** The annual goal value SHALL be persisted to storage (e.g. Firestore prefs) when the user changes it (on blur or on a debounced update). The profile form SHALL allow the user to type the number normally (e.g. "10" without the field forcing a leading zero or showing "010"). After page refresh or re-login, the saved annual goal SHALL be loaded and displayed correctly.
