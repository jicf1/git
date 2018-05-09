let Role =  {
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
			url: "/api/role/getTreeDatas",
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
		
	},
	initTable: function(settings) {
		let table = $dt.load({
			el: $("#" + settings.id),
			url: "/api/role/getTableDatas",
			data: settings.data,
			columns: [
				{
					"targets" : [ 0 ],
					"sWidth" : "1%",
					"data" : "code",
					"className" : "npt-content-center",
					"name" : "checkbox",
					"orderable" : false,
					"searchable" : false,
					"bSortable" : false,
					"render" : function(data, type, full, meta){
						let str = '<input type="checkbox" class="minimal" value="'+data+'">';
						str += "<script>";
						str +=	"$('input[type=checkbox].minimal').iCheck({";
						str +=	"	checkboxClass: 'icheckbox_minimal-orange',";
						str +=	"});";
						str += "</script>";
						return str;
					}
				},
				{
					"data" : "sort",
				},
				{
					"data" : "name",
				},
				{
					"data" : "code",
				},
				{
					"data" : "description",
				},
			]
		});
		return table;
	},
	/**
	 * 获取列表
	 */
	getList: function() {
		let list = null;
		$ajax.get({
			url: "/api/role/getList",
			data: {},
			success: function(resp) {
				if (resp.success) {
					list = resp.datas;
				} else {
					$ly.alert(resp.msg);
				}
			}
		});
		return list;
	},
	/**
	 * 根据主键查询对象
	 */
	getById: function(id) {
		let model = null;
		$ajax.get({
			url: "/api/role/getById/" + id,
			data: {},
			success: function(resp) {
				if (resp.success) {
					model = resp.data;
				} else {
					$ly.alert(resp.msg);
				}
			},
			error: function(ex) {
				$ly.alert("请求失败");
			}
		});
		return model;
	}
}