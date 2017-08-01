import React from 'react';
import {
	Card,
	Form,
	Input,
	Button,
	Checkbox,
	Icon,
	Switch,
	message,
	Alert
} from 'antd';
const FormItem = Form.Item;
const Component = React.Component;
import styles from './Login.less';
import cookie from 'js-cookie';
import ajaxRequestJsonP from '../../services/ajaxRequestJsonP.js'

const _api = {
	login: "http://api.sense.letv.cn/backend-sense-portal/auth/access_token/basic"
};

const initData = {
	user_id: (cookie.get("user_id") != "undefined" ? cookie.get("user_id") : ""),
	user_password: "123456"
}

function noop() {
	return false;
}

class Login extends Component {
	constructor() {
		super();
		this.state = {
			rememberMe: true
		};
	}

	handleSubmit(e) {
		e.preventDefault();
		this.props.form.validateFields((errors, values) => {
			if (!!errors) {
				console.log('Errors in form!!!');
				return;
			}
			message.loading('正在执行中...', 0);
			if (this.state.rememberMe) {
				cookie.set('user_id', values.name, {
					expires: 10000
				});
				cookie.set('user_password', values.passwd, {
					expires: 10000
				});
			}
			console.log(values);
			console.log("rememberMe:" + this.state.rememberMe);
			if (values.name == "admin" && values.passwd == "123456") {
				window.location.href = "./index";
			} else {
				message.destroy();
				message.error("账号或密码错误！");
			}
			/*var config = {
				url : _api.login,
				data  : values,
				success : function(result) {
					if (result.head.ret == 0) {
						cookie.set('user_info', result.body.user_info);
						cookie.set('access_token_info', result.body.access_token_info.access_token, {
							expires: result.body.access_token_info.expires_in
						});
						cookie.set('refresh_token_info', result.body.refresh_token_info.refresh_token, {
							expires: result.body.refresh_token_info.expires_in
						});
						window.location.href = "./index";
					} else if (result.head.ret == 100) {
						message.error("账号或密码错误！");
					}
				}
			}
			ajaxRequestJsonP(config);*/
			/*$.ajax({
				type: 'get',
				async: true,
				url: _api.login,
				data: values || '',
				dataType: "jsonp",
				jsonp: '_callback',
				beforeSend:function(xhr){
					xhr.setRequestHeader("Content-Type","application/json");
					xhr.setRequestHeader("X-Le-Sense-AT",cookie.get('access_token_info') || '');
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
						window.location.href = "./index";
					} else if (result.head.ret == 100) {
						message.error("账号或密码错误！");
					}
				},
				error: function() {},
				complete: function(){}
			});*/
			/*$.post(_api.login, values, function(result) {
				if (result.head.ret == 0) {
					cookie.set('user_info', result.body.user_info);
					cookie.set('access_token_info', result.body.access_token_info.access_token, {
						expires: result.body.access_token_info.expires_in
					});
					cookie.set('refresh_token_info', result.body.refresh_token_info.refresh_token, {
						expires: result.body.refresh_token_info.expires_in
					});
					window.location.href = "./index";
				} else if (result.head.ret == 100) {
					message.error("账号或密码错误！");
				}
			}.bind(this));*/

			/*var data = {
				headers:values
			}
			xFetch(
				_api.login,
				data,
				function(res) {
					if (result.head.ret == 0) {
						cookie.set('user_info', result.body.user_info);
						cookie.set('access_token_info', result.body.access_token_info.access_token, {
							expires: result.body.access_token_info.expires_in
						});
						cookie.set('refresh_token_info', result.body.refresh_token_info.refresh_token, {
							expires: result.body.refresh_token_info.expires_in
						});
						window.location.href = "./index";
					} else if (result.head.ret == 100) {
						message.error("账号或密码错误！");
					}
				}
			);*/
		});
	}

	handerChange(e) {
		this.state = {
			rememberMe: e
		};
	}

	userExists(rule, value, callback) {
		if (!value) {
			callback();
		} else {
			setTimeout(() => {
				if (value === 'JasonWood') {
					callback([new Error('抱歉，该用户名已被占用。')]);
				} else {
					callback();
				}
			}, 800);
		}
	}

	render() {
		const formTitle = <div style={{fontSize:"20px"}}><Icon type="cloud-o" /> 欢迎使用</div>;
		const {
			getFieldProps,
			getFieldError,
			isFieldValidating
		} = this.props.form;
		const formItemLayout = {
			labelCol: {
				span: 7
			},
			wrapperCol: {
				span: 12
			},
		};
		const nameProps = getFieldProps('name', {
			initialValue: initData.user_id,
			rules: [{
				required: true,
				min: 5,
				message: '用户名至少为 5 个字符'
			}, {
				validator: this.userExists
			}, ],
		});

		const userHelp = isFieldValidating('name') ? '校验中...' : (getFieldError('name') || []).join(', ');
		const passwdProps = getFieldProps('passwd', {
			initialValue: initData.user_password,
			rules: [{
				required: true,
				whitespace: true,
				message: '请填写密码'
			}, {
				validator: this.checkPass
			}, ],
		});
		return (
			<div className={styles.loginMain}>
			<div className={styles.loginBox}>
			<Card title={formTitle} style={{width:500,margin:"0 auto"}}>
				<Form horizontal 
					form={this.props.form} 
					onSubmit={this.handleSubmit.bind(this)}>
					<FormItem 
						{...formItemLayout}
			          	label="用户名"
			          	hasFeedback
			          	help={userHelp}>
			          	<Input 
			          		placeholder="请输入用户名"
			          		{...nameProps} />
			        </FormItem>
			        <FormItem 
			        	{...formItemLayout} 
			        	label="密码"
			        	hasFeedback>
						 <Input 
						 	type = "password"		
						 	placeholder = "请输入密码" 
						 	{...passwdProps}
							autoComplete = "off"
							onContextMenu = {noop}
							onPaste = {noop}
							onCopy = {noop}
							onCut = {noop}/>
			        </FormItem>
			        <FormItem 
			        	{...formItemLayout}
			        	label="记住我">
			        	<Switch onChange={this.handerChange.bind(this)} defaultChecked={this.state.rememberMe}/>
			        </FormItem>
			        <FormItem wrapperCol={{ span: 12, offset: 7 }} >
			          <Button type="primary" htmlType="submit">登录</Button>
			        </FormItem>
				</Form>
			</Card>
		</div></div>)
	}
}

Login = Form.create()(Login);

export default Login;