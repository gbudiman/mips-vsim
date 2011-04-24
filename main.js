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
			//alert(inputData + ' writing ' + parseInt(inputData, 16) + ' to ' + address);
		}
	}
}

Number.prototype.formatHex = function(length){
	var hexString = parseInt(this).toString(16).toUpperCase();
	//$('#pre_debug').append(hexString + '\n');
	if (hexString[0] == '-') {
		hexString = hexString.replace(hexString.charAt(0), 'F');
		if (hexString.length < length - 1) {
			var padding = length - hexString.length;
			var zero = new Array(padding + 1).join('F');
			return 'x' + zero + hexString;
		}
	}
	else { 
		if (hexString.length < length) {
			var padding = length - hexString.length;
			var zero = new Array(padding + 1).join('0');
			return 'x' + zero + hexString;
		}
	}
	return 'x' + hexString;
}

Number.prototype.pad = function(padding, character) {
	var padRequired = padding - this.toString().length;
	var zero = new Array(padRequired + 1).join(character);
	return zero + this;
}

Number.prototype.extract = function(part) {
	var opcodeMask = 0xFC000000;
	var rsMask = 0x3E00000;
	var rtMask = 0x1F0000;
	var rdMask = 0xF800;
	var shamtMask = 0x7C0;
	var aluMask = 0x3F;
	var immediateMask = 0xFFFF;
	var jumpMask = 0x3FFFFFF;
	
	switch(part) {
		case 'opcode': return (this & opcodeMask) >>> 26; break;
		case 'rs': return (this & rsMask) >>> 21;
		case 'rt': return (this & rtMask) >>> 16;
		case 'rd': return (this & rdMask) >>> 11;
		case 'shamt': return (this & shamtMask) >>> 6;
		case 'alu': return this & aluMask;
		case 'immediate': return this & immediateMask;
		case 'immediateExtendSign': return -1 * (this & immediateMask);
		case 'jump': return this & jumpMask;
		default: alert('Unknown integer extraction parameter');
	}
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
function createPipelineIFID() {
	var arraySignal = new Array('nextPC', 'instruction');
	pipelineIFID = new pipelineLatch(arraySignal, 'Pipeline IFID');
	return pipelineIFID;
}
function createRegDstMux() {
	var arraySignal = new Array('rt', 'rd', 'returnAddress');
	regDstMux = new mux(arraySignal, 'regDstMux', 'pre_regDst', false);
	return regDstMux;
}

function createExtenderMux() {
	var arraySignal = new Array('extendSign', 'extendZero');
	extenderMux = new mux(arraySignal, 'extenderMux', 'pre_extender', true);
	return extenderMux;
}

function run() {
	mainMemory = new memory();
	pc = new programCounter(0);
	pipelineIFID = createPipelineIFID();
	icache = new cache($('#i_index').val()
	                   , $('#i_block').val()
					   , $('#i_associativity').val());
	register = new registerFile(32);
	clu = new controlLogicUnit();
	regDstMux = createRegDstMux();
	extenderMux = createExtenderMux();
	
	icache.visual();
	loadMemory(mainMemory);
	mainMemory.dump();
	
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
	var ifidInstruction = 0;
	var netPC = pc.portOut();
	pc.visual();
	//icache.read(netPC, mainMemory);
	//ifid.portIn(pc.portAddPC(), icache.read(netPC, mainMemory));
	//ifid.portAddPC();
	pipelineIFID.clock(new Array(pc.portAddPC
	                             , icache.read(netPC, mainMemory)));
	ifidInstruction = pipelineIFID.portOut('instruction');
	clu.passThrough(ifidInstruction);
	regDstMux.portOut(new Array(ifidInstruction.extract('rt')
								, ifidInstruction.extract('rd')
								, 31) 
						, clu.portRegDst());
	extenderMux.portOut(new Array(ifidInstruction.extract('immediateExtendSign')
								, ifidInstruction.extract('immediate'))
						, clu.portExtendSign());
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
