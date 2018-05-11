var table = null;
$(function() {
	$loading.load();
	initTree();
	initBtns();
	$loading.close();
});

function initTree() {
	Dept.initTree({
		id : 'dtTree',
		callback : {
			click : treeNodeClick
		}
	})
}

function treeNodeClick(event, treeId, treeNode) {
	$(".table-box").css("display", "inline-block");
	$(".deptName").text(treeNode.name);
	
	// 加载当前部门分配的用户列表
	table = $dt.load({
		el: $("#dtTable"),
		url: "/api/reportAuth/getDatatables?deptcode=" + treeNode.id,
		data: function(map) {
			
		},
		columns: [
			{
				"data" : "userName"
			},
			{
				"data" : "authId",
				"render" : function(data, type, full, meta){
					let str = '<a class="dt-link remove-btn" data-id="'+ data +'">删除</a>';
					return str;
				}
			},
		]
	})
}

function initBtns() {
	
	// 点击调用添加方法
	$(".addUser").on("click", function() {
		var node = $zt.getSelected('dtTree');
		var deptcode = node.id;
		
		// 打开用户列表面板
		Tools.ly.modal({
			title: "用户列表",
			area: ['85%', '85%'],
			el: $("#select-user"),
			success: function() {
				UserList.initTable();
			},
			yes: function(index) {
				var userIdArray = $dt.getSelected('select-user-dt-table');
				if (userIdArray.length == 0) {
					$ly.alert("请选择用户");
					return;
				}
				var usernames = userIdArray.join(",");
				$ajax.post({
					url : '/api/reportAuth/add',
					data : {
						deptcode : deptcode,
						usernames : usernames
					},
					success : function(resp) {
						if (resp.success) {
							$ly.msg("添加成功");
							$dt.reload(table);
						} else {
							$ly.alert("添加失败");
							console.log(resp.errmsg);
						}
					}
				})
				layer.close(index);
			}
		})
	})
	
	$("#dtTable").on("click", ".remove-btn", function() {
		var authId = $(this).attr("data-id");
		$ly.confirm({
			title : "确认删除该条记录？",
			okFn : function() {
				$ajax.post({
					url : '/api/reportAuth/remove/' + authId,
					success : function(resp) {
						if (resp.success) {
							$ly.msg("删除成功!");
							$dt.reload(table);
						} else {
							$ly.alert("删除失败");
							console.log(resp.errmsg);
						}
					}
				})
			}
		})
	})
	
}

