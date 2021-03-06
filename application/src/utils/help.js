
function getCookie(name) {
	let matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

function isEmptyOrSpaces(str) {
	return str === undefined || str === null || str.match(/^ *$/) !== null;
}

function validate(document, ids) {
	let data = {};
	data.errors = [];
	for (let i = 0; i < ids.length; ++i) {
		let input = document.getElementById(ids[i]);
		let val = input.value;

		if (isEmptyOrSpaces(val))
			data.errors.push(ids[i]);
		else
			data[ids[i]] = val;
	}

	return data;
}

function val(document, id) {
	return document.getElementById(id).value;
}

function time(utc) {
	let date = new Date(utc - ((new Date()).getTimezoneOffset()) * 60 * 1000);

	let hh = date.getHours();
	let ss = date.getMinutes();

	let hhString = Math.floor(hh / 10) + "" + Math.floor(hh % 10);
	let ssString = Math.floor(ss / 10) + "" + Math.floor(ss % 10);

	return hhString + ':' + ssString;

}

function timeDate(utc) {
	let date = new Date(utc - ((new Date()).getTimezoneOffset()) * 60 * 1000);

	let dd = date.getDay();
	let mm = date.getMonth();
	let yyyy = date.getFullYear();

	let ddString = Math.floor(dd / 10) + "" + Math.floor(dd % 10);
	let mmString = Math.floor(mm / 10) + "" + Math.floor(mm % 10);

	return ddString + '.' + mmString + '.' + yyyy;
}

function toUTC(date) {
	return (date.getTime());
}

module.exports = {
	getCookie,
	isEmptyOrSpaces,
	validate,
	val,
	time,
	toUTC,
	timeDate
}