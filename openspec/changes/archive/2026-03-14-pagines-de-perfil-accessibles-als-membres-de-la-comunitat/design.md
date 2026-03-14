# Design: Pàgines de perfil accessibles als membres de la comunitat

## Flux

1. L'usuari accedeix a la pantalla de comunitat (llista de membres).
2. Clica sobre el nom o avatar d'un membre.
3. Navega a `/community/member/:userId` (o similar).
4. El sistema comprova que el membre pertany a la comunitat activa de l'usuari; si no, bloqueja l'accés.
5. Es mostra el perfil públic (read-only) del membre.

## Ruta i accés

- **Ruta:** `/community/member/:userId` (dins el context de la comunitat activa).
- **Autorització:** Abans de renderitzar, comprovar que `userId` és membre actiu de `activeCommunityId`. Si l'usuari no té comunitat activa o el membre no és de la comunitat, redirigir a `/community` amb missatge d'error o 404.
- **Propi perfil:** Si `userId === currentUser.uid`, redirigir a `/profile` (on es mantenen les opcions d'edició).

## Vista de perfil públic (MemberProfileView)

Reutilitzar la lògica visual de ProfileView amb les següents restriccions:

- **Mostrar:** Avatar, nom, estadístiques (total llibres, llibres completats), insígnies desbloquejades, punts, nivell, barra de progrés al següent nivell, objectiu anual i progrés.
- **Ocultar:** Botó logout, edició d'objectiu anual, selector d'idioma, configuració "mostrar al rànquing", botó admin comunitats.
- **Estat buit:** Si el membre no té activitat, mostrar "0 llibres", "0 llibres completats" i missatge "Aquest membre encara no ha registrat activitat de lectura".
- **Objectiu no definit:** Si no té objectiu anual, mostrar "Aquest membre encara no ha definit un objectiu de lectura".
- **Usuari inactiu/eliminat:** Si el membre no existeix o està desactivat, mostrar "Usuari no disponible" i enllaç per tornar.

## Dades

- Les dades del perfil (stats, badges, gamification, annualGoal) es llegeixen dels serveis existents però passant el `userId` del membre visitat, no el currentUser. Cal serveis o hooks que acceptin un `userId` opcional (per exemple `useStats(userId)`, `useGamification(userId)`, etc.) o crear variants per a perfils d'altres usuaris.
- Firestore: les dades estan a `users/{userId}/books`, `users/{userId}/prefs/settings`, gamification, badges. Els serveis ja llegeixen per userId; cal assegurar-se que només es permet accedir quan el membre és de la mateixa comunitat.

## Enllaços des de la comunitat

- A la llista de membres: fer el nom i avatar clicables, amb `navigate(/community/member/${m.userId})` (o ruta definitiva).
- A les cards de llibres en lectura: el clic en reader name/avatar ha de navegar al perfil del membre (no al detall del llibre).

## Edge cases

- **Usuari fora de la comunitat:** Bloquejar accés; redirigir a comunitat amb toast "No pots accedir al perfil d'aquest membre".
- **Usuari inactiu/eliminat:** Mostrar "Usuari no disponible".
- **Membre sense activitat:** Valors a 0 i missatge adequat.
- **Sense objectiu anual:** Missatge "Aquest membre encara no ha definit un objectiu de lectura".
