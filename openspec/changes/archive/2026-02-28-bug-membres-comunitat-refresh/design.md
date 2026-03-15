# Design: Bug membres comunitat refresh

## Causa

CommunityView manté `members`, `communityReaders` i `leaderboard` en estat local. En canviar `activeCommunityId`, els useEffects disparen noves càrregues però no reseten l'estat anterior. Mentre la nova càrrega és en curs, es continuen mostrant dades de la comunitat anterior.

## Solució

1. **Reset immediat en canvi de comunitat:** Quan `activeCommunityId` canvia, abans de la càrrega:
   - `setMembers([])`
   - `setCommunityReaders([])`
   - `setLeaderboard([])` (i `setMemberPointsByUserId({})`)

2. **Efecte members:** Si `!activeCommunityId`, netejar i sortir. Si canvia, netejar al start del effect, després carregar.

3. **Efecte communityReaders:** Idem: netejar al start si canvia comunitat.

4. **Race conditions:** El `cancelled` existent ja evita que respostes antigues sobreescriguin. El reset assegura que no mostrem dades barrejades.

5. **Estat buit:** Verificar que existeix missatge per comunitat sense membres (i18n si cal).
