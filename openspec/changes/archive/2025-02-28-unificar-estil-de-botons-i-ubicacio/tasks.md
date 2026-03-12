# Tasks: Unificar estil de botons i ubicació

## 1. Components de botons

- [x] 1.1 Crear `PrimaryButton`: estil verd unificat (primary-500/600/700), rounded-xl, px-4 py-3.
- [x] 1.2 Crear `SecondaryButton`: fons clar, border primary.
- [x] 1.3 Crear `GhostButton`: sense fons, text primary.
- [x] 1.4 Suportar `as={Link}` o prop `to` per navegació.

## 2. Unificació d'estil verd

- [x] 2.1 Tots els botons primaris han d'usar PrimaryButton amb el mateix color (primary-500 hover primary-600).

## 3. Ubicació del botó principal

- [x] 3.1 Biblioteca: layout flex justify-between, botó a la dreta (ja aplicat prèviament).
- [x] 3.2 Comunitat: mateix layout (títol + botó Crear comunitat / Invitar).
- [x] 3.3 Ressenyes: mateix layout (títol + botó Afegir ressenya).

## 4. Migració de botons

- [x] 4.1 LibraryView: utilitzar PrimaryButton per "Afegir llibre" / "Afegir el primer llibre".
- [x] 4.2 CommunityView: utilitzar PrimaryButton per accions principals; Secondary/Ghost per alternatives.
- [x] 4.3 ReviewsView: utilitzar PrimaryButton per "Afegir ressenya".
- [ ] 4.4 Altres vistes (AddBookView, BookForm, AdminCommunitiesView, etc.): PrimaryButton/SecondaryButton on correspongui. (futur)

## 5. Estats i accessibilitat

- [x] 5.1 Estat disabled visible (opacity-50, cursor-not-allowed).
- [x] 5.2 Focus visible (focus:ring-2 focus:ring-primary-200/300).
