function programCounter(initVal) {
	this.counter = initVal;
}

programCounter.prototype.advance = function(jump, jumpAddr, jr, jrAddr, halt) {
	if (halt == true) { /* do nothing */ }
	else if (jump == true) { this.counter = jumpAddr; }
	else if (jr == true) { this.counter = jrAddr; }
	else { this.counter += 4; }
}
programCounter.prototype.portOut = function() {
	return this.counter;
}
programCounter.prototype.visual = function() {
	$('#label_pc').text(this.counter.formatHex(4));
}