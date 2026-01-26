FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY core ./core
# Yarn lock needs to see all entries for proper dependency resolution
COPY entries ./entries
RUN corepack enable
RUN yarn install --immutable

FROM oven/bun:1-alpine
WORKDIR /app
COPY --from=builder /app/core ./core
COPY --from=builder /app/entries/bun ./entries/bun
COPY --from=builder /app/node_modules ./node_modules
# Bun needs tsconfig at root to resolve jsxImportSource for all packages
# COPY --from=builder /app/entries/bun/tsconfig.json ./tsconfig.json
WORKDIR /app/entries/bun
ENV NODE_ENV=production PORT=3000
EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]
