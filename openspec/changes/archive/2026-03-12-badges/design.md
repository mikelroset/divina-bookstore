# Design: Badges

## Model de dades

**Firestore:** `users/{userId}/prefs/badges` amb:
- `unlockedBadgeIds: string[]` – IDs dels badges desbloquejats
- `unlockedAt: Record<badgeId, string>` – data ISO de desbloqueig (opcional)

**Catalog:** Fitxer `src/utils/badgeCatalog.js` amb array de badges:
- `id`, `name`, `description`, `condition` (text per UI), `imagePath`, `category`
- Funció `checkCondition(badgeId, context)` → boolean; context = { books, stats, prefs, encouragementCount, reviewCount, etc. }

## Flux de desbloqueig

1. En carregar perfil o després d’accions rellevants (actualitzar pàgina, completar llibre, etc.), s’executa `checkAndUnlockBadges(userId)`.
2. Per cada badge del catàleg: si no està a `unlockedBadgeIds` i `checkCondition(badgeId, context)` retorna true → afegir a unlocks i mostrar notificació.
3. Els badges desbloquejats no es revoquen (persistents).

## Càlcul retroactiu

En la primera càrrega de badges (o si l’usuari no té doc), es calculen totes les condicions amb les dades actuals (llibres completats, pàgines, ratxa, gèneres, etc.) i es desbloquen els que es compleixin.

## UI al perfil

- Secció "Badges" amb grid de targetes.
- Badge desbloquejat: imatge en color, tooltip/modal amb nom, descripció, condició.
- Badge bloquejat: imatge en escala de grisos, mateix tooltip.
- Ordenació: desbloquejats primer, després bloquejats; dins de cada grup per categoria i dificultat.

## Notificació de desbloqueig

Popup/toast amb: icona del badge, nom, missatge "Has desbloquejat un nou badge!". Integració amb ToastContext existent o similar.

## Badges MVP (primera iteració)

Implementar condicions per a un subset representatiu; la resta es poden afegir en canvis posteriors:

1. **Volum:** Primera Pàgina, Primer Llibre, Biblioteca en creixement (10), 1000 pàgines
2. **Constància:** Hàbit lector (7 dies), Ratxa de lectura (30 dies)
3. **Exploració:** Explorador de gèneres (5 gèneres)
4. **Reptes:** Clàssic conquerit
5. **Meta-badge:** Arquitecte de Biblioteca (100 llibres + 10k pàgines + 10 gèneres)

Les imatges ja estan a `public/badges/`.

## Duplicats i integritat

- Per volum de llibres: només es compten llibres únics per `bookId` (evitar duplicats per registrar el mateix llibre diverses vegades).
- Un badge desbloquejat no es torna a registrar (idempotència).
