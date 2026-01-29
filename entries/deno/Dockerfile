FROM denoland/deno:alpine
WORKDIR /app
COPY entries ./entries
COPY core ./core

WORKDIR /app/entries/deno

RUN deno cache . && deno cache src/main.ts

ENV PORT=3000
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/ || exit 1
CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "src/main.ts"]
