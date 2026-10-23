import { convertToParamMap } from '@angular/router';
import { describe, expect, it } from 'vitest';
import type { Faction } from '../shared/services/model/faction';
import type { Sector } from '../shared/services/model/universe';
import { EventLogQuery, type EventLogModel } from './event-log-query';
import { EventLogRows, type EventLogLookups } from './event-log-rows';
import { LossSummaries } from './loss-summary';

const xenon = { id: 'xenon', name: 'Xenon', shortName: 'XEN' } as Faction;
const argon = { id: 'argon', name: 'Argon Federation', shortName: 'ARG' } as Faction;
const prime = { id: 'cluster_14_sector001', name: 'Argon Prime' } as Sector;

const lookups: EventLogLookups = {
	faction: (id) => [xenon, argon].find((x) => x.id === id),
	sector: (id) => (id === prime.id ? prime : undefined),
};

const model = (patch: Partial<EventLogModel> = {}): EventLogModel => ({ ...EventLogQuery.DEFAULTS, ...patch });

describe('EventLogRows', () => {
	const events = EventLogRows.events(
		[
			{ time: 9000, category: 'news', title: 'War update', text: 'Xenon station destroyed', faction: 'argon' },
			{ time: 5000, title: 'Reputation gained', factionName: 'Hariken Space Dynamics', sector: prime.id },
		],
		10000,
		lookups
	);

	it('builds event rows with the age, category and game data', () => {
		expect(events[0]).toMatchObject({ ago: 1000, category: 'news', factionKey: 'argon', faction: argon });
		expect(events[1]).toMatchObject({ category: 'general', factionKey: 'Hariken Space Dynamics', sector: prime });
	});

	it('filters events by category, faction, sector, time and text', () => {
		expect(EventLogRows.filterEvents(events, model({ category: 'general' })).map((x) => x.id)).toEqual([1]);
		expect(EventLogRows.filterEvents(events, model({ faction: 'argon' })).map((x) => x.id)).toEqual([0]);
		expect(EventLogRows.filterEvents(events, model({ sector: prime.id })).map((x) => x.id)).toEqual([1]);
		expect(EventLogRows.filterEvents(events, model({ since: '1' })).map((x) => x.id)).toEqual([0]);
		expect(EventLogRows.filterEvents(events, model({ search: 'STATION' })).map((x) => x.id)).toEqual([0]);
	});

	const losses = EventLogRows.losses(
		[
			{ time: 9500, name: 'Eclipse Vanguard', code: 'AAA-111', sector: prime.id, killer: 'XEN Raiding Party' },
			{ time: 9000, name: 'Eclipse Vanguard', code: 'BBB-222', sector: prime.id, killer: 'XEN Destroyer K' },
			{ time: 8000, name: 'Behemoth Vanguard', code: 'CCC-333', killer: 'Someone' },
			{ time: 7000, name: 'My renamed ship', code: 'DDD-444', location: 'Superhighway' },
		],
		10000,
		lookups
	);

	it('builds loss rows with the age and sector only', () => {
		expect(losses[0]).toEqual({ id: 0, loss: expect.any(Object), ago: 500, sector: prime });
		expect(losses[3].sector).toBeUndefined();
	});

	it('filters losses by sector and search, not by faction', () => {
		expect(EventLogRows.filterLosses(losses, model({ faction: 'xenon' })).length).toBe(4);
		expect(EventLogRows.filterLosses(losses, model({ sector: prime.id })).length).toBe(2);
		expect(EventLogRows.filterLosses(losses, model({ search: 'behemoth' })).map((x) => x.id)).toEqual([2]);
		expect(EventLogRows.filterLosses(losses, model({ search: 'raiding' })).map((x) => x.id)).toEqual([0]);
	});

	it('sums the losses per sector and killer as written', () => {
		const summary = LossSummaries.build(losses);
		expect(summary.total).toBe(4);
		expect(summary.bySector).toEqual([{ key: prime.id, value: prime, count: 2 }]);
		expect(summary.byKiller.map((x) => [x.key, x.count])).toEqual([
			['Someone', 1],
			['XEN Destroyer K', 1],
			['XEN Raiding Party', 1],
		]);
	});
});

describe('EventLogQuery', () => {
	it('reads and writes the tab and filters, defaults left out', () => {
		const state = EventLogQuery.read(convertToParamMap({ tab: 'losses', q: 'x', sector: 's', since: '10' }));
		expect(state).toEqual({ tab: 'losses', model: model({ search: 'x', sector: 's', since: '10' }) });
		expect(EventLogQuery.write(state)).toEqual({
			tab: 'losses',
			q: 'x',
			category: null,
			faction: null,
			sector: 's',
			since: '10',
		});
	});

	it('ignores an unknown time filter', () => {
		expect(EventLogQuery.read(convertToParamMap({ since: '7' })).model.since).toBe('');
	});
});
