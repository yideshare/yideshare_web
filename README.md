This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Onboarding (dev server + prisma bootup)

First, run the development server with following commands in coding IDE or local terminal:

(first-time to install package dependencies)

```bash
npm install
```
Ensure your `.env` file includes the following variables for local dev:
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_URL`
- `YALIES_API_KEY`
- `NODE_ENV=development`

Build, create, and start Docker containers:

```bash
docker compose up -d
```
Runs dev server on port 3000

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

When done,
```bash
docker compose down
```

## Using primsa:

Open a second terminal window and input the following commands:

Sync with latest db changes or create if no db:

```bash
npx prisma db push
```

Test:

```bash
npx prisma studio
```

## Using Playwright:

First navigate to testing folder:

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

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
