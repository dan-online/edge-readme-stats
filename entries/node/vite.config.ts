import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	resolve: {
		alias: {
			"@edge-readme-stats/core": resolve(__dirname, "../../core/src/index.tsx"),
		},
	},
	esbuild: {
		jsx: "automatic",
		jsxImportSource: "hono/jsx",
	},
	build: {
		target: "esnext",
		lib: {
			entry: "src/index.ts",
			formats: ["es"],
			fileName: "index",
		},
		rollupOptions: {
			external: [
				/^node:/,
				"@hono/node-server",
				"hono",
				"ky",
				"valibot",
				"hono-openapi",
				"@hono/swagger-ui",
				"@hono/valibot-validator",
			],
		},
	},
});
