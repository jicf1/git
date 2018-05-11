$(function() {

	initSelectBtns();
	
});

function initSelectBtns() {
	$("form").on("click", ".select-type-btn", function() {
		let _form = $("#data-form");
		
		// 选择字典类型，选择后，需要判断，上级字典字段的类型是否为该类型，如果不是，则情况，否则不作处理
		Tools.ly.modal({
			title: "数据字典类型列表",
			area: ['70%', '70%'],
			el: $("#select-type"),
			yes: function(index, layero) {
				let node = $zt.getSelected('select-type-dt-tree');
				if (node == null) {
					Tools.ly.alert("请选择字典类型");
					return;
				}
				
				_form.find("[name = 'type']").val(node.id);
				_form.find("[name = 'typeName']").val(node.name);
				
				// 查询获取当前的上级字典是否为当前类型，如果不是则清除
				let parentDicCode = $.trim(_form.find("[name = 'parentCode']").val());
				if (!$op.isEmpty(parentDicCode)) {
					let parentDic = Dictionary.getById(parentDicCode);
					if (parentDic.type != node.id) {
						_form.find("[name = 'parentCode']").val("");
						_form.find("[name = 'parentName']").val("");
					}
				}
				
				layer.close(index);
			}
		});
	});
	
	$("form").on("click", ".select-dic-btn", function() {
		let _form = $("#data-form");
		// 选择上级字典，并将上级字典的类型赋值给当前字典数据
		// 如果上级字典没有类型，则将当前字典数据的置空
		Tools.ly.modal({
			title: "数据字典列表",
			area: ['70%', '70%'],
			el: $("#select-dic"),
			success: function(layero, index) {
				Dictionary.initTree({
					id: 'select-dic-dt-tree',
				});
			},
			yes: function(index, layero) {
				let node = $zt.getSelected('select-dic-dt-tree');
				if (node == null) {
					Tools.ly.alert("请选择上级数据字典");
					return;
				}
				_form.find("[name = 'parentCode']").val(node.id);
				_form.find("[name = 'parentName']").val(node.name);
				
				let parentDic = Dictionary.getById(node.id);
				if (!$op.isEmpty(parentDic.type)) {
					let parentType = DictionaryType.getById(parentDic.type);
					if (parentType != null) {
						_form.find("[name = 'type']").val(parentType.code);
						_form.find("[name = 'typeName']").val(parentType.name);
					}
				} else {
					_form.find("[name = 'type']").val("");
					_form.find("[name = 'typeName']").val("");
				}
				
				layer.close(index);
			}
		});
	});
	
}