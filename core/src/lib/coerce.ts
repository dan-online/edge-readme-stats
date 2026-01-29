import * as v from "valibot";

export const coerceBoolean = v.fallback(
	v.pipe(
		v.string(),
		v.transform((s) => s === "true"),
	),
	false,
);

export const coerceBooleanTrue = v.fallback(
	v.pipe(
		v.string(),
		v.transform((s) => s !== "false"),
	),
	true,
);
