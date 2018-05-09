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
		$('.datepicker').datepicker({
			autoclose: true,
            todayHighlight: true,
			language:"zh-CN",
		    format: 'yyyy.m.d'
		})
		$('.date-begin').datepicker({
			autoclose: true,
			todayHighlight: true,
			language:"zh-CN",
			format: 'yyyy.m.d'
		}).on('changeDate',function(e){  
		    var startTime = e.date;  
		    $('.date-end').datepicker('setStartDate',startTime);
		    $('.callon-date').datepicker('setStartDate',startTime);
		})
		$('.date-end').datepicker({
			autoclose: true,
			todayHighlight: true,
			language:"zh-CN",
			format: 'yyyy.m.d'
		}).on('changeDate',function(e){  
			var endTime = e.date;  
		    $('.date-begin').datepicker('setEndDate',endTime);  
		    $('.callon-date').datepicker('setEndDate',endTime);  
		})
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
		$("[name=userName]").attr("readonly", true);
		$("[name=fillDate]").attr("readonly", true);
		$("[name=tripUserName]").attr("readonly", true);
		$("[name=tripAddr]").attr("readonly", true);
		$("[name=tripDate]").attr("readonly", true);
		$("[name=customerName]").attr("readonly", true);
		$("[name=callonUserName]").attr("readonly", true);
		$("[name=callonDate]").attr("readonly", true);
		$("[name=customerDesc]").attr("readonly", true);
		$("[name=callonDesc]").attr("readonly", true);
		$("[name=fileId]").remove();
		$(".removeFile").remove();
	}
}

