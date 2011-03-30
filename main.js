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
	$('#label_pc').text(this.counter);
}

function run() {
	pc = new programCounter(0);
	
	if ($('#enableDebug').is(':checked')) {
		$('#step').attr('disabled', false);
	}
	else {
		for (i = 0; i < 3; i++) {
			step();
		}
	}
}

function step() {
	pc.portOut();
	pc.advance(false, 0, false, 0, false);
}

function reset() {
	pc = new programCounter(0);
	$('#enableDebug').attr('checked', false);
	$('#step').attr('disabled', true);
	$('#label_pc').text('-offline-');
}
