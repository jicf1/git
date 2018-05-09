$(function() {
	
	initUserType();
	initModalBtns();
	initPlusMinusBtns();
	
});

function initUserType() {
	let userTypeList = UserType.getList();
	if (userTypeList != null) {
		let html = '<option value="">默认</option>';
		for (let i in userTypeList) {
			let userType = userTypeList[i];
			html += '<option value="'+ userType.id +'"> '+ userType.name +'</option>';
		}
		$("[name = 'type']").append(html);
	}
	
	$('input[type="checkbox"].minimal, input[type="radio"].minimal').iCheck({
		checkboxClass: 'icheckbox_minimal-orange',
		radioClass: 'iradio_minimal-orange'
	});
	$(".checkbox-inline, .radio-inline").css("padding-left", "0");
}

function initModalBtns() {
	// 部门选择框
	$("form").on("click", ".select-dept-btn", function() {
		let _relation = $(this).parents(".relation-group");
		Tools.ly.modal({
			title: "组织机构列表",
			area: ['70%', '70%'],
			el: $("#select-dept"),
			success: function() {
				Dept.initTree({
					id: 'select-dept-dt-tree'
				});
			},
			yes: function(index) {
				let node = $zt.getSelected('select-dept-dt-tree');
				if (node == null) {
					$ly.alert("请选择组织机构");
					return;
				}
				_relation.find("[name = 'deptCode']").val(node.id);
				_relation.find("[name = 'deptName']").val(node.name);
				
				layer.close(index);
			}
		});
	});
	
	// 职务选择框
	$("form").on("click", ".select-duty-btn", function() {
		let _relation = $(this).parents(".relation-group");
		Tools.ly.modal({
			title: "职务列表",
			area: ['70%', '70%'],
			el: $("#select-duty"),
			success: function() {
				let _form = $(".duty-conditions-form");
				_form.find("input").val("");
				let table = Duty.initTable({
					id: 'select-duty-dt-table',
					data: function(map) {
						map['name'] = $.trim(_form.find("[name = 'name']").val());
						map['sort'] = $.trim(_form.find("[name = 'sort']").val());
						map['code'] = $.trim(_form.find("[name = 'code']").val());
						map['level'] = $.trim(_form.find("[name = 'level']").val());
					},
				});
				$(".duty-condition-btn").on("click", function() {
					$dt.reload(table);
				});
			},
			yes: function(index) {
				let array = $dt.getSelected('select-duty-dt-table');
				if (array.length == 0) {
					$ly.alert("请选择职务");
					return;
				}
				if (array.length > 1) {
					$ly.alert("只能选择一条记录");
					return;
				}
				let duty = Duty.getById(array[0]);
				_relation.find("[name = 'dutyCode']").val(duty.code);
				_relation.find("[name = 'dutyName']").val(duty.name);
				
				layer.close(index);
			}
		});
	});
	
	// 角色选择框
	$("form").on("click", ".select-role-btn", function() {
		let _relation = $(this).parents(".relation-group");
		Tools.ly.modal({
			title: "角色列表",
			area: ['70%', '70%'],
			el: $("#select-role"),
			success: function() {
				let _form = $(".role-conditions-form");
				_form.find("input").val("");
				let table = Role.initTable({
					id: 'select-role-dt-table',
					data: function(map) {
						map['name'] = $.trim(_form.find("[name = 'name']").val());
						map['sort'] = $.trim(_form.find("[name = 'sort']").val());
						map['code'] = $.trim(_form.find("[name = 'code']").val());
					},
				});
				$(".role-condition-btn").on("click", function() {
					$dt.reload(table);
				});
			},
			yes: function(index) {
				let array = $dt.getSelected('select-role-dt-table');
				if (array.length == 0) {
					$ly.alert("请选择角色");
					return;
				}
				if (array.length > 1) {
					$ly.alert("只能选择一条记录");
					return;
				}
				let role = Role.getById(array[0]);
				_relation.find("[name = 'roleCode']").val(role.code);
				_relation.find("[name = 'roleName']").val(role.name);
				
				layer.close(index);
			}
		});
	});
}

