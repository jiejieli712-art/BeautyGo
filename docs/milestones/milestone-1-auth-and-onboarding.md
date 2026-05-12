# Milestone 1: Auth, Role Shell, and Artist Onboarding

## Goal

Deliver the first interactive product loop after bootstrap:

1. a mock login/session flow
2. role-aware customer and artist shell states
3. artist onboarding application submission
4. admin-side application review
5. API CRUD support for the flow

## Slice Definition

### Slice 1: Mock session login

Outcome:

1. user can choose a role
2. session is created through the API
3. UI switches to role-specific views

### Slice 2: Artist application submission

Outcome:

1. artist role can fill and submit onboarding data
2. payload includes bio, scenes, experience, and portfolio placeholders
3. submission result is visible in the UI

### Slice 3: Admin review list

Outcome:

1. admin can view submitted applications
2. admin can change status
3. admin can leave a review note

## Acceptance Gate

Milestone 1 is complete when:

1. `pnpm typecheck` passes
2. `pnpm build` passes
3. API exposes working session and artist application endpoints
4. super-app can submit an artist application
5. admin-web can review and update an application
