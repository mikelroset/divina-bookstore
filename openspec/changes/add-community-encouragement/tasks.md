# Tasks: Add community encouragement

## 1. Backend – Encouragement service and Firestore

- [x] 1.1 Create `src/services/encouragementService.js` with Firestore collection `encouragements`. Add `sendEncouragement(fromUserId, fromUserName, toUserId)` that creates a document with `fromUserId`, `fromUserName`, `toUserId`, `createdAt` (serverTimestamp).
- [x] 1.2 Add `getEncouragementsForUser(userId)` that queries `encouragements` where `toUserId == userId`, ordered by `createdAt` descending, and returns an array of encouragement objects (include `fromUserName` for display).

## 2. Community view – Send encouragement

- [x] 2.1 In Community view (or ReaderCard), add an "Encoratja" button (or equivalent) per other reader. On click, call `encouragementService.sendEncouragement(currentUser.uid, currentUser.displayName, reader.uid)`. Ensure the current user's own card does not show this button (list already excludes current user).
- [x] 2.2 Handle loading and error state for send (e.g. disable button while sending, show feedback on error).

## 3. Home view – Show received encouragements

- [x] 3.1 In HomeView, add a section that loads encouragements via `encouragementService.getEncouragementsForUser(user.uid)` (e.g. in useEffect or hook). Show section only when there is at least one encouragement.
- [x] 3.2 Render each encouragement as "[fromUserName] t'anima a seguir llegint". When there are no encouragements, do not show the section (or show empty state); leave rest of Home unchanged.

## 4. Firestore security (optional but recommended)

- [x] 4.1 Update Firestore security rules so that: only the sender can create documents with their own `fromUserId`; only the recipient can read documents where `toUserId` matches their uid. Document in code or README if rules are managed in Firebase Console.
