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
}

function initTable () {
	table = $dt.load({
		el: $("#dtTable"),
		url: "/api/sumup/getHistoryList",
		data: function(map) {
			map['title'] = $.trim($(".conditions-form").find("[name='title']").val());
		},
		columns: [
			{
				"data" : "title",
				"render" : function(data, type, full, meta){
					let str = '<a class="dt-link" href="'+ $root() +'/router/sumup/form?intype=VIEW&id='+ full.id +'">'+ data +'</a>';
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
				parent.search.cc_todo = table.page.info().recordsTotal;
			}
		}
	})
}