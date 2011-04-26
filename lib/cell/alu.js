function alu() {
}

alu.prototype.process = function(rA, rB, control) {
	var text = 'Input: ' + rA.formatHex(8) + ', ' + rB.formatHex(8) + '\n';
	text += 'Operation: ' + control;
	$('#pre_alu').text(text);
	switch(control) {
		case 'sll': return rA << rB;
		case 'srl': return rA >> rB;
		case 'add': return rA + rB;
		case 'sub': return rA - rB;
		case 'and': return rA & rB;
		case 'or': return rA | rB;
		case 'nor': return ~(rA | rB);
		case 'xor': return rA ^ rB;
		case 'slt': return (rA < rB) ? 1 : 0;
		case 'slt': return (Math.abs(rA) < Math.abs(rB)) ? 1 : 0;
	}
}
