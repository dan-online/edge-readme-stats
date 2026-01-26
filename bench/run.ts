import { execSync, spawn } from "node:child_process";

const RUNTIMES = ["node", "bun", "deno"] as const;
const PORT = 3456;
const DURATION = 10; // seconds
const THREADS = 4;
const CONNECTIONS = 100;

interface BenchResult {
	runtime: string;
	requestsPerSec: number;
	latencyAvg: string;
	latencyP99: string;
	errors: number;
}

async function startServer(
	runtime: (typeof RUNTIMES)[number],
): Promise<() => void> {
	let proc: ReturnType<typeof spawn>;

	switch (runtime) {
		case "node":
			proc = spawn("yarn", ["workspace", "@edge-readme-stats/node", "dev"], {
				env: { ...process.env, PORT: String(PORT) },
				stdio: "pipe",
			});
			break;
		case "bun":
			proc = spawn("bun", ["run", "entries/bun/src/index.ts"], {
				env: { ...process.env, PORT: String(PORT) },
				stdio: "pipe",
			});
			break;
		case "deno":
			proc = spawn(
				"deno",
				["run", "--allow-net", "--allow-env", "entries/deno/src/main.ts"],
				{
					env: { ...process.env, PORT: String(PORT) },
					stdio: "pipe",
				},
			);
			break;
	}

	await new Promise((resolve) => setTimeout(resolve, 2000));

	return () => proc.kill();
}

function runWrk(): BenchResult {
	const output = execSync(
		`wrk -t${THREADS} -c${CONNECTIONS} -d${DURATION}s --latency http://localhost:${PORT}/health`,
		{ encoding: "utf-8" },
	);

	const reqMatch = output.match(/Requests\/sec:\s+([\d.]+)/);
	const latencyMatch = output.match(
		/Latency\s+([\d.]+\w+)\s+([\d.]+\w+)\s+([\d.]+\w+)/,
	);
	const p99Match = output.match(/99%\s+([\d.]+\w+)/);
	const errorsMatch = output.match(/Socket errors.*read (\d+)/);

	return {
		runtime: "",
		requestsPerSec: reqMatch ? Number.parseFloat(reqMatch[1]) : 0,
		latencyAvg: latencyMatch ? latencyMatch[1] : "N/A",
		latencyP99: p99Match ? p99Match[1] : "N/A",
		errors: errorsMatch ? Number.parseInt(errorsMatch[1], 10) : 0,
	};
}

async function main() {
	console.log("🚀 edge-readme-stats Benchmark\n");
	console.log(
		`Duration: ${DURATION}s | Threads: ${THREADS} | Connections: ${CONNECTIONS}\n`,
	);

	const results: BenchResult[] = [];

	for (const runtime of RUNTIMES) {
		console.log(`Testing ${runtime}...`);

		try {
			const stop = await startServer(runtime);
			const result = runWrk();
			result.runtime = runtime;
			results.push(result);
			stop();
			await new Promise((resolve) => setTimeout(resolve, 1000));
		} catch (error) {
			console.error(`Failed to benchmark ${runtime}:`, error);
		}
	}

	console.log("\n📊 Results:\n");
	console.log(
		"| Runtime | Req/sec    | Latency (avg) | Latency (p99) | Errors |",
	);
	console.log(
		"|---------|------------|---------------|---------------|--------|",
	);

	for (const r of results) {
		console.log(
			`| ${r.runtime.padEnd(7)} | ${r.requestsPerSec.toFixed(2).padEnd(10)} | ${r.latencyAvg.padEnd(13)} | ${r.latencyP99.padEnd(13)} | ${r.errors.toString().padEnd(6)} |`,
		);
	}

	const winner = results.reduce((a, b) =>
		a.requestsPerSec > b.requestsPerSec ? a : b,
	);
	console.log(
		`\n🏆 Winner: ${winner.runtime} (${winner.requestsPerSec.toFixed(2)} req/sec)`,
	);
}

main().catch(console.error);
