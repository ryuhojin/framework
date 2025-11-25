# 베이스 빌드 이미지
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock .yarnrc ./
COPY yarn-offline-cache ./yarn-offline-cache
COPY packages ./packages
COPY apps/web/package.json ./apps/web/package.json

RUN yarn install --frozen-lockfile --ignore-optional || yarn install --frozen-lockfile --ignore-optional --offline

COPY . .
RUN yarn workspace web build

# 런타임 이미지
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000
CMD ["node", "apps/web/server.js"]
