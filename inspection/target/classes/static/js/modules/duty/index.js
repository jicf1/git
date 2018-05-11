let table = null;

$(function() {
	$loading.load();
	initTable();
	initBtns();
	$loading.close();
});

function initTable() {
	table = Duty.initTable({
		id: 'dtTable',
		data: function(map) {
			let _form = $(".conditions-form");
			map['name'] = $.trim(_form.find("[name = 'name']").val());
			map['sort'] = $.trim(_form.find("[name = 'sort']").val());
			map['code'] = $.trim(_form.find("[name = 'code']").val());
			map['level'] = $.trim(_form.find("[name = 'level']").val());
		},
	});
}

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

//打开表单
function open(id, operate) {
	$ly.open({
		title: "表单信息",
		url: '/router/duty/form',
		before: function (index, $form)  {
			if (id != null) {
				let model = Duty.getById(id);
				if (model != null) {
					set($form, model);
				}
			}
		},
		confirm: function (index, $form)  {
			return get($form, operate);
		}
	});
}

//删除
function deletes(array) {
	$ly.confirm({
		title: "确定删除?",
		okFn: function() {
			$ajax.post({
				url: "/api/duty/remove/" + array.join(','),
				data: {},
				success: function(resp) {
					$ly.msg(resp.msg);
					if (resp.success) {
						$dt.reload(table);
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
	_form.find("[name = 'level']").val(model.level);
	_form.find("[name = 'sort']").val(model.sort);
}

//收集表单数据
function get ($form, operate) {
	let _form = $form.find("form");
	
	// 校验
	let code = $.trim(_form.find("[name = 'code']").val());
	if ($check.isNull(code)) {
		$ly.alert("请填写类型编码");
		return;
	}
	let name = $.trim(_form.find("[name = 'name']").val());
	if ($check.isNull(name)) {
		$ly.alert("请填写类型名称");
		return;
	}
	let level = $.trim(_form.find("[name = 'level']").val());
	if ($check.isNull(level)) {
		level = 0;
	} else if (!$check.isPositive(level) && level != 0) {
		$ly.alert("级别必须是正整数");
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
		url: "/api/duty/save",
		data: {
			code: code,
			name: name,
			level: level,
			sort: sort,
			operate: operate,
		},
		success: function(resp) {
			$ly.msg(resp.msg);
			if (resp.success) {
				$dt.reload(table);
			}
		}
	});
	return true;
}











