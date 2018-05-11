let userDeptTable = null;
let userTable = null;

$(function() {
	initRoleTree();
	initBtns();
//	initUserDeptTable(null);
});

function initBtns () {
	$(".relation-tabs").on("click", ".nav-tabs a", function() {
		showOrHideBtns($(this).attr("href").replace("#", ""));
	});
	$("#user-dept-table").on("click", ".deleteUdBtn", function() {
		let uid = $(this).attr("data-id");
		$ly.confirm({
			title: "确定删除?",
			okFn: function() {
				$ajax.json({
					url: "/api/udr/remove/" + uid,
					data: {},
					success: function(resp) {
						$ly.msg(resp.msg);
						if (resp.success) {
							$dt.reload(userDeptTable);
						}
					}
				});
			}
		});
	});
	
	$("#user-table").on("click", ".deleteUserBtn", function() {
		let uid = $(this).attr("data-id");
		$ly.confirm({
			title: "确定删除?",
			okFn: function() {
				$ajax.json({
					url: "/api/ur/remove/" + uid,
					data: {},
					success: function(resp) {
						$ly.msg(resp.msg);
						if (resp.success) {
							$dt.reload(userTable);
						}
					}
				});
			}
		});
	});
	
	// 分配用户部门
	$(".allot-user-dept-btn").on("click", function() {
		Tools.ly.modal({
			title: "分配用户部门",
			el: $("#select-user-dept"),
			area: ['70%', '70%'],
			success: function() {
				Dept.initTree({
					id: 'select-dept-tree',
					callback: {
						click: function(event, treeId, treeNode) {
							initSelectTable(treeNode.id);
						}
					}
				});
				initSelectTable(null);
			},
			yes: function(index, layero) {
				// 获取选中的用户
				let array = $dt.getSelected('select-user-dept-dt-table');
				if (array == null || array.length == 0) {
					$ly.alert("请选择用户");
					return;
				}
				// 当前角色
				let node = $zt.getSelected('role-tree');
				if (node == null) {
					$ly.alert("请选择一个角色");
					return;
				}
				let roleCode = node.id;
				
				let objs = [];
				for (let i = 0; i < array.length; i++) {
					objs.push({
						udId: array[i],
						roleCode: roleCode
					});
				}
				
				// 存储用户角色关系
				$ajax.json({
					url: '/api/udr/save',
					data: {
						array: objs
					},
					success: function(resp) {
						$ly.msg(resp.msg);
						$dt.reload(userDeptTable);
					}
				});
				// 关闭
				layer.closeAll();
			}
		});
	});
	
	// 分配用户
	$(".allot-user-btn").on("click", function() {
		Tools.ly.modal({
			title: "分配用户",
			el: $("#select-user"),
			area: ['70%', '70%'],
			success: function() {
				initSelectTable(null);
			},
			yes: function(index, layero) {
				// 获取选中的用户
				let array = $dt.getSelected('select-user-dt-table');
				if (array == null || array.length == 0) {
					$ly.alert("请选择用户");
					return;
				}
				// 当前角色
				let node = $zt.getSelected('role-tree');
				if (node == null) {
					$ly.alert("请选择一个角色");
					return;
				}
				let roleCode = node.id;
				
				let objs = [];
				for (let i = 0; i < array.length; i++) {
					objs.push({
						username: array[i],
						roleCode: roleCode
					});
				}
				
				// 存储用户角色关系
				$ajax.json({
					url: '/api/ur/save',
					data: {
						array: objs
					},
					success: function(resp) {
						$ly.msg(resp.msg);
						$dt.reload(userTable);
					}
				});
				// 关闭
				layer.closeAll();
			}
		});
	});
	
	// 保存权限
	$(".allot-privilege-btn").on("click", function() {
		// 获取角色
		let node = $zt.getSelected('role-tree');
		if (node == null) {
			$ly.alert("请选择一个角色");
		}
		let roleCode = node.id;
		
		// 获取勾选的权限信息
		let datas = [];
		let nodes = $zt.getChecked(activeTabTree());
		if (nodes != null) {
			for (let i in nodes) {
				datas.push(nodes[i].id);
			}
		}
		save({
			privileges: datas
		}, activeType(), roleCode);
	});
}

