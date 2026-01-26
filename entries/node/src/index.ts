import { AppConfig, createApp } from "@edge-readme-stats/core";
import { serve } from "@hono/node-server";

const port = Number(process.env.PORT) || 3000;

const config = new AppConfig().env(process.env);
const app = createApp(config);

console.log(`Server running at http://localhost:${port}`);

serve({ fetch: app.fetch, port });
