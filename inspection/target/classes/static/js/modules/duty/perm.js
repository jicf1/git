let userTable = null;

$(function() {
	
	$loading.load();
	initTree();
	initBtns();
	initUserTable(null);
	$loading.close();
	
});

/**
 * 初始化按钮事件
 * 
 * @returns
 */
function initBtns () {
	// 人员维护
	$(".create-btn").on("click", function() {
		let node = $zt.getSelected('dtTree');
		if (node == null) {
			$ly.alert("请选择职务");
			return;
		}
		open(node.id);
	});
	$("#udTable").on("click", ".deleteBtn", function() {
		
		let uid = $(this).attr("data-id");
		let array = [];
		array.push(uid);
		deletes(array);
	});
}

// 打开表单
function open(dutyCode) {
	dutyCode == null ? null : dutyCode;
	Tools.ly.modal({
		title: "分配用户",
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
			
			let objs = [];
			for (let i = 0; i < array.length; i++) {
				objs.push({
					udId: array[i],
					dutyCode: dutyCode
				});
			}
			
			// 存储用户角色关系
			$ajax.json({
				url: '/api/udd/save',
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
}

// 删除
function deletes(array) {
	$ly.confirm({
		title: "确定删除?",
		okFn: function() {
			$ajax.post({
				url: "/api/udd/remove/" + array.join(','),
				data: {},
				success: function(resp) {
					$ly.msg(resp.msg);
					if (resp.success) {
						let node = $zt.getSelected("dtTree");
						let dutyCode = node == null ? null : node.id;
						initUserTable(dutyCode);
					}
				}
			});
		}
	});
}

function initTree() {
	Duty.initTree({
		id: 'dtTree',
		callback: {
			click: function(event, treeId, treeNode) {
				initUserTable(treeNode.id);
			}
		}
	});
}

function initUserTable(dutyCode) {
	userTable = $dt.load({
		el: $("#udTable"),
		url: "/api/udd/getTableDatas",
		data: function(map) {
			map['dutyCode'] = dutyCode == null ? null : dutyCode;
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
					let str = '<a class="deleteBtn" data-id="'+ data +'">删除</a>';
					return str;
				}
			},
		]
	});
}

function initSelectTable(deptCode) {
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

