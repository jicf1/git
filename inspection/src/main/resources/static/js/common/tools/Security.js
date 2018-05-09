$(function() {
	Security.filter();
})

var Security = {
	filter : function() {
		// hasUser, hasRole, hasPrivilege， 包含关系，值与值逗号分隔
		var security = null;
		$ajax.get({
			url : '/platform/perm/getSecurity',
			success : function(resp) {
				security = resp.data;
			}
		})
		if (security.guest) {
			return;
		}
		var username = security.user.username; // 用户名
		var roles = security.roles; // 角色数组
		var menus = security.menus; // 菜单数组
		var buttons = security.buttons; // 按钮数组

		// 包含用户
		var result = false;
		var elements = $("[hasUser]");
		if (elements != null && elements.length > 0) {
			for (var i = 0; i < elements.length; i++) {
				var el = $(elements[i]);
				var userStr = $.trim(el.attr("hasUser"));
				if (userStr != undefined && userStr != "undefined"
						&& userStr.length > 0) {
					var userArray = userStr.split(',');
					for (var j = 0; j < userArray.length; j++) {
						if ($.trim(userArray[j]) === username) {
							result = true;
							break;
						}
					}
					result ? el.removeAttr("hasUser") : el.remove();
				}
			}
		}

		// 包含角色
		result = false;
		elements = null;
		elements = $("[hasRole]");
		if (elements != null && elements.length > 0) {
			for (var i = 0; i < elements.length; i++) {
				var el = $(elements[i]);
				var roleStr = $.trim(el.attr("hasRole"));
				if (roleStr != undefined && roleStr != "undefined"
						&& roleStr.length > 0) {
					var roleArray = roleStr.split(',');
					for (var j = 0; j < roleArray.length; j++) {
						if (Security.contains($.trim(roleArray[j]), roles)) {
							result = true;
							break;
						}
					}
					result ? el.removeAttr("hasRole") : el.remove();
				}
			}
		}

		// 包含权限资源
		result = false;
		elements = null;
		elements = $("[hasPrivilege]");
		if (elements != null && elements.length > 0) {
			for (var i = 0; i < elements.length; i++) {
				var el = $(elements[i]);
				var privilegeStr = el.attr("hasPrivilege");
				if (privilegeStr != undefined && privilegeStr != "undefined"
						&& privilegeStr.length > 0) {
					var privilegeArray = privilegeStr.split(',');
					for (var j = 0; j < privilegeArray.length; j++) {
						var privilege = $.trim(privilegeArray[j]);
						if (Security.contains(privilege, menus)) {
							result = true;
							break;
						}
						if (Security.contains(privilege, buttons)) {
							result = true;
							break;
						}
					}
					result ? el.removeAttr("hasPrivilege") : el.remove();
				}
			}
		}
	},
	contains : function (value, array) {
		var i = array.length;
		while (i--) {
			if (array[i] === value) {
				return true;
			}
		}
		return false;
	}
}
