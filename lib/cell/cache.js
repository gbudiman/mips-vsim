function cache(e, b, a) {
	// LRU assumed
	this.content = new cacheFrame(e, b, a);
	this.associativity = a;
	this.blockSize = b;
	this.entrySize = e;
}

cache.prototype.visual = function() {
	var myString = '';
	for (s = 0; s < this.associativity; s++) {
		myString += 'Set ' + s + ':\n';
		for (i = 0; i < this.entrySize; i++) {
			myString += 'Index ' + i + ': ';
			myString += this.content[s][i] + '\n';
		}
		myString += 'End of set ' + s + '\n';
	}
	$('#icache_dump').text(myString);
	return myString;
}

function cacheBlock(blockSize) {
	var myBlock = Array();
	for (k = 0; k < blockSize; k++) {
		myBlock[k] = 0;
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
