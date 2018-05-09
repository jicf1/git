var id = $.trim($("[name='id']").val());
var intype = $.trim($("[name='intype']").val());
var createType = $.trim($("[name='createType']").val());
var currentFile = [];	// 存储上传的附件的id
$(function() {
	$loading.load();
	getInitialData();
	initial();
	$loading.close();
	initEvent();
});

function initial () {
	
	// 创建或更新
	if (intype === "CREATE") {
		$(".tools-bar .back").remove();
	}
	if (intype === "CREATE" || intype === "UPDATE") {
		$(".tools-bar .review").remove();
		$(".tools-bar .receive").remove();
		$(".tools-bar .save").css("display", "inline-block");
	}
	// 查阅，设置查阅按钮
	if (intype === "RECEIVE") {
		$(".tools-bar .save").remove();
		$(".tools-bar .review").css("display", "inline-block");
		$(".tools-bar .receive").css("display", "inline-block");
	}
	// 查看
	if (intype === "VIEW") {
		$(".tools-bar .op-btn").remove();
		$(".tools-bar .review").css("display", "inline-block");
	}
	if (intype != "CREATE" && intype != "UPDATE") {
		// 表单设置为只读
		$("[name=type]").attr("disabled", true);
		$("[name=workDesc]").attr("readonly", true);
		$("[name=probDesc]").attr("readonly", true);
		$("[name=fileId]").remove();
		$(".removeFile").remove();
	}
}

function getInitialData () {
	Tools.ajax.get({
		url: Tools.getRootPath() + "/api/sumup/getInitialData",
		data: {
			id : id
		},
		success: function(resp) {
			if (resp.success) {
				var model = resp.data;
				$("[name=id]").val(model.id);
				$("[name=createTime]").val(model.createTime);
				$("[name=createId]").val(model.createId);
				$("[name=userId]").val(model.userId);
				$("[name=userName]").val(model.userName);
				$("[name=fillDate]").val(model.fillDate);
				$("[name=type]").val(model.type);
				$("[name=type] option[value='"+ model.type +"']").prop("selected", true);
				if (model.type !== "HALF_YEAR") {
					$("[href='#tab_2']").css("display", "block");
				}
				
				if (intype === "UPDATE") {
					$("[name=createType]").val(model.createType);
					if (model.createType === "auto" || model.createType == null) {
						$("[name=type]").prop('disabled', true);
					}
				}
				
				$("[name=workDesc]").val(model.workDesc);
				$("[name=probDesc]").val(model.probDesc);
				
				// 附件展示
				if (model.files != null) {
					for (var i = 0; i < model.files.length; i++) {
						currentFile.push({
							id : model.files[i].id,
							name : model.files[i].fullName,
							path : model.files[i].path
						});
					}
					$("[name='fileId']").parents(".form-group").after(buildFileHtml(currentFile));
					Security.filter();
				}
				
			} else {
				$ly.alert(resp.msg);
			}
		}
	});
}

