export interface WorkerLike {
	postMessage(message: unknown): void;
	terminate(): void;
	onmessage: ((e: MessageEvent) => void) | null;
	onerror: ((e: ErrorEvent) => void) | null;
	onmessageerror?: ((e: MessageEvent) => void) | null;
}

export class WorkerCancelled extends Error {
	constructor() {
		super('The worker task was cancelled.');
		this.name = 'WorkerCancelled';
	}
}

export class WorkerTask<T> {
	constructor(
		readonly result: Promise<T>,
		readonly cancel: () => void,
	) {}

	/**
	 * Posts the request to a fresh worker. Every message goes to `onMessage`, which returns `{ done: value }` or
	 * `{ fail: error }` to settle the task, or undefined to keep going. `cancel()` terminates the worker and rejects
	 * with WorkerCancelled. The worker is terminated once the task settles.
	 */
	static run<T>(
		create: () => WorkerLike,
		request: unknown,
		onMessage: (data: unknown) => { done: T } | { fail: unknown } | undefined,
	): WorkerTask<T> {
		let worker: WorkerLike | undefined;
		let settle: (outcome: { done: T } | { fail: unknown }) => void = () => undefined;
		const result = new Promise<T>((resolve, reject) => {
			let settled = false;
			settle = (outcome) => {
				if (settled) {
					return;
				}
				settled = true;
				if (worker) {
					worker.onmessage = null;
					worker.onerror = null;
					worker.onmessageerror = null;
					worker.terminate();
				}
				if ('done' in outcome) {
					resolve(outcome.done);
				} else {
					reject(outcome.fail);
				}
			};
		});
		const task = new WorkerTask<T>(result, () => settle({ fail: new WorkerCancelled() }));
		try {
			worker = create();
			worker.onmessage = (e) => {
				try {
					const outcome = onMessage(e.data);
					if (outcome) {
						settle(outcome);
					}
				} catch (error) {
					settle({ fail: error });
				}
			};
			worker.onerror = (e) => settle({ fail: new Error(e.message || 'The worker failed.') });
			worker.onmessageerror = () => settle({ fail: new Error('The worker message could not be read.') });
			worker.postMessage(request);
		} catch (error) {
			settle({ fail: error });
		}
		return task;
	}
}
