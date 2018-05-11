$(function() {

	$(".logout").on("click", function() {
		$ly.confirm({
			title : "确定退出登录?",
			okFn : function() {
				window.location.href = $root() + '/signout';
			}
		});
	});

});

function openModifyPassword () {
	Tools.ly.modal({
		title: "修改密码",
		area: ['50%', '40%'],
		el: $("#modify-password"),
		success: function() {
			$('.modify-password-form').find('[name="newPassword"]').val("");
			$('.modify-password-form').find('[name="confirmPassword"]').val("");
		},
		yes: function(index) {
			var username = $.trim($('.modify-password-form').find('[name="username"]').val());
			var newPassword = $.trim($('.modify-password-form').find('[name="newPassword"]').val());
			var confirmPassword = $.trim($('.modify-password-form').find('[name="confirmPassword"]').val());
			if (username === "") {
				$ly.alert("未找到用户");
				return;
			}
			if (newPassword === "") {
				$ly.alert("请输入新密码");
				return;
			}
			if (confirmPassword === "") {
				$ly.alert("请输入确认新密码");
				return;
			}
			if (confirmPassword != newPassword) {
				$ly.alert("两次密码输入不一致");
				return;
			}
			
			$ajax.post({
				url : '/api/user/modifyPassword',
				data : {
					username : username,
					newPassword : MD5(newPassword),
					confirmPassword : MD5(confirmPassword)
				},
				success : function (resp) {
					$ly.msg("密码修改成功！");
					layer.close(index);
				},
				error : function (resp) {
					$ly.alert("密码修改失败！");
				}
			})
		}
	});
}