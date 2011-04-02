function cache(e, b, a) {
	// LRU assumed
	// Block size should be passed as number of offset bits (2 + x)
	// Entry size should be passed as number of index bits
	this.content = new cacheFrame(e, b, a);
	this.associativity = a;
	this.blockSize = Math.pow(2, b) / 4;
	this.entrySize = Math.pow(2, e);
	this.bParameter = b;
	this.eParameter = e;
	
	this.blockMask = ((this.blockSize * 4 - 1) >> 2) << 2;
	this.indexMask = (this.entrySize - 1) << b;
	this.tagMask = (Math.pow(2, 32 - b - e) - 1) << e << b >>> 0;
	
	var generalInfo = 'I-Cache Block Mask: ' + this.blockMask.toString(2) + '\n';
	generalInfo += 'I-Cache Index Mask: ' + this.indexMask.toString(2) + '\n';
	generalInfo += 'I-Cache Tag Mask: ' + this.tagMask.toString(2) + '\n';
	
	$('#general_info').text(generalInfo);
}

cache.prototype.visual = function() {
	var myString = '';
	for (s = 0; s < this.associativity; s++) {
		myString += 'Set ' + s.pad(5, ' ') + ': V L    Tag   =>';
		for (bg = 0; bg < this.blockSize; bg++) {
			myString += ' Block ' + bg.pad(3, ' ') + '|';
		}
		myString += '\n';
		for (i = 0; i < this.entrySize; i++) {
			myString += 'Index ' + i.pad(3, ' ') + ': ';
			myString += (this.content[s][i]['valid']) ? 'V ' : 'I ';
			myString += this.content[s][i]['LRU'] + ' ';
			myString += this.content[s][i]['tag'].formatHex(8) + '=>';
			for (b = 0; b < this.blockSize; b++) {
				myString += ' ' + this.content[s][i]['data'][b].formatHex(8) + '|';
			}
			myString += '\n';
		}
		myString += 'End of set ' + s + '\n';
	}
	$('#icache_dump').text(myString);
	return myString;
}

cache.prototype.age = function(setLastUsed, index) {
	for (i = 0; i < this.associativity; i++) {
		this.content[i][index]['LRU']++;
	}
	this.content[setLastUsed][index]['LRU'] = 0;
}

cache.prototype.read = function(address, memoryObject) {
	var seekIndex = (address & this.indexMask) >> this.bParameter;
	var wordIndex = (address & this.blockMask) >> 2;
	for (iterateSet = 0; iterateSet < this.associativity; iterateSet++) {
		if (this.content[iterateSet][seekIndex]['valid'] == true) {
			var tag = this.content[iterateSet][seekIndex]['tag'];
			if ((address & this.tagMask) >> (this.bParameter + this.eParameter + 2) == tag) {
				$('#label_icache').text('Hit on set ' + iterateSet + ' index ' + seekIndex + ' word ' + wordIndex);
				$('#label_instruction').text(this.content[iterateSet][seekIndex]['data'][wordIndex].formatHex(8));
				this.age(iterateSet, seekIndex);
				return this.content[iterateSet][seekIndex]['data'][wordIndex];
			}
		}
	}
	
	// fall-through: miss on all set
	$('#label_icache').text('Miss. Fetching...');
	this.write(address, memoryObject);
}

cache.prototype.write = function(address, memoryObject) {
	var seekIndex = (address & this.indexMask) >> this.bParameter;
	var wordIndex = (address & this.blockMask) >> 2;
	var LRUSet = Array();
	for (i = 0; i < this.associativity; i++) {
		LRUSet[i] = this.content[i][seekIndex]['LRU'];
	}
	var setToReplace = LRUSet.max();
	for (i = 0; i < this.blockSize; i++) {
		this.content[setToReplace][seekIndex]['data'][i] = memoryObject.portRead(address + 4 * i); 
		this.content[setToReplace][seekIndex]['valid'] = true;
		//this.content[setToReplace][seekIndex]['LRU'] = 0;
	}
	this.age(setToReplace, seekIndex);
	this.visual();
	$('#label_instruction').text(this.content[setToReplace][seekIndex]['data'][wordIndex].formatHex(8));
}

function cacheBlock(blockBits, setIndex) {
	var myBlock = Array();
	var blockSize = Math.pow(2, blockBits);
	/*for (k = 0; k < blockSize; k++) {
		myBlock[k] = new cacheRow();
	}*/
	myBlock['valid'] = false;
	myBlock['LRU'] = setIndex;
	myBlock['tag'] = 0;
	myBlock['data'] = new Array();
	for (k = 0; k < blockSize; k++) {
		myBlock['data'][k] = 0;
	}
	return myBlock;
}

function cacheEntry(entryBits, blockBits, setIndex) {
	var mySet = new Array();
	var entrySize = Math.pow(2, entryBits);
	for (j = 0; j < entrySize; j++) {
		mySet[j] = new cacheBlock(blockBits, setIndex);
	}
	return mySet;
}

function cacheFrame(e, b, a) {
	var myCache = new Array();
	for (i = 0; i < a; i++) {
		myCache[i] = new cacheEntry(e, b, i);
	}
	return myCache;
}
