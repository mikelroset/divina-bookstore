# Design: Corregir rànquing per mostrar punts de tots els membres de la comunitat

## Context

- Les dades de gamificació (punts, showInLeaderboard, etc.) viuen a `users/{uid}/prefs/gamification`.
- Les regles de Firestore només permeten llegir aquest document al propi usuari (`request.auth.uid == userId`).
- El codi actual (`gamificationService.getLeaderboard`) crida `getGamification(uid)` per a cada membre des del client; per als altres usuaris, Firestore denega la lectura → només es poden obtenir dades del usuari loguejat (o cap, segons com es propagui l'error).

## Decisió

1. **Cloud Function callable `getLeaderboard`:**
   - Input: `{ communityId: string, period: 'week' | 'month' | 'all' }`
   - Verificar que el caller (`context.auth.uid`) és membre actiu de la comunitat.
   - Obtenir membres actius: `communities/{communityId}/members` (status === 'active'), document ID = userId.
   - Per a cada membre, llegir `users/{userId}/prefs/gamification` amb Admin SDK (bypassa regles).
   - Filtrar qui té `showInLeaderboard === false`.
   - Ordenar per punts (segons period) i retornar array amb `{ userId, displayName?, points, rank }`.
   - Display names: obtenir de les dades dels documents de members (displayName, email).

2. **Client:**
   - Crear/utilitzar funció que cridi `httpsCallable(functions, 'getLeaderboard', { communityId, period })`.
   - Substituir la crida actual a `gamificationService.getLeaderboard` per la crida a la Cloud Function.
   - Mantenir la mateixa interfície a la vista: leaderboard array amb userId, displayName, points, rank.

## Flux

1. Usuari obre Comunitat, té `activeCommunityId` i `members` (de `getCommunityMembers`).
2. `CommunityView` carrega el leaderboard: crida la Cloud Function amb `activeCommunityId` i `leaderboardPeriod`.
3. La funció valida membres, llegeix gamificació de tots els membres (admin), retorna rànquing ordenat.
4. La UI mostra el rànquing de tots els membres de la comunitat.
