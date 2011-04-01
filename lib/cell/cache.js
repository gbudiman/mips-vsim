function cache(e, b, a) {
	// LRU assumed
	this.content = new cacheFrame(e, b, a);
	this.associativity = a;
	this.blockSize = b; // in words
	this.entrySize = e;
	
	this.offsetMask = (b * 4 - 1) & 0xFFFFFFFC;
}

cache.prototype.visual = function() {
	var myString = '';
	for (s = 0; s < this.associativity; s++) {
		myString += 'Set ' + s + ':\n';
		for (i = 0; i < this.entrySize; i++) {
			myString += 'Index ' + i + ': ';
			for (b = 0; b < this.blockSize; b++) {
				myString += this.content[s][i][b]['valid'];
				myString += this.content[s][i][b]['LRU'];
				myString += this.content[s][i][b]['tag'];
				myString += this.content[s][i][b]['data'] + '\n';
			}
		}
		myString += 'End of set ' + s + '\n';
	}
	$('#icache_dump').text(myString);
	return myString;
}

cache.prototype.read = function(address) {
	
}

function cacheRow() {
	var myRow = Array();
	myRow['valid'] = false;
	myRow['LRU'] = 0;
	myRow['tag'] = 0;
	myRow['data'] = 0;
	return myRow;
}

function cacheBlock(blockSize) {
	var myBlock = Array();
	for (k = 0; k < blockSize; k++) {
		myBlock[k] = new cacheRow();
	}
	return myBlock;
}

function cacheEntry(entrySize, blockSize) {
	var mySet = new Array();
	for (j = 0; j < entrySize; j++) {
		mySet[j] = new cacheBlock(blockSize);
	}
	return mySet;
}

function cacheFrame(e, b, a) {
	var myCache = new Array();
	for (i = 0; i < a; i++) {
		myCache[i] = new cacheEntry(e, b);
	}
	return myCache;
}
