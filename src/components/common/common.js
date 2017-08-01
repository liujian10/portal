function ajaxRequestJsonP(options) {
	jQuery.ajax({
		type: 'get',
		async: false,
		url: options.url,
		dataType: "jsonp",
		data: options.data || '',
		jsonp: options.callback || '_callback',
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.setRequestHeader("X-Le-Sense-AT", cookie.get('access_token_info') || '');
		},
		success: options.success,
		error: function() {}
	});
}