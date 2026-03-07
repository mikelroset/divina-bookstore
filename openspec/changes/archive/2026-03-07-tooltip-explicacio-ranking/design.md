# Design: Tooltip explicació de càlcul de rànquing

## Approach

- Afegir una icona d'informació (Info) al costat del títol "Rànquing" al bloc de leaderboard a CommunityView.
- Desktop: tooltip al hover (quan el ratolí passa sobre la icona).
- Mobile: tooltip al clic (toggle) perquè no hi ha hover.

## Implementation

- Utilitzar un component o patró existent de tooltip si n'hi ha (p. ex. `title` natiu, Tippy, Radix, o CSS pur).
- El text del tooltip serà estàtic, en català, amb les regles de càlcul del spec de gamificació.
