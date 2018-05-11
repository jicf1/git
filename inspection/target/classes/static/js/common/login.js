$(function() {
	$('input').iCheck({
		checkboxlet : 'icheckbox_square-blue',
		radiolet : 'iradio_square-blue',
		increaseArea : '20%' // optional
	});
	initBtns();
});

function initBtns() {
	// 快捷方式
	$("[name='loginname']").on("dblclick", function() {
		$("[name='loginpwd']").val($(this).val());
	});
	
	$(".btn-login").on("click", function() {
		var _form = $("#login-form");
		var loginname = $.trim(_form.find("[name = 'loginname']").val());
		var loginpwd = $.trim(_form.find("[name = 'loginpwd']").val());
		if (loginname == "") {
			layer.alert("请填写用户名");
			return;
		}
		if (loginpwd == "") {
			layer.alert("请填写密码");
			return;
		}
		// 登录
		$ajax.post({
			url: "/platform/user/login", 
			data: {
				loginName : loginname,
				loginPwd : MD5(loginpwd),
			},
			success: function(resp) {
				if (resp.success) {
					window.location.href = $root() + "/index";
				} else {
					$ly.alert(resp.msg);
				}
			},
			error: function(ex) {
				$ly.alert("请求失败");
			}
		});
	});
}
