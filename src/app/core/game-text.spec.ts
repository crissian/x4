import { GameText } from './game-text';
import { LocalStorage } from './services/local-storage';

describe('game text', () => {
	afterEach(() => {
		GameText.setTexts(null);
		vi.restoreAllMocks();
	});

	it('hashes texts like the extractor', () => {
		// values written by Translator.Hash in the extractor
		expect(GameText.hash('Claytronics')).toBe('166invo');
		expect(GameText.hash('Energy Cells')).toBe('9vhu1s');
	});

	it('swaps the game texts of nested data in place', async () => {
		GameText.setTexts({
			[GameText.hash('Claytronics')]: 'Nanotronik',
			[GameText.hash('Argon')]: 'Argonen',
			[GameText.hash('Yellow Star')]: 'Gelber Stern',
		});
		const race = { id: 'argon', name: 'Argon' };
		const data = {
			claytronics: { id: 'claytronics', name: 'Claytronics ', type: 'Claytronics', race },
			cluster: { suns: ['Yellow Star'] },
		};

		await GameText.translate(data, 'wares');
		await GameText.translate(data, 'wares');

		expect(data.claytronics.name).toBe('Nanotronik');
		expect(data.claytronics.type).toBe('Claytronics'); // not a game text property
		expect(race.name).toBe('Argonen');
		expect(data.cluster.suns).toEqual(['Gelber Stern']);
	});

	it('swaps the values of a text record', async () => {
		GameText.setTexts({ [GameText.hash('A ship')]: 'Ein Schiff' });
		const data: Record<string, string> = { ship: 'A ship', other: 'Other' };

		await GameText.translateRecord(data, 'ship-descriptions');

		expect(data).toEqual({ ship: 'Ein Schiff', other: 'Other' });
	});

	it('keeps the English texts without a language', async () => {
		const fetch = vi.spyOn(globalThis, 'fetch');
		const data = { name: 'Claytronics' };
		await GameText.translate(data, 'wares');
		expect(data.name).toBe('Claytronics');
		expect(fetch).not.toHaveBeenCalled();
	});

	it('fetches each texts file of the language once and looks up across the loaded files', async () => {
		vi.spyOn(LocalStorage, 'read').mockReturnValue('de');
		const files: Record<string, Record<string, string>> = {
			wares: { [GameText.hash('Claytronics')]: 'Nanotronik' },
			factions: { [GameText.hash('Argon Federation')]: 'Argonische Föderation' },
		};
		const fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
			const file = /i18n\/de\/(.+)\.json$/.exec(String(url))?.[1] ?? '';
			return new Response(JSON.stringify(files[file] ?? {}));
		});

		GameText.preload(['wares', 'factions']);
		const ware = { name: 'Claytronics' };
		await GameText.translate(ware, 'wares');

		expect(ware.name).toBe('Nanotronik');
		expect(GameText.get('Argon Federation')).toBe('Argonische Föderation');
		expect(fetch).toHaveBeenCalledTimes(2);
	});

	it('translates a data file with its own texts when files translate the same English text differently', async () => {
		vi.spyOn(LocalStorage, 'read').mockReturnValue('ja');
		const mine = GameText.hash('Mine');
		const files: Record<string, Record<string, string>> = {
			equipment: { [mine]: '機雷', [GameText.hash('Laser Tower')]: 'レーザータワー' },
			'ship-orders': { [mine]: '採掘' },
			'fleet-assignments': { [mine]: 'Mine' },
		};
		vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
			const file = /i18n\/ja\/(.+)\.json$/.exec(String(url))?.[1] ?? '';
			return new Response(JSON.stringify(files[file] ?? {}));
		});
		const equipment = [{ name: 'Mine' }, { name: 'Laser Tower' }];
		const order = { name: 'Mine' };
		const assignment = { name: 'Mine' };

		// a route loads the texts of all its data files before they translate
		await GameText.preload(['equipment', 'ship-orders', 'fleet-assignments']);
		await GameText.translate(equipment, 'equipment');
		await GameText.translate(order, 'ship-orders');
		await GameText.translate(assignment, 'fleet-assignments');

		expect(equipment.map((x) => x.name)).toEqual(['機雷', 'レーザータワー']);
		expect(order.name).toBe('採掘');
		// kept in English on purpose, not taken from the equipment file
		expect(assignment.name).toBe('Mine');
		expect(GameText.get('Mine', 'ship-orders')).toBe('採掘');
	});

	it('keeps the English texts when a texts file fails to load', async () => {
		vi.spyOn(LocalStorage, 'read').mockReturnValue('de');
		vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
		const data = { name: 'Claytronics' };

		await GameText.translate(data, 'wares');

		expect(data.name).toBe('Claytronics');
	});
});
