function registerFile(s) {
	this.reg = new Array();
	this.size = s;
	
	for (i = 0; i < s; i++) {
		this.reg[i] = 0;
	}
}

registerFile.prototype.portRead = function(index, visual) {
	$('#' + visual).text(this.reg[index].formatHex(8));
	if (index == 0) {
		return 0;
	}
	return this.reg[index];
}

registerFile.prototype.portWrite = function(index, data, enable) {
	if (index == 0) {
		return;
	}
	if (enable == true) {
		this.reg[index] = data;
	}
}
