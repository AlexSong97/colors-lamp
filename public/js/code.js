const urlBase = 'http://wocaozhemeniubi.shop/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// ====== Unit Test 用函数 ======
function parseCookieString(cookieString)
{
	let parsedData = {
		firstName: "",
		lastName: "",
		userId: -1
	};

	if (!cookieString || cookieString.trim() === "")
	{
		return parsedData;
	}

	let splits = cookieString.split(",");

	for (let i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");

		if (tokens.length < 2)
		{
			continue;
		}

		let key = tokens[0].trim();
		let value = tokens[1].trim();

		if (key === "firstName")
		{
			parsedData.firstName = value;
		}
		else if (key === "lastName")
		{
			parsedData.lastName = value;
		}
		else if (key === "userId")
		{
			parsedData.userId = parseInt(value, 10);
		}
	}

	return parsedData;
}

function buildColorList(results)
{
	let colorList = "";

	for (let i = 0; i < results.length; i++)
	{
		colorList += results[i];

		if (i < results.length - 1)
		{
			colorList += "<br />\r\n";
		}
	}

	return colorList;
}

// ====== 原有功能 ======
function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;

	document.getElementById("loginResult").innerHTML = "";

	let tmp = { login: login, password: password };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState === 4 && this.status === 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;

				if (userId < 1)
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "color.html";
			}
		};

		xhr.send(jsonPayload);
	}
	catch (err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	let parsedData = parseCookieString(document.cookie);

	firstName = parsedData.firstName;
	lastName = parsedData.lastName;
	userId = parsedData.userId;

	if (userId < 0)
	{
		window.location.href = "index.html";
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = { color: newColor, userId: userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/AddColor.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState === 4 && this.status === 200)
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};

		xhr.send(jsonPayload);
	}
	catch (err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";

	let tmp = { search: srch, userId: userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchColors.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState === 4 && this.status === 200)
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";

				let jsonObject = JSON.parse(xhr.responseText);
				let colorList = buildColorList(jsonObject.results);

				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};

		xhr.send(jsonPayload);
	}
	catch (err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}

// ====== 给 Jest 用的导出 ======
if (typeof module !== 'undefined')
{
	module.exports = {
		parseCookieString,
		buildColorList,
		searchColor
	};
}