# 단계 1: 빌드 환경
FROM node:18-slim as base
WORKDIR /app

FROM base AS deps

COPY .yarnrc.yml package.json yarn.lock ./
COPY packages/admin/package.json ./packages/admin/

RUN yarn set version berry
RUN yarn workspaces focus @artscope/admin

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .env ./packages/admin/.env

RUN yarn set version berry

RUN yarn workspace @artscope/admin build

# 단계 2: 프로덕션 환경
FROM nginx:alpine as runner

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 reactjs

RUN chown -R reactjs:nodejs /var/cache/nginx
COPY --from=builder --chown=reactjs:nodejs /app/packages/admin/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY packages/admin/nginx.conf /etc/nginx/conf.d

USER reactjs

EXPOSE 3000
ENV PORT 3000

CMD ["nginx", "-g", "daemon off;"]