function initRoleTree() {
	Role.initTree({
		id: 'role-tree',
		callback: {
			click: function(event, treeId, treeNode) {
				let roleCode = treeNode.id;
				// 加载角色用户部门关系信息
				userDeptTable == null ? initUserDeptTable(roleCode) : $dt.reload(userDeptTable);
				// 加载角色用户部门关系信息
				userTable == null ? initUserTable(roleCode) : $dt.reload(userTable);
				// 加载角色权限关系信息
				initPrivilegeTree('MENU', roleCode);
				initPrivilegeTree('BUTTON', roleCode);
				// 加载按钮
				showOrHideBtns(activeTabId());
			}
		}
	});
}

function showOrHideBtns(tabId) {
	// 没有选中角色,按钮全部不显示
	let node = $zt.getSelected('role-tree');
	if (node == null) {
		$("a.allot-user-dept-btn").css("display", "none");
		$("a.allot-user-btn").css("display", "none");
		$("a.allot-privilege-btn").css("display", "none");
	}
	// 选中了角色, 获取选中tab项, user tab显示分配用户, privilege tab显示保存权限
	else {
		if (tabId == 'user-dept-list') {
			$("a.allot-user-dept-btn").css("display", "block");
			$("a.allot-user-btn").css("display", "none");
			$("a.allot-privilege-btn").css("display", "none");
		} else if (tabId == 'user-list') {
			$("a.allot-user-dept-btn").css("display", "none");
			$("a.allot-user-btn").css("display", "block");
			$("a.allot-privilege-btn").css("display", "none");
		} else if (tabId == 'privilege-menu' || tabId == 'privilege-button') {
			$("a.allot-user-dept-btn").css("display", "none");
			$("a.allot-user-btn").css("display", "none");
			$("a.allot-privilege-btn").css("display", "block");
		}
	}
	
}
function initUserDeptTable(roleCode) {
	userDeptTable = $dt.load({
		el: $("#user-dept-table"),
		url: "/api/udr/getTableDatas",
		data: function(map) {
			map['roleCode'] = $zt.getSelected('role-tree') == null ? null : $zt.getSelected('role-tree').id;
		},
		columns: [
			{
				"targets" : [ 0 ],
				"sWidth" : "1%",
				"data" : "userId",
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
				"data" : "userName"
			},
			{
				"data" : "deptName"
			},
			{
				"data" : "id",
				"render" : function(data, type, full, meta){
					let str = '<a class="deleteUdBtn" data-id="'+ data +'">删除</a>';
					return str;
				}
			},
		]
	});
}

function initUserTable(roleCode) {
	userTable = $dt.load({
		el: $("#user-table"),
		url: "/api/ur/getTableDatas",
		data: function(map) {
			map['roleCode'] = $zt.getSelected('role-tree') == null ? null : $zt.getSelected('role-tree').id;
		},
		columns: [
			{
				"targets" : [ 0 ],
				"sWidth" : "1%",
				"data" : "userId",
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
				"data" : "userName"
			},
			{
				"data" : "id",
				"render" : function(data, type, full, meta){
					let str = '<a class="deleteUserBtn" data-id="'+ data +'">删除</a>';
					return str;
				}
			},
			]
	});
}

function initPrivilegeTree(type, roleCode) {
	let id = '';
	if (type == 'MENU') id = 'menu-tree';
	if (type == 'BUTTON') id = 'button-tree';
	initRolePrivilegeTree({
		id: id,
		type: type,
		roleCode: roleCode,
		callback: {
			click: function(event, treeId, treeNode) {
				
			}
		}
	});
}

function initRolePrivilegeTree(settings) {
	let setting = {    
		data: {
			simpleData:{
				enable: true,
            	idKey: "id",
              	pIdKey: "pid",
              	rootPId: 0
			}
		},
		check: {
			enable: true,
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
		url: "/api/permission/getTreeDatas/" + settings.type + "/" + settings.roleCode,
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
	
}

function save(data, type, roleCode) {
	$ajax.json({
		url: "/api/permission/save/"+ type +"/" + roleCode,
		data: data,
		success: function(resp) {
			$ly.msg(resp.msg);
		}
	});
}

function activeTabId() {
	return $(".relation-tabs .tab-pane.active").attr("id");
}

function activeType() {
	return $(".relation-tabs .tab-pane.active").attr('data-type');
}

function activeTabTree() {
	return $(".relation-tabs .tab-pane.active ul.ztree").attr("id");
}

function initSelectTable(deptCode){
	 $dt.load({
		el: $("#select-user-dept-dt-table"),
		url: "/api/ud/getTables",
		data: function(map) {
			map['deptCode'] = deptCode;
		},
		columns: [
			{
				"targets" : [ 0 ],
				"sWidth" : "1%",
				"data" : "id",
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
				"data" : "name"
			},
			{
				"data" : "deptName"
			},
		]
	});
}

