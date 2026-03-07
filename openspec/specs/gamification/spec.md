# gamification

## Purpose

Sistema de gamificació per incentivar la lectura: punts per pàgines i llibres completats, bonus de ratxa, nivells i rànquing a la comunitat.

## Requirements

### Requirement: Points for pages read

When the user registers new pages read (updates currentPage), the system SHALL award +1 point per 10 new pages (rounded down). Points SHALL NOT be awarded for pages already counted. If the page delta is negative or zero, no points SHALL be awarded.

### Requirement: Points for completed book

When a book transitions to "completed" status, the user SHALL receive +10 points. This bonus SHALL be granted at most once per book (idempotent).

### Requirement: Streak bonus every 5 days

When the user's reading streak reaches 5 days (or multiples: 10, 15, 20…), the system SHALL award +5 points. This bonus SHALL be idempotent (not duplicated on retries).

### Requirement: Levels

The system SHALL compute a level from total points (e.g. Level 1, 2, 3…). The level SHALL be visible on the profile.

### Requirement: Community leaderboard

The community page SHALL display a leaderboard block with: member name, points, position. The block SHALL support tabs for period: Weekly, Monthly, All time. The block SHALL follow the same visual style as other blocks.

### Requirement: Leaderboard opt-in

Users SHALL be able to opt out of appearing on the leaderboard. When "Show in ranking" is disabled, the user SHALL NOT appear on the leaderboard but SHALL continue to accumulate points and levels on their profile.

### Requirement: Leaderboard calculation tooltip

The leaderboard block SHALL display an information icon next to the "Rànquing" title. When the user hovers (desktop) or taps (mobile) the icon, a tooltip SHALL explain how the ranking is calculated.

The tooltip SHALL include, in plain language and Catalan:
- Which variables affect the score: pages read (+1 pt per 10 pages), books completed (+10 pt), streak bonus every 5 days (+5 pt).
- How points are aggregated: total, weekly, and monthly.
- What happens when there is no recent activity: points remain; the user can improve by reading more pages, completing books, or maintaining a streak.
