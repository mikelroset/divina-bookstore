# Design: Bug – Llistat de cards a biblioteca amb estrelles erròneas

## Decisió

- Reemplaçar els emojis d'estrelles per l'icona `Star` de Lucide React al component `BookCard`.
- Utilitzar `book.rating` (número de 0 a 5) per determinar quants estrelles omplir.
- Estrelles omplides: `fill-primary-500 text-primary-500` (verd primary).
- Estrelles buides: `text-slate-300` (gris).
- Si `book.rating` és 0, undefined o null, mostrar totes les estrelles buides.

## Implementació

A `src/components/common/BookCard.jsx`, reemplaçar les línies 24-28:

```jsx
<div className="flex items-center gap-1 mb-3">
  {[...Array(5)].map((_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${
        i < (book.rating || 0)
          ? "fill-primary-500 text-primary-500"
          : "text-slate-300"
      }`}
    />
  ))}
</div>
```
