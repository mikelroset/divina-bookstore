# Design: Pàgina de login informativa

## Estructura de blocs de contingut

### Bloc 1 — Value proposition (hero)
- Titular curt orientat a benefici (exemples):
  - "Organitza la teva lectura i gaudeix més dels llibres."
  - "La teva llibreria personal, amb reptes i comunitat."
- Subtítol (1 línia): "Segueix el progrés, mantén la ratxa i descobreix què llegeix la comunitat."

### Bloc 2 — Com funciona en 3 passos
1. Entra amb Google.
2. Afegeix llibres a "Vull llegir", "Llegint" i "Llegit".
3. Fes seguiment del progrés i la teva ratxa.

### Bloc 3 — Què hi pots fer (features per targetes)
- **Llegint:** marca progrés i estat del llibre.
- **Ratxa:** mantén l'hàbit amb una ratxa visual.
- **Comunitat:** mira rànquings, tendències i llibres populars.
- **Descobriment:** cerca i guarda llibres per més tard.

### Bloc 4 — Confiança i privacitat (microcopy)
- "Només fem servir el teu compte Google per identificar-te."
- "No publiquem res sense el teu permís."
- "Pots esborrar el compte quan vulguis."

### Bloc 5 — FAQ curt (2–4 preguntes)
- "Per què he de fer login?"
- "Què passa amb les meves dades?"
- "Puc canviar d'usuari?"
- "Puc desactivar la part social?" (si aplica)

## Layout

- **Desktop:** dues columnes: esquerra (CTA + login), dreta (blocs informatius amb targetes).
- **Mòbil:** CTA a dalt; blocs en format scroll.
- Evitar blocs llargs: màxim 3–5 bullets per targeta; iconografia simple per cada feature.

## Edge cases

- **Usuari dubta del login:** Microcopy de confiança a prop del botó (ex. "Per guardar la teva biblioteca i la teva ratxa", "No publiquem res sense permís").
- **Usuari sense compte Google:** Mostrar missatge "Cal un compte Google per entrar" i enllaç a FAQ.
- **Error o cancel·lació del Social Login:** Missatge d'error clar ("No s'ha pogut iniciar sessió. Torna-ho a provar.") mantenint la pantalla amb els blocs informatius.
