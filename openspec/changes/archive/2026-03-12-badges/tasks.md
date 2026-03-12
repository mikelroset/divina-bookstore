# Tasks: Badges

## 1. Backend – Catàleg i servei

- [x] 1.1 Crear `src/utils/badgeCatalog.js` amb el catàleg de tots els badges (id, nom, descripció, condició, imatge, categoria).
- [x] 1.2 Crear `src/services/badgeService.js`: `getUnlockedBadgeIds(userId)`, `unlockBadge(userId, badgeId)`, `evaluateAndUnlockBadges(userId, context)` amb Firestore `users/{uid}/prefs/badges`.
- [x] 1.3 Implementar funció d'avaluació per badges de volum: primera pàgina, primer llibre, 10/50/100 llibres, 1000/5000/10000/50000 pàgines (usant books i pageLog).

## 2. Backend – Badges de constància i intensitat

- [x] 1.4 Avaluar badges de constància: 7, 30, 100 dies i 365 dies (usant readingActivityDays).
- [x] 1.5 Avaluar badges d'intensitat: 100 pàgines/dia, 200 pàgines/dia, 300 pàgines/cap de setmana, lector nocturn (usant pageLog amb timestamps).
- [x] 1.6 Avaluar badge explorador de gèneres (5) i polifacètic (10) (usant gèneres de llibres completats).
- [x] 1.7 Avaluar badges de reptes: clàssic conquerit, 5 clàssics, 500 pàgines, 1000 pàgines (usant books).
- [x] 1.8 Avaluar meta-badge Arquitecte de Biblioteca (100 llibres + 10000 pàgines + 10 gèneres).
- [x] 1.9 Avaluar badges socials: primera ressenya, 10 ressenyes, ressenya amb 10 likes, encoratjar 10/50 vegades (integració amb reviewService i encouragementService).

## 3. UI – Secció Badges al perfil

- [x] 2.1 Afegir secció "Badges" a ProfileView amb grid de badges (desbloquejats en color, bloquejats en gris).
- [x] 2.2 Cada badge mostra icona (img de public/badges), nom, estat visual (color vs gris).
- [x] 2.3 Desktop: hover mostra tooltip amb nom, descripció, condició. Mobile: tap obre modal/tooltip amb la mateixa informació.
- [x] 2.4 Ordenar: desbloquejats primer, bloquejats després; dins de cada grup per categoria i dificultat.

## 4. Desbloqueig i notificació

- [x] 3.1 Cridar `evaluateAndUnlockBadges` en punts clau: carregar perfil, completar llibre, actualitzar pàgina, encoratjar, publicar ressenya.
- [x] 3.2 Quan es desbloqueja un badge: persistir a Firestore, mostrar toast/popup de celebració (icona, nom, "Has desbloquejat un nou badge!").
- [x] 3.3 Notificació diferida: si es desbloqueja però no es pot mostrar (offline), mostrar a la propera entrada a l'app.

## 5. Edge cases

- [x] 4.1 Càlcul retroactiu: en primera càrrega de badges per usuari existent, avaluar tots els badges amb dades actuals i desbloquejar els que compleixi.
- [x] 4.2 Badges persistents: un cop desbloquejat, no es revoquen encara que el progrés baixi.
- [x] 4.3 Sense duplicats: un usuari només pot tenir cada badge una vegada.
- [x] 4.4 Volum per llibre únic: per badges de llibres completats, comptar cada bookId una sola vegada (evitar duplicats si registra el mateix llibre més d’una vegada).
