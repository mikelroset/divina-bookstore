# Tasks: Superadmin gestiona usuaris

## 1. Cloud Functions

- [ ] 1.1 Crear callable `listUsersForAdmin` que retorna usuaris de Firebase Auth (pagina); verificar que el caller és superadmin (llegir config/superadmins).
- [ ] 1.2 Crear callable `disableUserForAdmin` amb paràmetre targetUserId; verificar superadmin; cridar admin.auth().updateUser(uid, { disabled: true }); desar disabledAt a users/{uid}/prefs/settings; registrar a adminLog.
- [ ] 1.3 Crear callable `deleteUserForAdmin` amb paràmetre targetUserId; bloquejar si targetUserId === caller; eliminar dades Firestore (users, members, reviews autor, encouragements, etc.); eliminar compte Auth; registrar a adminLog.

## 2. Firestore

- [ ] 2.1 Crear col·lecció adminLog amb estructura (superadminUserId, targetUserId, action, timestamp). Les Functions escriuen amb admin.
- [ ] 2.2 Afegir regles si cal per adminLog (només via Functions / admin).

## 3. Client: AdminUsersView

- [ ] 3.1 Crear AdminUsersView: comprovar superadmin, mostrar llista d'usuaris (cridant listUsersForAdmin), botons Desactivar i Eliminar per cada usuari.
- [ ] 3.2 ConfirmModal per Desactivar i per Eliminar amb missatges diferenciats.
- [ ] 3.3 Després de desactivar/eliminar: refresh llista, toast de confirmació.

## 4. Rutes i navegació

- [ ] 4.1 Afegir ROUTES.ADMIN_USERS i Route a App.jsx.
- [ ] 4.2 Enllaç des de ProfileView (només si superadmin) a la secció d'administració d'usuaris.

## 5. Anonimització i visibilitat

- [ ] 5.1 En llistats de membres de comunitat: no mostrar usuaris amb disabledAt (excloure dels resultats).
- [ ] 5.2 En ressenyes i encoratjaments: si l'autor té disabledAt, mostrar "Usuari desactivat" en lloc del nom.

## 6. Verificació

- [ ] 6.1 Provar desactivar usuari: no pot login, no apareix en membres, contingut mostra "Usuari desactivat".
- [ ] 6.2 Provar eliminar: compte i dades eliminats; altres usuaris no perden punts/insígnies.
- [ ] 6.3 Provar autoeliminació: bloqueig correcte.
