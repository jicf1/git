$(function() {
	$loading.load();
	initTree();
	initBtns();
	$loading.close();
});

function initTree() {
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
		callback: {
			onClick: zTreeOnClick
		}
	}
	
	// 获取nodes
	let zNodes = [];
	Tools.ajax.get({
		url: Tools.getRootPath() + "/api/prod/store/getTree",
		data: {},
		success: function(resp) {
			if (resp.success) {
				if (resp.datas != null) {
					for (let idx in resp.datas) {
						let data = resp.datas[idx];
						if (data.param.type === "TYPE") {
							data["icon"] = $root() + "/img/p1.png";
						} else if (data.param.type === "PROD") {
							data["icon"] = $root() + "/img/p2.png";
						} else if (data.param.type === "SELL") {
							data["icon"] = $root() + "/img/p3.png";
						} else {
							data["icon"] = $root() + "/img/p4.png";
						}
					}
					zNodes = resp.datas;
				}
			} else {
				$ly.alert(resp.msg);
			}
		}
	})
	
	// 点击事件
	function zTreeOnClick(event, treeId, treeNode) {
		$("form").css("display", "none");
		if (treeNode.param.type === "PROD") {
			showProps(treeNode.param);
		}
	}
	$.fn.zTree.init($("#dtTree"), setting, zNodes);
	var treeObj = $.fn.zTree.getZTreeObj("dtTree");
	treeObj.expandAll(true); 
	treeObj.selectNode(treeObj.getNodeByParam("id", "0", null));
	treeObj.setting.callback.onClick(null, treeObj.setting.treeId, treeObj.getNodeByParam("id", "0", null));
}

