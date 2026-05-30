# ProjectAlpha Automation Monorepo

## About
ProjectAlpha adalah monorepo automation testing berbasis Node.js yang memisahkan suite per domain:

- API automation
- Web automation (Playwright)
- Mobile automation (placeholder)
- Shared module untuk config dan utility

Repository ini memakai npm workspaces, reusable GitHub Actions workflow, dan model environment configuration berbasis single secret `TEST_CONFIG_JSON`.

## Tech Stack

- Node.js >= 20
- npm workspaces
- Playwright Test
- ESLint
- Husky + lint-staged
- GitHub Actions (reusable workflows)

## Repository Structure

```text
ProjectAlpha/
├── .github/workflows/
│   ├── playwright.yml        # Orchestrator workflow
│   ├── run-tests.yml         # Reusable test runner
│   └── report.yml            # Reusable report summary
├── packages/
│   ├── api-automation/
│   ├── web-automation/
│   ├── mobile-automation/
│   └── common-module/
├── docs/
└── package.json
```

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Jalankan lint:

```bash
npm run lint:web
npm run lint:api
npm run lint:common-module
npm run lint:mobile
```

3. Jalankan test:

```bash
npm run test:web
npm run test:api
npm run test:mobile
```

## Main Commands

### Root commands

```bash
npm run test:web
npm run test:api
npm run test:mobile
npm run test:web:orangehrm-login
npm run test:web:ui
npm run test:web:headed
npm run report:web
```

### Web workspace

```bash
npm run test --workspace=packages/web-automation
npm run test:orangehrm-login --workspace=packages/web-automation
```

## Environment Configuration

Runtime config dibaca dari `packages/common-module/index.js` melalui `getEnvConfig()`.

Sumber config:

1. GitHub Actions secret `TEST_CONFIG_JSON` (utama untuk CI)
2. File lokal `packages/common-module/config/env.sit.json` atau `env.uat.json` (fallback lokal)
3. Env vars direct (`BASE_URL`, `USERNAME`, `PASSWORD`) akan override nilai JSON jika diset

Environment aktif ditentukan oleh `ENV` dengan value `SIT` atau `UAT`.

Dokumen setup detail ada di [docs/github-actions-env-setup.md](docs/github-actions-env-setup.md).

## CI/CD

Workflow utama: [ .github/workflows/playwright.yml ](.github/workflows/playwright.yml)

Flow:

1. Trigger dari schedule, push, pull_request, atau manual dispatch
2. Memanggil reusable runner [ .github/workflows/run-tests.yml ](.github/workflows/run-tests.yml)
3. Memanggil reusable report [ .github/workflows/report.yml ](.github/workflows/report.yml)

## Notes

- `mobile-automation` saat ini masih placeholder.
- Folder report (`playwright-report`, `test-results`) tidak untuk di-commit.
- File env lokal bersifat sensitif dan sudah di-ignore oleh git.
