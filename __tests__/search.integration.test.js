const { searchColor } = require('../public/js/code.js');

describe('Integration test for searchColor', () => {
	beforeEach(() => {
		document.body.innerHTML = `
			<input id="searchText" value="Re">
			<div id="colorSearchResult"></div>
			<p></p>
		`;

		global.XMLHttpRequest = function ()
		{
			this.open = jest.fn();
			this.setRequestHeader = jest.fn();
			this.send = function ()
			{
				this.readyState = 4;
				this.status = 200;
				this.responseText = JSON.stringify({
					results: ["Red", "Green"],
					error: ""
				});

				if (this.onreadystatechange)
				{
					this.onreadystatechange();
				}
			};
		};
	});

	test('searchColor should display returned colors in the page', () => {
		searchColor();

		expect(document.getElementById("colorSearchResult").innerHTML)
			.toBe("Color(s) has been retrieved");

		expect(document.getElementsByTagName("p")[0].innerHTML)
			.toContain("Red");

		expect(document.getElementsByTagName("p")[0].innerHTML)
			.toContain("Green");

		expect(document.getElementsByTagName("p")[0].innerHTML)
			.toContain("<br");
	});
});