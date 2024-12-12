# EmployeesAPI

A REST API that communicates with using Express.js, Prisma and Postgres database
that stores employee data. The API manages authentication and CRUD operations.

## Usage

1. `npm i`.
2. Make a `.env`, `touch .env`. This will contain database information.
3. Add `DATABASE_URL="[path]"`, where `[path]` is your Postgres database. Eg.
   `DATABASE_URL="[path]"`.
4. `npm run dev` (Run locally); Or `npm run build`, `npm run start` (To run in
   production).

## Data

Seeded data is provided, see `prisma/seed.ts` for example data.

Real data can be used through [NeonDB](https://neon.tech/docs/import/import-sample-data#employees-database).
