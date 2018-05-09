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
	$loading.load();
	$ajax.get({
		url : '/api/crm/getById/' + id,
		success : function(resp) {
			if (resp.data != null) {
				let model = resp.data;
				let _form = $("form");
				_form.find("[name=id]").val(model.id);
				_form.find("[name=name]").val(model.name);
				_form.find("[name=addr]").val(model.addr);
				_form.find("[name=mail]").val(model.mail);
				_form.find("[name=customerDesc]").val(model.customerDesc);
				if (model.contacts != null) {
					for (let idx in model.contacts) {
						create(model.contacts[idx]);
					}
				}
				$loading.close();
			}
		}
	})
}

function initBtns() {
	
	// 添加联系人
	$('.add').on('click', function() {
		create();
	})
	// 删除联系人
	$('.contacts').on('click', '.remove', function() {
		$(this).parents('.contact').remove();
	})
	
	// 保存信息
	$(".save").on('click', function() {
		$loading.load();
		// 表单信息
		let _form = $("form");
		let id = $.trim(_form.find("[name=id]").val());
		if ($check.isNull(id)) {
			id = "0";
		}
		let name = $.trim(_form.find("[name=name]").val());
		let addr = $.trim(_form.find("[name=addr]").val());
		let mail = $.trim(_form.find("[name=mail]").val());
		let customerDesc = $.trim(_form.find("[name=customerDesc]").val());
		
		let contacts = [];
		$(".contact").each(function(idx, ele) {
			let _this = $(this);
			contacts.push({
				name : $.trim(_this.find("[name=contactName]").val()),
				job : $.trim(_this.find("[name=job]").val()),
				phone : $.trim(_this.find("[name=phone]").val())
			})
		})
		
		$ajax.json({
			url : "/api/crm/save",
			data : {
				customer: {
					id: Number(id),
					name: name,
					addr: addr,
					mail: mail,
					customerDesc: customerDesc
				},
				contacts: contacts
			},
			success: function(resp) {
				if (resp.success) {
					$ly.msg(resp.msg);
					window.location.href = $root() + "/router/crm/index";
				} else {
					$ly.alert(resp.msg);
				}
			}
		});
		$loading.close();
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
	html += '	    	<input type="text" class="form-control" name="contactName"';
	if (obj != null) {
		html += '	    	value="'+ obj.name +'"';
	}
	html += '			>';
	html += '	  	</div>';
	html += '		<label class="col-sm-1 control-label">职位<span class="red"> *</span></label>';
	html += '	   	<div class="col-sm-4">';
	html += '	    	<input type="text" class="form-control" name="job"';
	if (obj != null) {
		html += '	    	value="'+ obj.job +'"';
	}
	html += '			>';
	html += '	  	</div>';
	html += '	</div>';
	html += '	<div class="form-group">';
	html += '		<label class="col-sm-offset-1 col-sm-1 control-label">电话<span class="red"> *</span></label>';
	html += '	   	<div class="col-sm-4">';
	html += '	    	<input type="text" class="form-control" name="phone"';
	if (obj != null) {
		html += '	    	value="'+ obj.phone +'"';
	}
	html += '			>';
	html += '	  	</div>';
	html += '	  	<label class="col-sm-1 control-label"></label>';
	html += '	   	<div class="col-sm-4">';
	html += '	    	<a class="btn btn-danger remove">删除</a>';
	html += '	  	</div>';
	html += '	</div>';
	html += '</div>';
	$(".contacts").append(html);
}

