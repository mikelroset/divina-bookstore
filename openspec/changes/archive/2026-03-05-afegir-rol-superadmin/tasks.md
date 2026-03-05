# Tasks: Afegir rol superadmin

## 1. Persistència i servei Superadmin

- [x] 1.1 Crear document Firestore `config/superadmins` amb `{ uids: ["6g9VBE4EagT5yk8PuSZRHZGwAuH2"] }` (script o funció d'inicialització).
- [x] 1.2 Crear `superadminService.js` amb `isSuperadmin(userId)`: llegeix el document i retorna boolean.
- [x] 1.3 Exportar servei i integrar-lo amb hook o context per reutilitzar el resultat.

## 2. Ruta i guard

- [x] 2.1 Afegir ruta `/profile/admin-communities` a App.jsx.
- [x] 2.2 Crear component/vista que comprova `isSuperadmin`; si no, redirigir a `/profile`.

## 3. Perfil – entry point "Gestió de comunitats"

- [x] 3.1 A ProfileView, si `isSuperadmin(user.uid)`, mostrar enllaç/botó "Gestió de comunitats" que navega a la ruta de gestió.
- [x] 3.2 Si no és superadmin, no mostrar la secció.

## 4. Vista AdminCommunitiesView – llistat

- [x] 4.1 Llistar comunitats (query a `communities`). Camps: id, name, status, memberCount.
- [x] 4.2 Cercador per nom (filtrar client-side).
- [x] 4.3 Paginació: 10 per pàgina amb botons Següent/Anterior.
- [x] 4.4 Estat buit: missatge i CTA "Crear comunitat".
- [x] 4.5 Estat de càrrega i error amb reintentar.

## 5. Crear comunitat

- [x] 5.1 Modal o formulari: nom (obligatori), descripció, visibilitat (open|private).
- [x] 5.2 Cridar `createCommunity(currentUser.uid, ...)` i refrescar llistat.
- [x] 5.3 Validació: nom buit → error.

## 6. Editar i desactivar comunitat

- [x] 6.1 Funció `updateCommunity(communityId, { name, description, visibility, status })` al servei.
- [x] 6.2 Botó/acció "Editar" per comunitat: obrir modal amb form, desar.
- [x] 6.3 Botó "Desactivar" / "Arxivar": canviar status a `archived`; comunitat continua visible a gestió.

## 7. Gestió de membres (per comunitat)

- [x] 7.1 Expandir comunitat o navegar a detall: llista de membres (getCommunityMembers + banned).
- [x] 7.2 Accions: eliminar (left), bloquejar (banned), desbloquejar, canviar rol (owner/admin/participant).
- [x] 7.3 Afegir membre: per email (invite existent o afegir directe si possible). Mínim: invitar per email.
- [x] 7.4 Paginació de membres si n'hi ha molts (opcional).

## 8. Verificació

- [x] 8.1 Comprovar que usuari no superadmin no veu res i és redirigit.
- [x] 8.2 Comprovar flux: llistat, crear, editar, desactivar, membres.
