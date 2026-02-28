# Proposal: Bug – Llistat de cards a biblioteca amb estrelles erròneas

## Why

Tots els llibres (cards) al llistat de biblioteca mostren sempre 5 estrelles, independentment de la valoració real que l'usuari hagi assignat al llibre. Això confon l'usuari i no reflecteix la informació real de valoració.

**Impacte:** Mitjà. Afecta la confiança de l'usuari en la informació mostrada i la utilitat del sistema de valoració.

## What

- Utilitzar el component `Star` de Lucide React en comptes d'emoji per mostrar les estrelles.
- Mostrar la valoració real del llibre (`book.rating`): estrelles omplides (primary/green) per a la valoració assignada i estrelles buides (gris) per a les restants.
- Si un llibre no té valoració (`rating` és 0 o undefined), mostrar totes les estrelles en gris.

## Resultat esperat

- Si un llibre va ser valorat amb 1 estrella: mostrar 1 estrella omplida (primary) i 4 estrelles buides (gris).
- Si un llibre va ser valorat amb 2 estrelles: mostrar 2 estrelles omplides i 3 buides.
- Si un llibre va ser valorat amb 3 estrelles: mostrar 3 estrelles omplides i 2 buides.
- Si un llibre va ser valorat amb 4 estrelles: mostrar 4 estrelles omplides i 1 buida.
- Si un llibre va ser valorat amb 5 estrelles: mostrar 5 estrelles omplides.
- Si un llibre no té valoració: mostrar 5 estrelles buides (gris).

## Entorn

- Plataforma: Web
- URL: https://divina-bookstore.vercel.app/library
