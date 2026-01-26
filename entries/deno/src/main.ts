import { AppConfig, createApp } from "@edge-readme-stats/core";

const port = Number(Deno.env.get("PORT")) || 3000;

const config = new AppConfig().env(Deno.env.toObject());
const app = createApp(config);

console.log(`Server running at http://localhost:${port}`);
Deno.serve({ port }, app.fetch);
