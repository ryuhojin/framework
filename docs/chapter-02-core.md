# CHAPTER 2: Core / Config / DB / 보안 헤더

## 설정 구조 (packages/config)
- app: `APP_ENV`, `NODE_ENV`, `APP_PORT`, `APP_HOST`, `APP_BASE_URL`
- database: `DB_VENDOR (postgres|oracle|mssql|tibero)`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SCHEMA`, `DB_DISABLE`
- security: `CORS_ALLOWED_ORIGINS`(콤마 구분), `ENABLE_HELMET`, `CSP_ENABLED`, `LOG_LEVEL`(debug|info|warn|error)

### 환경별 샘플(.env.*)
- local: `APP_ENV=local`, `LOG_LEVEL=debug`, `CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001`
- dev: `APP_ENV=dev`, `LOG_LEVEL=info`, `CORS_ALLOWED_ORIGINS=https://dev.example.com,https://dev-api.example.com`
- prod: `APP_ENV=prod`, `LOG_LEVEL=warn`, `CSP_ENABLED=true`, `CORS_ALLOWED_ORIGINS=https://example.com,https://api.example.com`

## DB 모듈 (apps/api/src/database)
- TypeORM 기반 `DatabaseModule.forRoot()` 동적 모듈.
- 지원: PostgreSQL 완전 구성. oracle/mssql/tibero는 TODO 주석으로 확장 포인트 확보.
- `DB_DISABLE=true` 시 TypeORM 연결을 생략하여 로컬 테스트/CI에서 DB 없이 부팅 가능.
- UserEntity(임시) 포함, 향후 인증/인가에서 확장 예정.

## 공통 에러/응답 (packages/core + apps/api)
- packages/core: `ApiResponse<T>`, `ApiError`, `createSuccessResponse`, `createErrorResponse` 정의.
- apps/api: `ApiExceptionFilter`가 모든 예외를 공통 포맷으로 변환.  
  - prod: 상세 정보/stack 숨김.  
  - local/dev: 디버그용 detail 포함(금융권 운영 시 비활성화 권장).
- 에러 응답 예시:
```json
{
  "success": false,
  "error": {
    "code": "HTTP_ERROR",
    "message": "Bad Request",
    "detail": "invalid payload"
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

## 로깅
- Nest Logger 레벨을 `LOG_LEVEL`에 맞춰 설정(debug/info/warn/error).
- `HttpLoggingInterceptor`로 요청/응답 상태 및 처리 시간을 남김(민감정보는 로그에 남기지 않도록 주석/주의 포함).

## CORS 및 보안 헤더
- `ENABLE_HELMET=true` 시 helmet 기본 보안 헤더(XSS, noSniff, frameguard 등) 적용.
- `CSP_ENABLED=false`(기본): CSP는 Next.js 쪽에서 세밀하게 다룰 TODO 남김.
- CORS 정책(예시):
  - local: `http://localhost:3000`, `http://localhost:3001`, `http://localhost:4200`
  - dev: `https://dev.example.com`, `https://dev-api.example.com`
  - prod: `https://example.com`, `https://api.example.com`

## 헬스체크 API
- `GET /health` (또는 `/`): 공통 응답 포맷으로 상태 반환.
  - 포함: `status(ok|degraded)`, `env`, `version`, `db(up|down|disabled)`, `timestamp`.
  - DB 상태는 `SELECT 1` 검사 결과 기준. 노출 정보는 최소화하고, 상세 내부 정보는 미노출(TODO로 정책 확장).

## Docker / 환경 분기
- `docker-compose.yml`에서 `APP_ENV`, `DB_VENDOR`, `DB_DISABLE` 등을 api 컨테이너에 주입. DB 서비스(Postgres)와 연동 시 `DB_HOST=db`로 지정.
- 오프라인 빌드: `yarn install --offline --frozen-lockfile`로 캐시 활용 후 `docker compose up --build`.

## 테스트 및 빌드
- 단위 테스트: `yarn workspace api test` (DB 비활성화가 기본값이라 로컬에서 DB 없이 실행 가능).
- 빌드: `yarn build` (패키지 → api → web 순서).
- 헬스체크 검증:
  - 로컬: `curl http://localhost:3000/health`
  - 도커: `docker compose up --build` 후 동일 엔드포인트 확인.
- 실행 결과: `yarn workspace api test`, `yarn workspace api test:e2e`, `yarn build` 모두 통과(로컬 실행 기준).
