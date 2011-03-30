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
	$('#label_instruction').text(this.content[address/4].formatHex(8));
}
