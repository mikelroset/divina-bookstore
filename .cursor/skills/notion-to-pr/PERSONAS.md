# Multi-perspective Review Criteria

Revisió de proposta, disseny i implementació des de perspectives d’experts. L’agent aplica aquests criteris quan omple artefactes (pas 5) i durant la implementació (pas 6).

## Product Owner (PO)

**Al proposal i design:**
- [ ] Valor per usuari explícit al proposal
- [ ] Acceptance criteria complet i verificable
- [ ] Casos límit i edge cases considerats
- [ ] Prioritització clara de requisits
- [ ] Impacte en usuaris existents documentat si n’hi ha

**Durant implementació:**
- [ ] La implementació cobreix tots els criteris d’acceptació
- [ ] No hi ha desviacions no justificades respecte als requisits

## Senior Designer

**Obligatori:** El Senior Designer ha de consultar sempre el Design System del projecte (`src/design-system/` si existeix, o tokens/component existents) abans de proposar dissenys. Totes les decisions visuals han d’estar alineades amb els tokens, components i patrons definits per garantir consistència visual al 100%.

**Al proposal i design:**
- [ ] Design System consultat i referenciat (tokens, components, espaiats)
- [ ] UX consistent amb el sistema existent
- [ ] Accessibilitat bàsica considerada (aria, contrast, focus)
- [ ] Jerarquia visual clara
- [ ] Feedback visual en interaccions (loading, success, error)
- [ ] Responsive o adaptació a diferents mides de pantalla (si aplica)

**Durant implementació:**
- [ ] Ús de components i tokens del Design System (quan existeix) per garantir consistència visual
- [ ] Components i patrons visuals consistents amb el disseny del projecte
- [ ] Estats d’error i loading tenen representació visual
- [ ] Focus visible i ordre lògic de tabulació

## Senior Frontend

**Al proposal i design:**
- [ ] Components reutilitzables identificats quan és apropiat
- [ ] Gestió d’estat definida (local, context, store)
- [ ] Rendiment considerat (lazy loading, memoització si cal)
- [ ] Tipus i interfícies clares per dades

**Durant implementació:**
- [ ] Components encapsulats i reutilitzables quan cal
- [ ] Gestió d’estat adequada sense over-engineering
- [ ] Evitar re-renders innecessaris
- [ ] Validació i sanitització d’entrada d’usuari

## Senior Backend

**Al proposal i design:**
- [ ] Model de dades coherent
- [ ] API o contracte de dades definit si aplica
- [ ] Validació d’entrada especificada
- [ ] Seguretat considerada (auth, autorització, sanitització)
- [ ] Tractament d’errors i casos fallback

**Durant implementació:**
- [ ] Validació d’entrada abans de persisting o processar
- [ ] Errors tractats de forma adequada
- [ ] Cap secret ni dades sensibles exposades
- [ ] Transaccions o consistència adequada si hi ha múltiples operacions
