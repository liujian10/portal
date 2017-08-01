import cookie from 'js-cookie';

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
    error: function(res) {}
  });
}

function check401(res) {
  if (res.status === 401) {
    location.href = '/401';
  }
  return res;
}

function check404(res) {
  if (res.status === 404) {
    return Promise.reject(errorMessages(res));
  }
  return res;
}

function jsonParse(res) {
  return res.json().then(jsonResult => ({...res,
    jsonResult
  }));
}

function errorMessageParse(res) {
  const {
    success,
    message
  } = res.jsonResult;
  if (!success) {
    return Promise.reject(message);
  }
  return res;
}

export default ajaxRequestJsonP;