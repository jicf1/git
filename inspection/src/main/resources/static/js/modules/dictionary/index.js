$(function() {
	$loading.load();
	initDicTree();
	initBtns();
	$loading.close();
});

function initDicTree() {
	Dictionary.initTree({
		id: 'dic-tree',
		callback: {
			click: function(event, treeId, treeNode) {
				let _box = $(".show-box");
				_box.find("[data-name]").text("");
				let code = treeNode.id;
				let model = Dictionary.getById(code);
				if (model != null) {
					if (!$op.isEmpty(model.type)) {
						_box.find("[data-name = 'typeName']").text(DictionaryType.getById(model.type).name);
					}
					if (!$op.isEmpty(model.parentCode)) {
						_box.find("[data-name = 'parentName']").text(Dictionary.getById(model.parentCode).name);
					}
					_box.find("[data-name = 'code']").text(model.code);
					_box.find("[data-name = 'name']").text(model.name);
					_box.find("[data-name = 'value']").text(model.value);
					
					_box.find("[data-name = 'sort']").text(model.sort);
				}
			}
		}
	});
}

function initBtns() {
	// 添加
	$(".create-btn").on("click", function() {
		// 
		Tools.ly.modal({
			type: 2,
			shade: 0,
			title: "数据字典信息",
			el: Tools.getRootPath() + "/router/dictionary/form",
			btn: ['确定', '取消'],
			success: function(index, layero) {
				let _form = layero.find("#data-form");
				
				_form.find("[name = 'typeName']").attr("readonly", true);
				_form.find("[name = 'parentName']").attr("readonly", true);
				let node = $zt.getSelected('dic-tree');
				if (node != null) {
					_form.find("[name = 'parentCode']").val(node.id);
					_form.find("[name = 'parentName']").val(node.name);
					
					let parentDic = Dictionary.getById(node.id);
					if (!$op.isEmpty(parentDic.type)) {
						
						let parentType = DictionaryType.getById(parentDic.type);
						if (parentType != null) {
							_form.find("[name = 'type']").val(parentType.code);
							_form.find("[name = 'typeName']").val(parentType.name);
						}
						
					}
					
				}
				
			},
			yes: function(index, layero) {
				return save(layero.find("#data-form"), "add");
			}
		});
	});
	// 编辑
	$(".update-btn").on("click", function() {
		let node = $zt.getSelected('dic-tree');
		if (node == null) {
			$ly.alert("请选择数据字典");
			return;
		}
		//
		Tools.ly.modal({
			type: 2,
			shade: 0,
			title: "数据字典信息",
			el: Tools.getRootPath() + "/router/dictionary/form",
			btn: ['确定', '取消'],
			success: function(index, layero) {
				let model = Dictionary.getById(node.id);
				let _form = layero.find("#data-form");
				_form.find("[name = 'code']").attr("readonly", true);
				_form.find("[name = 'typeName']").attr("readonly", true);
				_form.find("[name = 'parentName']").attr("readonly", true);
				if (!$op.isEmpty(model.parentCode)) {
					_form.find("[name = 'parentCode']").val(model.parentCode);
					_form.find("[name = 'parentName']").val(Dictionary.getById(model.parentCode).name);
				}
				if (!$op.isEmpty(model.type)) {
					_form.find("[name = 'type']").val(model.type);
					_form.find("[name = 'typeName']").val(DictionaryType.getById(model.type).name);
				}
				
				_form.find("[name = 'code']").val(model.code);
				_form.find("[name = 'name']").val(model.name);
				_form.find("[name = 'value']").val(model.name);
				_form.find("[name = 'sort']").val(model.sort);
			},
			yes: function(index, layero) {
				return save(layero.find("#data-form"), "edit");
			}
		});
	});
	// 删除
	$(".delete-btn").on("click", function() {
		let node = $zt.getSelected('dic-tree');
		if (node == null) {
			$ly.alert("请选择数据字典");
			return;
		}
		deletes(node.id);
	});
}

function save(_form, operate) {
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
	let value = $.trim(_form.find("[name = 'value']").val());
	if ($check.isNull(value)) {
		$ly.alert("请填写字典值");
		return;
	}
	let sort = $.trim(_form.find("[name = 'sort']").val());
	if ($check.isNull(sort)) {
		sort = 0;
	} else if (!$check.isPositive(sort) && sort != 0) {
		$ly.alert("序号必须是正整数");
		return;
	}
	
	// 保存
	$ajax.post({
		url: "/api/dictionary/save",
		data: {
			type: type,
			parentCode: parentCode,
			code: code,
			name: name,
			value: value,
			sort: sort,
			operate: operate,
		},
		success: function(resp) {
			$ly.msg(resp.msg);
			if (resp.success) {
				initDicTree();
			}
		}
	});
	
	return true;
}

//删除
function deletes(id) {
	$ly.confirm({
		title: "确定删除?",
		okFn: function() {
			$ajax.post({
				url: "/api/dictionary/remove/" + id,
				data: {},
				success: function(resp) {
					$ly.msg(resp.msg);
					if (resp.success) {
						initDicTree();
					}
				}
			});
		}
	});
}


