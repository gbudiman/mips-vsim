function controlLogicUnit() {
	this.instruction;
	this.instructionClass;
	this.aluOpcode;
}

controlLogicUnit.prototype.passThrough = function(i) {
	this.instruction = i;
	var temp = i.extract('opcode');
	var argument0;
	var argument1;
	var argument2;
	switch (temp) {
		case 0x00: this.instructionClass = 'rtype';
			this.translateALUOpcode(i.extract('alu')); 
			break;
		case 0x02: this.instructionClass = 'j'; 
		           this.aluOpcode = 'null'; break;
		case 0x03: this.instructionClass = 'jal'; 
		           this.aluOpcode = 'null'; break;
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
				+ ' = R' + this.instruction.extract('rt')
				+ ' ? ' + 'PC <= ' + this.instruction.extract('immediate')
				+ ' : ' + 'PC <= (PC + 4)';
			default:
				return 'R' + this.instruction.extract('rt') + ' <= ' + this.aluOpcode +
				'(R' + this.instruction.extract('rs') +
				', ' + this.instruction.extract('immediate').formatHex(8) + ')';
		}
	}
}
