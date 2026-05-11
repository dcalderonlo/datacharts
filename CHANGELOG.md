# Changelog

## [1.4.1](https://github.com/dcalderonlo/datacharts/compare/v1.4.0...v1.4.1) (2026-05-11)


### Bug Fixes

* **e2e:** add register link to login page, make CI e2e tests resilient without DB ([a5334cc](https://github.com/dcalderonlo/datacharts/commit/a5334cc67626356724f6bf86e345d606901f59a7))

## [1.4.0](https://github.com/dcalderonlo/datacharts/compare/v1.3.0...v1.4.0) (2026-05-11)


### Features

* **dashboard:** connect analytics to real volatility data, remove hardcoded KPI cards ([2211435](https://github.com/dcalderonlo/datacharts/commit/221143561278a4dd19d7e1d6586f814015b9acbb))


### Bug Fixes

* **analytics:** use async/await in useEffect to avoid setState-in-effect lint error ([1e88bce](https://github.com/dcalderonlo/datacharts/commit/1e88bceb26566c9cba41679e9503a482f7a5d58f))
* **ci:** start next server before playwright tests, check r.ok in analytics fetch ([ef5fd02](https://github.com/dcalderonlo/datacharts/commit/ef5fd02f83373d007cd3f8fa270496551603be81))
* **types:** resolve TS errors from exactOptionalPropertyTypes and missing Card import ([5a3782a](https://github.com/dcalderonlo/datacharts/commit/5a3782a9c84bde7e1b4f7654dd559c62c80d621c))

## [1.3.0](https://github.com/dcalderonlo/datacharts/compare/v1.2.0...v1.3.0) (2026-05-11)


### Features

* **test:** add Phase 11 test suite ([7736d03](https://github.com/dcalderonlo/datacharts/commit/7736d03a32cb62c4b7eee524a781b892a783fdb7))

## [1.2.0](https://github.com/dcalderonlo/datacharts/compare/v1.1.0...v1.2.0) (2026-05-11)


### Features

* **deps:** migrate Tailwind CSS v3 to v4 ([765a47c](https://github.com/dcalderonlo/datacharts/commit/765a47c13f4ab17c5bbdb3b2f60c6040bab4ae18))
* **deps:** migrate Tailwind CSS v3 to v4 ([0d95fee](https://github.com/dcalderonlo/datacharts/commit/0d95fee517d55f7346e5e368b204ed5c048547e2))

## [1.1.0](https://github.com/dcalderonlo/datacharts/compare/v1.0.1...v1.1.0) (2026-05-11)


### Features

* **deps:** upgrade to Next.js 16.2.6 and React 19.2.6 ([be007b8](https://github.com/dcalderonlo/datacharts/commit/be007b84ee3bd615a96ad8c406d32f31b06a126a))
* **lint:** migrate to ESLint 9 flat config ([3282af3](https://github.com/dcalderonlo/datacharts/commit/3282af393abd159dc0fe1f2b85db59ce438358a7))


### Bug Fixes

* **auth:** split auth config for Edge-safe middleware ([74ad38e](https://github.com/dcalderonlo/datacharts/commit/74ad38e6eb1940a1b73a9b24580095443febc32e))
* **lint:** replace next lint with eslint src ([0bd05e0](https://github.com/dcalderonlo/datacharts/commit/0bd05e0d607351077a2139e289331d5f92234517))

## [1.0.1](https://github.com/dcalderonlo/datacharts/compare/v1.0.0...v1.0.1) (2026-05-11)


### Bug Fixes

* correct docker action versions to v7.1.0 and v4.1.0, add GHCR lo… ([3ec8ace](https://github.com/dcalderonlo/datacharts/commit/3ec8acefaa351df6907f36b46161a6ce2fdc4531))
* correct docker action versions to v7.1.0 and v4.1.0, add GHCR login to trivy image scan ([c60b766](https://github.com/dcalderonlo/datacharts/commit/c60b766d7d58c477580e9a06c03b86d23ee242f7))
* setup-node v5, vercel-action v42.3.0, move trivy image scan into docker job ([4f51317](https://github.com/dcalderonlo/datacharts/commit/4f51317f89e4f8edf783e81269b55efe2e92bdb0))

## 1.0.0 (2026-05-10)


### Features

* add release-please v5 workflow ([9a26757](https://github.com/dcalderonlo/datacharts/commit/9a2675767e2dd2c04d1a23bb120c33cf770fccb6))
* add security workflow with CodeQL and Trivy ([9a26757](https://github.com/dcalderonlo/datacharts/commit/9a2675767e2dd2c04d1a23bb120c33cf770fccb6))
* initial enterprise dashboard implementation ([026f1f4](https://github.com/dcalderonlo/datacharts/commit/026f1f44b90e00ce00bb570068159c003f4ea47d))
* watchlist, price alerts, notifications, web push ([b66b7e8](https://github.com/dcalderonlo/datacharts/commit/b66b7e896c61d81fb35d5513e06dd74f8a77b320))


### Bug Fixes

* add missing v prefix to trivy-action version tag ([5fd3444](https://github.com/dcalderonlo/datacharts/commit/5fd3444ff002158d9fbfb876fa0622c71106d8e7))
* lazy vapid init to prevent build failure without env vars ([b751d5b](https://github.com/dcalderonlo/datacharts/commit/b751d5b1025af3ed9f8faae68c3255a56c3375f0))
* lazy vapid init to prevent build failure without env vars ([9a26757](https://github.com/dcalderonlo/datacharts/commit/9a2675767e2dd2c04d1a23bb120c33cf770fccb6))
* remove unused motion import in AlertForm ([d3cdeb7](https://github.com/dcalderonlo/datacharts/commit/d3cdeb758117a8ad816d4f283dc8d6bc47dd5125))
* ts errors, node 24, preview deploy, update @types/node ([dacb5eb](https://github.com/dcalderonlo/datacharts/commit/dacb5eb3e4683dca73f7c561795cc802c503ca38))
