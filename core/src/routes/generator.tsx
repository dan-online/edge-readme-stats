import { Hono } from "hono";
import { html, raw } from "hono/html";
import * as v from "valibot";
import {
	CSS_VAR_THEME,
	generateThemeStyles,
	resolveTheme,
	type ThemeName,
	themeNames,
} from "../lib/themes.ts";
import { TopLangsCard } from "../render/cards/langs.tsx";
import { StatsCard } from "../render/cards/stats.tsx";
import type { LanguageStats, UserStats } from "../types/index.ts";
import { TopLangsQuerySchema } from "./langs.tsx";
import { BaseQuerySchema } from "./schemas.ts";
import { StatsQuerySchema } from "./stats.tsx";

const LOCALES = [
	{ code: "en", name: "English" },
	{ code: "zh", name: "Chinese" },
	{ code: "es", name: "Spanish" },
	{ code: "pt", name: "Portuguese" },
];

const THEME_LABELS: Record<ThemeName, string> = {
	github: "GitHub (Auto)",
	light: "Light",
	dark: "Dark",
	radical: "Radical",
	tokyonight: "Tokyo Night",
	dracula: "Dracula",
	gruvbox: "Gruvbox",
	nord: "Nord",
	catppuccin: "Catppuccin",
	onedark: "One Dark",
	monokai: "Monokai",
};

const STATS_OPTIONS = [
	{ value: "stars", label: "Stars" },
	{ value: "commits", label: "Commits" },
	{ value: "prs", label: "PRs" },
	{ value: "issues", label: "Issues" },
	{ value: "contribs", label: "Contributions" },
];

const LAYOUTS = ["compact", "donut"];

const PreviewQuerySchema = v.object({
	...BaseQuerySchema.entries,
	...StatsQuerySchema.entries,
	...TopLangsQuerySchema.entries,
	username: v.fallback(v.string(), "your-username"),
	type: v.fallback(v.picklist(["stats", "langs"]), "stats"),
});

const DUMMY_STATS: UserStats = {
	username: "your-username",
	totalStars: 1234,
	totalCommits: 567,
	totalPRs: 89,
	totalIssues: 42,
	totalContributions: 321,
	rank: { level: "A+", percentile: 90 },
};

const DUMMY_LANGS: LanguageStats[] = [
	{ name: "TypeScript", percentage: 45.2, color: "#3178c6" },
	{ name: "Rust", percentage: 25.8, color: "#dea584" },
	{ name: "Python", percentage: 15.3, color: "#3572A5" },
	{ name: "Go", percentage: 8.7, color: "#00ADD8" },
	{ name: "JavaScript", percentage: 5.0, color: "#f1e05a" },
];

