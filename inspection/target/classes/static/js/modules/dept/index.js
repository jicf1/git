$(function() {
	$loading.load();
	initTree();
	initBtns();
	$loading.close();
});

function initTree() {
	Dept.initTree({
		id: 'dtTree',
		callback: {
			click: function(event, treeId, treeNode) {
				let _box = $(".show-box");
				_box.find("[data-name]").text("");
				let code = treeNode.id;
				let model = Dept.getById(code);
				if (model != null) {
					_box.find("[data-name = 'code']").text(model.code);
					_box.find("[data-name = 'fullName']").text(model.fullName);
					_box.find("[data-name = 'name']").text(model.name);
					if (!Tools.op.isEmpty(model.type)) {
						let deptType = DeptType.getById(model.type);
						_box.find("[data-name = 'typeName']").text(deptType.name);
					}
					let parentCode = model.parentCode;
					if ($op.isNotEmpty(parentCode)) {
						_box.find("[data-name = 'parentName']").text(Dept.getById(parentCode).name);
					}
					_box.find("[data-name = 'level']").text(model.level);
					let leader = model.leader;
					if ($op.isNotEmpty(leader)) {
						_box.find("[data-name = 'leaderName']").text(User.getById(leader).name);
					}
					_box.find("[data-name = 'sort']").text(model.sort);
				}
			}
		}
	});
}

/**
 * 操作按钮相关
 * 
 * @returns
 */
function initBtns() {
	// 添加
	$(".create-btn").on("click", function() {
		// 
		Tools.ly.modal({
			type: 2,
			shade: 0,
			title: "组织机构信息",
			el: Tools.getRootPath() + "/router/dept/form",
			btn: ['确定', '取消'],
			yes: function(index, layero) {
				return save(layero.find("#data-form"), "add");
			}
		});
	});
	// 编辑
	$(".update-btn").on("click", function() {
		let node = Tools.zt.getSelected('dtTree');
		if (node == null) {
			Tools.ly.alert("请选择组织机构");
			return;
		}
		//
		Tools.ly.modal({
			type: 2,
			shade: 0,
			title: "组织机构信息",
			el: Tools.getRootPath() + "/router/dept/form",
			btn: ['确定', '取消'],
			success: function(index, layero) {
				let model = Dept.getById(node.id);
				let _form = layero.find("#data-form");
				_form.find("[name = 'code']").attr("readonly", true);
				_form.find("[name = 'code']").val(model.code);
				_form.find("[name = 'fullName']").val(model.fullName);
				_form.find("[name = 'name']").val(model.name);
				_form.find("[name = 'type'] option[value = '"+ model.type +"']").prop("selected", true);
				if (!Tools.op.isEmpty(model.parentCode)) {
					_form.find("[name = 'parentCode']").val(model.parentCode);
					_form.find("[name = 'parentName']").val(Dept.getById(model.parentCode).name);
				}
				_form.find("[name = 'level']").val(model.level);
				if ($op.isNotEmpty(model.leader)) {
					let user = User.getById(model.leader);
					_form.find("[name = 'leader']").val(user.username);
					_form.find("[name = 'leaderName']").val(user.name);
				}
				_form.find("[name = 'sort']").val(model.sort);
			},
			end: function() {
				
			},
			yes: function(index, layero) {
				return save(layero.find("#data-form"), "edit");
			}
		});
	});
	
	// 删除
	$(".delete-btn").on("click", function() {
		let node = $zt.getSelected("dtTree");
		if (node == null) {
			$ly.alert("请选择删除的记录");
			return;
		}
		$ly.confirm({
			title: "确定删除?",
			okFn: function() {
				$ajax.json({
					url: "/api/dept/remove/" + node.id,
					data: {},
					success: function(resp) {
						$ly.msg(resp.msg);
						if (resp.success) {
							initTree();
						}
					}
				});
			}
		});
	});
	
}

/**
 * 模态框相关
 * 
 * @returns
 */
function save(_form, operate) {
	// 校验
	let code = $.trim(_form.find("[name = 'code']").val());
	if (Tools.check.isNull(code)) {
		Tools.ly.alert("请填写组织机构编码");
		return;
	}
	let fullName = $.trim(_form.find("[name = 'fullName']").val());
	if (Tools.check.isNull(fullName)) {
		Tools.ly.alert("请填写组织机构全称");
		return;
	}
	let name = $.trim(_form.find("[name = 'name']").val());
	if (Tools.check.isNull(name)) {
		name = fullName;
	}
	let type = $.trim(_form.find("[name = 'type'] option:selected").val());
	let parentCode = $.trim(_form.find("[name = 'parentCode']").val());
	let level = $.trim(_form.find("[name = 'level']").val());
	if (Tools.check.isNull(level)) {
		level = 0;
	} else if (!Tools.check.isPositive(level) && level != 0) {
		Tools.ly.alert("级别必须是正整数");
		return;
	}
	let leader = $.trim(_form.find("[name = 'leader']").val());
	let sort = $.trim(_form.find("[name = 'sort']").val());
	if (Tools.check.isNull(sort)) {
		sort = 0;
	} else if (!Tools.check.isPositive(sort) && sort != 0) {
		Tools.ly.alert("序号必须是正整数");
		return;
	}
	
	// 保存
	Tools.ajax.post({
		url: Tools.getRootPath() + "/api/dept/save",
		data: {
			code: code,
			fullName: fullName,
			name: name,
			type: type,
			parentCode: parentCode,
			level: level,
			leader: leader,
			sort: sort,
			operate: operate,
		},
		success: function(result) {
			Tools.ly.msg(result.msg);
			if (result.success) {
				initTree();
			}
		}
	});
	return true;
}

