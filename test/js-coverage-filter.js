/* filter only openui5 results */
if (window.blanket) {
	var fnOriginalReport = window.blanket.report;
	window.blanket.report = function () {
		var oResults = window._$blanket,
			oFiltered = {},
			oRetValue;

		for (var sFile in oResults) {
			if (sFile.substr(0, 8) == "openui5/") {
				oFiltered[sFile] = oResults[sFile];
			}
		}

		window._$blanket = oFiltered;
		oRetValue = fnOriginalReport.apply(this, arguments);
		window._$blanket = oResults;

		return oRetValue;
	};
}
