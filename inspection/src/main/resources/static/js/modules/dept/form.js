$(function() {
	let deptTypeList = DeptType.getList();
	if (deptTypeList != null) {
		let html = '<option value="">默认</option>';
		for (let i in deptTypeList) {
			let deptType = deptTypeList[i];
			html += '<option value="'+ deptType.id +'"> '+ deptType.name +'</option>';
		}
		$("[name = 'type']").append(html);
	}
	
	initSelectBtns();
	
});

function initSelectBtns() {
	$("form").on("click", ".select-dept-btn", function() {
		let _form = $("form");
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
				let node = Tools.zt.getSelected('select-dept-dt-tree');
				if (node == null) {
					Tools.ly.alert("请选择组织机构");
					return;
				}
				
				_form.find("[name = 'parentCode']").val(node.id);
				_form.find("[name = 'parentName']").val(node.name);
				
				layer.close(index);
			}
		});
	});
	$("form").on("click", ".select-leader-btn", function() {
		let _form = $("form");
		Tools.ly.modal({
			title: "用户列表",
			area: ['90%', '90%'],
			el: $("#select-user"),
			yes: function(index) {
				let userIds = $dt.getSelected('select-user-dt-table');
				if (userIds.length > 1) {
					$ly.alert("只能选择一个用户");
					return false;
				}
				let user = User.getById(userIds[0]);
				_form.find("[name = 'leader']").val(user.username);
				_form.find("[name = 'leaderName']").val(user.name);
				
				layer.close(index);
			}
		});
	});
}