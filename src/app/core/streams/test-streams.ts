/** Helpers for specs: byte streams, gzip and gunzip without relying on Blob.stream(). */
export function streamOf(chunks: Uint8Array[]): ReadableStream<Uint8Array> {
	let index = 0;
	return new ReadableStream<Uint8Array>({
		pull(controller) {
			if (index < chunks.length) {
				controller.enqueue(chunks[index++]);
			} else {
				controller.close();
			}
		},
	});
}

export async function collectText(stream: ReadableStream<string>): Promise<string> {
	let text = '';
	const reader = stream.getReader();
	for (;;) {
		const { done, value } = await reader.read();
		if (done) {
			return text;
		}
		text += value;
	}
}

export async function gzipBytes(bytes: Uint8Array): Promise<Uint8Array> {
	const stream = streamOf([bytes]).pipeThrough(new CompressionStream('gzip') as unknown as TransformStream<Uint8Array, Uint8Array>);
	return new Uint8Array(await new Response(stream).arrayBuffer());
}

export async function gunzipBlob(blob: Blob): Promise<string> {
	const bytes = new Uint8Array(await blob.arrayBuffer());
	const stream = streamOf([bytes]).pipeThrough(new DecompressionStream('gzip') as unknown as TransformStream<Uint8Array, Uint8Array>);
	return new Response(stream).text();
}
