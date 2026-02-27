# Design: Bug – Persistir l’objectiu anual

## Context

- L’objectiu anual es guarda a `users/{uid}/prefs` via `userPrefsService.updateUserPrefs(userId, { annualGoal })`.
- El hook `useUserPrefs` exposa `annualGoal` (número) i `setAnnualGoal(value)` que actualitza l’estat local i crida `updateUserPrefs`.
- A ProfileView el camp és un `<input type="number" value={goal} onChange={(e) => setAnnualGoal(e.target.value)} />` amb `goal = parseInt(annualGoal, 10) || 0`, de manera que el valor mostrat és sempre numèric: el 0 per defecte no es pot “esborrar” i en escriure es produeix “01” / “010”.

## Decisions

1. **Control del input amb string per a la UX**  
   Mantenir el valor del camp com a string a la UI (o permetre valor buit) mentre l’usuari escriu; en desar (onBlur o debounce), convertir a número i persistir. Així es pot escriure “10” sense el zero inicial.

2. **Persistència**  
   Seguir utilitzant `setAnnualGoal` del hook, assegurant que es crida amb el valor final (número) en perdre el focus o després d’un debounce, i que `updateUserPrefs` s’executa correctament. Comprovar que les prefs es llegeixen en muntar el perfil i que no hi ha condicions de cursa que deixin el camp buit o incorrecte.

3. **Valor inicial**  
   Mostrar el valor carregat des de Firestore quan `useUserPrefs` ha retornat les dades (evitar mostrar 0 si el valor real encara no s’ha carregat, si cal).
