let type = "";
let cron = "";
let reportRole = {
	"WEEK" : "业务员",
	"MONTH" : "产品经理",
	"HALF_YEAR" : "产品经理"
}
$(function() {
	
	initTree();
	initEvent();
	initBtns();
	
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
			view: {
				showIcon: false
		    },
		    callback: {
		    	onClick: zTreeOnClick
		    }
	}
	
	// 获取nodes
	let zNodes = [
		{
			id: 'WEEK',
			name: "周报告"
		},
		{
			id: 'MONTH',
			name: "月报告"
		},
		{
			id: 'HALF_YEAR',
			name: "半年报告"
		}
	]
	
	// 点击事件
	function zTreeOnClick(event, treeId, treeNode) {
		type = treeNode.id;
		$("form").css("display", "none");
		$("#" + type).css("display", "block");
		initial(type);
		$(".save-btn").css("display", "inline-block");
		$(".delete-btn").css("display", "inline-block");
	}
	
	$.fn.zTree.init($("#dtTree"), setting, zNodes);
	var treeObj = $.fn.zTree.getZTreeObj("dtTree"); 
	treeObj.expandAll(true); 
	treeObj.selectNode(treeObj.getNodeByParam("id", "WEEK",null));
	treeObj.setting.callback.onClick(null, treeObj.setting.treeId, treeObj.getNodeByParam("id", "WEEK", null));
}

function initial(id){
	$("#" + id).find("[name='month']").children().remove();
	$("#" + id).find("[name='week']").children().remove();
	$("#" + id).find("[name='day']").children().remove();
	$("#" + id).find("[name='hour']").children().remove();
	
	var monthHtml = '';
	for (var i = 1; i <= 12; i++) {
		monthHtml += '<option value="'+ i +'">'+ i +'</option>';
	}
	$("#" + id).find("[name='month']").append(monthHtml);
	
	var weekHtml = '';
	weekHtml += '<option value="1">一</option>';
	weekHtml += '<option value="2">二</option>';
	weekHtml += '<option value="3">三</option>';
	weekHtml += '<option value="4">四</option>';
	weekHtml += '<option value="5">五</option>';
	weekHtml += '<option value="6">六</option>';
	weekHtml += '<option value="7">日</option>';
	$("#" + id).find("[name='week']").append(weekHtml);
	
	var dayHtml = '';
	for (var i = 1; i <= 31; i++) {
		dayHtml += '<option value="'+ i +'">'+ i +'</option>';
	}
	$("#" + id).find("[name='day']").append(dayHtml);
	
	var hourHtml = '';
	for (var i = 0; i < 24; i++) {
		hourHtml += '<option value="'+ i +'">'+ i +'</option>';
	}
	$("#" + id).find("[name='hour']").append(hourHtml);
	
	// 读取后台数据渲染
	Tools.ajax.get({
		url: Tools.getRootPath() + "/api/timed/getByName/" + id,
		data: {},
		success: function(resp) {
			if (resp.success) {
				if (resp.data != null) {
					var cronExp = resp.data.cron;
					let arr = cronExp.split(" ");
					if ("WEEK" === resp.data.type) {
						$("#" + id).find("[name='week'] option[value='"+ arr[5] +"']").prop("selected", true);
						$("#" + id).find("[name='hour'] option[value='"+ arr[2] +"']").prop("selected", true);
					} else if ("MONTH" === resp.data.type) {
						$("#" + id).find("[name='day'] option[value='"+ arr[3] +"']").prop("selected", true);
						$("#" + id).find("[name='hour'] option[value='"+ arr[2] +"']").prop("selected", true);
					} else if ("HALF_YEAR" === resp.data.type) {
						$("#" + id).find("[name='month'] option[value='"+ arr[4] +"']").prop("selected", true);
						$("#" + id).find("[name='day'] option[value='"+ arr[3] +"']").prop("selected", true);
						$("#" + id).find("[name='hour'] option[value='"+ arr[2] +"']").prop("selected", true);
					}
				}
			} else {
				$ly.alert(resp.msg);
			}
		}
	})
	
	cal(id);
	
	// 展示当前选择报告的角色属性
	$(".fmt-str").text("授权用户角色：" + reportRole[id]);
}

// 计算cron
function cal(type) {
	var value = "";
	if (type === "WEEK") {
		var cron = "0 0 hour ? * week";
		let week = $("#WEEK").find("[name='week'] option:selected").val();
		let hour = $("#WEEK").find("[name='hour'] option:selected").val();
		cron = cron.replace("week", week);
		cron = cron.replace("hour", hour);
		value = cron;
	} else if (type === "MONTH") {
		var cron = "0 0 hour day * ?";
		let day = $("#MONTH").find("[name='day'] option:selected").val();
		let hour = $("#MONTH").find("[name='hour'] option:selected").val();
		cron = cron.replace("day", day);
		cron = cron.replace("hour", hour);
		value = cron;
	} else if (type === "HALF_YEAR") {
		var cron = "0 0 hour day month ?";
		let month = $("#HALF_YEAR").find("[name='month'] option:selected").val();
		let day = $("#HALF_YEAR").find("[name='day'] option:selected").val();
		let hour = $("#HALF_YEAR").find("[name='hour'] option:selected").val();
		cron = cron.replace("month", month);
		cron = cron.replace("day", day);
		cron = cron.replace("hour", hour);
		value = cron;
	}
	cron = value;
	return value;
}

function initEvent() {
	$("[name = 'month']").on("change", function() {
		let id = $(this).parents("form").attr("id");
		cal(id);
	})
	$("[name = 'week']").on("change", function() {
		let id = $(this).parents("form").attr("id");
		cal(id);
	})
	$("[name = 'day']").on("change", function() {
		let id = $(this).parents("form").attr("id");
		cal(id);
	})
	$("[name = 'hour']").on("change", function() {
		let id = $(this).parents("form").attr("id");
		cal(id);
	})
}

function initBtns() {
	$(".save-btn").on("click", function() {
		Tools.ajax.post({
			url: Tools.getRootPath() + "/api/timed/save",
			data: {
				type: type,
				cron: cal(type)
			},
			success: function(resp) {
				if (resp.success) {
					$ly.alert(resp.msg);
				} else {
					$ly.alert(resp.msg);
				}
			}
		})
	})
	$(".delete-btn").on("click", function() {
		Tools.ajax.post({
			url: Tools.getRootPath() + "/api/timed/delete/" + type,
			data: {},
			success: function(resp) {
				if (resp.success) {
					$ly.alert(resp.msg);
					let ztree = $.fn.zTree.getZTreeObj("dtTree");
					ztree.setting.callback.onClick(null, ztree.setting.treeId, ztree.getNodeByParam("id", type, null));
				} else {
					$ly.alert(resp.msg);
				}
			}
		})
	})
}

