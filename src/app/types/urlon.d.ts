declare module 'urlon' {
	export function stringify(value: unknown): string;
	export function parse(text: string): unknown;
}
