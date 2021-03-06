function pipelineLatch(signalArray, pn) {
	this.internal = new Object();
	this.flop = new Object();
	for (i = 0; i < signalArray.length; i++) {
		this.internal[signalArray[i]] = 0;
		this.flop[signalArray[i]] = 0;
	}
	this.size = i;
	this.pipelineName = pn;
}

pipelineLatch.prototype.clock = function(signalArray) {
	if (signalArray.length != this.size) {
		alert('Array length mismatch in pipeline ' + this.pipelineName);
	}
	var counter = 0;
	for (i in this.flop) {
		this.flop[i] = this.internal[i];
		this.internal[i] = signalArray[counter++];
	}
	this.visual();
}

pipelineLatch.prototype.portOut = function(portName) {
	if (this.flop[portName] == undefined) {
		alert('No such signal "' + portName + '" in pipeline ' + this.pipelineName);
		return 0;
	}
	return this.flop[portName];
}

pipelineLatch.prototype.visual = function() {
	var text = '<table class="flop_table" id="' + this.pipelineName + '_table' + '">';
	text += '<th class="flop_header">Register</th>';
	text += '<th class="flop_header">Input</th>';
	text += '<th class="flop_header">Output</th>';
	for (i in this.flop) {
		if (i != 'bundle') {
			text += '<tr>';
			text += '<td>' + i + '</td>'
			        + '<td>' + this.internal[i].formatHex(8) + '</td>'
					+ '<td>' + this.flop[i].formatHex(8) + '</td>';
			text += '</tr>';
		}
	}
	for (i in this.flop['bundle']) {
		text += '<tr>';
		text += '<td>' + i + '</td>'
		        + '<td>' + this.internal['bundle'][i] + '</td>'
				+ '<td>' + this.flop['bundle'][i] + '</td>';
		text += '</tr>';
	}
	text += '</table>';
	$('#' + this.pipelineName + '_flop').html(text);
}

pipelineLatch.prototype.viewRegister = function() {
	var myString = '';
	for (i in this.flop) {
		myString += '"' + i + '"\n';
	}
	alert(myString);
}

pipelineLatch.prototype.initializeRegister = function(signal, data) {
	this.internal[signal] = data;
	this.flop[signal] = data;
}
