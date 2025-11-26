# CHAPTER 3: 인증/인가, RBAC, 메뉴/권한 모델

## 도메인/ER 개요
- User: id, username(고유), password(해시), name, email, status(ACTIVE/LOCKED/DISABLED), loginFailCount, lastLoginAt, messageKey.
- Role: id, name(고유), description, isSystemDefault, messageKey.
- Permission: id, code(고유), description, type(MENU|ACTION), resource, isActive, messageKey.
- Menu: id, name, path, depth, sortOrder, icon, isActive, parentId, messageKey.
- N:N: User-Role(`user_roles`), Role-Permission(`role_permissions`), Menu-Permission(`menu_permissions`).
- TODO: 메뉴/퍼미션 이름을 메시지 테이블로 국제화할 수 있도록 messageKey만 두고, 실제 메시지는 별도 테이블/서비스로 확장 예정.

## 설정 키 (auth/security)
- `JWT_SECRET`, `JWT_EXPIRES_IN`, `BCRYPT_SALT_OR_ROUNDS`
- CORS/Helmet/CSP: `CORS_ALLOWED_ORIGINS`, `ENABLE_HELMET`, `CSP_ENABLED`, `LOG_LEVEL`
- DB: `DB_VENDOR`, `DB_DISABLE` 등 (prod에서는 DB_DISABLE=false)

## 인증 (JWT)
- 엔드포인트: `POST /auth/login`
- 요청: `{ "username": "admin", "password": "admin123!" }`
- 검증:
  - bcrypt로 비밀번호 검증(`BCRYPT_SALT_OR_ROUNDS` 사용).
  - 실패 시 `loginFailCount` 증가, 잠금 정책은 TODO (금융권 정책에 맞춰 강화 필요).
  - 잠금/비활성 상태면 Unauthorized.
- 응답(공통 포맷):
```json
{
  "success": true,
  "data": {
    "accessToken": "<jwt>",
    "expiresIn": "1h"
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```
- JWT Payload: `{ sub, username, roles[], permissions[] }`
- 보안 TODO(운영):
  - 키 로테이션, 만료시간 단축(예: 15m), RefreshToken/재발급 정책.
  - 실패 횟수/계정 잠금 정책 구체화.
  - 2FA/MFA, IP 화이트리스트/블랙리스트.
  - 감사 로그(누가 언제 무엇을 했는지) 추가.

## 인가 (RBAC)
- 데코레이터: `@RequirePermissions('MANAGE_MENU')`
- 가드: `JwtAuthGuard` → `PermissionGuard` 순으로 적용.
- 권한 부족 시 403 공통 에러 응답.
- 중요한 API(admin/*)는 반드시 권한 체크를 주석/코드로 명시(금융권 감사를 대비).

## 관리용 API (ADMIN 권한 필요)
- `GET/POST/PATCH/DELETE /admin/menus` (권한: MANAGE_MENU)
- `GET/POST/PATCH/DELETE /admin/roles` (권한: MANAGE_ROLE)
- `GET/POST/PATCH/DELETE /admin/permissions` (권한: MANAGE_PERMISSION)
- 응답은 모두 공통 포맷(`ApiResponse<T>`) 사용.

## Seed (local/dev 전용)
- 조건: APP_ENV=local|dev, DB_DISABLE=false 일 때만 실행.
- 기본 데이터:
  - 사용자: `admin / admin123!` (운영 금지, 반드시 변경)
  - 역할: `ADMIN`
  - 퍼미션: `MANAGE_MENU`, `MANAGE_ROLE`, `MANAGE_PERMISSION`, `VIEW_DASHBOARD`
  - 메뉴: `/dashboard` (VIEW_DASHBOARD 권한 포함)
- 로그인 흐름:
  1) `POST /auth/login` → 토큰 획득
  2) Authorization: `Bearer <token>` 헤더로 `GET /admin/menus` 등 호출
  3) 권한 부족 시 403

## 금융권 보안 TODO
- 로그인 실패 횟수/계정 잠금 기간/해제 절차.
- IP 기반 차단/화이트리스트.
- MFA/OTP 도입 가능성 검토.
- 감사 로그(관리자/중요 작업) 및 변경 이력 보관.
- JWT 키 로테이션, 키 보관(HSM/Key Vault), RefreshToken 관리.

## Docker/환경
- docker-compose: `APP_ENV`와 `DB_VENDOR/DB_DISABLE` 전달. local/dev에서 Seed 자동 실행, prod에서는 Seed 금지.
- 오프라인: base 이미지(node:20-alpine, postgres:15) 사전 pull 후 `yarn install --offline --frozen-lockfile` → `docker compose up --build`.

## 테스트 및 빌드
- 실행: `yarn workspace api test`, `yarn workspace api test:e2e`, `yarn build`
- 시나리오:
  - 로그인 실패 시 Unauthorized.
  - PermissionGuard가 권한 없을 때 403.
  - e2e: `/health`, `/info` 응답 확인(DB 비활성 시에도 동작).
- 결과(로컬 실행 기준): `yarn workspace api test`(통과, 워커 종료 경고 메시지 있음), `yarn workspace api test:e2e`(통과, in-memory sqlite 사용), `yarn build`(패키지→api→web 모두 성공).

## ER/레이어 요약
- Entities: User, Role, Permission, Menu (+ join tables).
- Modules: Auth(JWT), RBAC(admin CRUD), Seed(local/dev), Config/DB/Exception/Logging/Health.
- TODO: 메뉴/퍼미션 메시지 다국어 테이블, 감사 로그, MFA, 키 로테이션.
