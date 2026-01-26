import { AppConfig, createApp } from "@edge-readme-stats/core";
import { handle } from "hono/vercel";

const config = new AppConfig().env(process.env);
const app = createApp(config);

export const GET = handle(app);
export const POST = handle(app);
