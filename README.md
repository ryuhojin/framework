# Framework Monorepo (NestJS + Next.js)

금융/공공망을 염두에 둔 전자정부 스타일 웹 서비스 스켈레톤이다. Yarn Classic 워크스페이스와 오프라인 캐시, Docker 구성, 환경 분리를 기본 제공한다.

## 구성
- apps/api: NestJS API (TypeORM, 글로벌 예외/응답 포맷, helmet/CORS, 헬스체크)
- apps/web: Next.js(App Router) 프론트
- packages/core: 공통 응답/에러/헬퍼
- packages/config: 환경 로더(APP/DB/보안/로그)
- packages/shared-types: 공통 DTO
- docs: 설계/운영 문서
- yarn-offline-cache: Yarn 오프라인 미러
- auth/rbac: JWT 로그인(`/auth/login`), 권한 가드/데코레이터, admin용 메뉴/역할/퍼미션 CRUD, local/dev Seed(admin/admin123!)

## 설치/오프라인
온라인:
```bash
yarn install
```
오프라인(캐시 준비 후):
```bash
yarn install --offline --frozen-lockfile
```
캐시 설정: `.yarnrc`에 `yarn-offline-mirror ./yarn-offline-cache`가 지정되어 있으며, `yarn offline:mirror` 스크립트로 동일 설정을 재적용할 수 있다.

## 스크립트(루트)
- 개발: `yarn dev:api`, `yarn dev:web`
- 빌드: `yarn build` (packages → api → web)
- 테스트: `yarn workspace api test`, `yarn workspace api test:e2e`
- Docker 전체: `yarn docker:up` (또는 `docker compose up --build`)

## 환경 변수
- `.env.local | .env.dev | .env.prod` (루트 및 apps/api, apps/web)
- 주요 키: `APP_ENV`, `NODE_ENV`, `APP_PORT/API_PORT/WEB_PORT`, `DB_VENDOR/DB_*`, `DB_DISABLE`, `CORS_ALLOWED_ORIGINS`, `ENABLE_HELMET`, `CSP_ENABLED`, `LOG_LEVEL`

## Docker
- services: api(3000), web(3001), db(Postgres)
- api 컨테이너에 `APP_ENV`, `DB_VENDOR`, `DB_DISABLE` 등을 주입하도록 compose 설정.
- 오프라인 빌드를 원하면 base 이미지(node:20-alpine, postgres:15)를 사전 pull 후 실행.

## 헬스체크
- `GET /health`(또는 `/`): `{ success, data: { status, env, version, db, timestamp } }`
- `GET /info`: `{ success, data: { name, description } }`

## 문서
- `docs/architecture-overview.md`: 전체 구조/레이어 개요
- `docs/chapter-01-bootstrap.md`: 초기 부트스트랩 과정
- `docs/chapter-02-core.md`: Config/DB/보안/에러/헬스체크 상세
