var currentFile = [];
$(function() {

	initBtns();

})

function initBtns() {
	// 提交数据
	$(".save").on('click', function() {
		var formData = new FormData();
		var files = $("[name='import-file']")[0].files;
		if (files != null && files.length > 0) {
			for (var i = 0; i < files.length; i++) {
				formData.append('files[]', files[i]);
			}
		}
		$.ajax({
			type : 'POST',
			url : $root() + "/api/business/import",
			data : formData,
			dataType : "json",
			async : false,
			cache : false,
			contentType : false,
			processData : false,
			success : function(data, textStatus) {
//				if (data.datas != null && data.datas.length > 0) {
//					var str = '';
//					for (var i = 0; i < data.datas.length; i++) {
//						str += ''+ data.datas[i].describe +', ';
//					}
//					$ly.alert("数据导入失败，" + str);
//				} else {
//					$ly.msg("导入成功");
//					back();
//				}
				$ly.msg("导入成功");
				back();
			},
			error : function(resp) {
				$ly.msg("导入失败");
			}
		});
	})
	
	// 附件
	$("[name='import-file']").on("change", function() {
		var files = $(this)[0].files;
		if (files.length > 0) {
			$(this).parents(".form-group").after(buildFileHtml(files));
		}
	});
}

function buildFileHtml(files) {
	$(".form-file-list").parents(".form-group").remove();
	var html = '';
	if (files.length > 0) {
		html += '<div class="form-group">';
		html += '	<label class="col-sm-3 control-label"></label>';
		html += '	<div class="col-sm-6 form-file-list">';
		html += '		<table class="table table-bordered table-condensed">';
		for (var i = 0; i < files.length; i++) {
			html += '			<tr>';
			html += '				<td style="width: 100%; border-right: none;">'+ files[i].name +'</td>';
			html += '			</tr>';
		}
		html += '		</table>';
		html += '	</div>';
		html += '</div>';
	}
	return html;
}

function back() {
	window.history.go(-1);
}