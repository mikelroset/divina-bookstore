# Proposal: Agrupar en un Box objectiu de llibres

## Why

L'objectiu és agrupar dins d'un mateix Box la informació referent als objectius anuals de lectura per fer el progrés més visible i motivador. Actualment aquesta informació pot estar dispersa o no tenir una representació visual clara.

## What

El nou component ha de mostrar dins d'un únic Box:

- **Títol**: Objectiu de llibres aquest any
- **ProgressBar**: barra visual del progrés
- **Progrés numèric**: text del tipus "Progrés anual: X / Y llibres"

Exemple:

```
Objectiu de llibres aquest any
[████░░░░░░]
Progrés anual: 1 / 10 llibres
```

Aquest Box ha d'ajudar l'usuari a:

- Veure ràpidament el seu progrés
- Mantenir motivació per continuar llegint
- Entendre quant falta per assolir l'objectiu anual

## Ubicacions

- **Home (Inici)**: Box amb objectiu i progrés quan `annualGoal > 0`
- **Perfil**: Box que agrupa l'input per configurar l'objectiu + ProgressBar + progrés numèric quan objectiu > 0

## Referència

- [Notion – Feature: Agrupar en un Box objectiu de llibres](https://www.notion.so/miquelroset/Feature-Agrupar-en-un-BOx-objectiu-de-llibres-3221492a70428041b3b2f57d172c5fbb)
