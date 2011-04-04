function pipeline_ifid() {
	this.addPC = 0;
	this.instruction = 0;
	this.outAddPC = 0;
	this.outInstruction = 0;
}

pipeline_ifid.prototype.portIn = function(a, i) {
	this.addPC = a;
	this.instruction = i;
}

pipeline_ifid.prototype.clock = function() {
	this.outAddPC = this.addPC;
	this.outInstruction = this.instruction;
}

pipeline_ifid.prototype.portAddPC = function() {
	$('#label_ifid_addPC').text(this.outAddPC.formatHex(4));
	return this.outAddPC;
}
pipeline_ifid.prototype.portInstruction = function() {
	$('#label_ifid_instruction').text(this.outInstruction.formatHex(8));
	return this.outInstruction;
}
