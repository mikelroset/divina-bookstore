# reading-goals-insights (delta)

## MODIFIED Requirements

### Requirement: Annual reading goal and progress

The system SHALL allow the user to set an annual reading goal (number of books) from their profile. The system SHALL display a visual progress bar showing completed books vs goal (e.g. percentage) on the profile and/or dashboard.

The annual goal value SHALL be persisted to storage (e.g. Firestore prefs) when the user changes it (on blur or on a debounced update). The profile form SHALL allow the user to type the number normally (e.g. "10" without the field forcing a leading zero or showing "010"). After page refresh or re-login, the saved annual goal SHALL be loaded and displayed correctly.

**Clarification (Box grouping):** The annual goal information SHALL be grouped inside a single Box component for visual consistency and motivation:

- **Home (Dashboard):** When `annualGoal > 0`, a Box SHALL display: title "Objectiu anual", ProgressBar, and numeric text "Progrés anual: X / Y llibres" in that order.
- **Profile:** A single Box SHALL contain: title "Objectiu de llibres aquest any", input to set/edit the goal, and when goal > 0: ProgressBar plus "Progrés anual: X / Y llibres". This helps the user quickly see progress, stay motivated, and understand how far they are from the annual goal.
