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
}

pipelineLatch.prototype.portOut = function(portName) {
	if (this.flop[portName] == undefined) {
		alert('No such signal ' + portName + ' in pipeline ' + this.pipelineName);
		return 0;
	}
	return this.flop[portName];
}

pipelineLatch.prototype.viewRegister = function() {
	var myString = '';
	for (i in this.flop) {
		myString += i + '\n';
	}
	alert(myString);
}