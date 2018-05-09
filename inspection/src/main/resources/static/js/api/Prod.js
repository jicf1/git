let Prod = {
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
			url: "/api/prod/store/getTree",
			data: {},
			success: function(resp) {
				if (resp.success) {
					zNodes = resp.datas;
			  	} else {
			  		$ly.alert(resp.msg);
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
		
	},
	/**
	 * 根据主键查询对象
	 */
	getById: function(id) {
		let model = null;
		$ajax.get({
			url: "/api/prod/store/getById/" + id,
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
	}
}