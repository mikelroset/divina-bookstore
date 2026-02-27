# Proposal: Bug – Persistir l’objectiu anual

## Why

Quan l’usuari va a la pàgina de Perfil per configurar l’objectiu anual de llibres, el valor introduït no es persisteix correctament i la UX del camp és deficient: el zero per defecte no es pot eliminar (en introduir "10" queda "010"), no hi ha feedback clar de desat i en refrescar la pàgina el valor es perd. Això bloqueja o dificulta l’ús de la funcionalitat d’objectiu anual.

## What

- **Persistència:** Assegurar que l’objectiu anual es desa a Firestore (prefs) en canviar el valor i que es carrega correctament en obrir el perfil; en refrescar o tornar a entrar, el valor ha de seguir visible.
- **UX del camp:** Fer que el camp numèric permeti escriure l’objectiu sense el zero inicial bloquejant (p. ex. poder escriure "10" sense que es mostri "010"); considerar desar en perdre el focus (onBlur) o amb un petit retard (debounce) per donar feedback que s’ha desat.
- **Feedback opcional:** Mostrar breument que s’ha desat (opcional) per tranquil·litzar l’usuari.

## Impacte

- **Perfil:** Camp d’objectiu anual amb valor inicial carregat des de prefs; persistència fiable; comportament del camp corregit.
- **reading-goals-insights:** La capacitat d’objectiu anual queda usable; no cal canviar la resta de la feature.
