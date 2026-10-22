import { hashText, setGameTexts, translateGameText } from './game-text';

describe('game text', () => {
	afterEach(() => setGameTexts(null));

	it('hashes texts like the extractor', () => {
		// values written by Translator.Hash in the extractor
		expect(hashText('Claytronics')).toBe('166invo');
		expect(hashText('Energy Cells')).toBe('9vhu1s');
	});

	it('swaps the game texts of nested data in place', () => {
		setGameTexts({
			[hashText('Claytronics')]: 'Nanotronik',
			[hashText('Argon')]: 'Argonen',
			[hashText('Yellow Star')]: 'Gelber Stern',
		});
		const race = { id: 'argon', name: 'Argon' };
		const data = {
			claytronics: { id: 'claytronics', name: 'Claytronics ', type: 'Claytronics', race },
			cluster: { suns: ['Yellow Star'] },
		};

		translateGameText(data);
		translateGameText(data);

		expect(data.claytronics.name).toBe('Nanotronik');
		expect(data.claytronics.type).toBe('Claytronics'); // not a game text property
		expect(race.name).toBe('Argonen');
		expect(data.cluster.suns).toEqual(['Gelber Stern']);
	});

	it('keeps the English texts without a language', () => {
		const data = { name: 'Claytronics' };
		translateGameText(data);
		expect(data.name).toBe('Claytronics');
	});
});
