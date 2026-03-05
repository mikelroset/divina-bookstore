# Proposal: Feature – Afegir rol superadmin

## Description

Volem afegir un nou rol de Superadmin a l'app per poder:
- Crear i gestionar comunitats de lectura.
- Gestionar els membres d'una comunitat (afegir, treure, canviar rol, bloquejar, etc.).

L'usuari actual mikelroset@gmail.com (Firestore uid: 6g9VBE4EagT5yk8PuSZRHZGwAuH2) serà el primer Superadmin.

A nivell de producte, dins del perfil del Superadmin hi ha d'haver un apartat clar de "Gestió de comunitats".

## User Story

Com a Superadmin de Divina, vull poder crear, editar i moderar comunitats de lectura i gestionar la gent que en forma part, per tal d'assegurar que les comunitats estiguin ben organitzades, siguin segures i funcionin sense fricció.

## What

- **Rol Superadmin:** Persistit al backend (Firestore); l'usuari 6g9VBE4EagT5yk8PuSZRHZGwAuH2 és Superadmin.
- **Perfil:** Secció "Gestió de comunitats" visible només per Superadmin.
- **Vista de gestió:** Llistat de comunitats (cercador, paginació), crear, editar, desactivar/arxivar, gestionar membres (llistar, afegir, eliminar, bloquejar, canviar rol).
- **Seguretat:** Accés protegit; redirecció si no autoritzat.
- **UX:** Estats de càrrega, error i reintentar.

## Referència

- [Notion – Feature: Afegir rol superadmin](https://www.notion.so/miquelroset/Feature-Afegir-rol-superadmin-31a1492a704280e1b187d87b0b7a0ed9)
