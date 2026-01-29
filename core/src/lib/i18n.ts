export const translations = {
	en: {
		stats: {
			title: (username: string) => `${username}'s GitHub Stats`,
			totalStars: "Stars",
			totalCommits: "Commits",
			totalPRs: "PRs",
			totalIssues: "Issues",
			contributions: "Contributions",
		},
		topLangs: {
			title: "Most Used Languages",
		},
		heatmap: {
			title: (username: string) => `${username}'s Contributions`,
			totalContributions: "Total",
			currentStreak: "Current Streak",
			longestStreak: "Longest Streak",
			days: "days",
			contributions: "contributions",
		},
		errors: {
			userNotFound: "User not found",
			usernameNotAllowed: "Username not allowed",
			rateLimited: "Rate limit exceeded",
			serverError: "Server error",
		},
	},
	// Machine translated
	zh: {
		stats: {
			title: (username: string) => `${username} 的 GitHub 统计`,
			totalStars: "星标",
			totalCommits: "提交",
			totalPRs: "拉取请求",
			totalIssues: "问题",
			contributions: "贡献",
		},
		topLangs: {
			title: "最常用语言",
		},
		heatmap: {
			title: (username: string) => `${username} 的贡献`,
			totalContributions: "总计",
			currentStreak: "当前连续",
			longestStreak: "最长连续",
			days: "天",
			contributions: "次贡献",
		},
		errors: {
			userNotFound: "用户未找到",
			usernameNotAllowed: "用户名不被允许",
			rateLimited: "请求频率超限",
			serverError: "服务器错误",
		},
	},
	// Machine translated
	es: {
		stats: {
			title: (username: string) => `Estadísticas de GitHub de ${username}`,
			totalStars: "Estrellas",
			totalCommits: "Commits",
			totalPRs: "PRs",
			totalIssues: "Issues",
			contributions: "Contribuciones",
		},
		topLangs: {
			title: "Lenguajes Más Usados",
		},
		heatmap: {
			title: (username: string) => `Contribuciones de ${username}`,
			totalContributions: "Total",
			currentStreak: "Racha Actual",
			longestStreak: "Racha Más Larga",
			days: "días",
			contributions: "contribuciones",
		},
		errors: {
			userNotFound: "Usuario no encontrado",
			usernameNotAllowed: "Nombre de usuario no permitido",
			rateLimited: "Límite de solicitudes excedido",
			serverError: "Error del servidor",
		},
	},
	// Machine translated
	pt: {
		stats: {
			title: (username: string) => `Estatísticas do GitHub de ${username}`,
			totalStars: "Estrelas",
			totalCommits: "Commits",
			totalPRs: "PRs",
			totalIssues: "Issues",
			contributions: "Contribuições",
		},
		topLangs: {
			title: "Linguagens Mais Usadas",
		},
		heatmap: {
			title: (username: string) => `Contribuições de ${username}`,
			totalContributions: "Total",
			currentStreak: "Sequência Atual",
			longestStreak: "Maior Sequência",
			days: "dias",
			contributions: "contribuições",
		},
		errors: {
			userNotFound: "Usuário não encontrado",
			usernameNotAllowed: "Nome de usuário não permitido",
			rateLimited: "Limite de requisições excedido",
			serverError: "Erro do servidor",
		},
	},
} as const;

export type Locale = keyof typeof translations;

export const locales = Object.keys(translations) as Locale[];

export function t(locale: Locale = "en") {
	return translations[locale];
}

export function resolveLocale(
	langQuery: string | undefined,
	acceptLanguage: string | undefined | null,
): Locale {
	if (langQuery && locales.includes(langQuery as Locale)) {
		return langQuery as Locale;
	}

	if (acceptLanguage) {
		const preferred = acceptLanguage.split(",")[0]?.split("-")[0]?.trim();
		if (preferred && locales.includes(preferred as Locale)) {
			return preferred as Locale;
		}
	}

	return "en";
}
