# Proposal: Multi-idioma

## Why

L'objectiu és permetre que l'aplicació estigui disponible en tres idiomes d'interfície (Català, Castellà, Anglès) per ampliar l'accessibilitat i millorar l'experiència d'usuari. Els usuaris han de poder escollir l'idioma des del perfil.

## What

- **Idiomes**: Català (ca), Castellà (es), Anglès (en)
- **Abast**: Afecta texts de navegació, botons, menús, missatges del sistema i notificacions
- **Exclusió**: El contingut generat pels usuaris (llibres, ressenyes, comentaris) NO es tradueix; es manté en l'idioma original
- **Selector**: Des del perfil, l'usuari pot seleccionar l'idioma de la UI
- **Persistència**: La preferència es guarda al perfil i es restaura en tornar a iniciar sessió
- **No autenticat**: Idioma per defecte segons navegador; fallback a Català si no suportat
- **Fallback traduccions**: Si falta una clau en l'idioma seleccionat, es mostra la versió en Català

## User Story

Com a usuari de l'aplicació, vull poder escollir l'idioma de la interfície per tal d'utilitzar l'app en l'idioma que em resulti més còmode.

## Referència

- [Notion – Multi-idioma](https://www.notion.so/miquelroset/Multi-idioma-31d1492a7042807db390f93deede91f0)