function initPlusMinusBtns() {
	// 增加部门职务组
	$("form.user-dept-duty-form").on("click", ".plus-btn", function() {
		let _prevRelation = $(this).parents(".relation-group");
		let relationHtml = relationDeptDuty();
		_prevRelation.after(relationHtml);
	});
	// 增加部门角色组
	$("form.user-dept-role-form").on("click", ".plus-btn", function() {
		let _prevRelation = $(this).parents(".relation-group");
		let relationHtml = relationDeptRole();
		_prevRelation.after(relationHtml);
	});
	// 移除组
	$("form").on("click", ".minus-btn", function() {
		$(this).parents(".relation-group").remove();
	});
}

function relationDeptDuty () {
	let html = '';
	html += '<div class="relation-group">';
	html += '	<div class="form-group">';
	html += '    	<label class="col-sm-3 control-label">组织机构<span class="red"> *</span></label>';
	html += '      	<div class="col-sm-6">';
	html += '       	<input type="hidden" name="deptCode">';
	html += '           <input type="text" class="form-control" name="deptName" readonly>';
	html += ' 		</div>';
	html += '   		<div class="col-sm-3">';
	html += '     		<a class="btn btn-default btn-flat select-dept-btn"><i class="fa fa-search"></i></a>';
	html += '           <a class="btn btn-default btn-flat plus-btn"><i class="fa fa-plus"></i></a>';
	html += '    	</div>';
	html += '  	</div>';
	html += '  	<div class="form-group">';
	html += '    	<label class="col-sm-3 control-label">职务<span class="red"> *</span></label>';
	html += '    	<div class="col-sm-6">';
	html += '       		<input type="hidden" name="dutyCode">';
	html += '            <input type="text" class="form-control" name="dutyName" readonly>';
	html += '      	</div>';
	html += '   	<div class="col-sm-3">';
	html += '       	<a class="btn btn-default btn-flat select-duty-btn"><i class="fa fa-search"></i></a>';
	html += '       	<a class="btn btn-danger btn-flat minus-btn"><i class="fa fa-minus"></i></a>';
	html += '     	</div>';
	html += '   </div>';
	html += '</div>';
	return html;
}

function relationDeptRole () {
	let html = '';
	html += '<div class="relation-group">';
	html += '	<div class="form-group">';
	html += '     	<label class="col-sm-3 control-label">组织机构<span class="red"> *</span></label>';
	html += '      	<div class="col-sm-6">';
	html += '       		<input type="hidden" name="deptCode">';
	html += '           	<input type="text" class="form-control" name="deptName" readonly>';
	html += '   		</div>';
	html += '  		<div class="col-sm-3">';
	html += '       		<a class="btn btn-default btn-flat select-dept-btn"><i class="fa fa-search"></i></a>';
	html += '         	<a class="btn btn-default btn-flat plus-btn"><i class="fa fa-plus"></i></a>';
	html += '     	</div>';
	html += '  	</div>';
	html += '	<div class="form-group">';
	html += '      	<label class="col-sm-3 control-label">角色<span class="red"> *</span></label>';
	html += '     	<div class="col-sm-6">';
	html += '          	<input type="hidden" name="roleCode">';
	html += '         	<input type="text" class="form-control" name="roleName" readonly>';
	html += '   		</div>';
	html += '       	<div class="col-sm-3">';
	html += '      		<a class="btn btn-default btn-flat select-role-btn"><i class="fa fa-search"></i></a>';
	html += '        	<a class="btn btn-danger btn-flat minus-btn"><i class="fa fa-minus"></i></a>';
	html += '     	</div>';
	html += '	</div>';
	html += '</div>';
	return html;
}



