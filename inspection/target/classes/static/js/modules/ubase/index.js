let table = null;

$(function() {
	
	$loading.load();
	initBtns();
	initTable(null);
	$loading.close();
	
});

/**
 * 初始化按钮事件
 * 
 * @returns
 */
function initBtns () {
	// 条件查询
	$(".condition-btn").on("click", function() {
		$dt.reload(table);
	});
	// 添加
	$(".create-btn").on("click", function() {
		open(null, "add");
	});
	// 编辑
	$(".update-btn").on("click", function() {
		let datas = $dt.getSelected("dtTable");
		if (datas == null || datas.length == 0) {
			$ly.alert("请选择一条记录");
			return;
		}
		if (datas.length > 1) {
			$ly.alert("只能选择一条记录");
			return;
		}
		open(datas[0], "edit");
	});
	// 删除
	$(".delete-btn").on("click", function() {
		let array = $dt.getSelected("dtTable");
		if (array == null || array.length == 0) {
			$ly.alert("请选择删除的记录");
			return;
		}
		deletes(array);
	});
}

// 打开表单
function open(id, operate) {
	$ly.open({
		title: "表单信息",
		url: '/router/ubase/form',
		before: function (index, $form)  {
			if (id != null) {
				let user = User.getById(id);
				set($form, user);
			}
		},
		confirm: function (index, $form)  {
			return get($form, operate);
		}
	});
}

// 删除
function deletes(array) {
	$ly.confirm({
		title: "确定删除?",
		okFn: function() {
			$ajax.post({
				url: "/api/user/remove/" + array.join(','),
				data: {},
				success: function(resp) {
					$ly.msg(resp.msg);
					if (resp.success) {
						initTable();
					}
				}
			});
		}
	});
}

// 注入信息
function set($form, user) {
	// 注入用户基本信息
	let _userform = $form.find("form.user-form");
	_userform.find("[name = 'username']").attr("readonly", true);
	_userform.find("[name = 'username']").val(user.username);
	_userform.find("[name = 'name']").val(user.name);
	_userform.find("[name = 'password']").parents("div.form-group").hide();
	
	_userform.find("[name = 'gender'] option[value='"+ user.gender +"']").prop("selected", true);
	_userform.find("[name = 'state'] option[value='"+ user.state +"']").prop("selected", true);
	_userform.find("[name = 'type'] option[value='"+ user.type +"']").prop("selected", true);
	_userform.find("[name = 'userResource'] option[value='"+ user.userResource +"']").prop("selected", true);

	_userform.find("[name = 'email']").val(user.email);
	_userform.find("[name = 'phone']").val(user.phone);
	_userform.find("[name = 'tel']").val(user.tel);
	_userform.find("[name = 'sort']").val(user.sort);
	
	if ($op.isNotEmpty(user.photo)) {
		let photos = $file.get(user.photo);
		$file.show({
			el: 'photo',
			datas: photos, 
			scope: $form
		});
	}
}

// 收集表单数据
function get($form, operate) {
	let _userform = $form.find("form.user-form");
	
	// 校验
	// 1. 用户基本信息
	let username = $.trim(_userform.find("[name = 'username']").val());
	if ($check.isNull(username)) {
		$ly.alert("请填写用户名");
		return;
	}
	let name = $.trim(_userform.find("[name = 'name']").val());
	if ($check.isNull(name)) {
		$ly.alert("请填写姓名");
		return;
	}
	let password = '';
	if (operate == "add") {
		password = $.trim(_userform.find("[name = 'password']").val());
		if ($check.isNull(password)) {
			$ly.alert("请填写密码");
			return;
		}
	}
	
	let gender = $.trim(_userform.find("[name = 'gender'] option:selected").val());
	let state = $.trim(_userform.find("[name = 'state'] option:selected").val());
	let type = $.trim(_userform.find("[name = 'type'] option:selected").val());
	let userResource = $.trim(_userform.find("[name = 'userResource'] option:selected").val());
	
	let email = $.trim(_userform.find("[name = 'email']").val());
	if (!$check.isNull(email) && !$check.isEmail(email)) {
		$ly.alert("请填写正确格式的邮箱");
		return;
	}
	let phone = $.trim(_userform.find("[name = 'phone']").val());
	if (!$check.isNull(email) && !$check.isPhone(phone)) {
		$ly.alert("请填写正确格式的手机号码");
		return;
	}
	let tel = $.trim(_userform.find("[name = 'tel']").val());
	
	let sort = $.trim(_userform.find("[name = 'sort']").val());
	if ($check.isNull(sort)) {
		sort = 0;
	} else if (!$check.isPositive(sort) && sort != 0) {
		$ly.alert("序号必须是正整数");
		return;
	}
	
	let user = {
		username: username,
		name: name,
		gender: gender,
		state: state,
		type: type,
		userResource: userResource,
		email: email,
		phone: phone,
		sort: sort,
		operate: operate,
	}

	user['photo'] = $file.upload(_userform.find("[name = 'photo']"), '/user');
	
	if (operate == "add") {
		user['password'] = MD5(password);
	}
	
	// 保存
	$ajax.post({
		url: "/api/user/saveBase",
		data: user,
		success: function(resp) {
			$ly.msg(resp.msg);
			if (resp.success) {
				initTable();
			}
		}
	});
	return true;
}

function initTable() {
	table = User.initTable({
		id: 'dtTable',
		data: function(map) {
			map['sort'] = $.trim($(".conditions-form").find("[name='sort']").val());
			map['name'] = $.trim($(".conditions-form").find("[name='name']").val());
		},
	});
}

