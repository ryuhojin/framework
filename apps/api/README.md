# API 서비스 (NestJS)

금융/공공망을 위한 NestJS 기본 스켈레톤이다. TypeORM 기반 DB 모듈, 글로벌 예외/응답 포맷, 보안 헤더(helmet), CORS, 공통 타입(`@framework/shared-types`)을 포함한다.

## 주요 스크립트
- `yarn workspace api start:dev` : 개발 서버 (기본 포트 3000)
- `yarn workspace api start:prod` : 빌드 결과 실행
- `yarn workspace api build` : 컴파일
- `yarn workspace api test` / `test:e2e` : 단위/통합 테스트

## 환경 변수
- `.env.local | .env.dev | .env.prod` 샘플 제공
- 핵심 값: `APP_ENV`, `NODE_ENV`, `API_HOST`, `API_PORT`, `APP_BASE_URL`, `DB_VENDOR`, `DB_DISABLE`, `DB_*`, `CORS_ALLOWED_ORIGINS`, `ENABLE_HELMET`, `CSP_ENABLED`, `LOG_LEVEL`

## 엔드포인트 (샘플)
- `GET /health` (또는 `/`) : `{ success, data: { status, version, env, db, timestamp } }`
- `GET /info` : `{ success, data: { name, description } }`
