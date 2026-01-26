/**
 * Syncs import versions in deno.json with dependencies from core/package.json
 *
 * Usage: deno task sync-imports
 */

const DENO_JSON_PATH = new URL("../deno.json", import.meta.url).pathname;
const CORE_PACKAGE_PATH = new URL("../../../core/package.json", import.meta.url)
	.pathname;

interface PackageJson {
	dependencies?: Record<string, string>;
}

interface DenoJson {
	imports?: Record<string, string>;
	[key: string]: unknown;
}

async function main() {
	const corePackage: PackageJson = JSON.parse(
		await Deno.readTextFile(CORE_PACKAGE_PATH),
	);
	const denoJson: DenoJson = JSON.parse(
		await Deno.readTextFile(DENO_JSON_PATH),
	);

	const coreDeps = corePackage.dependencies ?? {};
	const imports = denoJson.imports ?? {};

	const changes: string[] = [];
	const coreVersions = new Map<string, string>();
	for (const [pkg, version] of Object.entries(coreDeps)) {
		coreVersions.set(pkg, version);
	}

	const coveredPackages = new Set<string>();

	for (const [importKey, importValue] of Object.entries(imports)) {
		if (!importValue.startsWith("npm:")) continue;

		const match = importValue.match(/^npm:(@?[^@/]+(?:\/[^@/]+)?)@([^/]+)(.*)/);
		if (!match) continue;

		const [, packageName, currentVersion, subpath] = match;
		coveredPackages.add(packageName);

		const coreVersion = coreVersions.get(packageName);
		if (coreVersion && coreVersion !== currentVersion) {
			const newValue = `npm:${packageName}@${coreVersion}${subpath}`;
			imports[importKey] = newValue;
			changes.push(`Updated ${importKey}: ${currentVersion} → ${coreVersion}`);
		}
	}

	for (const [pkg, version] of coreVersions) {
		if (!coveredPackages.has(pkg)) {
			// Skip @types packages - Deno doesn't need them
			if (pkg.startsWith("@types/")) continue;

			imports[pkg] = `npm:${pkg}@${version}`;
			changes.push(`Added ${pkg}: ${version}`);
		}
	}

	for (const [importKey, importValue] of Object.entries(imports)) {
		if (!importValue.startsWith("npm:")) continue;

		const match = importValue.match(/^npm:(@?[^@/]+(?:\/[^@/]+)?)@/);
		if (!match) continue;

		const packageName = match[1];
		// Keep subpath imports (like hono/jsx) if base package exists
		if (importKey.includes("/") && coreVersions.has(importKey.split("/")[0])) {
			continue;
		}
		// Keep scoped subpath imports (like @hono/valibot-validator)
		if (importKey.startsWith("@") && importKey.includes("/")) {
			const scopedBase = importKey.split("/").slice(0, 2).join("/");
			if (coreVersions.has(scopedBase)) continue;
		}

		if (!coreVersions.has(packageName)) {
			delete imports[importKey];
			changes.push(`Removed ${importKey} (not in core)`);
		}
	}

	if (changes.length === 0) {
		console.log("✓ All imports are already in sync with core/package.json");
		return;
	}

	denoJson.imports = imports;
	await Deno.writeTextFile(
		DENO_JSON_PATH,
		`${JSON.stringify(denoJson, null, "\t")}\n`,
	);

	console.log("Synced imports with core/package.json:\n");
	for (const change of changes) {
		console.log(`  ${change}`);
	}
	console.log("\nRun 'deno cache src/main.ts' to update the lock file.");
}

main();
