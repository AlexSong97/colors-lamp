const { parseCookieString, buildColorList } = require('../public/js/code.js');

describe('Unit tests for code.js', () => {
	test('parseCookieString should correctly parse cookie values', () => {
		const cookieString = 'firstName=John,lastName=Doe,userId=5';
		const result = parseCookieString(cookieString);

		expect(result.firstName).toBe('John');
		expect(result.lastName).toBe('Doe');
		expect(result.userId).toBe(5);
	});

	test('buildColorList should format colors with line breaks', () => {
		const result = buildColorList(['Red', 'Blue', 'Green']);
		expect(result).toBe('Red<br />\r\nBlue<br />\r\nGreen');
	});
});