export interface TextStreamOptions {
	size: number;
	onProgress?(read: number, total: number): void;
	keepGzip?: boolean;
}

export interface OpenedTextStream {
	text: ReadableStream<string>;
	/** true when the input was gzip (first bytes 1f 8b) */
	gzipped: boolean;
	/** set when keepGzip and the input was plain: resolves to a gzip Blob of the input once text is fully read */
	gzipCopy?: Promise<Blob>;
}

type ByteTransform = TransformStream<Uint8Array, Uint8Array>;

export class TextStream {
	private static readonly PROGRESS_INTERVAL_MS = 100;

	/** Sniffs gzip, counts bytes for progress, inflates if needed and decodes UTF-8 to text chunks. */
	static async open(bytes: ReadableStream<Uint8Array>, options: TextStreamOptions): Promise<OpenedTextStream> {
		const reader = bytes.getReader();
		let first = new Uint8Array(0);
		while (first.length < 2) {
			const { done, value } = await reader.read();
			if (done) {
				break;
			}
			const merged = new Uint8Array(first.length + value.length);
			merged.set(first);
			merged.set(value, first.length);
			first = merged;
		}
		const gzipped = first.length >= 2 && first[0] === 0x1f && first[1] === 0x8b;
		let source = TextStream.prepend(first, reader).pipeThrough(TextStream.countBytes(options));
		let gzipCopy: Promise<Blob> | undefined;
		if (gzipped) {
			source = source.pipeThrough(new DecompressionStream('gzip') as unknown as ByteTransform);
		} else if (options.keepGzip) {
			const compression = new CompressionStream('gzip') as unknown as ByteTransform;
			gzipCopy = new Response(compression.readable).blob();
			source = TextStream.splitTo(source, compression.writable);
			gzipCopy.catch(() => undefined);
		}
		const text = source.pipeThrough(new TextDecoderStream('utf-8') as unknown as TransformStream<Uint8Array, string>);
		return { text, gzipped, gzipCopy };
	}

	private static prepend(first: Uint8Array, reader: ReadableStreamDefaultReader<Uint8Array>): ReadableStream<Uint8Array> {
		let pending: Uint8Array | null = first;
		return new ReadableStream<Uint8Array>({
			async pull(controller) {
				if (pending) {
					controller.enqueue(pending);
					pending = null;
					return;
				}
				const { done, value } = await reader.read();
				if (done) {
					controller.close();
				} else {
					controller.enqueue(value);
				}
			},
			cancel: (reason) => reader.cancel(reason),
		});
	}

	private static countBytes(options: TextStreamOptions): ByteTransform {
		let read = 0;
		let lastReport = 0;
		return new TransformStream<Uint8Array, Uint8Array>({
			transform(chunk, controller) {
				read += chunk.byteLength;
				controller.enqueue(chunk);
				if (options.onProgress) {
					const now = Date.now();
					if (now - lastReport >= TextStream.PROGRESS_INTERVAL_MS) {
						lastReport = now;
						options.onProgress(read, options.size);
					}
				}
			},
			flush() {
				options.onProgress?.(read, options.size);
			},
		});
	}

	/**
	 * Passes chunks through while writing each one to `copy`, waiting for it to accept the chunk first so
	 * memory stays bounded. Cancelling or failing aborts the copy so its consumer settles.
	 */
	private static splitTo(source: ReadableStream<Uint8Array>, copy: WritableStream<Uint8Array>): ReadableStream<Uint8Array> {
		const reader = source.getReader();
		const writer = copy.getWriter();
		writer.closed.catch(() => undefined);
		return new ReadableStream<Uint8Array>({
			async pull(controller) {
				try {
					const { done, value } = await reader.read();
					if (done) {
						await writer.close();
						controller.close();
						return;
					}
					await writer.ready;
					writer.write(value).catch(() => undefined);
					controller.enqueue(value);
				} catch (error) {
					writer.abort(error).catch(() => undefined);
					throw error;
				}
			},
			async cancel(reason) {
				writer.abort(reason).catch(() => undefined);
				await reader.cancel(reason);
			},
		});
	}
}