function getInitialData () {
	Tools.ajax.get({
		url: Tools.getRootPath() + "/api/busitrip/getInitialData",
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
				$("[name=tripUserName]").val(model.tripUserName);
				if ($check.isNull(model.tripUserName)) {
					$("[name=tripUserName]").val(model.userName);
				}
				$("[name=tripAddr]").val(model.tripAddr);
				if ($check.isNotNull(model.tripDate)) {
					var beginDate = model.tripDate.substring(0, model.tripDate.lastIndexOf("-"));
					$('[name=beginDate]').val(beginDate);
					if (model.tripDate.lastIndexOf("-") <  model.tripDate.length) {
						var endDate = model.tripDate.substring(model.tripDate.lastIndexOf("-") + 1);
						$('[name=endDate]').val(endDate);
					}
					$("[name=tripDate]").val(model.tripDate);
				}
				$("[name=customerId]").val(model.customerId);
				$("[name=customerName]").val(model.customerName);
				$("[name=callonUserName]").val(model.callonUserName);
				$("[name=callonDate]").val(model.callonDate);
				$("[name=customerDesc]").val(model.customerDesc);
				$("[name=callonDesc]").val(model.callonDesc);
				
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
			axios.get(Tools.getRootPath() + "/api/doc/doc/sys_cc/find?id=" + id)
			     .then(function(response){
			    	 var data = response.data;
			    	 if(data.errcode == 0){
			    		 if(data.obj.doc && data.obj.doc.path){
			    			 window.open(Tools.getRootPath() + '/plugins/pdfJs/generic/web/viewer.html?file=' + Tools.getRootPath() + '/document/pdfJs/doc/' + data.obj.doc.id);			    			 
			    		 }else if(data.obj.attachs.length > 0){
			    			 window.open(Tools.getRootPath() + "/document/previewbarv2?id=" + data.obj.attachs[0].id);
			    		 }else{
			    			 $ly.alert("不存在可预览文件");
			    		 }
			    	 }else{
			    		 $ly.alert("未生成对应报告");
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
		
		var tripUserName = $.trim(_form.find("[name=tripUserName]").val());
		var tripAddr = $.trim(_form.find("[name=tripAddr]").val());
		_form.find("[name=tripDate]").val($.trim(_form.find("[name=beginDate]").val()) + "-" + $.trim(_form.find("[name=endDate]").val()));
		var tripDate = $.trim(_form.find("[name=tripDate]").val());
		var customerId = $.trim(_form.find("[name=customerId]").val());
		var customerName = $.trim(_form.find("[name=customerName]").val());
		var callonUserName = $.trim(_form.find("[name=callonUserName]").val());
		var callonDate = $.trim(_form.find("[name=callonDate]").val());
		var customerDesc = $.trim(_form.find("[name=customerDesc]").val());
		var callonDesc = $.trim(_form.find("[name=callonDesc]").val());
		
		
		// 根据提交状态判断是否要做完整的字段校验，如果为true，表示提交，要么上传了附件，要么完整的填写了表单，为false不校验
		if ("true" === isSubmit) {
			// 判断是否有附件
			if (fileId.length === 0) {
				// 没有附件，判断是否表单填写完整
				if ($check.isNull(tripUserName) || $check.isNull(tripAddr) || $check.isNull(tripDate) ||
						 $check.isNull(customerName) || $check.isNull(callonUserName) || $check.isNull(callonDate) ||
						 $check.isNull(customerDesc) || $check.isNull(callonDesc)) {
					$ly.alert("未上传报告附件或表单填写不完整");
					$loading.close();
					return;
				}
			}
		}
		
		Tools.ajax.post({
			url: Tools.getRootPath() + "/api/busitrip/save",
			data: {
				id: Number(id),
				userId: userId,
				fillDate: fillDate,
				fileId: fileId,
				tripUserName: tripUserName,
				tripAddr: tripAddr,
				tripDate: tripDate,
				customerId: customerId,
				customerName: customerName,
				callonUserName: callonUserName, 
				callonDate: callonDate, 
				customerDesc: customerDesc,
				callonDesc: callonDesc,
				isSubmit: isSubmit
			},
			success: function(resp) {
				if (resp.success) {
					$ly.msg(resp.msg);
					if (isSubmit === "false") {
						window.location.href=Tools.getRootPath() + "/router/busitrip/todo"
					} else if (isSubmit === "true") {
						window.location.href=Tools.getRootPath() + "/router/busitrip/end"
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
					window.location.href=Tools.getRootPath() + "/router/busitrip/receive/todo"
				} else {
					$ly.alert(resp.msg);
				}
			}
		});
	})
	
	// 打开客户选择窗口
	$(".search-customer").on('click', function() {
		if (intype != "CREATE" && intype != "UPDATE") {
			return;
		}
		Tools.ly.modal({
			title: "客户列表",
			area: ['85%', '85%'],
			el: $("#select-customer"),
			success: function() {
				CustomerList.initTable();
			},
			yes: function(index) {
				var ids = $dt.getSelected('select-customer-data-table');
				if (ids.length  > 1) {
					$ly.alert("只能选择一个客户");
					return false;
				}
				if (ids.length == 0) {
					$("[name='customerName']").val("");
					$("[name='callonUserName']").val("");
					$("[name='customerDesc']").val("");
				} else {
					var model = getCustomer(ids[0]);
					if (model != null) {
						$("[name='customerId']").val(model.id);
						$("[name='customerName']").val(model.name);
						$("[name='customerDesc']").val(model.customerDesc);
						$("[name='callonUserName']").val(model.callonUserName);
					}
				}
				layer.close(index);
				$('#select-customer').css('display', 'none');
			}
		});
	})
	
	// 打开拜访对象选择窗口
	$(".search-callon").on('click', function() {
		if (intype != "CREATE" && intype != "UPDATE") {
			return;
		}
		var customerId = $.trim($('[name=customerId]').val())
		if ($check.isNull(customerId)) {
			$ly.alert("请选择客户");
			return;
		}
		Tools.ly.modal({
			title: "客户联系人列表",
			area: ['85%', '85%'],
			el: $("#select-contact"),
			success: function() {
				ContactList.initTable(customerId);
			},
			yes: function(index) {
				var ids = $dt.getSelected('select-contact-data-table');
				if (ids.length == 0) {
					$("[name='customerName']").val("");
					$("[name='callonUserName']").val("");
					$("[name='customerDesc']").val("");
				} else {
					var callonUserName = "";
					for (var idx in ids) {
						var model = getContact(ids[idx]);
						if (model != null) {
							callonUserName += ', ' + model.name;
						}
					}
					if (callonUserName.length > 0) {
						callonUserName = callonUserName.substring(2);
					}
					$("[name='callonUserName']").val(callonUserName);
				}
				layer.close(index);
				$('#select-contact').css('display', 'none');
			}
		});
	})

	$("form").on("click", ".search-tripuser", function() {
		if (intype != "CREATE" && intype != "UPDATE") {
			return;
		}
		var _form = $("form");
		Tools.ly.modal({
			title: "用户列表",
			area: ['85%', '85%'],
			el: $("#select-user"),
			success: function() {
				UserList.initTable();
			},
			yes: function(index) {
				var userIds = $dt.getSelected('select-user-dt-table');
				if (userIds.length == 0) {
					_form.find("[name = 'tripUserName']").val("");
				} else {
					var userNames = "";
					for (var idx in userIds) {
						var user = User.getById(userIds[idx]);
						userNames += ', ' + user.name;
					}
					if (userNames.length > 0) {
						userNames = userNames.substring(2);
					}
					_form.find("[name = 'tripUserName']").val(userNames);
				}
				
				layer.close(index);
			}
		});
	})
	
	// 预览
	$(".review").on('click', function () {
		var id = $.trim($("[name=id]").val());
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
			html += '					<a hasPrivilege="cc_download" href="'+ $root() + currentFile[i].path +'" class="downFile" title="下载" data-id="'+ currentFile[i].id +'"><i class="fa fa-download"></i></a>';
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


function getCustomer(id) {
	var model = null;
	$ajax.get({
		url : '/api/crm/getById/' + id,
		success : function (resp) {
			model = resp.data;
			if (model != null) {
				$ajax.get({
					url : '/api/crm/getFirstContactByCustomerId/' + id,
					success : function (resp) {
						contact = resp.data;
						if (contact != null) {
							model['callonUserName'] = contact.name;
						}
					}
				})
			}
		}
	})
	return model;
}
function getContact(id) {
	var model = null;
	$ajax.get({
		url : '/api/crm/getContactById/' + id,
		success : function (resp) {
			model = resp.data;
		}
	})
	return model;
}


