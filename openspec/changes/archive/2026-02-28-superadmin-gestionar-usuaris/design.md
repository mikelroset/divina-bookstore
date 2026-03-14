# Design: Superadmin gestiona usuaris

## Arquitectura

### Capes

1. **Client (React):** AdminUsersView amb llista d'usuaris, botons Desactivar/Eliminar, ConfirmModal
2. **Cloud Functions (callable):** Verifiquen superadmin i executem accions amb Admin SDK
3. **Firestore:** adminLog per audit

### Flux desactivar

1. Superadmin selecciona "Desactivar" → ConfirmModal
2. Confirma → crida `disableUserForAdmin({ targetUserId })`
3. Funció: verifica superadmin, comprova targetUserId !== caller, crida `admin.auth().updateUser(uid, { disabled: true })`
4. Registra a adminLog

### Flux eliminar

1. Superadmin selecciona "Eliminar" → ConfirmModal (advertiment més fort)
2. Confirma → crida `deleteUserForAdmin({ targetUserId })`
3. Funció: verifica superadmin, bloqueja si targetUserId === caller
4. Elimina dades Firestore: users/{uid}/*, membership, reviews (authorUserId), encouragements, etc.
5. Elimina compte Auth: `admin.auth().deleteUser(uid)`
6. Registra a adminLog

### Anonimització (desactivació)

Quan un usuari està desactivat:

- Firebase Auth disabled → no pot fer login
- En mostrar ressenyes/encoratjaments: si authorUserId està desactivat, mostrar "Usuari desactivat" (consultar config o flag a Firestore)

Opció: guardar a `users/{uid}/prefs/settings` camp `disabledAt: timestamp`. Les vistes que mostren autor comproven si existeix i disabledAt; si és així, mostren "Usuari desactivat".

Però amb Firebase Auth disabled, l'usuari ja no pot entrar. El perfil "no visible" es resol no mostrant-lo als llistats de membres actius (filtrant per disabled). Per contingut: podem afegir `users/{uid}/prefs/settings.disabledAt` i les vistes de ressenyes/encoratjaments comproven si l'autor té disabledAt i mostren "Usuari desactivat".

### Llista d'usuaris

L'API `admin.auth().listUsers(maxResults)` retorna usuaris de Firebase Auth. Creem callable `listUsersForAdmin({ pageToken?, pageSize })` que retorna { users, nextPageToken }.

### Log administratiu

Col·lecció `adminLog` (o `config/adminLog`):

```
adminLog/{logId}: {
  superadminUserId: string,
  targetUserId: string,
  action: 'disable' | 'delete',
  timestamp: FieldValue.serverTimestamp()
}
```

Regles Firestore: només superadmins poden escriure (via Cloud Function, que corre amb admin); clients poden llegir si són superadmin (opcional, per auditoria futura).

### Proteccions

- **Autoeliminació:** la funció deleteUserForAdmin comprova `targetUserId === request.auth.uid` i retorna error
- **Confirmació:** ConfirmModal amb missatge explícit
- **Acció individual:** cada acció és una crida separada, sense eliminació massiva
