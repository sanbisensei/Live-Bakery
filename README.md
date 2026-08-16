This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
## Project Overview

Live Bakery is a web-based bakery ordering system designed to make cake ordering simple and convenient.

Customers can browse available cakes, create accounts, place orders, use promotional codes, and read customer reviews.

## Customer Features

- User registration
- User login
- Browse available cakes
- Add cakes to shopping cart
- Update cart quantity
- Checkout and place orders
- Apply promotional codes
- View customer reviews

## Admin Features

- Manage customer orders
- Update order status
- Add and edit cakes
- Manage cake availability
- Manage promotional codes
- Activate or deactivate promo codes

## Frontend Technologies

### Next.js
Next.js is used as the main framework for building the Live Bakery web application.

### TypeScript
TypeScript is used to provide type safety and improve code maintainability.

### Tailwind CSS
Tailwind CSS is used for styling and creating the user interface.

## Backend and Database

### Supabase
Supabase is used as the backend service for the Live Bakery system.

It provides:

- User authentication
- Database management
- Order data storage
- Cake information storage
- Promo code management
- Review data management

## System Capabilities

The Live Bakery system supports both customer and administrative operations.

Customers can complete the full ordering process from browsing cakes to checkout.

Administrators can manage cakes, orders, promotional codes, and other bakery-related information through the admin interface.

## Testing

The Live Bakery project uses Vitest and React Testing Library for automated testing.

The project includes:

- Unit testing
- Negative testing
- Integration testing

Run all tests with:

```bash
npm test