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
		window.location.href = Tools.getRootPath() + "/router/prod/form?intype=VIEW&id=" + id;
	});
}

function initTable () {
	table = $dt.load({
		el: $("#dtTable"),
		url: "/api/receive/getEndList?modelName=PROD",
		data: function(map) {
			map['title'] = $.trim($(".conditions-form").find("[name='title']").val());
		},
		columns: [
			{
				"data" : "map",
				"render" : function(data, type, full, meta){
					let str = '<a class="dt-link" href="'+ $root() +'/router/prod/form?intype=VIEW'+ data.id +'">'+ data.title +'</a>';
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
					let str = data.prodName;
					return str;
				}
			},
			{
				"data" : "map",
				"render" : function(data, type, full, meta){
					let str = data.cnName;
					return str;
				}
			},
			{
				"data" : "map",
				"render" : function(data, type, full, meta){
					let str = data.enName;
					return str;
				}
			},
			{
				"data" : "map",
				"render" : function(data, type, full, meta){
					let str = data.chemName;
					return str;
				}
			},
			{
				"data" : "map",
				"render" : function(data, type, full, meta){
					let str = data.cas;
					return str;
				}
			},
		]
	})
}