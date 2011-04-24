function mux(arraySignal, mn, vn) {
	this.name = mn;
	this.visualName = vn;
	this.output = new Object();
	for (i = 0; i < arraySignal.length; i++) {
		this.output[arraySignal[i]] = 0;
	}
	this.size = i;
}

mux.prototype.portOut = function(arrayUpdate, controlSignal) {
	if (arrayUpdate.length != this.size) {
		alert('Unable to update mux. Array length mismatch in ' + this.name + ' mux');
	}
	else {
		counter = 0;
		for (var i in this.output) {
			this.output[i] = arrayUpdate[counter++];
		}
		this.visual(controlSignal);
		return this.output[controlSignal];
	}
}

mux.prototype.visual = function(controlSignal) {
	var myText = '';
	for (i in this.output) {
		myText += i + ' => ' + this.output[i];
		if (i == controlSignal) { myText += '*'; }
		myText += '\n';
	}
	$('#' + this.visualName).text(myText);
}
