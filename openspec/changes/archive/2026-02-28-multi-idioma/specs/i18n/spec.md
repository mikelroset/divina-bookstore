# i18n

## Purpose

Suport multi-idioma per la interfície d'usuari (Català, Castellà, Anglès).

## Requirements

### Requirement: Supported languages

The app SHALL support three interface languages: Català (ca), Castellà (es), Anglès (en).

### Requirement: Language selector in profile

When the user accesses the profile, they SHALL be able to select the interface language from: Català, Castellà, Anglès. The selection SHALL be applied immediately to all UI texts.

### Requirement: Persistence of language preference

When a user selects a language, that preference SHALL be saved to their profile. When the user logs in again, the app SHALL load the selected language.

### Requirement: Scope of translation

The following elements SHALL be translated according to the selected language: main menu (navigation), buttons, system texts, forms, error messages, notifications. User-generated content (books, reviews, comments) SHALL NOT be translated and SHALL remain in the original language.

### Requirement: Unauthenticated user language

When the user is not logged in, the interface language SHALL be determined by: (1) the browser's preferred language, or (2) the app's default language if the browser language is not supported.

### Requirement: Default and fallback language

When the browser language is not supported (e.g. French, German), the app SHALL use Català as the default. When a translation key is missing in the selected language, the app SHALL display the Catalan version (fallback).

### Requirement: Language change with active session

When the user changes the language while navigating the app, the interface SHALL update completely to reflect the new texts (no stale strings).
