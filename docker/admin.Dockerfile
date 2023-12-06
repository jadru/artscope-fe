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
FROM nginx:alpine as runner

ENV NODE_ENV=production


RUN rm /etc/nginx/conf.d/default.conf
RUN  touch /var/run/nginx.pid && \
     chown -R nginx:nginx /var/cache/nginx /var/run/nginx.pid

USER nginx
COPY --chown=nginx:nginx packages/admin/default.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx --from=builder /app/packages/admin/dist /usr/share/nginx/html

RUN mkdir -p /var/log/nginx
RUN chown -R nginx:nginx /var/log/nginx
RUN chmod -R 777 /var/log/nginx


VOLUME /usr/share/nginx/html
VOLUME /etc/nginx/conf.d

EXPOSE 3000
ENV PORT 3000

CMD ["nginx", "-g", "daemon off;"]
