let Job = {
	/**
	 * 获取列表
	 */
	getList: function() {
		let list = null;
		$ajax.get({
			url: "/api/job/getList",
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
			url: "/api/job/getById/" + id,
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