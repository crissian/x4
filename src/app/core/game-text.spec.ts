import { GameText } from './game-text';

describe('game text', () => {
	afterEach(() => GameText.setTexts(null));

	it('hashes texts like the extractor', () => {
		// values written by Translator.Hash in the extractor
		expect(GameText.hash('Claytronics')).toBe('166invo');
		expect(GameText.hash('Energy Cells')).toBe('9vhu1s');
	});

	it('swaps the game texts of nested data in place', () => {
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

		GameText.translate(data);
		GameText.translate(data);

		expect(data.claytronics.name).toBe('Nanotronik');
		expect(data.claytronics.type).toBe('Claytronics'); // not a game text property
		expect(race.name).toBe('Argonen');
		expect(data.cluster.suns).toEqual(['Gelber Stern']);
	});

	it('keeps the English texts without a language', () => {
		const data = { name: 'Claytronics' };
		GameText.translate(data);
		expect(data.name).toBe('Claytronics');
	});
});
