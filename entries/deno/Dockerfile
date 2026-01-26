FROM denoland/deno:alpine
WORKDIR /app
COPY entries/deno ./entries/deno
COPY core ./core
RUN deno cache entries/deno/src/main.ts
ENV PORT=3000
EXPOSE 3000
CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "entries/deno/src/main.ts"]
