# Tasks: Gamificació

## 1. Model i servei de punts

- [x] 1.1 Crear `src/services/gamificationService.js`: getGamification(userId), addPoints(userId, amount, reason), grantCompletedBookBonus(userId, bookId), grantStreakBonus(userId, streakDay).
- [x] 1.2 Firestore: users/{uid}/prefs/gamification amb totalPoints, pointsThisWeek, pointsThisMonth, showInLeaderboard, completedBookIds[], lastStreakBonusDay.
- [x] 1.3 Funció pointsToLevel(points) per calcular nivell.

## 2. Integrar punts al flux de lectura

- [x] 2.1 Punts per pàgines: a handleUpdateCurrentPageFromHome i AddBookRoute handleSave, després de guardar, cridar addPoints(floor(delta/10)) si delta > 0 i totalPages > 0.
- [x] 2.2 Punts per completat: quan llibre passa a completed, cridar grantCompletedBookBonus (idempotent).
- [x] 2.3 Bonus ratxa 5 dies: a addReadingActivityDay (o després de recordReadingActivity), si streak % 5 === 0 i no s'ha donat avui, afegir +5 punts.

## 3. Opt-in leaderboard

- [x] 3.1 Afegir showInLeaderboard a gamification (default true o false?). Per AC6, default true (participa); l'usuari pot desactivar.
- [x] 3.2 Toggle al Perfil per "Aparèixer al rànquing".

## 4. Leaderboard a Comunitat

- [x] 4.1 Bloc "Rànquing" a CommunityView: tabs Setmanal, Mensual, Tot.
- [x] 4.2 Obtenir punts dels membres (showInLeaderboard=true), ordenar per punts del període, mostrar posició, nom, punts.
- [x] 4.3 Actualitzar pointsThisWeek / pointsThisMonth en addPoints; resetar en canvi de setmana/mes.

## 5. Perfil: punts i nivell

- [x] 5.1 Mostrar punts totals i nivell a ProfileView.
- [x] 5.2 Progrés fins al següent nivell (barra o text).

## 6. Edge cases

- [x] 6.1 No punts si delta pàgines <= 0 (AC Edge 1).
- [x] 6.2 Sense pàgines totals: no punts per pàgines; només +10 si marcat completat manualment (AC Edge 2).
- [x] 6.3 Antitrampa: si delta > 300 en una actualització, no atorgar punts per pàgines (AC Edge 3).

## 7. Verificació

- [x] 7.1 Completar llibre → +10; actualitzar pàgines → +1 per 10; ratxa 5 dies → +5.
- [x] 7.2 Desactivar leaderboard → no apareix al rànquing.
