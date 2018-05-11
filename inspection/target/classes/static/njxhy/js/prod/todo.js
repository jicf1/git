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
		window.location.href = Tools.getRootPath() + "/router/prod/form?intype=UPDATE&id=" + id;
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
		window.location.href = Tools.getRootPath() + "/router/prod/form?intype=VIEW&id=" + id;
	});
}

function initTable () {
	table = $dt.load({
		el: $("#dtTable"),
		url: "/api/prod/getTodoList",
		data: function(map) {
			map['title'] = $.trim($(".conditions-form").find("[name='title']").val());
		},
		columns: [
			{
				"data" : "title",
				"render" : function(data, type, full, meta){
					let str = '<a class="dt-link" target="view_iframe" href="'+ $root() +'/router/prod/form?intype=UPDATE&id='+ full.id +'">'+ data +'</a>';
					return str;
				}
			},
			{
				"data" : "userName"
			},
			{
				"data" : "fillDate",
			},
			{
				"data" : "prodName"
			},
			{
				"data" : "cnName"
			},
			{
				"data" : "enName"
			},
			{
				"data" : "chemName"
			},
			{
				"data" : "cas"
			},
		],
		fnInitComplete : function(oSettings, json){
			if(parent.search){
				parent.search.cp_todo = table.page.info().recordsTotal;
			}
		}
	})
}

