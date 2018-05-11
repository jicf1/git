let table = null;

$(function() {
	
	$loading.load();
	initTable();
	initBtns();
	$loading.close();
	
});

function initTable() {
	table = $dt.load({
		el: $("#dtTable"),
		url: "/api/utype/getTableDatas",
		data: function(map) {
			let _form = $(".conditions-form");
			map['name'] = $.trim(_form.find("[name = 'name']").val());
			map['sort'] = $.trim(_form.find("[name = 'sort']").val());
		},
		columns: [
			{
				"targets" : [ 0 ],
				"sWidth" : "1%",
				"data" : "id",
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
				"data" : "sort",
			},
			{
				"data" : "name",
			},
		]
	});
}

function initBtns() {
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
	$(".remove-btn").on("click", function() {
		let datas = $dt.getSelected("dtTable");
		if (datas == null || datas.length == 0) {
			$ly.alert("请选择删除的记录");
			return;
		}
		deletes(datas);
	});
}

//打开表单
function open(id, operate) {
	$ly.open({
		title: "表单信息",
		url: '/router/utype/form',
		before: function(index, $form) {
			if (id != null) {
				let model = UserType.getById(id);
				if (model != null) {
					set($form, model);
				}
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
				url: "/api/utype/remove/" + array.join(','),
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
function set($form, model) {
	let _form = $form.find('form');
	_form.find("[name = 'id']").val(model.id);
	_form.find("[name = 'name']").val(model.name);
	_form.find("[name = 'sort']").val(model.sort);
}

//收集表单数据
function get($form, operate) {
	let _form = $form.find("form");
	
	// 校验
	let id = $.trim(_form.find("[name = 'id']").val());
	let name = $.trim(_form.find("[name = 'name']").val());
	if ($check.isNull(name)) {
		$ly.alert("请填写类型名称");
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
		url: "/api/utype/save",
		data: {
			id: id,
			name: name,
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

