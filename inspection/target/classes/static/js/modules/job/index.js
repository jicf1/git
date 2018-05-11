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
		url: "/api/job/getTableDatas",
		data: function(map) {
			let _form = $(".conditions-form");
			map['name'] = $.trim(_form.find("[name = 'name']").val());
			map['sort'] = $.trim(_form.find("[name = 'sort']").val());
			map['code'] = $.trim(_form.find("[name = 'code']").val());
		},
		columns: [
			{
				"targets" : [ 0 ],
				"sWidth" : "1%",
				"data" : "code",
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
			{
				"data" : "code",
			},
			{
				"data" : "dutyCode",
			},
			{
				"data" : "description",
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
		// 
		Tools.ly.modal({
			type: 2,
			shade: 0,
			title: "岗位信息",
			el: Tools.getRootPath() + "/router/job/form",
			btn: ['确定', '取消'],
			yes: function(index, layero) {
				return save(layero.find("#data-form"), "add");
			}
		});
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
		
		//
		Tools.ly.modal({
			type: 2,
			shade: 0,
			title: "岗位信息",
			el: Tools.getRootPath() + "/router/job/form",
			btn: ['确定', '取消'],
			success: function(index, layero) {
				let model = Job.getById(datas[0]);
				if (model != null) {
					let _form = layero.find("#data-form");
					_form.find("[name = 'code']").attr("readonly", true);
					_form.find("[name = 'code']").val(model.code);
					_form.find("[name = 'name']").val(model.name);
					_form.find("[name = 'dutyCode']").val(model.dutyCode);
					_form.find("[name = 'description']").val(model.description);
					_form.find("[name = 'sort']").val(model.sort);
				}
			},
			yes: function(index, layero) {
				return save(layero.find("#data-form"), "edit");
			}
		});
	});
	// 删除
	$(".remove-btn").on("click", function() {
		let datas = $dt.getSelected("dtTable");
		if (datas == null || datas.length == 0) {
			$ly.alert("请选择删除的记录");
			return;
		}
		
		$ly.confirm({
			title: "确定删除?",
			okFn: function() {
				$ajax.post({
					url: "/api/job/remove/" + datas.join(','),
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
		
	});
}

function save(_form, operate) {
	// 校验
	let name = $.trim(_form.find("[name = 'name']").val());
	if ($check.isNull(name)) {
		$ly.alert("请填写岗位名称");
		return;
	}
	let code = $.trim(_form.find("[name = 'code']").val());
	if ($check.isNull(code)) {
		$ly.alert("请填写岗位编码");
		return;
	}
	let dutyCode = $.trim(_form.find("[name = 'dutyCode']").val());
	let description = $.trim(_form.find("[name = 'description']").val());
	
	let sort = $.trim(_form.find("[name = 'sort']").val());
	if ($check.isNull(sort)) {
		sort = 0;
	} else if (!$check.isPositive(sort) && sort != 0) {
		$ly.alert("序号必须是正整数");
		return;
	}
	
	// 保存
	$ajax.post({
		url: "/api/job/save",
		data: {
			code: code,
			name: name,
			dutyCode: dutyCode,
			description: description,
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
