# Tasks: UT & coverage

## 1. Configuració coverage mínim

- [x] 1.1 Configurar Vitest amb `coverage` (reporter) i exigir límit mínim 70% a línies, funcions i branches (o el màxim assolible documentant el gap).
- [x] 1.2 Afegir script `test:coverage` a package.json que executi vitest run --coverage.

## 2. Ampliar CI

- [x] 2.1 Ampliar el workflow de GitHub Actions per executar tests també en push/PR a branques feature/* (o ** si ja cobreix).
- [x] 2.2 Assegurar que el build falla si els tests fallen (ja ho fa).

## 3. Unit tests per mòduls crítics

- [ ] 3.1 Auth/session: tests per lògica de login, logout, sessió (mòduls relacionats: auth, AuthContext si apliquen).
- [x] 3.2 Library: tests per bookService (add, remove, get) i helpers de biblioteca.
- [x] 3.3 Reading progress: tests per registre de lectura i càlcul de progrés.
- [x] 3.4 Badges/gamification: tests per lògica de punts i insígnies (gamificationService, badgeService si són testeables sense Firebase).
- [ ] 3.5 Reviews: tests per funcionalitat de ressenyes si existeix.

## 4. Edge cases

- [x] 4.1 Assegurar que tots els tests tenen assertions reals (no expect(true).toBe(true)).
- [ ] 4.2 Verificar que la suite completa s’executa en menys de 5 minuts.
- [ ] 4.3 Documentar o implementar monitorització d’errors d’aplicació (opcional per aquest canvi).

## 5. Verificació

- [x] 5.1 Executar `npm run test:run` i `npm run test:coverage` i assegurar que passen.
- [x] 5.2 Verificar que CI executa els tests i el coverage en push/PR.
