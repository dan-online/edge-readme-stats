const inflightCalls: Record<string, Promise<unknown>> = {};

export function inflight<T>(key: string, fn: () => Promise<T>): Promise<T> {
	if (inflightCalls[key]) {
		return inflightCalls[key] as Promise<T>;
	}

	const promise = fn();
	inflightCalls[key] = promise;

	promise.finally(() => {
		delete inflightCalls[key];
	});

	return promise;
}
