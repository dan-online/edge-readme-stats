FROM node:24-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare yarn@4.12.0 --activate
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY core ./core
COPY entries/node ./entries/node
RUN yarn install --immutable
RUN yarn workspace @edge-readme-stats/node build

FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/entries/node/dist ./dist
ENV NODE_ENV=production PORT=3000
EXPOSE 3000
CMD ["node", "dist/index.js"]
