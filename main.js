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
	$('#label_pc').text(this.counter.toString(16).toUpperCase());
}

function memory() {
	this.content = new Array();
}

memory.prototype.dump = function() {
	var myDump;
	for (var i in this.content) {
		myDump += parseInt(i).toString(16) + ': ' + this.content[i].toString(16) + '\n';
	}
	alert(myDump);
}
memory.prototype.portRead = function(address) {
	return this.content[address/4];
}
memory.prototype.visual = function(address) {
	$('#label_instruction').text(this.content[address/4].toString(16).toUpperCase());
}

//////////////////////////////////////////////////////////////////////////////
// Utilities
//////////////////////////////////////////////////////////////////////////////
function loadMemory(myMemory) {
	var data = $('#meminit').val().split('\n');
	for (i = 0; i < data.length; i++) {
		if (data[i].length == 19) {
			var address = parseInt(data[i].substring(3, 7), 16);
			var inputData = parseInt(data[i].substring(9, 17), 16);
			myMemory.content[address] = inputData;
		}
	}
}

//////////////////////////////////////////////////////////////////////////////
// Runtime
//////////////////////////////////////////////////////////////////////////////
function run() {
	mainMemory = new memory();
	pc = new programCounter(0);
	loadMemory(mainMemory);
	//mainMemory.dump();
	
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
	mainMemory.portRead(pc.portOut());
	pc.visual();
	mainMemory.visual(pc.portOut());
	pc.advance(false, 0, false, 0, false);
}

function reset() {
	/*pc = new programCounter(0);
	$('#enableDebug').attr('checked', false);
	$('#step').attr('disabled', true);
	$('#label_pc').text('-offline-');*/
	document.location = 'index.html';
}
