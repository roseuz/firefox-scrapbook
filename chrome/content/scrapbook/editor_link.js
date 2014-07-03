var gData;

function init() {
	if ( !window.arguments) window.close();
	gData = window.arguments[0];
	if (gData.id) document.getElementById("sbLinkID").value = gData.id;
}

function accept() {
	gData.url_use = document.getElementById("sbLinkURLUse").selected;
	gData.id_use = document.getElementById("sbLinkIDUse").selected;
	gData.url = document.getElementById("sbLinkURL").value;
	gData.id = document.getElementById("sbLinkID").value;
	gData.format = document.getElementById("sbLinkFormat").value;
	gData.result = ((gData.url_use && gData.url) || (gData.id_use && gData.id)) ? 1 : 0;
}

function pick(aIDToCheck) {
console.debug('input');
	document.getElementById("sbLinkSelector").selectedItem = document.getElementById(aIDToCheck);
}