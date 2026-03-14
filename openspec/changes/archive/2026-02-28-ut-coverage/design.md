# Design: UT & coverage

## Arquitectura del sistema de tests

### Capes

1. **Unit tests (Vitest):** Mòduls aïllats, funcions pures, components React amb Testing Library
2. **Integration tests:** Serveis + mocks de Firebase/Firestore
3. **E2E (futur):** Playwright o similar per fluxos complets

### Mòduls crítics amb tests obligatoris

| Mòdul | Ubicació | Tipus de test |
|-------|----------|---------------|
| auth | `src/services/auth*`, `src/contexts/*` | Unit (mock Firebase) |
| library | `src/services/bookService`, `src/hooks/useLibrary` | Unit, integració (mock) |
| reading progress | `src/services/*`, `src/utils/readingInsights` | Unit |
| badges | `src/services/badgeService`, gamification | Unit |
| reviews | `src/services/reviewService` | Unit |

### Configuració de coverage

- **Vitest** amb `coverage` provider (v8 o istanbul)
- Umbral mínim: 70% línies (configurable per branches)
- Excloure: `node_modules`, `*.config.js`, mocks

### CI

- GitHub Actions: `npm run test:run` en push i pull_request
- El build ha de fallar si els tests fallen (bloqueig de desplegament)
- Executar en totes les branques rellevants (main i feature)

### Edge cases considerats

1. **Tests sense assertions reals:** Revisar que cada test validi comportament real
2. **Coverage en codi poc important:** Prioritzar mòduls crítics (auth, library, reading, badges, reviews)
3. **Tests lents:** Objectiu < 5 minuts per a tota la suite
4. **Monitorització:** (Fase posterior) Registrar errors d'aplicació i exceptions
