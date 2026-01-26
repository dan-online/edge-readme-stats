FROM denoland/deno:alpine
WORKDIR /app
COPY entries ./entries
COPY core ./core

WORKDIR /app/entries/deno

RUN deno cache . && deno cache src/main.ts

ENV PORT=3000
EXPOSE 3000
CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "src/main.ts"]
