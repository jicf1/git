$(function() {
	
	initSelectBtns();
	
});

function initSelectBtns() {
	$("form").on("click", ".select-privilege-btn", function() {
		Tools.ly.modal({
			title: "权限列表",
			area: ['70%', '70%'],
			el: $("#select-privilege"),
			success: function() {
				Privilege.initTree({
					id: 'select-privilege-dt-tree',
					type: $.trim($("[name='type']").val())
				});
			},
			yes: function(index) {
				let node = $zt.getSelected('select-privilege-dt-tree');
				if (node == null) {
					$ly.alert("请选择权限");
					return;
				}
				$(".privilege-form").find("[name = 'parentCode']").val(node.id);
				$(".privilege-form").find("[name = 'parentName']").val(node.name);
				
				layer.close(index);
			}
		});
	});
}


