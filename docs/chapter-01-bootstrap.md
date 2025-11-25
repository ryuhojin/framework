# CHAPTER 1: Bootstrap

## 이번 챕터에서 수행한 작업
- NestJS + Next.js(App Router) 기반 모노레포 골격 생성 (`apps/api`, `apps/web`).
- Yarn Classic 워크스페이스와 오프라인 캐시 디렉터리(`yarn-offline-cache/`) 구성, `.yarnrc`에 미러 경로 지정.
- 공통 패키지 생성: `@framework/core`, `@framework/config`, `@framework/shared-types`.
- 환경 분리용 `.env.local`, `.env.dev`, `.env.prod` 샘플을 루트/각 앱에 배치.
- Docker 기본 구성 (`docker-compose.yml`, `apps/api/Dockerfile`, `apps/web/Dockerfile`).
- 문서/아키텍처 개요 작성.

## Yarn 오프라인 캐시 채우기/사용하기
1. **온라인 환경(인터넷 가능)**  
   - `yarn install` (루트) 실행 → 의존성 tarball이 `./yarn-offline-cache`에 저장된다.  
   - 오프라인 배포 대상에 `yarn.lock`, `.yarnrc`, `yarn-offline-cache/`를 함께 전달한다.
2. **오프라인 환경**  
   - 동일 디렉터리 구조로 복사 후 `yarn install --offline --frozen-lockfile` 실행.
3. 필요 시 캐시 정리: `.yarnrc`의 `yarn-offline-mirror-pruning true`로 미사용 패키지 정리 가능.

## 새 개발자 온보딩 절차 (local 기준)
1. `git clone <repo>`  
2. `yarn install` (온라인) 혹은 `yarn install --offline` (오프라인)  
3. `.env.local`(루트/각 앱) 값을 실제 환경에 맞게 수정  
4. 백엔드 개발 서버: `yarn workspace api start:dev` (기본 포트 3000)  
5. 프론트 개발 서버: `yarn workspace web dev` (기본 포트 3001)  
6. 브라우저 접속:  
   - Web: http://localhost:3001  
   - API 헬스: http://localhost:3000/  
   - API 정보: http://localhost:3000/info

## Docker로 올리기
- 빌드 및 실행: `docker compose up --build`  
- 기본 포트 (local 샘플 기준):  
  - web: http://localhost:3001  
  - api: http://localhost:3000  
  - db(postgres): 5432
- 캐시가 채워져 있다면 컨테이너 빌드 시 `yarn install --offline`가 활용된다.

## 추가 메모
- Next.js에서 `/api/*` 경로로 NestJS 백엔드 호출을 염두에 두고 타입 공유(`@framework/shared-types`)를 준비했다.
- 이후 챕터에서 DB/인증/보안 모듈을 확장할 예정이며, 본 챕터는 최소 실행 골격과 환경 분리/오프라인 기반만 준비한다.
