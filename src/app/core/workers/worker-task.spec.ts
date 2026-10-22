import { WorkerCancelled, WorkerLike, runWorkerTask } from './worker-task';

class FakeWorker implements WorkerLike {
	onmessage: ((e: MessageEvent) => void) | null = null;
	onerror: ((e: ErrorEvent) => void) | null = null;
	onmessageerror: ((e: MessageEvent) => void) | null = null;
	posted: unknown[] = [];
	terminated = 0;

	postMessage(message: unknown) {
		this.posted.push(message);
	}

	terminate() {
		this.terminated++;
	}

	emit(data: unknown) {
		this.onmessage?.({ data } as MessageEvent);
	}
}

describe('runWorkerTask', () => {
	it('settles with the done value and terminates', async () => {
		const worker = new FakeWorker();
		const task = runWorkerTask<number>(
			() => worker,
			'request',
			(data) => (data === 'end' ? { done: 42 } : undefined),
		);
		expect(worker.posted).toEqual(['request']);
		worker.emit('end');
		expect(await task.result).toBe(42);
		expect(worker.terminated).toBe(1);
	});

	it('forwards intermediate messages without settling', async () => {
		const worker = new FakeWorker();
		const seen: unknown[] = [];
		const task = runWorkerTask<string>(
			() => worker,
			null,
			(data) => {
				seen.push(data);
				return data === 'last' ? { done: 'ok' } : undefined;
			},
		);
		worker.emit('a');
		worker.emit('b');
		expect(worker.terminated).toBe(0);
		worker.emit('last');
		expect(await task.result).toBe('ok');
		expect(seen).toEqual(['a', 'b', 'last']);
	});

	it('rejects with the failure from onMessage', async () => {
		const worker = new FakeWorker();
		const task = runWorkerTask<number>(
			() => worker,
			null,
			() => ({ fail: new Error('boom') }),
		);
		worker.emit('x');
		await expect(task.result).rejects.toThrow('boom');
		expect(worker.terminated).toBe(1);
	});

	it('rejects with WorkerCancelled on cancel and terminates', async () => {
		const worker = new FakeWorker();
		const task = runWorkerTask<number>(
			() => worker,
			null,
			() => undefined,
		);
		task.cancel();
		await expect(task.result).rejects.toBeInstanceOf(WorkerCancelled);
		expect(worker.terminated).toBe(1);
		task.cancel();
		expect(worker.terminated).toBe(1);
	});

	it('rejects when the worker errors', async () => {
		const worker = new FakeWorker();
		const task = runWorkerTask<number>(
			() => worker,
			null,
			() => undefined,
		);
		worker.onerror?.({ message: 'crashed' } as ErrorEvent);
		await expect(task.result).rejects.toThrow('crashed');
		expect(worker.terminated).toBe(1);
	});

	it('settles with a failure when onMessage throws', async () => {
		const worker = new FakeWorker();
		const task = runWorkerTask<number>(
			() => worker,
			null,
			() => {
				throw new Error('bad callback');
			},
		);
		worker.emit('x');
		await expect(task.result).rejects.toThrow('bad callback');
		expect(worker.terminated).toBe(1);
	});

	it('settles with a failure on messageerror', async () => {
		const worker = new FakeWorker();
		const task = runWorkerTask<number>(
			() => worker,
			null,
			() => undefined,
		);
		worker.onmessageerror?.({} as MessageEvent);
		await expect(task.result).rejects.toThrow();
		expect(worker.terminated).toBe(1);
	});

	it('rejects instead of throwing when postMessage throws', async () => {
		const worker = new FakeWorker();
		worker.postMessage = () => {
			throw new Error('cannot clone');
		};
		const task = runWorkerTask<number>(
			() => worker,
			null,
			() => undefined,
		);
		await expect(task.result).rejects.toThrow('cannot clone');
		expect(worker.terminated).toBe(1);
	});

	it('rejects instead of throwing when create throws', async () => {
		const task = runWorkerTask<number>(
			() => {
				throw new Error('no worker');
			},
			null,
			() => undefined,
		);
		await expect(task.result).rejects.toThrow('no worker');
	});

	it('ignores messages after settle', async () => {
		const worker = new FakeWorker();
		let calls = 0;
		const task = runWorkerTask<number>(
			() => worker,
			null,
			() => {
				calls++;
				return { done: calls };
			},
		);
		const handler = worker.onmessage;
		worker.emit('a');
		handler?.({ data: 'b' } as MessageEvent);
		expect(await task.result).toBe(1);
		expect(worker.terminated).toBe(1);
	});
});
