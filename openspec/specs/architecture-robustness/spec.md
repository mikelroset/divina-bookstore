# architecture-robustness

## Purpose

Garantir que l'aplicació sigui robusta i fiable mitjançant una arquitectura coherent: maneig d'errors centralitzat, protecció contra crashes, cancel·lació d'efectes asíncrons i separació de lògica de negoci.

## Requirements

### Requirement: Error Boundary global

The application SHALL be wrapped in an Error Boundary at the root level. When an uncaught error occurs during render, the app SHALL display a fallback UI (e.g. error message with retry option) instead of a blank screen. The Error Boundary SHALL NOT catch errors in event handlers or async code.

### Requirement: Centralized error feedback (Toast)

The application SHALL provide a centralized way to show error messages to the user. Critical errors (e.g. save book, login, delete) SHALL display feedback via a toast or similar non-blocking UI instead of `alert()`. A ToastContext or equivalent SHALL be available for components to call `showError(message)`.

### Requirement: Null-safe components

Components that display user or book data SHALL guard against null/undefined to prevent crashes. When `reader.currentBook` or similar optional data is null, the component SHALL either return null, render a fallback, or use optional chaining for all accesses.

### Requirement: Null-safe utilities

Utility functions that accept potentially null data (e.g. `sortBooks` with `title`/`author`, progress calculations) SHALL use null coalescing or guards (e.g. `(a.title ?? "").localeCompare(b.title ?? "")`) to avoid runtime errors.

### Requirement: Safe progress calculation

Progress bars and percentage calculations SHALL use a safe helper (e.g. `safeProgress`) that handles division by zero, null values, and invalid ranges. The helper SHALL return null or 0 for invalid inputs rather than throwing.

### Requirement: Async effect cancellation

useEffect hooks that perform async data fetching SHALL use a cancellation pattern to avoid updating state with stale data when dependencies change. The pattern SHALL set a `cancelled` flag in the cleanup function and check it before calling setState after awaits.

### Requirement: Async error handling

Promise chains (e.g. `getUserCommunities().then(...)`) SHALL include `.catch()` to handle rejections. Errors SHALL be logged and, when appropriate, surfaced to the user via the toast or error state.

### Requirement: Email validation for invites

When sending community invites by email, the application SHALL validate the email format (e.g. regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) before calling the API. Invalid emails SHALL show a user-facing error message.

### Requirement: Business logic extraction

Complex business logic (e.g. saving a book with gamification, notifications, page delta calculation) SHALL be extracted into hooks or services rather than embedded in component handlers. The `useBookSave` hook or equivalent SHALL encapsulate save logic and return `saveBook` and `updateCurrentPage` functions.

### Requirement: JSDoc for services

Public service functions SHALL include JSDoc with `@param`, `@returns`, and `@typedef` where applicable to improve maintainability and IDE support.
