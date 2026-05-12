# Changelog

## [1.4.13](https://github.com/dcalderonlo/datacharts/compare/v1.4.12...v1.4.13) (2026-05-12)


### Bug Fixes

* **build:** force turbopack for production build and remove unused [@p](https://github.com/p)… ([e132ecb](https://github.com/dcalderonlo/datacharts/commit/e132ecb9aa6dffbd38d10506d26f268453bae2a0))

## [1.4.12](https://github.com/dcalderonlo/datacharts/compare/v1.4.11...v1.4.12) (2026-05-12)


### Bug Fixes

* **middleware:** replace @panva/hkdf with native Web Crypto API for e… ([2c7618b](https://github.com/dcalderonlo/datacharts/commit/2c7618bced26721b10ce1601b3de5d4a47a21cbd))

## [1.4.11](https://github.com/dcalderonlo/datacharts/compare/v1.4.10...v1.4.11) (2026-05-12)


### Bug Fixes

* **middleware:** force web crypto build for @panva/hkdf in edge runtime ([adcc09a](https://github.com/dcalderonlo/datacharts/commit/adcc09a8946ee16fe62514f73b43e93733d30e38))
* **middleware:** force web crypto build for @panva/hkdf in edge runtime ([005594d](https://github.com/dcalderonlo/datacharts/commit/005594dc51893f15acbde02db9eed4ec514f459b))

## [1.4.10](https://github.com/dcalderonlo/datacharts/compare/v1.4.9...v1.4.10) (2026-05-12)


### Bug Fixes

* **docker:** copy prisma schema before npm ci instead of --ignore-scr… ([0b9216d](https://github.com/dcalderonlo/datacharts/commit/0b9216dcaac3ee778835127268a59424e63780a4))
* **docker:** copy prisma.config.ts before npm ci ([18d91e6](https://github.com/dcalderonlo/datacharts/commit/18d91e6ce129e0b236d2b107dd7af5965677f56f))

## [1.4.9](https://github.com/dcalderonlo/datacharts/compare/v1.4.8...v1.4.9) (2026-05-12)


### Bug Fixes

* **docker:** use --ignore-scripts in npm ci to prevent postinstall fa… ([5f588cb](https://github.com/dcalderonlo/datacharts/commit/5f588cb840600eeaeac05eebb89d4689c0a92d31))

## [1.4.8](https://github.com/dcalderonlo/datacharts/compare/v1.4.7...v1.4.8) (2026-05-12)


### Bug Fixes

* **build:** add postinstall hook to run prisma generate ([c1a6352](https://github.com/dcalderonlo/datacharts/commit/c1a635204e7c3b7dee51abb8956defa7b7e4fecd))
* **build:** add postinstall hook to run prisma generate ([895ac61](https://github.com/dcalderonlo/datacharts/commit/895ac616eec33262fba5148388eca3695c07a294))

## [1.4.7](https://github.com/dcalderonlo/datacharts/compare/v1.4.6...v1.4.7) (2026-05-12)


### Bug Fixes

* **middleware:** track chunk length incrementally and harden key reso… ([0183cac](https://github.com/dcalderonlo/datacharts/commit/0183caca9d4c183f4a23350dd745bbe664cdc0ff))
* **middleware:** track chunk length incrementally and harden key resolver types ([59e30ce](https://github.com/dcalderonlo/datacharts/commit/59e30cecd0b669cf899fa56fc79bbff37c536b34))

## [1.4.6](https://github.com/dcalderonlo/datacharts/compare/v1.4.5...v1.4.6) (2026-05-12)


### Bug Fixes

* **middleware:** harden session decryption and cookie chunk loop ([f58b3a5](https://github.com/dcalderonlo/datacharts/commit/f58b3a544c9f966096c89b70b3f3a1766808e7e3))

## [1.4.5](https://github.com/dcalderonlo/datacharts/compare/v1.4.4...v1.4.5) (2026-05-12)


### Bug Fixes

* **middleware:** use JWE decryption and harden cookie handling ([d56a22a](https://github.com/dcalderonlo/datacharts/commit/d56a22aa4df78cb383bd228decf86b61ff7e9d30))
* **middleware:** use JWE decryption and harden cookie handling ([c309bbc](https://github.com/dcalderonlo/datacharts/commit/c309bbc374eefdb28dd1a303fed13df7fddd7192))

## [1.4.4](https://github.com/dcalderonlo/datacharts/compare/v1.4.3...v1.4.4) (2026-05-12)


### Bug Fixes

* **middleware:** replace next-auth with jose for Edge-safe JWT verification ([9ae3a65](https://github.com/dcalderonlo/datacharts/commit/9ae3a6530395a025b62f083bbf549c31f37ddf6d))

## [1.4.3](https://github.com/dcalderonlo/datacharts/compare/v1.4.2...v1.4.3) (2026-05-12)


### Bug Fixes

* **auth:** use AUTH_SECRET, trustHost, and explicit middleware redire… ([04d3f53](https://github.com/dcalderonlo/datacharts/commit/04d3f53fab863ef48e729a81fc7c48fbbae5cae4))
* **auth:** use AUTH_SECRET, trustHost, and explicit middleware redirect for protected routes ([8f64570](https://github.com/dcalderonlo/datacharts/commit/8f64570b94dc1c08561342da6bcbc309aacd67b0))

## [1.4.2](https://github.com/dcalderonlo/datacharts/compare/v1.4.1...v1.4.2) (2026-05-12)


### Bug Fixes

* **build:** run prisma generate before next build to avoid implicit a… ([e6eeb1d](https://github.com/dcalderonlo/datacharts/commit/e6eeb1d26b534a914331eb48f82720a15b54c7a1))
* **build:** run prisma generate before next build to avoid implicit any types ([e094d70](https://github.com/dcalderonlo/datacharts/commit/e094d70be95dda0dd6b084ff6c5625c311063f9d))
* **ci:** upgrade upload-artifact to v6 ([f78453b](https://github.com/dcalderonlo/datacharts/commit/f78453b0d45aa00b8b9a6c1d420f7205f3f2500d))
* **e2e:** use label selectors and resilient routes in auth tests ([6d1795b](https://github.com/dcalderonlo/datacharts/commit/6d1795b1f13c2a0ad677741002324f767fbd557d))

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
