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
		window.location.href = Tools.getRootPath() + "/router/sumup/form?intype=RECEIVE&id=" + id;
	});
}

function initTable () {
	table = $dt.load({
		el: $("#dtTable"),
		url: "/api/receive/getTodoList?modelName=SUMUP",
		data: function(map) {
			map['title'] = $.trim($(".conditions-form").find("[name='title']").val());
		},
		columns: [
			{
				"data" : "map",
				"render" : function(data, type, full, meta){
					let str = '<a class="dt-link" target="view_iframe" href="'+ $root() +'/router/sumup/form?intype=RECEIVE&id='+ data.id +'">'+ data.title +'</a>';
					return str;
				}
			},
			{
				"data" : "map",
				"render" : function(data, type, full, meta){
					let str = data.userName;
					return str;
				}
			},
			{
				"data" : "map",
				"render" : function(data, type, full, meta){
					let str = data.fillDate;
					return str;
				}
			},
			{
				"data" : "map",
				"render" : function(data, type, full, meta){
					let str = data.type;
					if (str == "WEEK") {
						str = "周报告";
					} else if (str == "MONTH") {
						str = "月报告";
					} else if (str == "HALF_YEAR") {
						str = "半年报告";
					}
					return str;
				}
			},
		],
		fnInitComplete : function(oSettings, json){
			if(parent.search){
				parent.search.zjp_todo = table.page.info().recordsTotal;
			}
		}
	})
}