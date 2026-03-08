# Tasks: Bug – Error en el rànquing (només es mostra l'usuari loguejat)

## 1. Cloud Function getLeaderboard

- [x] 1.1 Crear Cloud Function callable `getLeaderboard` a `functions/index.js`: accepta `{ communityId, period }`.
- [x] 1.2 Verificar que `context.auth.uid` és membre actiu de la comunitat (llegir `communities/{communityId}/members/{uid}`).
- [x] 1.3 Obtenir tots els membres actius de la comunitat (query `communities/{communityId}/members` where status==='active').
- [x] 1.4 Per a cada membre, llegir `users/{userId}/prefs/gamification` amb Admin Firestore; excloure qui té `showInLeaderboard === false`.
- [x] 1.5 Calcular punts segons `period` (week → pointsThisWeek, month → pointsThisMonth, all → totalPoints).
- [x] 1.6 Ordenar per punts descendent, assignar rank, retornar array amb `{ userId, displayName?, points, rank }`. Display name des de `members` (displayName o email o "Lector").

## 2. Client: cridar la Cloud Function

- [x] 2.1 Afegir export/import de `getFunctions`, `httpsCallable` des de `firebase/functions` i connectar a la regió correcta (europe-west1).
- [x] 2.2 Refactoritzar `gamificationService.getLeaderboard` per cridar la Cloud Function amb `(communityId, period)`.
- [x] 2.3 A `CommunityView`, substituir la crida per `getLeaderboard(activeCommunityId, leaderboardPeriod)` i adaptar dependències de l'useEffect.
- [x] 2.4 La implementació client-side anterior s'ha eliminat; la nova delegació és a la Cloud Function.

## 3. Verificació

- [ ] 3.1 Revisar: en una comunitat amb diversos membres, el rànquing mostra els punts de tots ells (no només de l'usuari loguejat).
- [ ] 3.2 Revisar: el període (setmana / mes / total) funciona correctament.
