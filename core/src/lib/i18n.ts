export const translations = {
	en: {
		stats: {
			title: (username: string) => `${username}'s GitHub Stats`,
			totalStars: "Total Stars",
			totalCommits: "Total Commits",
			totalPRs: "Total PRs",
			totalIssues: "Total Issues",
			contributions: "Contributions",
		},
		topLangs: {
			title: "Most Used Languages",
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
			totalStars: "获得星标",
			totalCommits: "提交总数",
			totalPRs: "拉取请求",
			totalIssues: "问题总数",
			contributions: "贡献",
		},
		topLangs: {
			title: "最常用语言",
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
			totalStars: "Estrellas Totales",
			totalCommits: "Commits Totales",
			totalPRs: "PRs Totales",
			totalIssues: "Issues Totales",
			contributions: "Contribuciones",
		},
		topLangs: {
			title: "Lenguajes Más Usados",
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
			totalStars: "Estrelas Totais",
			totalCommits: "Commits Totais",
			totalPRs: "PRs Totais",
			totalIssues: "Issues Totais",
			contributions: "Contribuições",
		},
		topLangs: {
			title: "Linguagens Mais Usadas",
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

const locales = Object.keys(translations) as Locale[];

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
