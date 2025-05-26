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

Schema and API is based off of [NeonDB employees database](https://neon.tech/docs/import/import-sample-data#employees-database). Follow the guide to generate more data.

Seeded data is also provided. See `prisma/seed.ts` for example data. The data creates a new department called `_gaming` having 51 employees.

Alternatively, see `prisma/seed_tests.ts` for example data which is used for testing. This data creates a new department called `_internship` having 50 employees.

The seed data have been randomly generated from [Mockaroo](https://www.mockaroo.com/). With each `first_name` and `last_name` being prefixed with `_` to distinguish the seeded values.

To seed data `npm run prisma-seed`, this seed uses `prisma/seed.ts`.

## Testing

Tests have been created using [Vitest](https://vitest.dev/). Tests are dependent on seeded data, `prisma/seed_test.ts`.

1. Run `npm run prisma-seed-tests` to seed the data used for testing.
2. `npm run test` to run tests.

## Whats next?

- Complete `GET`, `POST`, `PUT` and `DELETE` tests for the routes.
- Utilise JWT for session management.
- Utilise RBAC.
