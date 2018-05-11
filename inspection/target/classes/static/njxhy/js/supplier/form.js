let id = $.trim($("[name=id]").val());
$(function () {
	$loading.load();
	initBtns();
	if ($check.isNull(id)) {
		create();
	} else {
		initInfo();
	}
	$loading.close();
})

function initInfo() {
	$ajax.get({
		url : '/api/supplier/getFullById/' + id,
		success : function (resp) {
			if (resp.data != null) {
				var model = resp.data;
				var form = $("form");
				form.find("[name = 'code']").val(model.code);
				form.find("[name = 'status']").val(model.status);
				form.find("[name = 'name']").val(model.name);
				form.find("[name = 'simpleName']").val(model.simpleName);
				form.find("[name = 'area']").val(model.area);
				form.find("[name = 'country']").val(model.country);
				form.find("[name = 'city']").val(model.city);
				form.find("[name = 'website']").val(model.website);
				form.find("[name = 'addr']").val(model.addr);
				form.find("[name = 'businessContent']").val(model.businessContent);
				form.find("[name = 'buildDate']").val(model.buildDate);
				form.find("[name = 'buttUserName']").val(model.buttUserName);
				console.log(model);
				if (model.contacts != null) {
					for (let idx in model.contacts) {
						create(model.contacts[idx]);
					}
				}
			}
		},
		error : function(resp) {
			$ly.alert("数据获取失败");
		}
	})
}

function initBtns () {
	// 添加联系人
	$('.add').on('click', function() {
		create();
	})
	// 删除联系人
	$('.contacts').on('click', '.remove', function() {
		$(this).parents('.contact').remove();
	})
}

function back() {
	window.history.go(-1);
}

function create(obj) {
	let html = '';
	html += '<div class="contact">';
	html += '	<div class="form-group">';
	html += '		<label class="col-sm-offset-1 col-sm-1 control-label">名称<span class="red"> *</span></label>';
	html += '	   	<div class="col-sm-4">';
	html += '	    	<input type="text" class="form-control" name="name"';
	if (obj != null) {
		html += '	    	value="'+ obj.name +'"';
	}
	html += '			readonly>';
	html += '	  	</div>';
	html += '		<label class="col-sm-1 control-label">部门<span class="red"> *</span></label>';
	html += '	   	<div class="col-sm-4">';
	html += '	    	<input type="text" class="form-control" name="deptName"';
	if (obj != null) {
		html += '	    	value="'+ obj.deptName +'"';
	}
	html += '			readonly>';
	html += '	  	</div>';
	html += '	</div>';
	
	html += '	<div class="form-group">';
	html += '		<label class="col-sm-offset-1 col-sm-1 control-label">性别<span class="red"> *</span></label>';
	html += '	   	<div class="col-sm-4">';
	html += '	    	<input type="text" class="form-control" name="sex"';
	if (obj != null) {
		html += '	    	value="'+ obj.sex +'"';
	}
	html += '			readonly>';
	html += '	  	</div>';
	html += '		<label class="col-sm-1 control-label">职务<span class="red"> *</span></label>';
	html += '	   	<div class="col-sm-4">';
	html += '	    	<input type="text" class="form-control" name="job"';
	if (obj != null) {
		html += '	    	value="'+ obj.job +'"';
	}
	html += '			readonly>';
	html += '	  	</div>';
	html += '	</div>';

	html += '	<div class="form-group">';
	html += '		<label class="col-sm-offset-1 col-sm-1 control-label">电话号码<span class="red"> *</span></label>';
	html += '	   	<div class="col-sm-4">';
	html += '	    	<input type="text" class="form-control" name="tel"';
	if (obj != null) {
		html += '	    	value="'+ obj.tel +'"';
	}
	html += '			readonly>';
	html += '	  	</div>';
	html += '		<label class="col-sm-1 control-label">手机号码<span class="red"> *</span></label>';
	html += '	   	<div class="col-sm-4">';
	html += '	    	<input type="text" class="form-control" name="phone"';
	if (obj != null) {
		html += '	    	value="'+ obj.phone +'"';
	}
	html += '			readonly>';
	html += '	  	</div>';
	html += '	</div>';
	
	html += '	<div class="form-group">';
	html += '		<label class="col-sm-offset-1 col-sm-1 control-label">传真号码<span class="red"> *</span></label>';
	html += '	   	<div class="col-sm-4">';
	html += '	    	<input type="text" class="form-control" name="fax"';
	if (obj != null) {
		html += '	    	value="'+ obj.fax +'"';
	}
	html += '			readonly>';
	html += '	  	</div>';
	html += '		<label class="col-sm-1 control-label">电子邮件<span class="red"> *</span></label>';
	html += '	   	<div class="col-sm-4">';
	html += '	    	<input type="text" class="form-control" name="email"';
	if (obj != null) {
		html += '	    	value="'+ obj.email +'"';
	}
	html += '			readonly>';
	html += '	  	</div>';
	html += '	</div>';
	
//	html += '	<div class="form-group">';
//	html += '		<label class="col-sm-offset-1 col-sm-1 control-label"></label>';
//	html += '	   	<div class="col-sm-4">';
//	html += '	    	<a class="btn btn-danger remove">删除</a>';
//	html += '	  	</div>';
	html += '	</div>';
	
	html += '</div>';
	$(".contacts").append(html);
}
