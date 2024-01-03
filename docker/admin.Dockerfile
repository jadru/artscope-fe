# 단계 1: 빌드 환경
FROM node:18-slim as base
WORKDIR /app

FROM base AS builder

COPY .yarnrc.yml package.json yarn.lock ./
COPY packages/admin/package.json ./packages/admin/


COPY . .

COPY .env ./packages/admin/.env

RUN yarn set version berry
RUN yarn workspace @artscope/admin install
RUN yarn workspace @artscope/admin build

EXPOSE 3000
ENV PORT 3000

CMD ["yarn", "workspace", "@artscope/admin", "dev"]
