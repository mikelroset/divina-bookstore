# Tasks: Pàgines de perfil accessibles als membres de la comunitat

## 1. Ruta i autorització

- [x] 1.1 Afegir ruta `/community/member/:userId` a App.jsx.
- [x] 1.2 Crear component o lògica que comprovi: (a) userId és membre de activeCommunityId, (b) si userId === currentUser.uid, redirigir a /profile.
- [x] 1.3 Si l'usuari no és membre de la comunitat, bloquejar accés i redirigir a /community amb missatge.

## 2. Dades per a perfil d'altre usuari

- [x] 2.1 Verificar o adaptar useStats, useGamification, useBadges, getUserPrefs per acceptar un userId opcional (quan es consulta perfil aliè).
- [x] 2.2 Crear hook useMemberProfile(userId) o equivalent que carregui stats, badges, gamification, annualGoal del userId donat (només si autoritzat).

## 3. Vista MemberProfileView (read-only)

- [x] 3.1 Crear MemberProfileView que reutilitzi estructura de ProfileView però sense: logout, edició objectiu, selector idioma, showInLeaderboard, admin.
- [x] 3.2 Mostrar: avatar, nom, total llibres, llibres completats, insígnies desbloquejades, punts, nivell, progress bar nivell, objectiu anual + progrés (si definit).
- [x] 3.3 Estat buit: 0 llibres, 0 completats, missatge "Aquest membre encara no ha registrat activitat de lectura".
- [x] 3.4 Objectiu no definit: missatge "Aquest membre encara no ha definit un objectiu de lectura".
- [x] 3.5 Usuari inactiu: missatge "Usuari no disponible" i botó/enllaç per tornar.

## 4. Enllaços des de CommunityView

- [x] 4.1 A la llista de membres: fer nom i avatar clicables → navegar a `/community/member/:userId`.
- [x] 4.2 A les cards de llibres en lectura: clic en nom/avatar del lector → navegar al perfil del membre.

## 5. i18n

- [x] 5.1 Afegir claus per: "Aquest membre encara no ha registrat activitat de lectura", "Aquest membre encara no ha definit un objectiu de lectura", "Usuari no disponible", "No pots accedir al perfil d'aquest membre" (ca, es, en).

## 6. Constants i ROUTES

- [x] 6.1 Afegir ROUTES.COMMUNITY_MEMBER = "/community/member" (o path base) a constants.js.
