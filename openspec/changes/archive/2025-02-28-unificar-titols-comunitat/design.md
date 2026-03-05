# Design: Unificar títols de la comunitat

## Context

La pàgina de Comunitat (CommunityView) té diversos blocs: Membres, Estàs llegint, La resta de lectors ara mateix, Estadístiques de la Comunitat. El bloc "Estàs llegint" ja té el format correcte: títol amb icona verda i tipografia unificada.

## Estil de referència (Estàs llegint)

```jsx
<div className="flex items-center gap-2 mb-4">
  <BookMarked className="w-5 h-5 text-primary-600" />
  <h3 className="text-sm font-medium text-primary-800 uppercase tracking-wide">
    Estàs llegint
  </h3>
</div>
```

## Decisions

1. **Tipografia:** `text-sm font-medium text-primary-800 uppercase tracking-wide` per a tots els títols.
2. **Icones:** `w-5 h-5 text-primary-600` per a totes. Mantenir icona adequada per bloc: Shield (Membres), BookMarked (Estàs llegint), Users (La resta de lectors), BarChart2 (Estadístiques).
3. **Estructura:** Per als blocs amb card (Membres, Estadístiques), moure el títol fora del card com a fila independent, igual que Estàs llegint i La resta de lectors.
4. **CommunityView:** Modificar les quatre seccions per aplicar l’estil unificat.
