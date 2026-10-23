import { describe, expect, it } from 'vitest';
import { ResearchProgress } from './research-progress';
import { ResearchTesting } from './research-testing';

class ProgressFixture {
	static of(...done: string[]): ResearchProgress {
		return new ResearchProgress(ResearchTesting.tree(), new Set(done));
	}

	static states(progress: ResearchProgress): Record<string, string> {
		return Object.fromEntries(progress.projects.map((x) => [x.id, progress.state(x)]));
	}
}

describe('ResearchProgress', () => {
	it('tells done, available, locked and mission projects apart', () => {
		expect(ProgressFixture.states(ProgressFixture.of('dock'))).toEqual({
			dock: 'done',
			defence: 'available',
			build: 'locked',
			pre: 'mission',
			mk1: 'locked',
			mk2: 'locked',
			teleport: 'available',
		});
	});

	it('lists the visible projects that can be started now, by sort order', () => {
		expect(
			ProgressFixture.of()
				.next()
				.map((x) => x.id)
		).toEqual(['teleport', 'dock']);
		expect(
			ProgressFixture.of('dock', 'defence', 'pre')
				.next()
				.map((x) => x.id)
		).toEqual(['teleport', 'mk1']);
	});

	it('leaves story projects out of the next ones', () => {
		const progress = new ResearchProgress(
			[...ResearchTesting.tree(), ResearchTesting.project('ship', { story: true })],
			new Set()
		);
		expect(progress.next().map((x) => x.id)).toEqual(['teleport', 'dock']);
	});

	it('sums what a project still takes, prerequisites first', () => {
		const progress = ProgressFixture.of();
		const path = progress.path(progress.get('build')!);
		expect(path.steps.map((x) => x.id)).toEqual(['dock', 'defence', 'build']);
		expect(path.wares).toEqual([
			{ ware: 'energycells', amount: 5000 },
			{ ware: 'smartchips', amount: 150 },
		]);
		expect(path.missions).toEqual([]);
	});

	it('leaves the done projects out of the path and names the missions needed', () => {
		const progress = ProgressFixture.of('mk1');
		expect(progress.path(progress.get('mk2')!).steps.map((x) => x.id)).toEqual(['mk2']);
		const fresh = ProgressFixture.of().path(ProgressFixture.of().get('mk2')!);
		expect(fresh.missions.map((x) => x.id)).toEqual(['pre']);
		expect(fresh.researched.map((x) => x.id)).toEqual(['mk1', 'mk2']);
	});

	it('has an empty path for a done project', () => {
		const progress = ProgressFixture.of('teleport');
		expect(progress.path(progress.get('teleport')!).steps).toEqual([]);
	});

	it('links projects both ways', () => {
		const progress = ProgressFixture.of();
		expect(progress.requires(progress.get('build')!).map((x) => x.id)).toEqual(['defence', 'dock']);
		expect(progress.requiredBy(progress.get('dock')!).map((x) => x.id)).toEqual(['defence', 'build']);
	});

	it('gives story projects no availability, whatever their prerequisites', () => {
		const progress = new ResearchProgress(
			[...ResearchTesting.tree(), ResearchTesting.project('ship', { story: true })],
			new Set()
		);
		expect(progress.state(progress.get('ship')!)).toBe('story');
		const done = new ResearchProgress([ResearchTesting.project('ship', { story: true })], new Set(['ship']));
		expect(done.state(done.get('ship')!)).toBe('done');
	});

	it('ranks available first and done last', () => {
		const states = ['done', 'mission', 'story', 'available', 'locked'] as const;
		expect([...states].sort((a, b) => ResearchProgress.rank(a) - ResearchProgress.rank(b))).toEqual([
			'available',
			'locked',
			'story',
			'mission',
			'done',
		]);
	});
});
