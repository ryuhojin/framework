# Web 서비스 (Next.js App Router)

Next.js(App Router) 기반 프론트엔드 스켈레톤이다. `/api/*` 경로로 NestJS 백엔드와 통신할 예정이며, 공통 타입은 `@framework/shared-types`를 사용한다.

## 주요 스크립트
- `yarn workspace web dev` : 개발 서버 (기본 포트 3001, 내부 3000 → 호스트 3001 매핑)
- `yarn workspace web build` : 프로덕션 빌드
- `yarn workspace web start` : 빌드 결과 실행
- `yarn workspace web lint` : ESLint

## 환경 변수
- `.env.local | .env.dev | .env.prod` 샘플 제공
- 핵심 값: `APP_ENV`, `NODE_ENV`, `WEB_HOST`, `WEB_PORT`, `API_BASE_URL`

## 개발 메모
- App Router 구조이며, 디자인/컴포넌트 시스템은 후속 단계에서 추가 예정.
- 금융권/공공망 배포를 위해 Yarn 오프라인 캐시를 활용하도록 Dockerfile을 구성했다.
