# Design: Box objectiu de llibres

## Estat actual

- **HomeView**: Ja existeix un Box "Objectiu anual" amb BoxTitle, text "X / Y llibres" i ProgressBar. Orde actual: títol → text numèric → barra.
- **ProfileView**: L'input "Objectiu de llibres aquest any" i la ProgressBar + text "Progrés anual: X / Y llibres" estan en divs separats, no dins d'un Box específic.

## Solució

### HomeView

- Mantenir el Box existent.
- Ajustar l'ordre dins del Box per coincidir amb l'exemple de Notion: **títol → ProgressBar → progrés numèric**.
- El Box només es mostra quan `annualGoal > 0` (comportament actual).

### ProfileView

- Crear un únic Box que contingui:
  1. **BoxTitle** (icona Target): "Objectiu de llibres aquest any"
  2. **Input** per introduir/editar l'objectiu (comportament actual: desa en blur)
  3. Quan `goal > 0`: **ProgressBar** i text "Progrés anual: X / Y llibres"

### Consistència visual

- Usar `Box`, `BoxTitle`, `ProgressBar` del design system.
- Orde: títol → barra → text numèric (quan hi ha progrés).
- En ProfileView, l'input va abans de la barra (l'usuari configura primer l'objectiu).
