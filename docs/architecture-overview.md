# 아키텍처 개요 (NestJS + Next.js 모노레포)

본 레포는 금융권/공공망에서도 동작 가능한 전자정부 스타일의 웹 서비스 스켈레톤이다. Yarn Classic 워크스페이스와 오프라인 캐시, Docker 구성, 환경 분리(.env local/dev/prod)를 기본 제공한다.

## 모노레포 디렉터리 역할
- `apps/api`: NestJS 기반 백엔드 API. 최소 Health/Info 엔드포인트만 포함.
- `apps/web`: Next.js(App Router) 기반 프론트엔드. `/api/*`로 백엔드와 연동 예정.
- `packages/core`: 공통 헬퍼/유틸(AppEnv 판별 등).
- `packages/config`: 환경 변수 기반 설정 로더.
- `packages/shared-types`: API/프론트에서 공유하는 타입(DTO).
- `docs`: 설계/운영 문서.
- `yarn-offline-cache`: Yarn 오프라인 미러 디렉터리(패키지 tarball 저장 위치).

## Yarn 워크스페이스 & Offline Cache
- 루트 `package.json`의 `workspaces`로 `apps/*`, `packages/*`를 관리한다.
- `.yarnrc`에서 `yarn-offline-mirror "./yarn-offline-cache"`로 설정된다.
- 인터넷이 되는 환경에서 `yarn install`을 실행하면 의존성 tarball이 `yarn-offline-cache/`에 저장된다. 오프라인 망에서는 같은 디렉터리를 복사해두고 `yarn install --offline`으로 설치한다.

## 환경 분리 개념
- `APP_ENV`: `local` / `dev` / `prod` 로 동작 컨텍스트를 지정.
- `NODE_ENV`: Node 런타임 모드(`development` | `production`).
- 각 환경별 `.env.{local,dev,prod}` 샘플을 루트와 `apps/api`, `apps/web`에 제공한다.

## 서비스 확장 로드맵(개략)
1. **보안**: HTTPS 설정, TLS 종료, 보안 헤더 모듈 적용.
2. **DB/ORM**: PostgreSQL + ORM(TypeORM/Prisma) 연동, 마이그레이션 파이프라인 구축.
3. **인증/인가**: 조직/사용자 도메인, OAuth2/SAML/JWT 기반 인증 추가.
4. **API 계약 관리**: shared-types 확장, API 버저닝, OpenAPI 스키마 노출.
5. **UI/디자인 시스템**: 공공 UI 가이드 반영한 공통 컴포넌트 라이브러리 추가.
6. **배포**: Docker/K8s 빌드 파이프라인, 헬스체크/프로브/로깅/모니터링 연계.
