# Design: Noms atractius pels nivells

## Catàleg de nivells (1–71)

### Rols i rangs minerals

Cada rol té 7 subnivells (un per rang mineral). Ordre: Ferro → Bronze → Plata → Or → Platí → Esmeralda → Diamant.

| Rols (10) | Nivells |
|-----------|---------|
| Aprenent de Biblioteca | 1–7 |
| Aprenent de Llibres | 8–14 |
| Novici de la Paraula | 15–21 |
| Escuder de la Tinta | 22–28 |
| Cavaller de les Històries | 29–35 |
| Guardià del Pergamí | 36–42 |
| Cronista | 43–49 |
| Arxiver Reial | 50–56 |
| Gran Bibliotecari | 57–63 |
| Saviesa Antiga | 64–70 |
| **Llegenda Divina** | 71 |

### Fórmula de punts

- `POINTS_PER_LEVEL = 171` (~12000 / 70)
- `pointsToLevel(points) = clamp(1, 71, 1 + floor(points / 171))`
- El nivell numèric es manté intern; la UI mostra només el nom.

### Colors per rang mineral

| Rang | Color (Tailwind / hex) |
|------|------------------------|
| Ferro | gris fosc (`slate-700`) |
| Bronze | marró/coure (`amber-800`) |
| Plata | gris clar (`slate-400`) |
| Or | daurat (`amber-500`) |
| Platí | blau clar (`sky-400`) |
| Esmeralda | verd (`emerald-500`) |
| Diamant | blau brillant (`blue-400`) |

### Fallback

- Si nivell < 1 → mostrar nivell 1.
- Si nivell > 71 → mostrar nivell 71.
- Registrar anomalia a console (opcional, per debug).

### Coherència

- Els noms són una capa de presentació; el progrés es basa en l'id numèric.
- Canvis de copy en el futur no afecten l'històric de punts.
