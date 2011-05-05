function registerFile(s, n) {
	this.reg = new Array();
	this.size = s;
	this.name = n;
	
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
		this.visual();
	}
}

registerFile.prototype.visual = function() {
	var dump = '';
	for (i = 0; i < this.size; i++) {
		dump += i + ': ' + this.reg[i].formatHex(8) + '\n';
	}
	$('#' + this.name + '_dump').text(dump);
}
