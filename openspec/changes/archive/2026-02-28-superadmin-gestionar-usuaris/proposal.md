# Proposal: El superadmin pot gestionar usuaris

## Objectiu

Permetre que el superadministrador de l'aplicació pugui gestionar els comptes d'usuari mitjançant dues accions:

- **Desactivar usuari (soft delete):** el compte deixa d'estar actiu però les dades es mantenen
- **Eliminar usuari (hard delete):** eliminació definitiva del compte i totes les dades

## Abast

Aquesta funcionalitat permet administrar la plataforma en situacions com:

- comptes fraudulents
- usuaris que incompleixen normes de la comunitat
- comptes inactius
- peticions d'eliminació de compte per part de l'usuari

## Desactivació (soft delete)

- L'usuari no pot iniciar sessió
- El perfil deixa de ser visible dins la comunitat
- El contingut públic (ressenyes, likes, etc.) es mostra com "Usuari desactivat"
- Manté la coherència de dades i estadístiques agregades

## Eliminació (hard delete)

- Elimina el compte d'autenticació
- Elimina biblioteca, progrés, insígnies, ressenyes i contingut creat
- Garanteix que altres usuaris no perdin punts/insígnies per contingut eliminat

## Restriccions

- Només usuaris amb rol **superadmin** poden accedir
- Confirmació obligatòria abans de cada acció
- Registre en log administratiu
- Bloqueig d'autoeliminació (el superadmin no pot eliminar el seu propi compte)

## Referència

- [Notion – Feature: El superadmin pot gestionar usuaris](https://www.notion.so/miquelroset/Feature-El-superadmin-pot-gestionar-usuaris-3231492a704280569ff1ee6b8f3102dc)
