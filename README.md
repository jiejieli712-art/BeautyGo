# BeautyGo

BeautyGo is a role-aware service marketplace for on-demand beauty appointments. This repo is being built from the PRD in small vertical slices, starting with a monorepo foundation that supports:

1. `super-app` for customer and artist flows
2. `admin-web` for review and operations
3. `api` for domain logic and integrations
4. `domain-types` for shared business models

## Current Status

`Milestone 0` is in progress:

1. workspace structure
2. role-aware foundation
3. shared domain language
4. architecture docs and next-slice planning

The current machine now has Node.js and pnpm available, so the next step is to install dependencies and run the API plus both web shells locally.

## Repo Layout

```text
apps/
  api/
  admin-web/
  super-app/
packages/
  domain-types/
docs/
  architecture/
  milestones/
```

## Next Delivery Slices

1. install workspace dependencies with `pnpm install`
2. run the local environment with `pnpm dev`
3. implement auth and role switching
4. implement artist onboarding as the first business slice
