# Bedi Commerce — E-Commerce QA Automation Portfolio

[![CI](https://github.com/yabedip94/bedi-commerce/actions/workflows/ci.yml/badge.svg)](https://github.com/yabedip94/bedi-commerce/actions/workflows/ci.yml)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.3.0-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-1.64.1-2EAD33?logo=playwright&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Allure](https://img.shields.io/badge/Allure_Report-3.x-FF7F00?logo=allure&logoColor=white)

Bedi Commerce is a full-stack e-commerce application engineered as a real-world **QA Automation Portfolio Project**. It pairs a modern web storefront with a multi-layered automated testing framework using **Playwright**, **TypeScript**, **PostgreSQL**, and **Allure Reporting**, validated by continuous integration via **GitHub Actions**.

The repository is structured to demonstrate enterprise-grade QA practices: strict separation of concerns, the Page Object Model (POM), data fixtures, defensive API assertions, transactional database validation, and comprehensive CI telemetry.

---

## Table of Contents

- [Project Status & CI Evidence](#project-status--ci-evidence)
- [Technology Stack](#technology-stack)
- [Architecture & Test Pyramid](#architecture--test-pyramid)
- [Page Object Model & Fixtures](#page-object-model--fixtures)
- [Test Coverage Highlights](#test-coverage-highlights)
- [Project Structure](#project-structure)
- [Prerequisites & Local Setup](#prerequisites--local-setup)
- [Test Execution Commands](#test-execution-commands)
- [CI/CD Pipeline Architecture](#cicd-pipeline-architecture)
- [Allure Reporting Guide](#allure-reporting-guide)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)

---

## Project Status & CI Evidence

The automated test suite runs on every pull request and push to the `main` branch.

- **Verified CI Run:** [Run #40212100806](https://github.com/yabedip94/bedi-commerce/actions/runs/40212100806)
- **Suite Outcome:** **68 passed** (0 failing, 0 skipped, 30.3s runtime)
- **Pipeline Jobs:**
  - `Lint & Typecheck` (34s): ESLint + `tsc --noEmit`
  - `Build & Playwright Tests` (1m 53s): PostgreSQL 16 service, Drizzle migrations, Next.js production build, Playwright test suite, Allure report generation & artifact upload
- **Repository Links:**
  - [Automated Tests Directory](tests/)
  - [GitHub Actions Workflow](.github/workflows/ci.yml)

> **Note:** CI results reflect the verified execution state of commit `96ab09c`. Test status is continuously validated via the pipeline.

---

## Technology Stack

### Storefront Application
- **Framework:** Next.js 16 (`16.4.2`) with React 19 (`19.3.0`) App Router
- **Language:** TypeScript 5 (`^5`)
- **Styling:** Tailwind CSS v4 (`^4`)
- **Database & ORM:** PostgreSQL 16 (`postgres: ^3.4.9`) with Drizzle ORM (`^0.45.4` / `drizzle-kit: ^0.31.11`)

### QA Automation Framework
- **End-to-End & Integration Engine:** Playwright Test (`^1.64.1`)
- **Design Pattern:** Page Object Model (POM) with custom test fixtures
- **Reporting:** Allure Playwright (`^3.14.0`) + Allure CLI (`^3.22.1`) + Playwright HTML Reporter
- **Linter & Type Checker:** ESLint 9 (`^9`, `eslint-config-next: 16.4.2`) + TypeScript Compiler (`tsc`)
- **CI/CD Platform:** GitHub Actions with containerized PostgreSQL service (`postgres:16-alpine`)

---

## Architecture & Test Pyramid

The testing strategy implements a classic five-tier test pyramid consisting of **68 tests across 9 spec files**:

```mermaid
pie title Bedi Commerce Test Suite Distribution (68 Tests)
    "Functional UI (Page Object Model)" : 40
    "API Testing (REST Endpoints)" : 11
    "Unit Testing (Domain & Business Logic)" : 9
    "Integration Testing (Database & Repository)" : 6
    "Smoke Testing (Storefront Sanity)" : 2
```

### 1. Smoke Tests (2 Tests)
- **File:** [`tests/smoke/smoke.spec.ts`](tests/smoke/smoke.spec.ts)
- Verifies initial application boot, critical metadata, primary header/hero rendering, and baseline catalog availability (12 initial products).

### 2. Unit Tests (9 Tests)
- **File:** [`tests/unit/order-service.spec.ts`](tests/unit/order-service.spec.ts)
- Isolates domain logic in the order service:
  - Combining duplicate product line items and verifying stock limit rejections.
  - Defensive type checks (validating that non-string phone or province inputs fail gracefully with `INVALID_INPUT` without raising unhandled `TypeError` exceptions).
  - Sanitization and trimming of optional customer fields.
  - Collision-resistant format validation of generated order IDs (`ORD-YYYYMMDD-XXXXXXXX`).

### 3. Integration Tests (6 Tests)
- **File:** [`tests/integration/order-repository.spec.ts`](tests/integration/order-repository.spec.ts)
- Tests data access directly against a live PostgreSQL test database (`bedi_commerce_test`):
  - Order creation and retrieval with exact price/snapshot persistence.
  - Null responses for nonexistent IDs.
  - Rejection of duplicate order IDs with custom domain error types.
  - **Transaction rollback verification:** Ensures that if line-item insertion fails, the entire transaction rolls back cleanly with zero orphaned order records.
  - Foreign key cascading deletes.

### 4. API Tests (11 Tests)
- **File:** [`tests/api/orders.spec.ts`](tests/api/orders.spec.ts)
- Tests REST endpoints (`POST /api/orders` and `GET /api/orders/[id]`):
  - Shipping tier calculation ($15 shipping fee for orders under $150 vs $0 free shipping for orders $\ge \$150$).
  - **Client tampering immunity:** Verifies the backend completely ignores client-injected item prices and totals, calculating all prices exclusively from server-side catalog definitions.
  - HTTP error contracts: `400 Bad Request` (malformed JSON), `422 Unprocessable Entity` (missing fields, unknown products, invalid quantities), `409 Conflict` (quantities exceeding available stock or duplicate IDs), `404 Not Found`.

### 5. Functional UI Tests (40 Tests)
- **Cart Management (10 tests):** [`tests/functional/cart-management.spec.ts`](tests/functional/cart-management.spec.ts)
  - Stepper increments/decrements, stock limitation button states, item deletion, full cart reset, dynamic shipping fee threshold updates, keyboard (`Escape`) and backdrop modal dismissals.
- **Catalog Filters & Sorting (8 tests):** [`tests/functional/catalog-filters.spec.ts`](tests/functional/catalog-filters.spec.ts)
  - Category filtering, clear/reset filters, "In Stock Only" toggle, price ascending/descending sorting, rating sorting, combined filter-and-search conditions, bidirectional category synchronization between header dropdown and catalog tabs.
- **Checkout Flow (6 tests):** [`tests/functional/checkout.spec.ts`](tests/functional/checkout.spec.ts)
  - Cart-to-modal transition, form validation alerts, order creation verification, shipping tier display in order confirmation, API error preservation of cart state, submission loading indicators.
- **Interactive Regression & Responsive Viewports (10 tests):** [`tests/functional/interactions.spec.ts`](tests/functional/interactions.spec.ts)
  - Add-to-cart toast alerts, cart drawer lifecycle, smooth scroll anchors, and navigation accessibility tested across 5 viewport breakpoints:
    - Mobile: 390px
    - Tablet Portrait: 768px
    - Tablet Landscape: 900px
    - Small Desktop: 1024px
    - Standard Desktop: 1280px
- **Search (6 tests):** [`tests/functional/search.spec.ts`](tests/functional/search.spec.ts)
  - Exact match, partial match, case-insensitivity, no-results empty state with reset, search query clearance, bidirectional sync between header search bar and catalog search input.

---

## Page Object Model & Fixtures

The UI test layer strictly separates test definitions from DOM selectors and interaction mechanics.

```
tests/
├── fixtures/
│   ├── base-fixture.ts     # Extends Playwright test with pre-instantiated POMs
│   └── test-data.ts        # Test payloads, customer factories, and catalog getters
└── pages/
    ├── StorefrontPage.ts   # Locators and workflows for header, hero, catalog & filters
    ├── CartDrawerPage.ts   # Locators and workflows for the shopping cart slide-out drawer
    └── CheckoutModalPage.ts# Locators and workflows for the order checkout dialog
```

### Page Objects
- [`StorefrontPage`](tests/pages/StorefrontPage.ts): Encapsulates header navigation, brand links, search bars, category tabs/dropdowns, in-stock toggle, sort selector, product cards, add-to-cart triggers, and toast notifications.
- [`CartDrawerPage`](tests/pages/CartDrawerPage.ts): Encapsulates cart drawer slide-out, line-item cards, quantity stepper controls, item removal buttons, clear cart action, and checkout progression button.
- [`CheckoutModalPage`](tests/pages/CheckoutModalPage.ts): Encapsulates checkout dialog lifecycle: customer form inputs (`#checkout-fullname`, `#checkout-email`, etc.), validation banners, submission states, and order confirmation view.

### Custom Fixtures
- [`base-fixture.ts`](tests/fixtures/base-fixture.ts): Extends standard Playwright `test` by injecting pre-instantiated, isolated page objects (`storefrontPage`, `cartDrawerPage`, `checkoutModalPage`) into every test execution without manual instantiation boilerplate.
- [`test-data.ts`](tests/fixtures/test-data.ts): Defines immutable baseline customer objects (`DEFAULT_TEST_CUSTOMER`), deep-cloning factory functions (`createCustomerInfo`, `createOrderPayload`), and product lookup utilities (`getTestProduct`) to prevent shared state contamination.

---

## Test Coverage Highlights

| Feature / Domain | Automated Validation | Key Assertions / Invariants |
| :--- | :--- | :--- |
| **Catalog Search** | Functional UI | Case-insensitive matching, partial queries, debounced sync between header and catalog inputs, empty state recovery. |
| **Catalog Filters** | Functional UI | Category filtering, price asc/desc sorting, rating sort, in-stock exclusion, bidirectional header-to-tab sync. |
| **Cart Boundaries** | Functional UI | Stepper buttons automatically disable when stock ceiling is reached; decrementing to 0 removes the item. |
| **Shipping Rules** | API + Functional UI | Under $150 triggers a $15 shipping fee; reaching or exceeding $150 triggers automatic $0 free shipping. |
| **Price Tampering** | API | Injected request prices and totals are completely discarded; order totals are computed exclusively from database/catalog pricing. |
| **Checkout Guardrails** | Functional UI | Required fields display validation alerts; API failures keep the user's cart intact and render actionable error messages. |
| **DB Transactions** | Integration | Partial line item insertion failures trigger immediate `ROLLBACK`, leaving zero dangling orders in PostgreSQL. |
| **Cross-Device UI** | Functional UI | Navigation and layout verified across 5 screen widths (390px, 768px, 900px, 1024px, 1280px). |

---

## Project Structure

```
bedi-commerce/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI workflow definition
├── app/
│   ├── api/orders/              # REST API order endpoints (POST, GET)
│   ├── globals.css              # Global styles and Tailwind v4 setup
│   ├── layout.tsx               # Root application layout
│   └── page.tsx                 # Main storefront page entry point
├── components/store/            # Storefront React components (Hero, Cart, Checkout, etc.)
├── data/
│   └── products.ts              # Authoritative in-memory catalog data (12 products)
├── drizzle/                     # Drizzle ORM migrations and schema snapshots
├── lib/
│   ├── db/                      # PostgreSQL connection pool and Drizzle schema definition
│   └── orders/                  # Order service business logic and repository layer
├── tests/
│   ├── api/                     # REST API automated test specs
│   ├── fixtures/                # Custom Playwright fixtures and test data factories
│   ├── functional/              # Functional UI test specs using Page Objects
│   ├── integration/             # Database repository integration test specs
│   ├── pages/                   # Page Object Model class definitions
│   ├── smoke/                   # Quick storefront smoke test specs
│   └── unit/                    # Order service business logic unit test specs
├── .env.example                 # Template for required environment variables
├── drizzle.config.ts            # Drizzle Kit configuration
├── package.json                 # Scripts, dependencies, and project metadata
├── playwright.config.ts         # Playwright test configuration and multi-reporters
└── tsconfig.json                # TypeScript compiler configuration
```

---

## Prerequisites & Local Setup

### 1. Prerequisites
- **Node.js:** `v20.x` or higher
- **npm:** `v10.x` or higher
- **PostgreSQL:** `16.x` (Local service or Docker container)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/yabedip94/bedi-commerce.git
cd bedi-commerce
npm ci
```

### 3. PostgreSQL Database Setup
Run PostgreSQL locally or start a container using Docker:
```bash
docker run --name bedi-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=bedi_commerce \
  -p 5432:5432 \
  -d postgres:16-alpine
```

Create the secondary test database (required for integration tests):
```bash
# Using Docker:
docker exec -i bedi-postgres psql -U postgres -c "CREATE DATABASE bedi_commerce_test;"

# Or using local psql:
psql -h localhost -U postgres -c "CREATE DATABASE bedi_commerce_test;"
```

### 4. Environment Configuration
Copy the environment template:
```bash
# Linux / macOS
cp .env.example .env.local

# Windows PowerShell
copy .env.example .env.local
```

Configure `.env.local` for local development. Use the development-only template values below (never commit production credentials):
```ini
# Primary application database (used by Next.js app, API routes, and Drizzle migrations)
DATABASE_URL=postgres://postgres:password@localhost:5432/bedi_commerce

# Dedicated test database (used by repository integration tests)
TEST_DATABASE_URL=postgres://postgres:password@localhost:5432/bedi_commerce_test
```

> **Configuration Note:**
> - Next.js and Drizzle Kit load connection parameters from `.env.local` via `DATABASE_URL`. If omitted, they default to `postgres://postgres@localhost:5432/bedi_commerce`.
> - Integration tests ([`tests/integration/order-repository.spec.ts`](tests/integration/order-repository.spec.ts)) read `TEST_DATABASE_URL`. If unset, they fall back to `postgres://postgres@localhost:5432/bedi_commerce_test`. Defining `TEST_DATABASE_URL` explicitly in `.env.local` ensures integration tests authenticate seamlessly when local PostgreSQL requires a password.

### 5. Apply Database Migrations
Apply schema migrations to the primary application database:
```bash
npm run db:migrate
```

To run integration tests locally, also apply migrations to the secondary test database (`bedi_commerce_test`):
```bash
# Linux / macOS (Bash / Zsh)
DATABASE_URL="postgres://postgres:password@localhost:5432/bedi_commerce_test" npm run db:migrate

# Windows PowerShell
$env:DATABASE_URL="postgres://postgres:password@localhost:5432/bedi_commerce_test"; npm run db:migrate; Remove-Item Env:\DATABASE_URL
```

### 6. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Test Execution Commands

Every test command corresponds directly to scripts defined in [`package.json`](package.json):

| Command | Scope / Description | Prerequisites |
| :--- | :--- | :--- |
| `npm run test:e2e` | Builds Next.js production app and runs all 68 tests across all categories. | PostgreSQL running with migrations applied to both `bedi_commerce` and `bedi_commerce_test` |
| `npm run test:smoke` | Runs quick sanity checks on storefront metadata and catalog boot. | Application running or auto-started by Playwright (No DB required) |
| `npm run test:unit` | Runs fast unit tests for order business logic and ID generation. | None (No database or server required) |
| `npm run test:integration` | Runs PostgreSQL repository tests (transactions, constraints, rollbacks). | PostgreSQL running with migrations applied to `bedi_commerce_test` |
| `npm run test:api` | Runs REST API endpoint tests for order calculation, validation, and errors. | Application running or auto-started by Playwright + PostgreSQL running with migrations applied to `bedi_commerce` (required for order-persistence specs) |
| `npm run test:functional` | Runs all 40 Page Object Model functional UI tests. | Application running or auto-started by Playwright + PostgreSQL running with migrations applied to `bedi_commerce` (required for checkout order-persistence specs) |
| `npm run test:e2e:report` | Opens the standard Playwright HTML test report. | Prior test execution (`playwright-report/` exists) |
| `npm run lint` | Executes ESLint 9 checks against source and test files. | None |
| `npx tsc --noEmit` | Validates TypeScript types across the entire repository. | None |
| `npm run build` | Builds the Next.js production bundle. | None |

> **Playwright Auto-WebServer:** In [`playwright.config.ts`](playwright.config.ts), Playwright is configured with a `webServer` block that automatically builds and serves the Next.js application on port `3001` if no server is running.

---

## CI/CD Pipeline Architecture

The continuous integration pipeline is defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) and runs on GitHub Actions hosted Ubuntu runners:

```mermaid
flowchart TD
    Trigger([Push or PR to main]) --> LintJob[Job: Lint & Typecheck]
    Trigger --> TestJob[Job: Build & Playwright Tests]

    subgraph LintJob [Job 1: Static Code Quality]
        L1[actions/checkout@v4] --> L2[actions/setup-node@v4: Node 20]
        L2 --> L3[npm ci]
        L3 --> L4[npm run lint]
        L4 --> L5[npx tsc --noEmit]
    end

    subgraph TestJob [Job 2: Build, Database & Tests]
        T1[PostgreSQL 16 Alpine Service Container] --> T2[actions/checkout@v4]
        T2 --> T3[actions/setup-node@v4: Node 20]
        T3 --> T4[npm ci]
        T4 --> T5[Create bedi_commerce_test DB]
        T5 --> T6[Apply Drizzle Migrations to Both DBs]
        T6 --> T7[Install Playwright Chromium]
        T7 --> T8[npm run build: Production Next.js Build]
        T8 --> T9[npx playwright test: Execute 68 Tests]
        T9 --> T10[npx allure generate: Build Report]
        T10 --> T11[Upload Artifact: allure-report]
        T11 --> T12[Upload Artifact: allure-results]
        T9 -.->|On Failure Only| T13[Upload Artifact: playwright-diagnostics]
    end
```

### Pipeline Key Features:
- **Fast Feedback:** Lint and typechecking run concurrently with test setup.
- **Service Isolation:** PostgreSQL 16 container with health check (`pg_isready`) handles test data isolation.
- **Fail-Safe Telemetry:** Allure reports and raw results are uploaded with `if: always()` and a 7-day retention period. Playwright trace files, screenshots, and videos are retained and uploaded conditionally (`if: failure()`) via `playwright-diagnostics`.
- **Decoupled Deployment:** CI serves as an independent gatekeeper. Deployment to hosting environments (e.g., Vercel) is decoupled from the automated testing pipeline.

---

## Allure Reporting Guide

The framework is configured with `@allure-playwright` to output test execution telemetry into `allure-results/`.

```
                  ┌──────────────────────┐
                  │ npx playwright test  │
                  └──────────┬───────────┘
                             │
                             ▼
                 ┌────────────────────────┐
                 │ allure-results/ (JSON) │
                 └───────────┬────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [npm run allure:serve]           [npm run allure:generate]
            │                                 │
            ▼                                 ▼
Live Browser Preview at          allure-report/ (HTML Artifact)
http://localhost:port                         │
                                              ▼
                                    [npm run allure:open]
```

### Viewing Allure Reports Locally
After executing tests, view reports using the scripts in `package.json`:

```bash
# Option 1: Generate HTML report and open it in your browser
npm run allure:generate
npm run allure:open

# Option 2: Serve directly from raw results on a local dev server
npm run allure:serve
```

### Downloading Allure Artifacts from CI
1. Navigate to the **Actions** tab on GitHub.
2. Select any completed run (e.g., [Run #40212100806](https://github.com/yabedip94/bedi-commerce/actions/runs/40212100806)).
3. Scroll down to the **Artifacts** section.
4. Download `allure-report.zip` or `allure-results.zip`.
5. Extract the archive and view locally using `npx allure open <path-to-unzipped-report>`.

---

## Known Limitations

- **Simulated Payment Gateway:** The checkout system persists order records in PostgreSQL with status `'PENDING'`. It does not process live monetary transactions through external payment processors (e.g., Stripe, Midtrans).
- **Static Catalog vs. Dynamic Orders:** Product definitions in [`data/products.ts`](data/products.ts) are maintained in-memory for catalog performance and test determinism, while orders and line items are stored dynamically in PostgreSQL.
- **Cloud Database Configuration:** Serverless deployments (e.g. Vercel) require a hosted PostgreSQL URL (such as Neon or Supabase) configured in the `DATABASE_URL` environment variable; without it, catalog browsing functions normally while checkout API requests return connection errors.

---

## Future Improvements

- [ ] **Automated Allure Report Hosting:** Automatically publish generated Allure reports to GitHub Pages on merges to `main`.
- [ ] **Visual Regression Testing:** Integrate Playwright pixel-comparison snapshots (`expect(page).toHaveScreenshot()`) for visual UI regressions.
- [ ] **Mock Payment Gateway Service:** Add simulated webhook endpoints for external payment processor state transitions (`PENDING` $\to$ `PAID` $\to$ `SHIPPED`).
- [ ] **Database Seeding CLI:** Introduce a dedicated `npm run db:seed` command to populate local development databases with initial sample orders.

---

## Author & Contact

**Yabedi**
- **GitHub:** [@yabedip94](https://github.com/yabedip94)
- **Repository:** [bedi-commerce](https://github.com/yabedip94/bedi-commerce)
