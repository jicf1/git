var id = $.trim($("[name='id']").val());
var intype = $.trim($("[name='intype']").val());
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
		$("input").prop("readonly", true);
		$(".form-file-label").attr("for", "");
		$(".removeFile").remove();
	}
}

function getInitialData () {
	Tools.ajax.get({
		url: Tools.getRootPath() + "/api/prod/getById?id=" + id,
		data: {},
		success: function(resp) {
			if (resp.success) {
				let model = resp.data;
				$("[name='id']").val(model.id);
				$("[name='userId']").val(model.userId);
				$("[name='userName']").val(model.userName);
				$("[name='fillDate']").val(model.fillDate);
				$("[name='chemName']").val(model.chemName);
				$("[name='enName']").val(model.enName);
				$("[name='cnName']").val(model.cnName);
				$("[name='prodId']").val(model.prodId);
				$("[name='prodName']").val(model.prodName);
				$("[name='cas']").val(model.cas);
				
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
			axios.get(Tools.getRootPath() + "/api/doc/doc/sys_cp/find?id=" + id)
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
			$ly.alert("请先提交报告后再查看");
		}
	});
	
	
	// 保存
	$(".save").on("click", function() {
		$loading.load();
		let isSubmit = $(this).attr("data-submit");
		// 校验
		let id = $.trim($("[name = 'id']").val());
		if ($check.isNull(id)) {
			id = "0";
		}
		let userId = $.trim($("[name = 'userId']").val());
		let fillDate = $.trim($("[name = 'fillDate']").val());
		let prodId = $.trim($("[name = 'prodId']").val());
		let chemName = $.trim($("[name = 'chemName']").val());
		let enName = $.trim($("[name = 'enName']").val());
		let cnName = $.trim($("[name = 'cnName']").val());
		let cas = $.trim($("[name = 'cas']").val());
		
		var fileId = "";
		if (currentFile.length > 0) {
			for (var i = 0; i < currentFile.length; i++) {
				fileId += ',' + currentFile[i].id;
			}
			fileId = fileId.substring(1);
		}
		
		
		// 根据提交状态判断是否要做完整的字段校验，如果为true，表示提交，要么上传了附件，要么完整的填写了表单，为false不校验
		if ("true" === isSubmit) {
			// 判断是否有附件
			if (fileId.length === 0 || $check.isNull(chemName) || $check.isNull(enName) || $check.isNull(cnName) ||
					 $check.isNull(cas)) {
				$ly.alert("未上传报告附件或表单填写不完整");
				$loading.close();
				return;
			}
		}
		
		// 保存
		$ajax.post({
			url: "/api/prod/save",
			data: {
				id : id,
				userId : userId,
				fillDate : fillDate,
				prodId : prodId,
				chemName : chemName,
				enName : enName,
				cnName : cnName,
				cas : cas,
				fileId : fileId, 
				isSubmit : isSubmit
			},
			success: function(resp) {
				$ly.msg(resp.msg);
				if ("true" === isSubmit) {
					window.location.href = $root() + '/router/prod/end'
				} else {
					window.location.href = $root() + '/router/prod/todo'
				}
			}
		})
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
					window.location.href=Tools.getRootPath() + "/router/prod/receive/todo"
				} else {
					$ly.alert(resp.msg);
				}
			}
		});
	})
	
	// 选择产品
	$(".search-prod").on('click', function() {
		if (intype != "CREATE" && intype != "UPDATE") {
			return;
		}
		let _form = $("form");
		Tools.ly.modal({
			title: "产品列表",
			area: ['85%', '85%'],
			el: $("#select-prod"),
			success: function() {
				ProdList.initTable();
			},
			yes: function(index) {
				let prodIds = $dt.getSelected('select-prod-data-table');
				if (prodIds.length > 1) {
					$ly.alert("只能选择一个产品");
					return false;
				}
				if (prodIds.length == 0) {
					_form.find("[name = 'prodId']").val("");
					_form.find("[name = 'prodName']").val("");
					_form.find("[name = 'chemName']").val("");
					_form.find("[name = 'enName']").val("");
					_form.find("[name = 'cnName']").val("");
					_form.find("[name = 'cas']").val("");
				} else if (prodIds.length == 1) {
					let model = getProd(prodIds[0]);
					_form.find("[name = 'prodId']").val(model.id);
					_form.find("[name = 'prodName']").val(model.name);
					_form.find("[name = 'chemName']").val(model.chemName);
					_form.find("[name = 'enName']").val(model.enName);
					_form.find("[name = 'cnName']").val(model.cnName);
					_form.find("[name = 'cas']").val(model.cas);
				}
				
				layer.close(index);
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
		html += '	<label class="col-sm-offset-1 col-sm-1 control-label"></label>';
		html += '	<div class="col-sm-4 form-file-list">';
		html += '		<table class="table table-bordered table-condensed">';
		for (var i = 0; i < currentFile.length; i++) {
			html += '			<tr>';
			html += '				<td style="width: 80%; border-right: none;">'+ currentFile[i].name +'</td>';
			html += '				<td style="width: 20%; text-align: center;">';
			html += '					<a hasPrivilege="cp_download" href="'+ $root() + currentFile[i].path +'" class="downFile" title="下载" data-id="'+ currentFile[i].id +'"><i class="fa fa-download"></i></a>';
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

function getProd(id) {
	let model = null;
	$ajax.get({
		url : '/api/prod/store/getById/' + id,
		success : function (resp) {
			model = resp.data;		
		}
	})
	return model;
}

