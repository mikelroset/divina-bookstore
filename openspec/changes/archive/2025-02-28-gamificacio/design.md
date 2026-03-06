# Design: Gamificació

## Context

L'app ja té:
- `readingActivityDays` i `computeStreak` a userPrefsService.
- `recordReadingActivity` es crida quan l'usuari actualitza currentPage.
- Perfil amb objectiu anual i stats.

## Decisions

1. **Persistència de punts:** Document `users/{uid}/prefs/gamification` amb: `totalPoints`, `showInLeaderboard` (opt-in), `lastStreakBonusDay` (per idempotència del bonus 5 dies), `completedBookIds` (per evitar duplicar +10). Alternativament estendre prefs/settings; es prefereix document separat per no sobrecarregar.

2. **Punts per pàgines:** Al guardar currentPage, calcular delta = newCurrentPage - prevCurrentPage. Si delta > 0 i totalPages > 0, afegir floor(delta/10) punts. No premiar si delta <= 0.

3. **Punts per completat:** Quan status passa a "completed", +10 punts. Verificar que el llibre no estigui a completedBookIds; afegir-lo després.

4. **Bonus ratxa cada 5 dies:** Quan recordReadingActivity s'executa i la ratxa resultant és múltiple de 5 (5, 10, 15…), afegir +5 punts. Idempotència: guardar lastStreakBonusDay; si streak >= 5 i (streak % 5 === 0) i lastStreakBonusDay !== streak, actualitzar.

5. **Nivells:** Funció `pointsToLevel(points)` retorna nivell (ex: 1 punt per nivell fins a 100, després escala). Nivell = 1 + floor(points / 100) o similar.

6. **Leaderboard:** Col·lecció o vista agregada. Opció A: denormalitzar punts a `community/{userId}` o `users/{uid}` i fer query. Opció B: `userScores` collection amb { userId, communityId, period, points }. Per MVP: llegir punts dels membres de la comunitat des de users/{uid}/prefs/gamification, filtrar per showInLeaderboard, ordenar per totalPoints. Període: calcular setmanal/mensual des de pageLog o activity.

7. **Períodes leaderboard:** Setmanal = punts guanyats aquesta setmana; Mensual = aquest mes; All time = totalPoints. Cal guardar punts per període o recalcular. Per simplificar: guardar `pointsThisWeek`, `pointsThisMonth`, `totalPoints` i resetear setmanal/mensual en canvi de setmana/mes.
