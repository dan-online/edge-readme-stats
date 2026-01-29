import * as v from "valibot";
import { coerceBooleanTrue } from "../lib/coerce.ts";
import { locales } from "../lib/i18n.ts";
import { themeNames } from "../lib/themes.ts";

export const sizes = ["sm", "md", "lg", "xl"] as const;
export type Size = (typeof sizes)[number];

export const sizeScales: Record<Size, number> = {
	sm: 0.5,
	md: 0.75,
	lg: 1.0,
	xl: 1.25,
};

export const BaseQuerySchema = v.object({
	username: v.string(),
	lang: v.fallback(v.picklist(locales), "en"),
	theme: v.fallback(v.picklist(themeNames), themeNames[0]),
	size: v.fallback(v.picklist(sizes), "lg"),
	hide: v.fallback(
		v.pipe(
			v.string(),
			v.transform((s) => s.split(",").map((s) => s.trim())),
		),
		[],
	),
	border: coerceBooleanTrue,
	animations: coerceBooleanTrue,
	bg_color: v.optional(v.string()),
	title_color: v.optional(v.string()),
	text_color: v.optional(v.string()),
	icon_color: v.optional(v.string()),
	border_color: v.optional(v.string()),
});

export type BaseQuery = v.InferOutput<typeof BaseQuerySchema>;
