# Design: Unificar estil de botons i ubicació

## 1. Definició del botó primari

- **Color**: `primary-500` normal, `primary-600` hover, `primary-700` active/pressed
- **Tipografia**: font-medium, text-white
- **Forma**: `rounded-xl`, padding consistent (`px-4 py-3` per botons principals, `px-4 py-2` per variants més petites)
- **Transició**: `transition-colors` per hover/pressed

## 2. Componentes reutilitzables

### PrimaryButton
- Acció principal de la pantalla
- Classes: `inline-flex items-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-medium rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`
- Props: `children`, `onClick`, `to` (Link), `disabled`, `className`, `icon`

### SecondaryButton
- Acció alternativa
- Classes: `inline-flex items-center gap-2 px-4 py-3 bg-white/80 border border-primary-500 text-slate-700 hover:bg-primary-50 hover:border-primary-400 font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`

### GhostButton
- Accions menors
- Classes: `inline-flex items-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`

## 3. Ubicació unificada

A Biblioteca, Comunitat i Ressenyes, el layout del header ha de ser:
```
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
  <div>
    <h2>Títol</h2>
    <p>Subtítol</p>
  </div>
  {accions principals && <PrimaryButton ... />}
</div>
```

El botó principal va sempre a la dreta del títol (desktop) o sota (mobile).

## 4. Jerarquia visual

- Només una acció primària per pantalla (PrimaryButton)
- Altres accions: SecondaryButton o GhostButton
- Pantalles sense acció clarament principal: cap PrimaryButton o una sola

## 5. Estats interactius

- **normal**: estil base
- **hover**: variant més fosca/visible
- **active/pressed**: variant encara més fosca
- **disabled**: opacity-50, cursor-not-allowed

## 6. Responsive

- Desktop: botó a la dreta del títol
- Mobile: botó sota el títol (flex-col), mateix estil
- Espaiat mínim entre botons quan n'hi ha diversos (gap-3)
