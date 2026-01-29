import * as v from "valibot";
import { themeNames } from "../lib/themes.ts";
import { coerceBoolean } from "../types/index.ts";

export const BaseQuerySchema = v.object({
	username: v.string(),
	lang: v.optional(v.string()),
	theme: v.fallback(v.picklist(themeNames), themeNames[0]),
	hide: v.fallback(
		v.pipe(
			v.string(),
			v.transform((s) => s.split(",").map((s) => s.trim())),
		),
		[],
	),
	hide_border: coerceBoolean,
	disable_animations: coerceBoolean,
	bg_color: v.optional(v.string()),
	title_color: v.optional(v.string()),
	text_color: v.optional(v.string()),
	icon_color: v.optional(v.string()),
	border_color: v.optional(v.string()),
});
