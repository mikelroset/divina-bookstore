# Tasks: Noms atractius pels nivells

## 1. Catàleg i lògica

- [x] 1.1 Crear `levelCatalog.js`: array de 71 entrades amb `{ level, roleName, mineralRank, displayName }`.
- [x] 1.2 Actualitzar `pointsToLevel` i `pointsToNextLevel` a gamificationService: POINTS_PER_LEVEL = 171, clamp 1–71.
- [x] 1.3 Funció `getLevelInfo(level)`: retorna { displayName, roleName, mineralRank, color } amb fallback per fora de rang.

## 2. Colors per rang

- [x] 2.1 Definir mapes de colors minerals (Tailwind classes o CSS vars) reutilitzables.
- [x] 2.2 Exportar funció `getMineralColor(rank)` per ús a la UI.

## 3. UI: substituir número per nom

- [x] 3.1 A ProfileView: mostrar `displayName` del nivell (p. ex. "Cavaller de les Històries — Or") en lloc de "Nivell X".
- [x] 3.2 A CommunityView (leaderboard/rànquing): no mostra nivell actualment; queda per a futur si s’afegeix.
- [x] 3.3 Afegir color del rang mineral quan es mostri el nivell (text amb colorClass).
- [x] 3.4 Actualitzar useGamification per exposar levelDisplayName i levelColorClass.

## 4. Verificació i edge cases

- [x] 4.1 Fallback: getLevelInfo clampa a 1–71 i registra anomalia.
- [x] 4.2 Progressió cap al següent nivell amb progressPct correcte.
