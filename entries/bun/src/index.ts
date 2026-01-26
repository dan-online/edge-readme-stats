import { AppConfig, createApp } from "@edge-readme-stats/core";

const port = Number(process.env.PORT) || 3000;

const config = new AppConfig().env(process.env);
const app = createApp(config);

export default {
	port,
	fetch: app.fetch,
};
