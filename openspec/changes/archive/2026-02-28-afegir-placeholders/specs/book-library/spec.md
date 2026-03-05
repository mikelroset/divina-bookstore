# book-library (delta)

## NEW Requirements

### Requirement: Book cover placeholder

When a book has no cover URL or the cover image fails to load, the UI SHALL display a placeholder that maintains the same size and aspect ratio as a real cover, without causing layout shift. The placeholder SHALL be visually neutral (e.g. slate background, book icon) and not distract from real covers. Images (real or placeholder) SHALL have appropriate alt text: "Portada de {títol}" or "Portada no disponible". Image load errors SHALL be handled gracefully with fallback to placeholder, without blocking rendering or causing console errors that affect the user experience.
