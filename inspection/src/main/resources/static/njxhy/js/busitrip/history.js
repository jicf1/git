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
		url: "/api/busitrip/getHistoryList",
		data: function(map) {
			map['title'] = $.trim($(".conditions-form").find("[name='title']").val());
		},
		columns: [
			{
				"data" : "title",
				"render" : function(data, type, full, meta){
					let str = '<a class="dt-link" target="view_iframe" href="'+ $root() +'/router/busitrip/form?intype=VIEW&id='+ full.id +'">'+ data +'</a>';
					return str;
				}
			},
			{
				"data" : "userName"
			},
			{
				"data" : "fillDate",
			},
		],
		fnInitComplete : function(oSettings, json){
			if(parent.search){
				parent.search.cc_todo = table.page.info().recordsTotal;
			}
		}
	})
}