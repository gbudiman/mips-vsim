function alu() {
}

alu.prototype.process = function(rA, rB, control) {
	var text = 'Input: ' + rA.formatHex(8) + ', ' + rB.formatHex(8) + '\n';
	var res;
	text += 'Operation: ' + control + '\n';
	switch(control) {
		case 'sll': res = rA << rB; break;
		case 'srl': res = rA >> rB; break;
		case 'add': res = rA + rB; break;
		case 'sub': res = rA - rB; break;
		case 'and': res = rA & rB; break;
		case 'or': res = rA | rB; break;
		case 'nor': res = ~(rA | rB); break;
		case 'xor': res = rA ^ rB; break;
		case 'slt': res = (rA < rB) ? 1 : 0; break;
		case 'slt': res = (Math.abs(rA) < Math.abs(rB)) ? 1 : 0; break;
	}
	text += 'Result: ' + res;
	$('#pre_alu').text(text);
	return res;
}
