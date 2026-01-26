import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: false,
		environment: "node",
		include: ["tests/**/*.test.{ts,tsx}"],
	},
	resolve: {
		alias: {
			"@edge-readme-stats/core": path.resolve(__dirname, "./src"),
		},
	},
	esbuild: {
		jsx: "automatic",
		jsxImportSource: "hono/jsx",
	},
});
