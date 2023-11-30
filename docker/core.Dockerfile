FROM node:18-slim AS base
WORKDIR /app

FROM base AS deps

COPY .yarnrc.yml package.json yarn.lock ./
COPY packages/core/package.json ./packages/core/

RUN yarn set version berry
RUN yarn workspaces focus @artscope/core

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .env ./packages/core/.env

RUN yarn set version berry

RUN yarn workspace @artscope/core build

RUN rm -rf ./packages/core/.next/cache

FROM base AS runner

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs


COPY --from=builder --chown=nextjs:nodejs /app/packages/core/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/core/public ./packages/core/public
COPY --from=builder --chown=nextjs:nodejs /app/packages/core/.next/static ./packages/core/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "packages/core/server.js"]
