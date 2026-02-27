# Proposal: Bug – La Ratxa no es calcula bé

## Why

L’estadística de Ratxa al Dashboard és sempre 0. L’usuari que llegeix diversos dies seguits no veu la ratxa incrementar-se, i la funcionalitat de “dies consecutius llegint” no aporta valor.

## What

- **Comportament esperat:** Cada dia que l’usuari llegeix de manera consecutiva (actualitzant la pàgina actual d’almenys un llibre) la ratxa s’incrementa. Si passa un dia sense activitat, la ratxa es reinicia a 0.
- **Correcció:** Revisar i assegurar que (1) les activitats de lectura es registren correctament a les prefs de l’usuari (`readingActivityDays`), (2) el càlcul del streak des d’aquestes dades és correcte, i (3) el valor es carrega i es mostra a la vista d’Inici.

## Impacte

- **Mitjà:** La ratxa és una funcionalitat de motivació; si sempre és 0, no es percep.

## Impact (implementació)

- **userPrefsService:** `addReadingActivityDay` i `computeStreak`; comprovar que les prefs es llegeixen i es persisteixen.
- **Flux:** En desar un llibre amb `currentPage` s’ha de cridar `recordReadingActivity`; al Dashboard es mostra el streak des de `useUserPrefs`.
- **Possibles causes:** No cridar `recordReadingActivity` en tots els punts on es canvia la pàgina actual; error en el càlcul de dies consecutius; prefs no carregades o no persistides.
