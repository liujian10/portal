import React, {
	Component,
	PropTypes
} from 'react';
import {
	message
} from 'antd';
import cookie from 'js-cookie';
import Todos from './Todos/Todos';
import MainLayout from '../layouts/MainLayout/MainLayout';
import ajaxRequestJsonP from '../services/ajaxRequestJsonP.js';

var _api = {
	limits: "http://api.sense.letv.cn/backend-sense-passport/limits/user"
}

function refreshTaken(e) {
	var refresh_token_info = cookie.get("refresh_token_info");
	if (refresh_token_info) {
		var config = {
			url: _api.limits,
			data: {
				refresh_token: refresh_token_info
			},
			success: function(result) {
				if (result.head.ret == 0) {
					cookie.set('user_info', result.body.user_info);
					cookie.set('access_token_info', result.body.access_token_info.access_token, {
						expires: result.body.access_token_info.expires_in
					});
					cookie.set('refresh_token_info', result.body.refresh_token_info.refresh_token, {
						expires: result.body.refresh_token_info.expires_in
					});
					ajaxRequestJsonP(e);
				} else if (result.head.ret == 101) {
					toLogin();
				}
			}
		}
		ajaxRequestJsonP(config);
	} else {
		toLogin();
	}
}

function toLogin() {
	window.location.href = "./login";
}

class App extends Component {
	componentWillMount() {
		var config = {
			url: _api.limits,
			success: function(result) {
				if (result.head.ret == 0) {
					var limits = result.body.limits;
					console.log(limits);
				} else if (result.head.ret == 2) {
					refreshTaken(config);
				} else if (result.head.ret == 4) {
					message.info("您访问太频繁哦，请稍候重试0.0");
				} else if (result.head.ret == 5) {
					message.info("您没有访问权限哦！");
				}
			}
		}
		var data = {
			head: {
				ret: 2
			}
		};
		ajaxRequestJsonP(config);
	}

	render() {
		return (
			<MainLayout>
      			<Todos location={location} />
    		</MainLayout>
		)
	};
};

App.propTypes = {};

export default App;