function initBtns() {
	// 新建库
	$(".create-store-btn").on("click", function() {
		let node = $zt.getSelected('dtTree');
		$("form").css("display", "none");
		$("#store").find("[name='id']").val("");
		$("#store").find("[name='name']").val("");
		$("#store").find("[name='pid']").val(node.id);
		$("#store").find("[name='storeLevel']").val(node.level + 1);
		
		if (node.param.type == null) {
			$("#store").find("[name = 'type'] option").css("display", "block");
			$("#store").find("[name = 'type'] [value='PROD']").css("display", "none");
			$("#store").find("[name = 'type'] [value='SELL']").css("display", "none");
			$("#store").find("[name = 'type'] [value='TYPE']").prop("selected", true);
		} else if (node.param.type === "TYPE") {
			$("#store").find("[name = 'type'] option").css("display", "block");
			$("#store").find("[name = 'type'] [value='SELL']").css("display", "none");
			$("#store").find("[name = 'type'] [value='TYPE']").prop("selected", true);
		} else if (node.param.type === "PROD") {
			$("#store").find("[name = 'type'] option").css("display", "block");
			$("#store").find("[name = 'type'] [value='TYPE']").css("display", "none");
			$("#store").find("[name = 'type'] [value='PROD']").css("display", "none");
			$("#store").find("[name = 'type'] [value='SELL']").prop("selected", true);
		} else if (node.param.type === "SELL") {
			$ly.alert("当前数据为可销售产品，无法新增");
			return;
		}
		
		$("#store").css("display", "block");
	})
	
	// 更新库
	$(".update-store-btn").on("click", function() {
		let node = $zt.getSelected('dtTree');
		if (node == null || node.id == "0") {
			$ly.alert("请选择一条记录");
			return;
		}
		$("form").css("display", "none");
		$("#store").find("[name='name']").val("");
		$("#store").find("[name = 'type'] [value='TYPE']").prop("selected", true);
		$ajax.get({
			url : '/api/prod/store/getById/' + node.id,
			data : {},
			success : function(resp) {
				if (resp.data != null) {
					let model = resp.data;
					$("#store").find("[name='id']").val(model.id);
					$("#store").find("[name='name']").val(model.name);
					$("#store").find("[name='pid']").val(model.pid);
					$("#store").find("[name='storeLevel']").val(model.storeLevel);
					
					let parent = getParent(model.pid);
					if (parent == null) {
						$("#store").find("[name = 'type'] option").css("display", "block");
						$("#store").find("[name = 'type'] [value='PROD']").css("display", "none");
						$("#store").find("[name = 'type'] [value='SELL']").css("display", "none");
					} else if (parent.type === "TYPE") {
						$("#store").find("[name = 'type'] option").css("display", "block");
						$("#store").find("[name = 'type'] [value='SELL']").css("display", "none");
					} else if (parent.type === "PROD") {
						$("#store").find("[name = 'type'] option").css("display", "block");
						$("#store").find("[name = 'type'] [value='TYPE']").css("display", "none");
						$("#store").find("[name = 'type'] [value='PROD']").css("display", "none");
					} else if (parent.type === "SELL") {
						$("#store").find("[name = 'type'] option").css("display", "block");
						$("#store").find("[name = 'type'] [value='TYPE']").css("display", "none");
						$("#store").find("[name = 'type'] [value='PROD']").css("display", "none");
					}
					
					$("#store").find("[name = 'type'] [value='"+ model.type +"']").prop("selected", true);
				}
			}
		})
		$("#store").css("display", "block");
	})
	
	// 保存库
	$(".save-store-btn").on("click", function() {
		// 校验
		let id = $.trim($("#store").find("[name = 'id']").val());
		if ($check.isNull(id)) {
			id = "0";
		}
		let name = $.trim($("#store").find("[name = 'name']").val());
		if ($check.isNull(name)) {
			$ly.alert("请填写名称");
			return;
		}
		let pid = $.trim($("#store").find("[name = 'pid']").val());
		let storeLevel = $.trim($("#store").find("[name = 'storeLevel']").val());
		let type = $.trim($("#store").find("[name = 'type']").find("option:selected").val());
		
		// 保存
		$ajax.post({
			url: "/api/prod/store/save",
			data: {
				id : id,
				name : name,
				pid : pid,
				storeLevel : storeLevel,
				type: type
			},
			success: function(resp) {
				$ly.msg(resp.msg);
				initTree();
				$("#store").css("display", "none");
				if (resp.data != null) {
					var treeObj = $.fn.zTree.getZTreeObj("dtTree");
					treeObj.expandAll(true);
					treeObj.selectNode(treeObj.getNodeByParam("id", resp.data.id, null));
					treeObj.setting.callback.onClick(null, treeObj.setting.treeId, treeObj.getNodeByParam("id", resp.data.id, null));
				}
			}
		})
	})
	$(".delete-store-btn").on("click", function() {
		let node = $zt.getSelected('dtTree');
		if (node == null || node.id === "0") {
			$ly.alert("请选择删除的记录");
			return;
		}
		$ly.confirm({
			title: "子目录将全部删除，确定删除？",
			okFn: function() {
				Tools.ajax.post({
					url: Tools.getRootPath() + "/api/prod/store/delete/" + node.id,
					data: {},
					success: function(resp) {
						if (resp.success) {
							$ly.msg(resp.msg);
							initTree();
						} else {
							$ly.alert(resp.msg);
						}
					}
				})
			}
		})
	})
	
	// 保存产品属性
	$(".save-report-btn").on("click", function() {
		$loading.load();
		// 校验
		let id = $.trim($("#report").find("[name = 'id']").val());
		if ($check.isNull(id)) {
			id = "0";
		}
		let name = $.trim($("#report").find("[name = 'name']").val());
		let chemName = $.trim($("#report").find("[name = 'chemName']").val());
		let enName = $.trim($("#report").find("[name = 'enName']").val());
		let cnName = $.trim($("#report").find("[name = 'cnName']").val());
		let cas = $.trim($("#report").find("[name = 'cas']").val());
		
		// 保存
		$ajax.post({
			url: "/api/prod/store/updateProdProps",
			data: {
				id : id,
				name : name,
				chemName : chemName,
				enName : enName,
				cnName : cnName,
				cas : cas
			},
			success: function(resp) {
				$ly.msg(resp.msg);
				$("#store").css("display", "none");
			}
		})
		$loading.close();
	})
}

function showProps(obj) {
	$loading.load();
	let node = $zt.getSelected('dtTree');
	if (node == null || node.id === "0") {
		$ly.alert("请选择一条记录");
		return;
	}
	$("form").css("display", "none");
	
	// 加载产品数据
	$ajax.get({
		url : '/api/prod/store/getById/' + obj.id,
		success : function (resp) {
			let model = resp.data;
			$("#report").find("[name='id']").val(model.id);
			$("#report").find("[name='chemName']").val(model.chemName);
			$("#report").find("[name='enName']").val(model.enName);
			$("#report").find("[name='cnName']").val(model.cnName);
			$("#report").find("[name='name']").val(model.name);
			$("#report").find("[name='cas']").val(model.cas);
			$("#report").css("display", "block");
		}
	})
	
	$loading.close();
}

function getParent(id) {
	let model = null;
	$ajax.get({
		url : '/api/prod/store/getById/' + id,
		success : function (resp) {
			model = resp.data;		
		}
	})
	return model;
}

