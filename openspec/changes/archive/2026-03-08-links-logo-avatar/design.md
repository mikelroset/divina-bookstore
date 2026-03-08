# Design: Links al logo i avatar

## Decisió

- Utilitzar `Link` de React Router per al logotip i l'avatar al Header.
- Logotip: `to="/"` (ROUTES.HOME).
- Avatar: `to="/profile"` (ROUTES.PROFILE).
- Estils: cursor pointer, hover sutil (opacity o scale) per feedback visual.
- Si l'avatar no es renderitza (fallback a icona), la zona clicable segueix portant al perfil.
