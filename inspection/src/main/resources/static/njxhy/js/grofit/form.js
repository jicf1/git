var currentFile = [];
$(function() {

	initBtns();

})

function initBtns() {
	// 提交数据
	$(".save").on('click', function() {
		var formData = new FormData();
		var files = $("[name='upload-file']")[0].files;
		if (files == null || files.length == 0) {
			$ly.alert("未选择上传的文件");
			return;
		}
		var length = 0;
		for (var i = 0; i < files.length; i++) {
			length += Number(files[i].size);
			formData.append('files[]', files[i]);
		}
		var maxSize = 20 * 1024 * 1024
		if (length >= maxSize) {
			$ly.alert("文件总大小超出限制");
			return;
		}
		$.ajax({
			type : 'POST',
			url : $root() + "/api/grofit/upload",
			data : formData,
			dataType : "json",
			async : true,
			cache : false,
			contentType : false,
			processData : false,
			beforeSend : function(XMLHttpRequest) {
				$loading.load("上传中...");
			},
			success : function(data) {
				$ly.msg("上传成功");
				back();
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				$ly.msg("上传失败");
			},
			complete : function(XMLHttpRequest, textStatus) {
				$loading.close();
			}
		});
	})
	
	// 附件
	$("[name='upload-file']").on("change", function() {
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