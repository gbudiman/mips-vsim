function wipe(target) {
	target.value = '';
}

function compact(myObject) {
	$('#pre_' + $(myObject).attr('id')).slideToggle('fast');
}

function tableCompact(myObject) {
	$('#' + $(myObject).attr('id') + '_table').slideToggle('slow');
}
