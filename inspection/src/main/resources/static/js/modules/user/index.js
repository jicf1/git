let uddTable = null;
let udrTable = null;

$(function() {
	
	$loading.load();
	initTree();
	initBtns();
	initUddTable(null);
	initUdrTable(null);
	$loading.close();
	
});

/**
 * 初始化按钮事件
 * 
 * @returns
 */
function initBtns() {
	// 添加
	$(".create-btn").on("click", function() {
		open(null, "add");
	});
	// 编辑
	$(".update-btn").on("click", function() {
		let tableId = $(".dtTable-tabs").find(".tab-pane.active").find("table").attr('id');
		let datas = $dt.getSelected(tableId);
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
		let tableId = $(".dtTable-tabs").find(".tab-pane.active").find("table").attr('id');
		let array = $dt.getSelected(tableId);
		if (array == null || array.length == 0) {
			$ly.alert("请选择要删除的记录");
			return;
		}
		deletes(array);
	});
}

// 打开表单
function open(id, operate) {
	$ly.open({
		title: "表单信息",
		url: '/user/form',
		before: function(index, $form) {
			if (id != null) {
				console.log(id);
				let user = User.getById(id);
				set($form, user);
			}
		},
		confirm: function(index, $form) {
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
						let node = $zt.getSelected("dtTree");
						let deptCode = node == null ? null : node.id;
						initUddTable(deptCode);
						initUdrTable(deptCode);
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
	
	// 注入用户关系信息
	// 1. 用户-部门-职务关系
	let _uddform = $form.find("form.user-dept-duty-form");
	let uddRelations = User.getUddRelations(user.username);
	if (uddRelations != null && uddRelations.length > 0) {
		let fuddGroup = _uddform.find(".relation-group");
		for (let i = 0; i < uddRelations.length - 1; i++) {
			fuddGroup.after(relationDeptDuty());
		}
		let groups = _uddform.find(".relation-group");
		for (let i = 0; i < uddRelations.length; i++) {
			let group = $(groups[i]);
			group.find("[name = 'deptCode']").val(uddRelations[i].deptCode);
			group.find("[name = 'deptName']").val(uddRelations[i].deptName);
			group.find("[name = 'dutyCode']").val(uddRelations[i].dutyCode);
			group.find("[name = 'dutyName']").val(uddRelations[i].dutyName);
		}
	}
	// 2. 用户-部门-角色关系
	let _udrform = $form.find("form.user-dept-role-form");
	let udrRelations = User.getUdrRelations(user.username);
	if (udrRelations != null && udrRelations.length > 0) {
		let fudrGroup = _udrform.find(".relation-group");
		for (let i = 0; i < udrRelations.length - 1; i++) {
			fudrGroup.after(relationDeptRole());
		}
		let groups = _udrform.find(".relation-group");
		for (let i = 0; i < udrRelations.length; i++) {
			let group = $(groups[i]);
			group.find("[name = 'deptCode']").val(udrRelations[i].deptCode);
			group.find("[name = 'deptName']").val(udrRelations[i].deptName);
			group.find("[name = 'roleCode']").val(udrRelations[i].roleCode);
			group.find("[name = 'roleName']").val(udrRelations[i].roleName);
		}
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
		tel: tel,
	}
	
	// 2. 用户-部门-职务关系
	let udds = [];
	let _uddform = $form.find("form.user-dept-duty-form");
	let uddGroups = _uddform.find(".relation-group");
	
	for (let i = 0; i < uddGroups.length; i++) {
		let uddGroup = $(uddGroups[i]);
		// 校验
		let deptCode = $.trim(uddGroup.find("[name = 'deptCode']").val());
		if ($check.isNull(deptCode)) {
			$ly.alert("请选择组织机构");
			return;
		}
		let dutyCode = $.trim(uddGroup.find("[name = 'dutyCode']").val());
		if ($check.isNull(dutyCode)) {
			$ly.alert("请选择职务");
			return;
		}
		udds.push({
			username: username,
			deptCode: deptCode,
			dutyCode: dutyCode,
		});
	}
	
	// 3. 用户-部门-角色关系
	let udrs = [];
	let _udrform = $form.find("form.user-dept-role-form");
	let udrGroups = _udrform.find(".relation-group");
	for (let i = 0; i < udrGroups.length; i++) {
		let udrGroup = $(udrGroups[i]);
		// 校验
		let deptCode = $.trim(udrGroup.find("[name = 'deptCode']").val());
		if ($check.isNull(deptCode)) {
			$ly.alert("请选择组织机构");
			return;
		}
		let roleCode = $.trim(udrGroup.find("[name = 'roleCode']").val());
		if ($check.isNull(roleCode)) {
			$ly.alert("请选择角色");
			return;
		}
		udrs.push({
			username: username,
			deptCode: deptCode,
			roleCode: roleCode,
		});
	}
	
	user['photo'] = $file.upload(_userform.find("[name = 'photo']"), '/user');
	
	// 保存
	$ajax.json({
		url: "/api/user/save",
		data: {
			user,
			udds,
			udrs,
			operate,
		},
		success: function(resp) {
			$ly.msg(resp.msg);
			if (resp.success) {
				let node = $zt.getSelected("dtTree");
				let deptCode = node == null ? null : node.id;
				initUddTable(deptCode);
				initUdrTable(deptCode);
			}
		}
	});
	return true;
}


function initTree() {
	Dept.initTree({
		id: 'dtTree',
		callback: {
			// 点击组织机构，加载当前部门的所有人员及职务、角色关系
			click: function(event, treeId, treeNode) {
				let deptCode = treeNode.id;
				initUddTable(deptCode);
				initUdrTable(deptCode);
			}
		}
	});
}

function initUddTable(deptCode) {
	uddTable = $dt.load({
		el: $("#uddTable"),
		url: "/api/udd/getTableDatas",
		data: function(map) {
			map['deptCode'] = deptCode;
		},
		columns: [
			{
				"targets" : [ 0 ],
				"sWidth" : "1%",
				"data" : "userId",
				"className" : "npt-content-center",
				"name" : "checkbox",
				"orderable" : false,
				"searchable" : false,
				"bSortable" : false,
				"render" : function(data, type, full, meta){
					let str = '<input type="checkbox" class="minimal" value="'+data+'">';
					str += "<script>";
					str +=	"$('input[type=checkbox].minimal').iCheck({";
					str +=	"	checkboxClass: 'icheckbox_minimal-orange',";
					str +=	"});";
					str += "</script>";
					return str;
				}
			},
			{
				"data" : "userName"
			},
			{
				"data" : "deptName"
			},
			{
				"data" : "dutyName"
			},
		]
	});
	
}

function initUdrTable(deptCode) {
	udrTable = $dt.load({
		el: $("#udrTable"),
		url: "/api/udr/getTableDatas",
		data: function(map) {
			map['deptCode'] = deptCode;
		},
		columns: [
			{
				"targets" : [ 0 ],
				"sWidth" : "1%",
				"data" : "userId",
				"className" : "npt-content-center",
				"name" : "checkbox",
				"orderable" : false,
				"searchable" : false,
				"bSortable" : false,
				"render" : function(data, type, full, meta){
					let str = '<input type="checkbox" class="minimal" value="'+data+'">';
					str += "<script>";
					str +=	"$('input[type=checkbox].minimal').iCheck({";
					str +=	"	checkboxClass: 'icheckbox_minimal-orange',";
					str +=	"});";
					str += "</script>";
					return str;
				}
			},
			{
				"data" : "userName"
			},
			{
				"data" : "deptName"
			},
			{
				"data" : "roleName"
			},
		]
	});
}


function relationDeptDuty () {
	let html = '';
	html += '<div class="relation-group">';
	html += '	<div class="form-group">';
	html += '		<label class="col-sm-3 control-label">组织机构<span class="red"> *</span></label>';
	html += '		<div class="col-sm-6">';
	html += '			<input type="hidden" name="deptCode">';
	html += '			<input type="text" class="form-control" name="deptName" readonly>';
	html += '		</div>';
	html += '		<div class="col-sm-3">';
	html += '			<a class="btn btn-default btn-flat select-dept-btn"><i class="fa fa-search"></i></a>';
	html += '			<a class="btn btn-default btn-flat plus-btn"><i class="fa fa-plus"></i></a>';
	html += '		</div>';
	html += '	</div>';
	html += '	<div class="form-group">';
	html += '		<label class="col-sm-3 control-label">职务<span class="red"> *</span></label>';
	html += '		<div class="col-sm-6">';
	html += '			<input type="hidden" name="dutyCode">';
	html += '			<input type="text" class="form-control" name="dutyName" readonly>';
	html += '		</div>';
	html += '		<div class="col-sm-3">';
	html += '			<a class="btn btn-default btn-flat select-duty-btn"><i class="fa fa-search"></i></a>';
	html += '			<a class="btn btn-danger btn-flat minus-btn"><i class="fa fa-minus"></i></a>';
	html += '		</div>';
	html += '	</div>';
	html += '</div>';
	return html;
}

function relationDeptRole () {
	var html = '';
	html += '<div class="relation-group">';
	html += '	<div class="form-group">';
	html += '     	<label class="col-sm-3 control-label">组织机构<span class="red"> *</span></label>';
	html += '      	<div class="col-sm-6">';
	html += '       		<input type="hidden" name="deptCode">';
	html += '           	<input type="text" class="form-control" name="deptName" readonly>';
	html += '   		</div>';
	html += '  		<div class="col-sm-3">';
	html += '       		<a class="btn btn-default btn-flat select-dept-btn"><i class="fa fa-search"></i></a>';
	html += '         	<a class="btn btn-default btn-flat plus-btn"><i class="fa fa-plus"></i></a>';
	html += '     	</div>';
	html += '  	</div>';
	html += '	<div class="form-group">';
	html += '      	<label class="col-sm-3 control-label">角色<span class="red"> *</span></label>';
	html += '     	<div class="col-sm-6">';
	html += '          	<input type="hidden" name="roleCode">';
	html += '         	<input type="text" class="form-control" name="roleName" readonly>';
	html += '   		</div>';
	html += '       	<div class="col-sm-3">';
	html += '      		<a class="btn btn-default btn-flat select-role-btn"><i class="fa fa-search"></i></a>';
	html += '        	<a class="btn btn-danger btn-flat minus-btn"><i class="fa fa-minus"></i></a>';
	html += '     	</div>';
	html += '	</div>';
	html += '</div>';
	return html;
}



