# API 서비스 (NestJS)

금융/공공망을 위한 NestJS 기본 스켈레톤이다. `@framework/shared-types`의 타입을 사용해 헬스체크와 서비스 정보를 제공한다.

## 주요 스크립트
- `yarn workspace api start:dev` : 개발 서버 (기본 포트 3000)
- `yarn workspace api start:prod` : 빌드 결과 실행
- `yarn workspace api build` : 컴파일
- `yarn workspace api test` / `test:e2e` : 단위/통합 테스트

## 환경 변수
- `.env.local | .env.dev | .env.prod` 샘플 제공
- 핵심 값: `APP_ENV`, `NODE_ENV`, `API_HOST`, `API_PORT`, `DB_*`

## 엔드포인트 (샘플)
- `GET /` : 헬스 응답 `{ status, version, timestamp }`
- `GET /info` : API 정보 `{ name, description }`