function initEvent () {
	
	// 选择报告改变事件
	$('[name=type]').on('change', function() {
		var type = $(this).val();
		if (type === "HALF_YEAR") {
			$("[href='#tab_2']").css("display", "none");
		} else {
			$("[href='#tab_2']").css("display", "block");
		}
	})
	
	
	// 附件
	$("[name=fileId]").on("change", function() {
		var files = $(this)[0].files;
		if (files.length > 0) {
			Tools.upload("[name=fileId]", function(resp) {
				if (resp.success) {
					currentFile = [];
					currentFile.push({
						id : resp.datas[0].id,
						name : resp.datas[0].fullName,
						path : "/upload" + resp.datas[0].path,
					});
				} else {
					f = true;
					$ly.alert(resp.msg);
				}
			});
			$(this).parents(".form-group").after(buildFileHtml(currentFile));
			Security.filter();
		}
	});
	
	$("form").on("click", ".removeFile", function() {
		currentFile = [];
		$(this).parents('.form-group').remove();
	})
	
	// 预览
	$(".review").on("click", function(){
		var id = $("[name=id]").val();
		if(id){
			axios.get(Tools.getRootPath() + "/api/doc/doc/sys_zj/find?id=" + id)
			     .then(function(response){
			    	 var data = response.data;
			    	 if(data.obj.doc && data.obj.doc.path){
		    			 window.open(Tools.getRootPath() + '/plugins/pdfJs/generic/web/viewer.html?file=' + Tools.getRootPath() + '/document/pdfJs/doc/' + data.obj.doc.id);			    			 
		    		 }else if(data.obj.attachs.length > 0){
		    			 window.open(Tools.getRootPath() + "/document/previewbarv2?id=" + data.obj.attachs[0].id);
		    		 }else{
		    			 $ly.alert("不存在可预览文件");
		    		 }
			     })
			     .catch(function(error){
			    	 $ly.alert("未找到对应文档记录");
			     });
		}else{
			$ly.alert("请先提交后查看");
		}
	});
	
	// 保存
	$(".save").on("click", function() {
		$loading.load();
		var isSubmit = $(this).attr('data-submit');
		// 表单信息
		var _form = $("form");
		var userId = $.trim(_form.find("[name=userId]").val());
		var fillDate = $.trim(_form.find("[name=fillDate]").val());
		var fileId = "";
		if (currentFile.length > 0) {
			for (var i = 0; i < currentFile.length; i++) {
				fileId += ',' + currentFile[i].id;
			}
			fileId = fileId.substring(1);
		}
		
		var type = $.trim(_form.find("[name=type]").val());
		var createType = $.trim(_form.find("[name=createType]").val());
		var workDesc = $.trim(_form.find("[name=workDesc]").val());
		var probDesc = $.trim(_form.find("[name=probDesc]").val());
		
		// 根据提交状态判断是否要做完整的字段校验，如果为true，表示提交，要么上传了附件，要么完整的填写了表单，为false不校验
		if ("true" === isSubmit) {
			// 判断是否有附件
			if (fileId.length === 0) {
				if ("HALF_YEAR" === type) {
					$ly.alert("未上传报告附件");
					return;
				} else {
					// 没有附件，判断是否表单填写完整
					if ($check.isNull(workDesc) || $check.isNull(probDesc)) {
						$ly.alert("未上传报告附件或表单填写不完整");
						$loading.close();
						return;
					}
				}
			}
		}
		
		
		Tools.ajax.post({
			url: Tools.getRootPath() + "/api/sumup/save",
			data: {
				id: Number(id),
				userId: userId,
				fillDate: fillDate,
				fileId: fileId,
				type: type, 
				workDesc: workDesc,
				probDesc: probDesc,
				createType: createType,
				isSubmit: isSubmit
			},
			success: function(resp) {
				if (resp.success) {
					$ly.msg(resp.msg);
					if (isSubmit === "false") {
						window.location.href=Tools.getRootPath() + "/router/sumup/todo"
					} else if (isSubmit === "true") {
						window.location.href=Tools.getRootPath() + "/router/sumup/end"
					}
				} else {
					$ly.alert(resp.msg);
				}
			}
		});
		$loading.close();
	})
	
	// 标记为已阅
	$(".receive").on("click", function() {
		Tools.ajax.post({
			url: Tools.getRootPath() + "/api/receive/received/" + id,
			data: {},
			success: function(resp) {
				if (resp.success) {
					$ly.msg(resp.msg);
					window.location.href=Tools.getRootPath() + "/router/sumup/receive/todo"
				} else {
					$ly.alert(resp.msg);
				}
			}
		});
	})
	
	// 预览
	$(".review").on('click', function () {
		let id = $.trim($("[name=id]").val());
		// ...
	})
	
}

function buildFileHtml(currentFile) {
	$(".form-file-list").parents(".form-group").remove();
	var html = '';
	if (currentFile.length > 0) {
		html += '<div class="form-group">';
		html += '	<label class="col-sm-3 control-label"></label>';
		html += '	<div class="col-sm-6 form-file-list">';
		html += '		<table class="table table-bordered table-condensed">';
		for (var i = 0; i < currentFile.length; i++) {
			html += '			<tr>';
			html += '				<td style="width: 90%; border-right: none;">'+ currentFile[i].name +'</td>';
			html += '				<td style="width: 10%; text-align: center;">';
			html += '					<a hasPrivilege="zj_download" href="'+ $root() + currentFile[i].path +'" class="downFile" title="下载" data-id="'+ currentFile[i].id +'"><i class="fa fa-download"></i></a>';
			html += '					<a href="javascrip:;" class="removeFile" title="移除"><i class="fa fa-trash"></i></a>';
			html += '				</td>';
			html += '			</tr>';
		}
		html += '		</table>';
		html += '	</div>';
		html += '</div>';
	}
	return html;
}

function back () {
	window.history.go(-1);
}

