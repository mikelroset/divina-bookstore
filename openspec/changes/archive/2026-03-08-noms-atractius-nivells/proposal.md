# Proposal: Noms atractius pels nivells (no números)

## Why

Els usuaris veuen actualment el nivell com a número (1, 2, 3…), cosa que és menys motivadora i menys fàcil d'entendre. Un sistema de noms atractius i coherents augmenta la sensació de progrés i la motivació a seguir llegint.

**User story:** Com a usuari de Divina Book Store, vull veure el meu nivell amb un nom atractiu (en lloc d'un número), per tal d'entendre fàcilment el meu progrés i sentir més motivació a seguir llegint.

## What

- Substituir la visualització numèrica del nivell per noms atractius amb estructura: **Títol del rol — Rang mineral**.
- Catàleg de 71 nivells: 70 nivells amb 10 rols × 7 rangs minerals (Ferro, Bronze, Plata, Or, Platí, Esmeralda, Diamant) + nivell 71 "Llegenda Divina".
- Associar colors als rangs minerals per identificació ràpida.
- Mantenir el càlcul intern basat en punts; els noms són capa de presentació (editable sense afectar històric).
- Fallback segur per nivells fora de rang (clamp 1–71).

## Puntuació

- 12.000 punts ≈ Llegenda Divina (nivell 71).
- ~171 punts per rang mineral.
- Lector habitual (~6000 pàgines/any) → ~20 anys per arribar al final.

## Referència

- [Notion – Noms atractius pels nivells (no números)](https://www.notion.so/miquelroset/Noms-atractius-pels-nivells-no-n-meros-31d1492a704280fb9134caf7b1d9ea7a)
