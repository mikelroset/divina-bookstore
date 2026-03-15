# Tasks: Bug membres comunitat refresh

## 1. Reset d'estat en canvi de comunitat

- [ ] 1.1 En l'effect de members: si !activeCommunityId, setMembers([]) i return. Al start de l'effect (quan canvia comunitat), setMembers([]) abans de carregar.
- [ ] 1.2 En l'effect de communityReaders: setCommunityReaders([]) al start quan activeCommunityId canvia (o quan és fals).
- [ ] 1.3 En l'effect de leaderboard: assegurar que setLeaderboard([]) i setMemberPointsByUserId({}) es criden quan activeCommunityId és fals o canvia.

## 2. Verificació

- [ ] 2.1 Canviar de comunitat X a Y: només es mostren membres de Y.
- [ ] 2.2 Canvi ràpid entre comunitats: només es mostra la llista de l'última seleccionada.
- [ ] 2.3 Comunitat sense membres: es mostra missatge d'estat buit.
