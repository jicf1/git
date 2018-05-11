var table = null;
$(function () {
	
	initTable();
	initBtns();
	
})

function initTable() {
	table = $dt.load({
		el : '#dtTable',
		url : '/api/tech/getList',
		data: function(map) {
			let _form = $(".conditions-form");
			map['name'] = $.trim(_form.find("[name = 'name']").val());
		},
		columns : [
			{
				"data" : "attachment",
				"render" : function(data, type, full, meta){
					var str = '<a title="下载" class="dt-link donwload-btn" href="javascript:;" data-atta-id="'+ data.id +'">'+ data.fullName +'</a>';
					return str;
				}
			},
			{
				"data" : "attachment",
				"render" : function(data, type, full, meta){
					var str = "";
					var size = data.size;
					if (size <= 1024) {
						str = "1Kb";
					} else if (1024 < size <= (1024 * 1024)){
						var s = (size / 1024).toFixed(0);
						if (s < 1024) {
							str = (size / 1024).toFixed(0) + "Kb";
						} else {
							str = (size / 1024 / 1024).toFixed(0) + "Mb";
						}
					}
					return str;
				}
			},
			{
				"data" : "userName"
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
	// 上传资料
	$(".form-btn").on('click', function() {
		window.location.href = $root() + "/router/tech/form";
	})
	// 删除
	$("#dtTable").on('click', '.remove-btn', function() {
		var id = $(this).attr('data-id');
		$ly.confirm({
			title : "确认删除该资料？",
			okFn : function() {
				$ajax.post({
					url : '/api/tech/remove?id=' + id,
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
	// 下载
	$("#dtTable").on('click', '.donwload-btn', function() {
		var attaId = $(this).attr('data-atta-id');
		$ajax.get({
			url : '/api/tech/downcheck?attaId=' + attaId,
			success : function (data) {
				if (data.success) {
					window.open($root() + '/api/tech/download?attaId=' + attaId, "文件下载");
				} else {
					$ly.alert(data.errmsg);
				}
			}
		})
	})
}

