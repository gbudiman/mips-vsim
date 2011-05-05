function mux(arraySignal, mn, vn, ho) {
	this.name = mn;
	this.visualName = vn;
	this.output = new Object();
	for (i = 0; i < arraySignal.length; i++) {
		this.output[arraySignal[i]] = 0;
	}
	this.size = i;
	this.hexOutput = ho;
}

mux.prototype.portOut = function(arrayUpdate, controlSignal) {
	if (arrayUpdate == undefined) {
		alert('Undefined input signals in mux ' + this.name + '\nContent: ' + arrayUpdate);
	}
	else if (arrayUpdate.length != this.size) {
		alert('Unable to update mux. Array length mismatch in ' + this.name + ' mux');
	}
	else {
		counter = 0;
		for (var i in this.output) {
			this.output[i] = arrayUpdate[counter++];
		}
		this.visual(controlSignal);
		if (this.output[controlSignal] == undefined) {
			alert('No such signal ' + controlSignal + ' in mux ' + this.name);
			return 0;
		}
		return this.output[controlSignal];
	}
}

mux.prototype.visual = function(controlSignal) {
	var myText = '';
	for (i in this.output) {
		if (this.hexOutput) {
			if (this.output[i] == undefined) {
				alert('undef at ' + this.name)
			}
			myText += i + ' => ' + this.output[i].formatHex(8) + ' (' + this.output[i] + ')';
		}
		else {
			myText += i + ' => ' + this.output[i];
		}
		if (i == controlSignal) { myText += '*'; }
		myText += '\n';
	}
	$('#' + this.visualName).text(myText);
}
