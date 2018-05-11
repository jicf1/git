var table = null;
$(function () {
	
	initTable();
	initBtns();
	
})

function initTable() {
	table = $dt.load({
		el : '#dtTable',
		url : '/api/crm/getList',
		data: function(map) {
			let _form = $(".conditions-form");
			map['name'] = $.trim(_form.find("[name = 'name']").val());
			map['addr'] = $.trim(_form.find("[name = 'addr']").val());
			map['mail'] = $.trim(_form.find("[name = 'mail']").val());
		},
		columns : [
			{
				"data" : "name",
				"render" : function(data, type, full, meta){
					let str = '<a class="dt-link" href="'+ $root() +'/router/crm/form?id='+ full.id +'">'+ data +'</a>';
					return str;
				}
			},
			{
				"data" : "addr"
			},
			{
				"data" : "mail"
			},
			{
				"data" : "contacts",
				"render" : function(data, type, full, meta){
					let str = "";
					if (data != null && data.length > 0) {
						for (var idx in data) {
							str += ", " + data[idx].name;
						}
						return str.substring(2);
					}
					return str;
				}
			},
		]
	})
}

function initBtns() {
	// 条件查询
	$(".condition-btn").on("click", function() {
		$dt.reload(table);
	});
	$(".create-btn").on('click', function() {
		window.location.href = $root() + '/router/crm/form';
	})
	// 下载导入模板
	$(".download-btn").on('click', function() {
		window.open($root() + "/docs/客户导入模板.xlsx", "模板下载");
	})
	// 数据导入
	$(".import-btn").on('click', function() {
		window.location.href = $root() + "/router/crm/import/form";
	})
}

