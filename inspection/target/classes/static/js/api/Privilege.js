let Privilege = {
	/**
	 * 根据主键查询对象
	 */
	getById: function(id) {
		let model = null;
		$ajax.get({
			url: "/api/privilege/getById/" + id,
			data: {},
			success: function(resp) {
				if (resp.success) {
					model = resp.data;
				} else {
					$ly.alert(resp.msg);
				}
			}
		});
		return model;
	},
	/**
	 * 初始化数据树
	 * settings: {
	 * 	id
	 * 	callback: {
	 * 		click
	 * 	}
	 * 	expand
	 * }
	 */
	initTree: function(settings) {
		// setting
		let setting = {    
			data: {
				simpleData:{
					enable: true,
	            	idKey: "id",
	              	pIdKey: "pid",
	              	rootPId: 0
				}
			},
			view: {
				showIcon: false
	    	},
	    	callback: {
	    		onClick: zTreeOnClick
	     	}
		};
		
		// 获取nodes
		let zNodes = [];
		$ajax.get({
			url: "/api/privilege/getTreeDatas/" + settings.type,
			data: {},
			success: function(result) {
				if (result.success) {
					zNodes = result.datas;
			  	} else {
			  		$ly.alert(result.msg);
			  	}
			}
		});
		
		// 点击事件
		function zTreeOnClick(event, treeId, treeNode) {
			if (settings.callback) {
				if (settings.callback.click) {
					settings.callback.click(event, treeId, treeNode);
				}
			}
		};
		
		$.fn.zTree.init($("#" + settings.id), setting, zNodes);
		var treeObj = $.fn.zTree.getZTreeObj(settings.id); 
		if (!settings.expand) {
			treeObj.expandAll(true); 
		}
		
	}
}