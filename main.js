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
//////////////////////////////////////////////////////////////////////////////
// Runtime
//////////////////////////////////////////////////////////////////////////////
function run() {
	mainMemory = new memory();
	pc = new programCounter(0);
	icache = new cache(32, 8, 4);
	icache.visual();
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
