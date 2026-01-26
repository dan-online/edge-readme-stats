import * as v from "valibot";
import { themeNames } from "../lib/themes.ts";

/**
 * Base query schema with common fields shared across all card routes
 */
export const BaseQuerySchema = v.object({
	username: v.string(),
	lang: v.optional(v.string()),
	theme: v.optional(v.picklist(themeNames)),
	hide: v.optional(v.string()),
	hide_border: v.optional(v.string()),
	disable_animations: v.optional(v.string()),
	bg_color: v.optional(v.string()),
	title_color: v.optional(v.string()),
	text_color: v.optional(v.string()),
	icon_color: v.optional(v.string()),
	border_color: v.optional(v.string()),
});
