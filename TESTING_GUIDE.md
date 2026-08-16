# Live Bakery Testing Guide

This package is designed for the uploaded Next.js/React Live Bakery pages. The tests assume the common route paths below:

- `@/app/login/page`
- `@/app/signup/page`
- `@/app/cakes/page`
- `@/app/reviews/page`
- `@/app/checkout/page`
- `@/app/admin/promos/page`

If your project uses `src/app`, the existing `@` alias normally still makes these imports work. If your route folder names differ, update only the imports at the top of the affected test files.

## 1. Install testing packages

From the project root:

```bash
npm install -D vitest @vitejs/plugin-react vite-tsconfig-paths jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitest/coverage-v8
```

## 2. Copy this package into the repository

Copy:

- `tests/` -> project root `tests/`
- `vitest.config.ts` -> project root
- `.github/workflows/tests.yml` -> project root `.github/workflows/tests.yml`

Then merge the `scripts` from `package-testing-snippet.json` into your existing `package.json`. Do **not** replace your whole package.json.

## 3. Testing types used

### Unit testing

Tests one page/component behavior while repository/Supabase dependencies are mocked.

Covered examples:

- Login sends correct credentials and renders auth errors.
- Signup sends `full_name` metadata and respects password minimum.
- Cakes page calculates discounted prices correctly and renders load errors.
- Reviews page renders review data and repository failures.

Additional tested modules:

- Admin Orders
- Admin Blog
- Custom Cake

### Admin Orders Testing

Admin order tests verify:

- Order loading
- Empty order state
- Repository failure handling
- Local order status updates
- Cancelled order removal

Run:

```bash
npm run test:unit
```

### Negative testing

Intentionally sends invalid input or mocked failures and verifies the application rejects/handles them safely.

Covered examples:

- Missing promo code/discount.
- Cancelling promo deletion.
- Promo repository load failure.
- Invalid, inactive, expired, and maxed-out checkout promo codes.
- Order creation failure.
- Order-item insertion failure.
- Empty cart order attempt.

Run:

```bash
npm run test:negative
```

Two promo validation tests are marked `todo` because the current production page does not yet reject discount values outside 0..100 or negative max-use values. Add those validations, then convert the todo tests into normal tests.

### Integration testing

The included integration tests exercise several application modules together while mocking only external persistence/navigation boundaries.

Covered examples:

- Checkout: cart -> promo lookup -> total calculation -> authenticated user -> order create -> item create -> clear cart -> success navigation.
- Admin promo: UI form -> normalization -> repository create -> repository reload.

Run:

```bash
npm run test:integration
```

For **real database integration**, create a separate Supabase test project and test the repository functions against that database. Do not point automated tests at production data.

## 4. Run everything

```bash
npm test
```

Coverage:

```bash
npm run test:coverage
```

Open `coverage/index.html` after the coverage run.

## 5. What a successful run should look like

You should see unit, negative, and integration suites passing. `todo` tests are reported separately and do not fail CI.

If an import such as `@/app/reviews/page` fails, your actual route folder is different. Change that import to the correct page path; do not change the test logic.

## 6. Recommended manual integration checks

Before submission, also run the real app (`npm run dev`) and verify these flows in the browser with a non-production/test account:

1. Sign up -> log in.
2. Browse cakes -> add a size to cart -> change quantity -> remove item.
3. Checkout with no promo.
4. Checkout with active promo.
5. Try invalid, inactive, expired, and maxed promo.
6. Place order -> verify order and order_items both exist in the test DB.
7. Admin changes order status -> customer-visible state updates.
8. Admin creates/edits/deactivates/deletes a promo -> checkout reflects the change.
9. Repository/network failure -> page shows an error instead of blank/crash.

## 7. GitHub commands

From the Live Bakery project folder:

```bash
git status
git checkout -b testing/live-bakery-tests
git add tests vitest.config.ts package.json .github/workflows/tests.yml KNOWN_TEST_FINDINGS.md TESTING_GUIDE.md
git commit -m "test: add unit negative and integration tests"
git push -u origin testing/live-bakery-tests
```

Then open GitHub and create a Pull Request from `testing/live-bakery-tests` into your main branch.

If your faculty expects the tests directly on `main`, after verifying the branch you can merge the Pull Request. Using a branch first is safer and demonstrates proper Git workflow.

## 8. Before pushing

Run:

```bash
npm test
npm run test:coverage
git status
```

Do not commit `.next/`, `node_modules/`, `.env.local`, Supabase service-role keys, or coverage HTML unless your instructor explicitly asks for it. Add these to `.gitignore` if needed:

```gitignore
node_modules/
.next/
coverage/
.env*
!.env.example
```