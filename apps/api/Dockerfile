# 베이스 빌드 이미지
FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

# Yarn 설정 및 워크스페이스 메타 복사
COPY package.json yarn.lock .yarnrc ./
COPY yarn-offline-cache ./yarn-offline-cache
COPY packages ./packages
COPY apps/api/package.json ./apps/api/package.json

# 의존성 설치 (온라인/오프라인 자동 대응)
RUN yarn install --frozen-lockfile --ignore-optional || yarn install --frozen-lockfile --ignore-optional --offline

# 소스 복사 후 빌드
COPY . .
RUN yarn workspace @framework/core build && yarn workspace @framework/config build && yarn workspace @framework/shared-types build && yarn workspace api build

# 런타임 이미지
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

COPY package.json yarn.lock .yarnrc ./
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/packages /app/packages
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist

EXPOSE 3000
CMD ["yarn", "workspace", "api", "start:prod"]
