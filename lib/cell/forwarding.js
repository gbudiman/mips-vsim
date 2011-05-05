function forwarding() {
	this.sigA;
	this.sigB;
}

forwarding.prototype.process = function(idex_rs, idex_rt, idex_regWrite
                                        , exmem_rd, exmem_regWrite
										, memwb_rd, memwb_regWrite) {
	if (memwb_regWrite == true
		&& (memwb_rd != 0)
		&& !(exmem_regWrite && exmem_rd != 0 && exmem_rd == idex_rs)
		&& (memwb_rd == idex_rs)) {
		this.sigA = 'memwb';
	}
	else if (exmem_regWrite == true
		&& (exmem_rd != 0)
		&& (exmem_rd == idex_rs)) {
		this.sigA = 'exmem';
	}
	else {
		this.sigA = 'pipeline';
	}
	
	if (memwb_regWrite == true
		&& (memwb_rd != 0)
		&& !(exmem_regWrite && exmem_rd != 0 && exmem_rd == idex_rs)
		&& (memwb_rd == idex_rt)) {
		this.sigB = 'memwb';
	}
	else if (exmem_regWrite == true
		&& (exmem_rd != 0)
		&& (exmem_rd == idex_rt)) {
		this.sigB = 'exmem';
	}
	else {
		this.sigB = 'pipeline';
	}
}

forwarding.prototype.portA = function() {
	return this.sigA;
}

forwarding.prototype.portB = function() {
	return this.sigB;
}