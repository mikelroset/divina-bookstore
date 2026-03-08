# Proposal: Afegir links al logo i a l'avatar

## Why

Els usuaris necessiten navegar ràpidament a les seccions principals sense haver de buscar opcions al menú. Actualment el logotip i l'avatar no fan cap acció en clicar-los.

**User story:** Com a persona usuària registrada, vull poder navegar ràpidament a l'inici tocant el logotip i al meu perfil tocant l'avatar, per tal d'accedir a les seccions principals sense haver de buscar opcions al menú.

## What

- Logotip → enllaç a Home (`/`)
- Avatar → enllaç a Perfil (`/profile`)

Elements clicable amb feedback visual (cursor, hover). Navegació via React Router (SPA, sense recarregar).

## Resultat esperat

- Clic al logotip: navega a la pàgina d'inici.
- Clic a l'avatar: navega a la pàgina de perfil.
- Si ja estem a Home o Perfil, no hi ha canvis inesperats.

## Referència

- [Notion – Afegir links al logo i a l'avatar](https://www.notion.so/miquelroset/Afegir-links-al-logo-i-a-l-avatar-31d1492a704280a39e28e050ea8f3c90)
