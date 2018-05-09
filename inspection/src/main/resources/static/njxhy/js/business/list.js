let table = null;
$(function () {
	$loading.load();
	initBtns();
	initTable();
	$loading.close();
});

function initBtns() {
	// 下载导入模板
	$(".download-btn").on('click', function() {
		window.open($root() + "/docs/经营分析导入模板 .xlsx", "模板下载");
	})
	// 数据导入
	$(".import-btn").on('click', function() {
		window.location.href = $root() + "/router/business/import/form";
	})
	// 条件查询
	$(".condition-btn").on("click", function() {
		$dt.reload(table);
	});
	// 新增
	$(".add-btn").on("click", function() {
		window.location.href = Tools.getRootPath() + "/router/business/form?intype=CREATE";
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
		var id = datas[0];
		window.location.href = Tools.getRootPath() + "/router/business/form?intype=UPDATE&id=" + id;
	});
	// 查看
	$(".view-btn").on("click", function() {
		let datas = $dt.getSelected("dtTable");
		if (datas == null || datas.length == 0) {
			$ly.alert("请选择一条记录");
			return;
		}
		if (datas.length > 1) {
			$ly.alert("只能选择一条记录");
			return;
		}
		var id = datas[0];
		window.location.href = Tools.getRootPath() + "/router/busitrip/form?intype=VIEW&id=" + id;
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

function initTable () {
	table = $dt.load({
		el: $("#dtTable"),
		url: "/api/business/getList",
		data: function(map) {
			map['salesman'] = $.trim($(".conditions-form").find("[name='salesman']").val());
			map['goodsName'] = $.trim($(".conditions-form").find("[name='goodsName']").val());
			map['salesNum_start'] = $.trim($(".conditions-form").find("[name='salesNum_start']").val());
			map['salesNum_end'] = $.trim($(".conditions-form").find("[name='salesNum_end']").val());
			map['allFee_start'] = $.trim($(".conditions-form").find("[name='allFee_start']").val());
			map['allFee_end'] = $.trim($(".conditions-form").find("[name='allFee_end']").val());
			map['primaryProfit_start'] = $.trim($(".conditions-form").find("[name='primaryProfit_start']").val());
			map['primaryProfit_end'] = $.trim($(".conditions-form").find("[name='primaryProfit_end']").val());
		},
		columns: [
			{
				"data" : "salesman",
				"render" : function(data, type, full, meta){
					let str = '<a class="dt-link" target="view_iframe" href="'+ $root() +'/router/business/form?intype=UPDATE&id='+ full.id +'">'+ data +'</a>';
					return str;
				}
			},
			{
				"data" : "goodsName",
			},
			{
				"data" : "salesNum",
			},
			{
				"data" : "profit",
			},
			{
				"data" : "allFee",
			},
			{
				"data" : "primaryProfit",
			},
		]
	})
}

//删除
function deletes(array) {
	$ly.confirm({
		title: "确定删除?",
		okFn: function() {
			$ajax.post({
				url: "/api/busitrip/remove/" + array.join(','),
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