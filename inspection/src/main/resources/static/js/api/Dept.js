let Dept = {
	/**
	 * 根据主键查询对象
	 */
	getById: function(id) {
		let model = null;
		Tools.ajax.get({
			url: Tools.getRootPath() + "/api/dept/getById/" + id,
			data: {},
			success: function(result) {
				if (result.success) {
					model = result.data;
				} else {
					Tools.ly.alert(result.msg);
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
		Tools.ajax.get({
			url: Tools.getRootPath()+"/api/dept/getTree",
			data: {},
			success: function(result) {
				if (result.success) {
					zNodes = result.datas;
			  	} else {
			  		Tools.ly.alert(result.msg);
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