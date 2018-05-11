let udTable = null;

$(function() {
	
	$loading.load();
	initTree();
	initBtns();
	initUdTable(null);
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
			$ly.alert("请选择部门");
			return;
		}
		open(node.id);
	});
	// 删除
	$(".delete-btn").on("click", function() {
		let array = $dt.getSelected("udTable");
		if (array == null || array.length == 0) {
			$ly.alert("请选择删除的记录");
			return;
		}
		deletes(array);
	});
}

// 打开表单
function open(deptCode) {
	let dept = Dept.getById(deptCode);
	$ly.open({
		title: "分配用户：" + dept.name,
		url: '/router/ud/form',
		before: function (index, $form)  {
			$form.find("[name='deptCode']").val(dept.code);
			let datas = null;
			$ajax.get({
				url: "/api/ud/getUserList/" + deptCode,
				data: {},
				success: function(resp) {
					datas = resp.datas;
				}
			});
			initInTable($form, datas);
			initOutTable($form, datas);
		},
		confirm: function (index, $form)  {
			return get($form, deptCode);
		}
	});
}

function initInTable($form, datas) {
	$ajax.get({
		url: "/api/user/getList",
		data: {},
		success: function(resp) {
			if (resp.success && resp.datas != null) {
				let tbody = $form.find('#inTable tbody');
				let trs = '';
				// 是否要比较已加入的用户
				let flag = datas == null || datas.length == 0 ? false : true;
				for (let i = 0; i < resp.datas.length; i++) {
					let next = true;
					let data = resp.datas[i];
					if (flag) {
						for (let j = 0; j < datas.length; j++ ) {
							if (datas[j].username == data.username) {
								next = false;
								break;
							}
						}
					}
					if (next) {
						let tr = '';
						tr += '<tr data-id="'+ data.username +'" data-name="'+ data.name +'" data-sort="'+ data.sort +'">';
						tr += '	<td><input type="checkbox" class="minimal" value="'+ data.username +'"></td>';
						tr += '	<td>'+ data.sort +'</td>';
						tr += '	<td>'+ data.name +'</td>';
						tr += '</tr>';
						trs += tr;
					}
				}
				tbody.append(trs);
				$form.find('input[type=checkbox].minimal').iCheck({
					checkboxClass: 'icheckbox_minimal-orange',
				});
			}
		}
	});
}

function initOutTable($form, datas) {
	if (datas !== null && datas.length > 0) {
		let tbody = $form.find('#outTable tbody');
		let trs = '';
		for (let i = 0; i < datas.length; i++) {
			let data = datas[i];
			let tr = '';
			tr += '<tr data-id="'+ data.username +'" data-name="'+ data.name +'" data-sort="'+ data.sort +'">';
			tr += '	<td><input type="checkbox" class="minimal" value="'+ data.username +'"></td>';
			tr += '	<td>'+ data.sort +'</td>';
			tr += '	<td>'+ data.name +'</td>';
			tr += '</tr>';
			trs += tr;
		}
		tbody.append(trs);
		$form.find('input[type=checkbox].minimal').iCheck({
			checkboxClass: 'icheckbox_minimal-orange',
		});
	}
}

// 删除
function deletes(array) {
	$ly.confirm({
		title: "确定删除?",
		okFn: function() {
			$ajax.post({
				url: "/api/ud/remove/" + array.join(','),
				data: {},
				success: function(resp) {
					$ly.msg(resp.msg);
					if (resp.success) {
						let node = $zt.getSelected("dtTree");
						let deptCode = node == null ? null : node.id;
						initUdTable(deptCode);
					}
				}
			});
		}
	});
}

// 收集表单数据
function get($form, deptCode) {
	let users = [];
	$form.find('#outTable').find("tbody>tr").each(function(idx, ele) {
		let value = $(ele).find("td:eq(0)").find("input[type='checkbox']").val();
		if(Tools.op.isNotEmpty(value)) {
			users.push(value);
		}
	});
	$ajax.json({
		url: '/api/ud/save',
		data: {
			deptCode: deptCode,
			users: users,
		},
		success: function(resp) {
			$ly.msg(resp.msg);
			if (resp.success) {
				let node = $zt.getSelected('dtTree');
				initUdTable(node.id);
			}
		}
	});
	return true;
}


function initTree() {
	Dept.initTree({
		id: 'dtTree',
		callback: {
			click: function(event, treeId, treeNode) {
				initUdTable(treeNode.id);
			}
		}
	});
}

function initUdTable(deptCode) {
	udTable = $dt.load({
		el: $("#udTable"),
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

