FROM node:24-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare yarn@4.12.0 --activate
COPY package.json yarn.lock .yarnrc.yml ./
COPY core ./core

COPY entries ./entries
RUN yarn install --immutable
RUN yarn workspace @edge-readme-stats/node build

FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/core ./core
COPY --from=builder /app/entries/node ./entries/node
COPY --from=builder /app/node_modules ./node_modules
WORKDIR /app/entries/node
ENV NODE_ENV=production PORT=3000
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/ || exit 1
CMD ["node", "dist/index.js"]
