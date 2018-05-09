var table = null;
$(function () {
	$loading.load();
	initBtns();
	initTable();
	$loading.close();
});

function initBtns() {
	// 条件查询
	$(".condition-btn").on("click", function() {
		$dt.reload(table);
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
		window.location.href = Tools.getRootPath() + "/router/sumup/form?intype=UPDATE&id=" + id;
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
		window.location.href = Tools.getRootPath() + "/router/sumup/form?intype=VIEW&id=" + id;
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
		url: "/api/sumup/getTodoList",
		data: function(map) {
			map['title'] = $.trim($(".conditions-form").find("[name='title']").val());
		},
		columns: [
			{
				"data" : "title",
				"render" : function(data, type, full, meta){
					let str = '<a class="dt-link" target="view_iframe" href="'+ $root() +'/router/sumup/form?intype=UPDATE&id='+ full.id +'">'+ data +'</a>';
					return str;
				}
			},
			{
				"data" : "userName"
			},
			{
				"data" : "fillDate"
			},
			{
				"data" : "type",
				"render" : function(data, type, full, meta){
					let str = "";
					if (data == "WEEK") {
						str = "周报告";
					} else if (data == "MONTH") {
						str = "月报告";
					} else if (data == "HALF_YEAR") {
						str = "半年报告";
					}
					return str;
				}
			},
		],
		fnInitComplete : function(oSettings, json){
			if(parent.search){
				parent.search.zj_todo = table.page.info().recordsTotal;
			}
		}
	})
}

//删除
function deletes(array) {
	$ly.confirm({
		title: "确定删除?",
		okFn: function() {
			$ajax.post({
				url: "/api/sumup/remove/" + array.join(','),
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