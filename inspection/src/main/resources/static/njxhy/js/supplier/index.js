var table = null;
$(function () {
	
	initTable();
	initBtns();
	
})

function initTable() {
	table = $dt.load({
		el : '#dtTable',
		url : '/api/supplier/getList',
		data: function(map) {
			let _form = $(".conditions-form");
			map['code'] = $.trim(_form.find("[name = 'code']").val());
			map['name'] = $.trim(_form.find("[name = 'name']").val());
			map['country'] = $.trim(_form.find("[name = 'country']").val());
			map['city'] = $.trim(_form.find("[name = 'city']").val());
		},
		columns : [
			{
				"data" : "code"
			},
			{
				"data" : "name",
				"render" : function(data, type, full, meta){
					let str = '<a class="dt-link" href="'+ $root() +'/router/supplier/form?id='+ full.id +'">'+ data +'</a>';
					return str;
				}
			},
			{
				"data" : "country"
			},
			{
				"data" : "city"
			},
			{
				"data" : "status"
			},
			{
				"data" : "id",
				"render" : function(data, type, full, meta){
					var str = '<a class="remove-btn" href="javascript:;" data-id="'+ data +'">删除</a>';
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
	// 下载导入模板
	$(".download-btn").on('click', function() {
		window.open($root() + "/docs/供应商导入模板.xlsx", "模板下载");
	})
	// 数据导入
	$(".import-btn").on('click', function() {
		window.location.href = $root() + "/router/supplier/import/form";
	})
	// 删除
	$("#dtTable").on('click', '.remove-btn', function() {
		var id = $(this).attr('data-id');
		$ly.confirm({
			title : "确认删除供应商？",
			okFn : function() {
				$ajax.post({
					url : '/api/supplier/remove?id=' + id,
					success : function(resp) {
						$ly.msg("删除成功");
						$dt.reload(table);
					},
					error : function() {
						$ly.alert("删除失败");
					}
				})
			}
		})
	})
}

