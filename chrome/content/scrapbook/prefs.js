var sbPrefWindow = {

	changed: false,

	init: function() {
		//Checkbox zum Aktivieren des Status-Bar Icons ausblenden, falls FF>=4
		var iffVersion = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo);
		var iVerComparator = Components.classes["@mozilla.org/xpcom/version-comparator;1"].getService(Components.interfaces.nsIVersionComparator);
		if ( iVerComparator.compare(iffVersion.version, "4.0")>=0 ) document.getElementById("sbPrefStatsBarIcon").hidden = true;
		//Ende
		this.updateDataPath();
		this.hlInitUI();
		this._updateFileField("sbDataPath", "extensions.scrapbook.data.path");
		if (!sbMultiBookService.validateRefresh(true)) {
			var elts = document.getElementById("sbDataDefault").getElementsByTagName("*");
			Array.forEach(elts, function(elt) {
				elt.disabled = true;
			});
		}
	},

	done: function() {
		if (!this.changed)
			return;
		sbMultiBookService.refreshGlobal();
	},

	updateGroupedUI: function(aPrefName, aGroupName) {
		var enable = document.getElementById(aPrefName).value;
		var elts = document.getElementsByAttribute("group", aGroupName);
		Array.forEach(elts, function(elt) {
			elt.disabled = !enable;
		});
	},

	hlInitUI: function() {
		var tmpElt = document.getElementById("hlTemplate");
		for (var num = 1; num <= 6; num++) {
			var elt = tmpElt.cloneNode(true);
			tmpElt.parentNode.insertBefore(elt, tmpElt);
			elt.firstChild.setAttribute("value", num + ":");
			elt.firstChild.nextSibling.id = "hlPrefLabel" + num;
			elt.lastChild.setAttribute("hlnumber", num);
		}
		tmpElt.hidden = true;
		this.hlUpdateUI();
	},

	hlUpdateUI: function() {
		var prefBranch = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		for (var num = 6; num > 0; num--) {
			var prefVal = null;
			var prefName = "extensions.scrapbook.highlighter.style." + num;
			try {
				prefVal = prefBranch.getComplexValue(prefName, Components.interfaces.nsISupportsString).data;
			}
			catch (ex) {
				prefVal = sbHighlighter.PRESET_STYLES[num];
			}
			sbHighlighter.decorateElement(document.getElementById("hlPrefLabel" + num), prefVal);
		}
	},

	hlCustomize: function(aNumber) {
		document.documentElement.openSubDialog(
			"chrome://scrapbook/content/hlCustom.xul", "modal,centerscreen,chrome", aNumber
		);
		this.hlUpdateUI();
	},

	updateDataUI: function() {
		var isDefault = document.getElementById("extensions.scrapbook.data.default").value;
		var mbEnabled = document.getElementById("extensions.scrapbook.multibook.enabled").value;
		document.getElementById("sbDataDefault").disabled = mbEnabled;
		document.getElementById("sbDataPath").disabled    = isDefault || mbEnabled;
		document.getElementById("sbDataButton").disabled  = isDefault || mbEnabled;
	},

	updateDataPath: function() {
		this._updateFileField("sbDataPath", "extensions.scrapbook.data.path");
	},

	_updateFileField: function(aEltID, aPrefID) {
		var file = document.getElementById(aPrefID).value;
		if (!file)
			return;
		var fileField = document.getElementById(aEltID);
		fileField.file = file;
		if (file.exists() && file.isDirectory())
			fileField.label = file.path;
	},

	selectFolder: function(aPickerTitle) {
		var file = document.getElementById("extensions.scrapbook.data.path").value;
		var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
		if (file)
			fp.displayDirectory = file;
		fp.init(window, aPickerTitle, fp.modeGetFolder);
		if (fp.show() == fp.returnOK) {
			document.getElementById("extensions.scrapbook.data.path").value = fp.file;
			this.updateDataPath();
		}
	},

};


