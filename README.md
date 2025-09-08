This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Onboarding (dev server + prisma bootup)

First, run the development server with following commands in coding IDE or local terminal:

Install package dependencies (first time)

```bash
npm install
```
Ensure your `.env` file includes the following variables for local dev:
- `NODE_ENV=development`
- `YALIES_API_KEY`
- `POSTGRES_DB=z<your_db_name>`
- `POSTGRES_PASSWORD=<your_password>`
- `DATABASE_URL="postgresql://postgres:<your_password>@postgres:5432/<your_db_name>?schema=public"`
- `DIRECT_URL="postgresql://postgres:<your_password>@postgres:5432/<your_db_name>?schema=public"`

Build, create, and start Docker containers:

```bash
docker compose up -d
```
Runs dev server on port 3000

```bash
npm run dev
```
Sync with latest db changes or create if no db:

```bash
npx prisma db push
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To stop all running containers:
```bash
docker compose down
```

## Helpful Commands:

Seed the DB (optional):

```bash
npx prisma db seed
```

Examine the DB (testing / working with APIs):

```bash
npx prisma studio
```

To stop the containers AND delete all database data (useful for a clean restart):

```bash
docker-compose down -v
```

## Using Playwright:

First, install Playwright browsers (only needed once after installing Playwright):

```bash
npx playwright install
```

Then navigate to testing folder:

```bash
cd playwright-tests
```

To run tests simple:

```bash
npx playwright test
```

Recommended (in UI mode)

```bash
npx playwright test --ui
```

For detailed Playwright testing instructions, see [playwright-tests/README.md](./playwright-tests/README.md)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.