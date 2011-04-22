function controlLogicUnit() {
	this.instruction;
	this.instructionClass;
	this.aluOpcode;
}

controlLogicUnit.prototype.passThrough = function(i) {
	this.instruction = i;
	var temp = i.extract('opcode');
	switch (temp) {
		case 0x00: this.instructionClass = 'rtype';
			this.translateALUOpcode(i.extract('alu')); 
			break;
		case 0x02: this.instructionClass = 'j'; 
		           this.aluOpcode = 'null'; break;
		case 0x03: this.instructionClass = 'jal'; 
		           this.aluOpcode = 'null'; break;
		case 0x04: this.instructionClass = 'beq';
		           this.aluOpcode = 'subu'; break;
		case 0x05: this.instructionClass = 'bne'; 
		           this.aluOpcode = 'subu'; break;
		case 0x09: this.instructionClass = 'addiu'; 
		           this.aluOpcode = 'addu'; break;
		case 0x0A: this.instructionClass = 'slti';
		           this.aluOpcode = 'slt'; break;
		case 0x0B: this.instructionClass = 'sltiu';
		           this.aluOpcode = 'sltu'; break;
		case 0x0C: this.instructionClass = 'andi';
		           this.aluOpcode = 'and'; break;
		case 0x0D: this.instructionClass = 'ori';
		           this.aluOpcode = 'or'; break;
		case 0x0E: this.instructionClass = 'xori';
		           this.aluOpcode = 'xor'; break;
		case 0x0F: this.instructionClass = 'lui';
		           this.aluOpcode = 'null'; break;
		case 0x23: this.instructionClass = 'lw';
		           this.aluOpcode = 'addu'; break;
		case 0x2B: this.instructionClass = 'sw';
		           this.aluOpcode = 'addu'; break;
		case 0x30: this.instructionClass = 'll';
		           this.aluOpcode = 'addu'; break;
		case 0x38: this.instructionClass = 'sc';
		           this.aluOpcode = 'addu'; break;
		default: this.instructionClass = '?';
		         this.aluOpcode = 'null'; 
	}
	
	$('#pre_decoder').text(this.visual());
	return this.aluOpcode;
}

controlLogicUnit.prototype.portRegDst = function() {
	if (this.instructionClass == 'rtype') {
		return true;
	}
	return false;
}

controlLogicUnit.prototype.portBEQ = function() {
	if (this.instructionClass == 'beq') {
		return true;
	}
	return false;
}

controlLogicUnit.prototype.portBNE = function() {
	if (this.instructionClass == 'bne') {
		return true;
	}
	return false;
}

controlLogicUnit.prototype.portUpper = function() {
	if (this.instructionClass == 'lui') {
		return true;
	}
	return false;
}

controlLogicUnit.prototype.portExtendSign = function() {
	switch (this.instructionClass) {
		case 'addiu':
		case 'lw':
		case 'slti':
		case 'sltiu':
		case 'sw':
		case 'j':
		case 'jal':
		case 'bne':
		case 'beq':
		case 'll':
		case 'sc': return true;
		default: return false;
	}
}

controlLogicUnit.prototype.portALUSrc = function() {
	
}

controlLogicUnit.prototype.translateALUOpcode = function(ALUOpcode) {
	switch (ALUOpcode) {
		case 0x0: this.aluOpcode = 'sll'; break; 
		case 0x2: this.aluOpcode = 'srl'; break;
		case 0x21: this.aluOpcode = 'addu'; break; 
		case 0x23: this.aluOpcode = 'subu'; break;
		case 0x24: this.aluOpcode = 'and'; break; 
		case 0x25: this.aluOpcode = 'or'; break; 
		case 0x26: this.aluOpcode = 'xor'; break;
		case 0x27: this.aluOpcode = 'nor'; break;
		case 0x2A: this.aluOpcode = 'slt'; break;
		case 0x2B: this.aluOpcode = 'sltu'; break;
		default: this.aluOpcode = 'null';
	}
}

controlLogicUnit.prototype.visual = function() {	
	if (this.instructionClass == 'rtype') {
		switch (i.extract('alu')) {
			case 0x8:
				return 'PC <= ' + this.instruction.extract('rt');
			default:
				return 'R' + this.instruction.extract('rd') + ' <= ' + this.aluOpcode +
				'(R' + this.instruction.extract('rs') +
				', R' + this.instruction.extract('rt') + ')';
		}
	}
	else {
		switch (this.instructionClass) {
			case 'j': return 'PC <= *' + this.instruction.extract('jump').formatHex(7);
			case 'jal': return 'PC <= *' + this.instruction.extract('jump').formatHex(7)
				+ '; R31 <= (PC + 4)';
			case 'beq': return 'R' + this.instruction.extract('rs')
				+ ' == R' + this.instruction.extract('rt')
				+ ' ? ' + 'PC <= ' + this.instruction.extract('immediate').formatHex(8)
				+ ' : ' + 'PC <= (PC + 4)';
			case 'beq': return 'R' + this.instruction.extract('rs')
				+ ' != R' + this.instruction.extract('rt')
				+ ' ? ' + 'PC <= ' + this.instruction.extract('immediate').formatHex(8)
				+ ' : ' + 'PC <= (PC + 4)';
			case 'slti':
			case 'sltiu': return 'R' + this.instruction.extract('rs')
				+ ' < ' + this.instruction.extract('immediate').formatHex(8)
				+ ' ? ' + 'R' + this.instruction.extract('rt')
				+ ' <= 1 : 0';
			case 'lui': return 'R' + this.instruction.extract('rt')
				+ ' <= ' + this.instruction.extract('immediate').formatHex(4) + '0000';
			case 'lw': return 'R' + this.instruction.extract('rt')
				+ ' <= M[R' + this.instruction.extract('rs')
				+ ' + SignExt(' + this.instruction.extract('immediate').formatHex(4)
				+ ')]';
			case 'sw': return 'M[R' + this.instruction.extract('rs')
				+ ' + SignExt(' + this.instruction.extract('immediate').formatHex(4)
				+ ')] <= R' + this.instruction.extract('rt');
			case 'll': return 'R' + this.instruction.extract('rt')
				+ ' <= M[R' + this.instruction.extract('rs')
				+ ' + SignExt(' + this.instruction.extract('immediate').formatHex(4)
				+ ')]; RMW <= ' + this.instruction.extract('rs')
				+ ' + SignExt(' + this.instruction.extract('immedate').formatHex(4) + ')';
			case 'sc': return 'if (RMW == ' + this.instruction.extract('rs')
				+ ' + SignExt(' + this.instruction.extract('immediate').formatHex(4)
				+ ') then M[R' + this.instruction.extract('rs')
				+ ' + SignExt(' + this.instruction.extract('immediate').formatHex(4)
				+ ')];' + ' R' + this.instruction.extract('rt') + ' <= 1 else R'
				+ this.instruction.extract('rt') + ' <= 0';
			default:
				return 'R' + this.instruction.extract('rt') + ' <= ' + this.aluOpcode +
				'(R' + this.instruction.extract('rs') +
				', ' + this.instruction.extract('immediate').formatHex(8) + ')';
		}
	}
}
