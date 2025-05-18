# EmployeesAPI

A REST API that communicates with using Express.js, Prisma and Postgres database
that stores employee data. The API manages authentication and CRUD operations.

## Usage

1. `npm i`.
2. Make a `.env`, `touch .env`. This will contain database information.
3. Add `DATABASE_URL="[path]"`, where `[path]` is your Postgres database.
4. `npm run dev` (Run locally); ~~Or `npm run build`, `npm run start` (To run in
   production)~~. (Will have to configure a bundler to resolve paths).

## Data

Seeded data is provided. See `prisma/seed.ts` for example data. Alternatively, see `prisma/seed_tests.ts` for example data used for testing.

Real data can be used through [NeonDB](https://neon.tech/docs/import/import-sample-data#employees-database).

To seed data `npm run prisma-seed`.

## Testing

Tests have been created using [Vitest](https://vitest.dev/).

Tests are dependent on seeded data, run `npm run prisma-seed-tests` to seed data for testing.

## Whats next?

- Complete `GET`, `POST`, `PUT` and `DELETE` tests for the routes.
- Utilise JWT for session management.
- Utilise RBAC.