export function createGeneratorRoute() {
	const app = new Hono();

	app.get("/preview", (c) => {
		const rawQuery = c.req.query();
		const query = v.parse(PreviewQuerySchema, rawQuery);

		const customColors = {
			bg_color: query.bg_color,
			title_color: query.title_color,
			text_color: query.text_color,
			icon_color: query.icon_color,
			border_color: query.border_color,
		};

		const themeStyles = generateThemeStyles(query.theme, customColors);

		let svg: string;

		if (query.type === "langs") {
			svg = (
				<TopLangsCard
					username={query.username}
					languages={DUMMY_LANGS}
					theme={CSS_VAR_THEME}
					themeStyles={themeStyles}
					hideBorder={query.hide_border}
					layout={query.layout}
					langsCount={query.langs_count}
					locale={query.lang}
					animate={false}
				/>
			).toString();
		} else {
			const stats = { ...DUMMY_STATS, username: query.username };
			svg = (
				<StatsCard
					username={query.username}
					stats={stats}
					theme={CSS_VAR_THEME}
					themeStyles={themeStyles}
					showIcons={query.show_icons}
					hideRank={query.hide_rank}
					hideBorder={query.hide_border}
					hide={query.hide}
					locale={query.lang}
					animate={false}
				/>
			).toString();
		}

		return c.body(svg, 200, {
			"Content-Type": "image/svg+xml",
			"Cache-Control": "no-cache",
		});
	});

	app.get("/", (c) => {
		const baseUrl = new URL(c.req.url).origin;

		return c.html(html`
			<!doctype html>
			<html lang="en">
				<head>
					<meta charset="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>Card Generator - edge-readme-stats</title>
					<style>
						* { box-sizing: border-box; }
						body {
							font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
							max-width: 900px;
							margin: 0 auto;
							padding: 2rem;
							background: #0d1117;
							color: #c9d1d9;
						}
						h1 { color: #58a6ff; margin-bottom: 0.5rem; }
						.subtitle { color: #8b949e; margin-bottom: 2rem; }
						.grid {
							display: grid;
							grid-template-columns: 1fr 1fr;
							gap: 2rem;
						}
						@media (max-width: 700px) {
							.grid { grid-template-columns: 1fr; }
						}
						.card {
							background: #161b22;
							border: 1px solid #30363d;
							border-radius: 6px;
							padding: 1.5rem;
						}
						h2 {
							margin-top: 0;
							font-size: 1rem;
							color: #c9d1d9;
							border-bottom: 1px solid #30363d;
							padding-bottom: 0.5rem;
						}
						label {
							display: block;
							margin-bottom: 0.5rem;
							color: #8b949e;
							font-size: 0.875rem;
						}
						input[type="text"], input[type="number"], select {
							width: 100%;
							padding: 0.5rem;
							margin-bottom: 1rem;
							background: #0d1117;
							border: 1px solid #30363d;
							border-radius: 4px;
							color: #c9d1d9;
							font-size: 0.875rem;
						}
						input:focus, select:focus {
							outline: none;
							border-color: #58a6ff;
						}
						input[type="color"] {
							width: 40px;
							height: 32px;
							padding: 0;
							border: 1px solid #30363d;
							border-radius: 4px;
							cursor: pointer;
						}
						.color-row {
							display: flex;
							align-items: center;
							gap: 0.5rem;
							margin-bottom: 0.75rem;
						}
						.color-row label { margin: 0; min-width: 70px; }
						.color-row input[type="text"] { margin: 0; flex: 1; }
						.checkbox-group {
							display: flex;
							flex-wrap: wrap;
							gap: 0.75rem;
							margin-bottom: 1rem;
						}
						.checkbox-item {
							display: flex;
							align-items: center;
							gap: 0.25rem;
						}
						.checkbox-item input { margin: 0; }
						.checkbox-item label { margin: 0; cursor: pointer; }
						.toggle-row {
							display: flex;
							align-items: center;
							justify-content: space-between;
							margin-bottom: 0.75rem;
						}
						.toggle-row label { margin: 0; }
						.preview-container {
							background: #0d1117;
							border: 1px solid #30363d;
							border-radius: 4px;
							padding: 1rem;
							min-height: 180px;
							display: flex;
							align-items: center;
							justify-content: center;
						}
						.preview-container img { max-width: 100%; height: auto; }
						.output-box {
							background: #0d1117;
							border: 1px solid #30363d;
							border-radius: 4px;
							padding: 0.75rem;
							font-family: monospace;
							font-size: 0.75rem;
							word-break: break-all;
							margin-bottom: 0.5rem;
							color: #7ee787;
						}
						button {
							background: #238636;
							color: white;
							border: none;
							padding: 0.5rem 1rem;
							border-radius: 4px;
							cursor: pointer;
							font-size: 0.875rem;
						}
						button:hover { background: #2ea043; }
						.btn-secondary {
							background: #21262d;
							border: 1px solid #30363d;
						}
						.btn-secondary:hover { background: #30363d; }
						.button-row { display: flex; gap: 0.5rem; }
						.tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
						.tab {
							padding: 0.5rem 1rem;
							background: #21262d;
							border: 1px solid #30363d;
							border-radius: 4px;
							cursor: pointer;
							color: #c9d1d9;
						}
						.tab.active { background: #238636; border-color: #238636; }
						.hidden { display: none; }
						.note { font-size: 0.75rem; color: #8b949e; margin-top: 0.5rem; }
					</style>
				</head>
				<body>
					<h1>Card Generator</h1>
					<p class="subtitle">Build your GitHub stats card and copy the markdown</p>

					<div class="grid">
						<div>
							<div class="card">
								<h2>Card Type</h2>
								<div class="tabs">
									<div class="tab active" data-type="stats">Stats</div>
									<div class="tab" data-type="langs">Languages</div>
								</div>

								<label for="username">GitHub Username</label>
								<input type="text" id="username" placeholder="your-username" oninput="updatePreview()" />

								<label for="theme">Theme</label>
								<select id="theme" onchange="updatePreview(); updateColorPlaceholders()">
									${themeNames.map((t) => html`<option value="${t}">${THEME_LABELS[t]}</option>`)}
								</select>

								<label for="lang">Language</label>
								<select id="lang" onchange="updatePreview()">
									${LOCALES.map((l) => html`<option value="${l.code}">${l.name}</option>`)}
								</select>
							</div>

							<div class="card" style="margin-top: 1rem">
								<h2>Options</h2>
								<div id="stats-options">
									<div class="toggle-row">
										<label>Show Icons</label>
										<input type="checkbox" id="show_icons" checked onchange="updatePreview()" />
									</div>
									<div class="toggle-row">
										<label>Hide Rank</label>
										<input type="checkbox" id="hide_rank" onchange="updatePreview()" />
									</div>
									<div class="toggle-row">
										<label>Hide Border</label>
										<input type="checkbox" id="hide_border" onchange="updatePreview()" />
									</div>
									<label>Hide Stats</label>
									<div class="checkbox-group">
										${STATS_OPTIONS.map(
											(s) => html`
											<div class="checkbox-item">
												<input type="checkbox" id="hide_${s.value}" onchange="updatePreview()" />
												<label for="hide_${s.value}">${s.label}</label>
											</div>
										`,
										)}
									</div>
								</div>
								<div id="langs-options" class="hidden">
									<label for="langs_count">Languages Count</label>
									<input type="number" id="langs_count" min="1" max="10" value="5" onchange="updatePreview()" />
									<label for="layout">Layout</label>
									<select id="layout" onchange="updatePreview()">
										${LAYOUTS.map((l) => html`<option value="${l}">${l}</option>`)}
									</select>
									<div class="toggle-row">
										<label>Hide Border</label>
										<input type="checkbox" id="langs_hide_border" onchange="updatePreview()" />
									</div>
								</div>
							</div>

							<div class="card" style="margin-top: 1rem">
								<h2>Custom Colors</h2>
								<div class="color-row">
									<label>BG</label>
									<input type="color" id="bg_color_picker" value="#0d1117" oninput="syncColor('bg_color')" />
									<input type="text" id="bg_color" placeholder="optional" oninput="updatePreview()" />
								</div>
								<div class="color-row">
									<label>Title</label>
									<input type="color" id="title_color_picker" value="#58a6ff" oninput="syncColor('title_color')" />
									<input type="text" id="title_color" placeholder="optional" oninput="updatePreview()" />
								</div>
								<div class="color-row">
									<label>Text</label>
									<input type="color" id="text_color_picker" value="#c9d1d9" oninput="syncColor('text_color')" />
									<input type="text" id="text_color" placeholder="optional" oninput="updatePreview()" />
								</div>
								<div class="color-row">
									<label>Icons</label>
									<input type="color" id="icon_color_picker" value="#58a6ff" oninput="syncColor('icon_color')" />
									<input type="text" id="icon_color" placeholder="optional" oninput="updatePreview()" />
								</div>
								<div class="color-row">
									<label>Border</label>
									<input type="color" id="border_color_picker" value="#30363d" oninput="syncColor('border_color')" />
									<input type="text" id="border_color" placeholder="optional" oninput="updatePreview()" />
								</div>
								<button class="btn-secondary" style="width: 100%; margin-top: 0.5rem" onclick="applyTheme()">Submit as New Theme</button>
							</div>
						</div>

						<div>
							<div class="card">
								<h2>Preview</h2>
								<div class="preview-container">
									<img id="preview-img" src="" alt="Preview" />
								</div>
								<p class="note">Preview uses sample data. Your actual stats will differ.</p>
							</div>

							<div class="card" style="margin-top: 1rem">
								<h2>Output</h2>
								<div class="output-box" id="markdown-output">![GitHub Stats](${baseUrl}/stats?username=YOUR_USERNAME)</div>
								<div class="button-row">
									<button onclick="copyText('markdown', this)">Copy Markdown</button>
									<button class="btn-secondary" onclick="copyText('url', this)">Copy URL</button>
								</div>
							</div>
						</div>
					</div>

					<script>
						const baseUrl = "${baseUrl}";
						let cardType = "stats";

						const isDefault = (id) => {
							const el = document.getElementById(id);
							return el.value === el.options[0].value;
						};

						document.querySelectorAll(".tab").forEach(tab => {
							tab.addEventListener("click", () => {
								document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
								tab.classList.add("active");
								cardType = tab.dataset.type;
								document.getElementById("stats-options").classList.toggle("hidden", cardType !== "stats");
								document.getElementById("langs-options").classList.toggle("hidden", cardType !== "langs");
								updatePreview();
							});
						});

						function syncColor(field) {
							const picker = document.getElementById(field + "_picker");
							document.getElementById(field).value = picker.value.substring(1);
							updatePreview();
						}

						function buildParams(forPreview) {
							const params = new URLSearchParams();
							const username = document.getElementById("username").value.trim() || "your-username";

							if (forPreview) {
								params.set("type", cardType);
								params.set("username", username);
							} else {
								params.set("username", username === "your-username" ? "YOUR_USERNAME" : username);
							}

							if (!isDefault("theme")) params.set("theme", document.getElementById("theme").value);
							if (!isDefault("lang")) params.set("lang", document.getElementById("lang").value);

							if (cardType === "stats") {
								if (!document.getElementById("show_icons").checked) params.set("show_icons", "false");
								if (document.getElementById("hide_rank").checked) params.set("hide_rank", "true");
								if (document.getElementById("hide_border").checked) params.set("hide_border", "true");

								const hide = [];
								["stars", "commits", "prs", "issues", "contribs"].forEach(s => {
									if (document.getElementById("hide_" + s).checked) hide.push(s);
								});
								if (hide.length) params.set("hide", hide.join(","));
							} else {
								const count = document.getElementById("langs_count").value;
								if (count !== "5") params.set("langs_count", count);
								if (!isDefault("layout")) params.set("layout", document.getElementById("layout").value);
								if (document.getElementById("langs_hide_border").checked) params.set("hide_border", "true");
							}

							["bg_color", "title_color", "text_color", "icon_color", "border_color"].forEach(c => {
								const val = document.getElementById(c).value.trim();
								if (val) params.set(c, val);
							});

							return params;
						}

						function updatePreview() {
							const previewParams = buildParams(true);
							previewParams.set("cache", crypto.randomUUID());
							document.getElementById("preview-img").src = baseUrl + "/generator/preview?" + previewParams.toString();

							const outputParams = buildParams(false);
							const endpoint = cardType === "stats" ? "stats" : "langs";
							const altText = cardType === "stats" ? "GitHub Stats" : "Top Languages";
							const url = baseUrl + "/" + endpoint + "?" + outputParams.toString();
							document.getElementById("markdown-output").textContent = "![" + altText + "](" + url + ")";
						}

						function copyText(type, btn) {
							const outputParams = buildParams(false);
							const endpoint = cardType === "stats" ? "stats" : "langs";
							const url = baseUrl + "/" + endpoint + "?" + outputParams.toString();

							if (type === "url") {
								navigator.clipboard.writeText(url);
							} else {
								const altText = cardType === "stats" ? "GitHub Stats" : "Top Languages";
								navigator.clipboard.writeText("![" + altText + "](" + url + ")");
							}

							const original = btn.textContent;
							btn.textContent = "Copied!";
							btn.disabled = true;
							setTimeout(() => {
								btn.textContent = original;
								btn.disabled = false;
							}, 1500);
						}

						const themes = ${raw(
							JSON.stringify(
								Object.fromEntries(
									themeNames.map((name) => [
										name,
										resolveTheme(name as ThemeName),
									]),
								),
							),
						)};

						function updateColorPlaceholders() {
							const themeName = document.getElementById("theme").value;
							const theme = themes[themeName] || themes.light;

							document.getElementById("bg_color").placeholder = theme.bg.slice(1);
							document.getElementById("title_color").placeholder = theme.title.slice(1);
							document.getElementById("text_color").placeholder = theme.text.slice(1);
							document.getElementById("icon_color").placeholder = theme.icon.slice(1);
							document.getElementById("border_color").placeholder = theme.border.slice(1);

							document.getElementById("bg_color_picker").value = theme.bg;
							document.getElementById("title_color_picker").value = theme.title;
							document.getElementById("text_color_picker").value = theme.text;
							document.getElementById("icon_color_picker").value = theme.icon;
							document.getElementById("border_color_picker").value = theme.border;
						}

						function applyTheme() {
							const baseTheme = themes[document.getElementById("theme").value] || themes.github;
							const bg = document.getElementById("bg_color").value.trim();
							const title = document.getElementById("title_color").value.trim();
							const text = document.getElementById("text_color").value.trim();
							const icon = document.getElementById("icon_color").value.trim();
							const border = document.getElementById("border_color").value.trim();

							const themeName = prompt("Enter a name for your theme (lowercase, no spaces):");
							if (!themeName) return;

							const themeObj = {
								bg: bg ? "#" + bg : baseTheme.bg,
								title: title ? "#" + title : baseTheme.title,
								text: text ? "#" + text : baseTheme.text,
								icon: icon ? "#" + icon : baseTheme.icon,
								border: border ? "#" + border : baseTheme.border,
							};

							const previewParams = new URLSearchParams({
								username: "dan-online",
								bg_color: themeObj.bg.slice(1),
								title_color: themeObj.title.slice(1),
								text_color: themeObj.text.slice(1),
								icon_color: themeObj.icon.slice(1),
								border_color: themeObj.border.slice(1),
							});
							const previewUrl = "https://edge-readme-stats.dancodes.workers.dev/stats?" + previewParams;
							const body = [
								"## New Theme: " + themeName,
								"",
								"\`\`\`ts",
								themeName + ": " + JSON.stringify(themeObj, null, "\\t") + ",",
								"\`\`\`",
								"",
								"### Preview",
								"![Preview](" + previewUrl + ")",
							].join("\\n");

							const issueUrl = "https://github.com/dan-online/edge-readme-stats/issues/new?" +
								"title=" + encodeURIComponent("feat(theme): add custom theme " + themeName) +
								"&body=" + encodeURIComponent(body);

							window.open(issueUrl, "_blank");
						}

						// Initialize on page load
						updatePreview();
						updateColorPlaceholders();
					</script>
				</body>
			</html>
		`);
	});

	return app;
}
