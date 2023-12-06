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

# 단계 2: 프로덕션 환경
FROM nginxinc/nginx-unprivileged:latest as runner

ENV NODE_ENV=production

RUN rm /etc/nginx/conf.d/default.conf

COPY packages/admin/default.conf /etc/nginx/conf.d/default.conf
RUN chmod 777 /etc/nginx/conf.d/default.conf
COPY --from=builder /app/packages/admin/dist /usr/share/nginx/html
#COPY --from=builder --chown=reactjs:nodejs /app/node_modules /usr/share/nginx/html/node_modules



EXPOSE 3000
ENV PORT 3000

CMD ["nginx", "-g", "daemon off;"]
