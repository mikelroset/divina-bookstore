# Design: Unificar estils blocs perfil

## Decisió

Aplicar les mateixes classes Tailwind als tres blocs de estadístiques del perfil:
- Total de Llibres (referència)
- Llibres Completats
- Punts totals (incloent el bloc de gamificació)

**Classes a usar:** `bg-primary-50 rounded-xl p-4 border border-primary-500`

## Canvis

- **Llibres Completats:** canviar `bg-emerald-50 border-emerald-200` → `bg-primary-50 border-primary-500`
- **Punts totals:** canviar `border-primary-200` → `border-primary-500` per alinear amb la resta
