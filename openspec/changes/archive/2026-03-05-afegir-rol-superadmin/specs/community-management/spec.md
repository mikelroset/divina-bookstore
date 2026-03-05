# community-management (delta)

## NEW Requirements

### Requirement: Superadmin role and community management

The app SHALL support a Superadmin role for users who can create and manage communities beyond normal membership.

- **Persistence:** The Superadmin role SHALL be stored in the backend (e.g. Firestore document `config/superadmins` with `{ uids: string[] }`). The user with uid `6g9VBE4EagT5yk8PuSZRHZGwAuH2` (mikelroset@gmail.com) SHALL be the first Superadmin.
- **Profile section:** A Superadmin SHALL see a "Gestió de comunitats" entry point in their profile. Non-superadmin users SHALL NOT see this section.
- **Community list:** The Superadmin SHALL be able to view a list of all communities (not limited to their memberships). Each item SHALL show at least: name, status (active/archived/inactive), member count. The list SHALL support search and pagination (e.g. 10 per page).
- **Create community:** The Superadmin SHALL be able to create a community with name (required), description (optional), and visibility (public/private). The Superadmin SHALL be the owner of newly created communities.
- **Edit and deactivate:** The Superadmin SHALL be able to edit community fields and to deactivate or archive a community. Archived/inactive communities SHALL NOT appear to normal users but SHALL remain accessible in the management view.
- **Member management:** The Superadmin SHALL be able to view, add, remove, block, unblock, and change roles of community members.
- **Access control:** Management UI and actions SHALL be restricted to Superadmins. Non-superadmin users attempting to access the management view (e.g. via deep link) SHALL be redirected to a safe screen (e.g. profile).
- **Loading and error states:** All management screens SHALL display loading state while fetching data, error state with a retry option when operations fail.
