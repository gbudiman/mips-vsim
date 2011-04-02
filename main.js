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

Number.prototype.formatHex = function(length){
	var hexString = parseInt(this).toString(16).toUpperCase();
	if (hexString.length < length) {
		var padding = length - hexString.length;
		var zero = new Array(padding + 1).join('0');
		return 'x' + zero + hexString;
	}
	return 'x' + hexString;
}

Number.prototype.pad = function(padding, character) {
	var padRequired = padding - this.toString().length;
	var zero = new Array(padRequired + 1).join(character);
	return zero + this;
}

Array.prototype.min = function() {
	var min = 0x7FFFFFFF;
	var index = 0;
	for (i = 0; i < this.length; i++) {
		if (this[i] < min) {
			min = this[i];
			index = i;
		}
	}
	
	return index;
}

Array.prototype.max = function() {
	var max = 0;
	var index = 0;
	for (i = 0; i < this.length; i++) {
		if (this[i] > max) {
			max = this[i];
			index = i;
		}
	}
	
	return index;
}
//////////////////////////////////////////////////////////////////////////////
// Runtime
//////////////////////////////////////////////////////////////////////////////
function run() {
	mainMemory = new memory();
	pc = new programCounter(0);
	icache = new cache($('#i_index').val(), $('#i_block').val(), $('#i_associativity').val());
	icache.visual();
	loadMemory(mainMemory);
	//mainMemory.dump();
	
	if ($('#enableDebug').is(':checked')) {
		$('#step').attr('disabled', false);
	}
	else {
		do {
			var localIns = step();
		} while (localIns != 0xFFFFFFFF)
	}
}

function step() {
	var netPC = pc.portOut();
	pc.visual();
	icache.read(netPC, mainMemory);
	//mainMemory.visual(pc.portOut());
	pc.advance(false, 0, false, 0, false);
	
	return mainMemory.portRead(netPC);
}

function recalculate(myObject, target) {
	$('#' + target).text(Math.pow(2, myObject.value));
}

function reset() {
	/*pc = new programCounter(0);
	$('#enableDebug').attr('checked', false);
	$('#step').attr('disabled', true);
	$('#label_pc').text('-offline-');*/
	document.location = 'index.html';
}
