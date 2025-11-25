# 아키텍처 개요 (NestJS + Next.js 모노레포)

금융/공공망에서도 동작 가능한 전자정부 스타일의 웹 서비스 스켈레톤이다. Yarn Classic 워크스페이스, 오프라인 캐시, Docker 구성, 환경 분리(.env local/dev/prod)를 기본 제공한다.

## 모노레포 디렉터리 역할
- `apps/api`: NestJS 기반 백엔드 API. 헬스체크/정보, TypeORM 기반 DB 추상화, 글로벌 에러/로그/보안 헤더 구성.
- `apps/web`: Next.js(App Router) 기반 프론트엔드. `/api/*`로 백엔드와 연동 예정.
- `packages/core`: 공통 헬퍼/응답/에러 타입.
- `packages/config`: 환경 변수 기반 설정 로더(환경별 CORS/보안/DB 설정 포함).
- `packages/shared-types`: API/프론트 공유 타입(DTO).
- `docs`: 설계/운영 문서.
- `yarn-offline-cache`: Yarn 오프라인 미러 디렉터리(패키지 tarball 저장 위치).

## Yarn 워크스페이스 & Offline Cache
- 루트 `package.json`의 `workspaces`로 `apps/*`, `packages/*`를 관리한다.
- `.yarnrc`에서 `yarn-offline-mirror "./yarn-offline-cache"`로 설정된다.
- 온라인에서 `yarn install` → 캐시 채움 → 오프라인에서는 동일 디렉터리 복사 후 `yarn install --offline --frozen-lockfile`로 설치한다.

## 환경 분리 개념
- `APP_ENV`: `local` / `dev` / `prod`.
- `NODE_ENV`: Node 런타임 모드.
- `.env.{local,dev,prod}` 샘플을 루트와 `apps/api`, `apps/web`에 제공하며, CORS/보안/DB 설정까지 포함한다.

## 백엔드 코어 레이어(Chapter 2 요약)
- **Config**: `packages/config`에서 환경별 설정(앱/DB/보안/로그)을 로딩.
- **DB**: `apps/api/src/database` TypeORM 모듈, PostgreSQL 기본 구현(다른 벤더는 TODO).
- **Exception/Logging**: 글로벌 예외 필터 + HTTP 로깅 인터셉터 + 보안 헤더(helmet) + CORS.
- **Health**: `/health`에서 버전/환경/DB 상태를 공통 응답 포맷으로 반환.

## 서비스 확장 로드맵(개략)
1. **보안**: HTTPS/TLS 종료, HSTS/CSP 고도화.
2. **DB/ORM**: 다른 벤더(oracle/mssql/tibero) 연결, 마이그레이션 파이프라인.
3. **인증/인가**: 조직/사용자 도메인, OAuth2/SAML/JWT 기반 인증 추가.
4. **API 계약 관리**: shared-types 확장, API 버저닝, OpenAPI 스키마 노출.
5. **UI/디자인 시스템**: 공공 UI 가이드 기반 공통 컴포넌트 라이브러리.
6. **배포/운영**: Docker/K8s 빌드 파이프라인, 헬스체크/프로브/로깅/모니터링 연계.
