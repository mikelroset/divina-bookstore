# Tasks: Reading Goals & Insights

## 1. Objectiu anual i barra de progrés

- [x] 1.1 Afegir camp d'objectiu anual (número) al perfil d'usuari (Firestore o context); persistir i llegir des del perfil.
- [x] 1.2 Mostrar barra de progrés visual (llibres finalitzats / objectiu) al perfil i/o Dashboard; tractar objectiu 0 (no dividir, mostrar empty state o missatge).

## 2. Algoritme de ritme i predicció d'acabament

- [x] 2.1 Calcular "ritme mitjà de lectura" (pàgines/dia) basant-se en les actualitzacions de "pàgina actual" dels darrers 7 dies (i timestamps si existeixen).
- [x] 2.2 A la pantalla del llibre en lectura, mostrar text dinàmic: "Al teu ritme actual, acabaràs aquest llibre en X dies (Data estimada: DD/MM)".
- [x] 2.3 Si la mitjana de pàgines/dia és ≤ 0: no mostrar data de finalització; mostrar empty state "Llegeix unes quantes pàgines per calcular el teu ritme!".
- [x] 2.4 Si l'usuari redueix la pàgina actual (re-lectura): ignorar valors negatius en el càlcul de la mitjana (mantenir mitjana prèvia o 0 fins a la següent actualització positiva).

## 3. Daily streak

- [x] 3.1 Mostrar icona de "foc" (streak) al Dashboard.
- [x] 3.2 Calcular streak: augmentar cada dia que l'usuari actualitzi la "pàgina actual" en qualsevol llibre; reiniciar a zero si passa un dia sense activitat.
- [x] 3.3 Persistir o derivar streak des de dades d'activitat (segons model de dades existent).

## 4. Mini-chart setmanal

- [x] 4.1 Dins de la fitxa del llibre (en lectura), incloure un gràfic senzill (mini-chart) amb el progrés de pàgines de l'última setmana.

## 5. Edge cases i protecció

- [x] 5.1 Si el llibre està "Llegint" però té 0 pàgines totals: demanar les pàgines totals abans d'activar predicció i insights (o amagar predicció fins que hi hagi total).
- [ ] 5.2 (Opcional) Canvi d'any: reiniciar objectiu anual a 0 la nit del 31/12; arxiu "2025" per historial anterior (implementar si es vol en aquest canvi).

## 6. Verificació

- [x] 6.1 Provar objectiu anual i barra de progrés al perfil.
- [x] 6.2 Provar predicció d'acabament amb activitat als últims 7 dies; provar empty state sense activitat; provar re-lectura (pàgina enrere).
- [x] 6.3 Provar streak: diversos dies amb actualitzacions i un dia sense; comprovar reinici.
- [x] 6.4 Provar mini-chart i llibre sense pàgines totals.
