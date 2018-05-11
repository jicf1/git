$(function() {
	
	$loading.load();
	initTree('MENU');
	initTree('BUTTON');
	initBtns();
	$loading.close();
	
});

function initTree(type) {
	let id = '';
	if (type == 'MENU') id = 'menu-tree';
	if (type == 'BUTTON') id = 'button-tree';
	Privilege.initTree({
		id: id,
		type: type,
		callback: {
			click: function(event, treeId, treeNode) {
				let _box = $(".show-box");
				_box.find("[data-name]").text("");
				let code = treeNode.id;
				let model = Privilege.getById(code);
				if (model != null) {
					if (!$op.isEmpty(model.type)) {
						_box.find("[data-name = 'typeName']").text(model.type == 'MENU' ? '菜单' : '按钮');
					}
					if (!$op.isEmpty(model.parentCode)) {
						_box.find("[data-name = 'parentName']").text(Privilege.getById(model.parentCode).name);
					}
					_box.find("[data-name = 'code']").text(model.code);
					_box.find("[data-name = 'name']").text(model.name);
					_box.find("[data-name = 'url']").text(model.url);
					_box.find("[data-name = 'icon']").text(model.icon);
					_box.find("[data-name = 'remarks']").text(model.remarks);
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
		open(null, "add", activeType());
	});
	// 编辑
	$(".update-btn").on("click", function() {
		let node = $zt.getSelected(activeTreeId());
		if (node == null) {
			$ly.alert("请选择权限");
			return;
		}
		open(node.id, "edit", activeType());
	});
	// 删除
	$(".delete-btn").on("click", function() {
		let node = $zt.getSelected(activeTreeId());
		if (node == null) {
			$ly.alert("请选择权限");
			return;
		}
		deletes(node.id);
	});
}

//打开表单
function open(id, operate, type) {
	type == null ? "MENU" : type;
	let node = $zt.getSelected(activeTreeId());
	let parentCode = node == null ? '' : node.id;
	$ly.open({
		title: "表单信息",
		url: '/router/privilege/form',
		before: function (index, $form)  {
			// 赋值
			if (id != null) {
				let model = Privilege.getById(id);
				if (model != null) {
					set($form, model);
				}
			} else {
				// 初始化菜单类型
				let typeName = type == 'MENU' ? '菜单' : '按钮';
				let _form = $form.find('form');
				_form.find('[name = type]').val(type);
				_form.find('[name = typeName]').val(typeName);
				// 初始化上级菜单
				if ($op.isNotEmpty(parentCode)) {
					_form.find('[name = parentCode]').val(parentCode);
					_form.find('[name = parentName]').val(Privilege.getById(parentCode).name);					
				}
			}
		},
		confirm: function (index, $form)  {
			return get($form, operate);
		}
	});
}

//删除
function deletes(id) {
	$ly.confirm({
		title: "确定删除?",
		okFn: function() {
			$ajax.post({
				url: "/api/privilege/remove/" + id,
				data: {},
				success: function(resp) {
					$ly.msg(resp.msg);
					if (resp.success) {
						initTree(activeType());
					}
				}
			});
		}
	});
}

//注入信息
function set ($form, model) {
	let _form = $form.find('form');
	_form.find("[name = 'code']").attr("readonly", true);
	_form.find("[name = 'code']").val(model.code);
	_form.find("[name = 'name']").val(model.name);
	_form.find("[name = 'type']").val(model.type);
	_form.find("[name = 'typeName']").val(model.type == 'MENU' ? '菜单' : '按钮');
	_form.find("[name = 'url']").val(model.url);
	_form.find("[name = 'icon']").val(model.icon);
	_form.find("[name = 'remarks']").val(model.remarks);
	let parentCode = model.parentCode;
	if ($op.isNotEmpty(parentCode)) {
		_form.find('[name = parentCode]').val(parentCode);
		_form.find('[name = parentName]').val(Privilege.getById(parentCode).name);					
	}
	_form.find("[name = 'sort']").val(model.sort);
}

//收集表单数据
function get ($form, operate) {
	let _form = $form.find("form");
	
	// 校验
	let type = $.trim(_form.find("[name = 'type']").val());
	let parentCode = $.trim(_form.find("[name = 'parentCode']").val());
	let code = $.trim(_form.find("[name = 'code']").val());
	if ($check.isNull(code)) {
		$ly.alert("请填写编码");
		return;
	}
	let name = $.trim(_form.find("[name = 'name']").val());
	if ($check.isNull(name)) {
		$ly.alert("请填写名称");
		return;
	}
	let url = $.trim(_form.find("[name = 'url']").val());
	let icon = $.trim(_form.find("[name = 'icon']").val());
	let remarks = $.trim(_form.find("[name = 'remarks']").val());
	
	let sort = $.trim(_form.find("[name = 'sort']").val());
	if ($check.isNull(sort)) {
		sort = 0;
	} else if (!$check.isPositive(sort) && sort != 0) {
		$ly.alert("序号必须是正整数");
		return;
	}
	
	// 保存
	$ajax.post({
		url: "/api/privilege/save",
		data: {
			type: type,
			parentCode: parentCode,
			code: code,
			name: name,
			url: url,
			icon: icon,
			remarks: remarks,
			sort: sort,
			operate: operate,
		},
		success: function(resp) {
			$ly.msg(resp.msg);
			if (resp.success) {
				initTree(activeType());
			}
		}
	});
	return true;
}



function activeTabId() {
	return $(".tree-tabs .tab-pane.active").attr('id');
}

function activeType() {
	return $(".tree-tabs .tab-pane.active").attr('data-type');
}

function activeTreeId() {
	return $(".tree-tabs .tab-pane.active ul.ztree").attr('id');
}

