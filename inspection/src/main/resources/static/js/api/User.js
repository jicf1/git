let User = {
	/**
	 * 根据主键查询对象
	 */
	getById: function(id) {
		let model = null;
		$ajax.get({
			url: "/api/user/getById/" + id,
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
	 * 获取用户列表
	 */
	initTable: function(settings) {
		let table = $dt.load({
			el: $("#" + settings.id),
			url: "/api/user/getTableDatas",
			data: settings.data,
			columns: [
				{
					"targets" : [ 0 ],
					"sWidth" : "1%",
					"data" : "username",
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
					"data" : "type",
				},
			]
		});
		return table;
	},
	/**
	 * 获取用户部门职务关系集合
	 */
	getUddRelations: function(username) {
		let array = null;
		$ajax.get({
			url: "/api/udd/getRelations/" + username,
			data: {},
			success: function(resp) {
				if (resp.success) {
					array = resp.datas;
				} else {
					$ly.alert(resp.msg);
				}
			}
		});
		return array;
	},
	/**
	 * 获取用户部门角色关系集合
	 */
	getUdrRelations: function(username) {
		let array = null;
		$ajax.get({
			url: "/api/udr/getRelations/" + username,
			data: {},
			success: function(resp) {
				if (resp.success) {
					array = resp.datas;
				} else {
					$ly.alert(resp.msg);
				}
			}
		});
		return array;
	}
	
}