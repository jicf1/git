let table = null;

$(function() {
	$loading.load();
	initBtns();
	initTable();
	$loading.close();
});

function initBtns () {
	// 条件查询
	$(".condition-btn").on("click", function() {
		$dt.reload(table);
	});
	// 删除
	$(".delete-btn").on("click", function() {
		let array = $dt.getSelected("dtTable");
		if (array == null || array.length == 0) {
			$ly.alert("请选择删除的记录");
			return;
		}
		deletes(array);
	});
}

function initTable() {
	table = $dt.load({
		el: $("#dtTable"),
		url: "/api/log/getTables",
		data: function(map) {
			let _form = $(".conditions-form");
			map['type'] = $.trim(_form.find("[name = 'type']").val());
			map['level'] = $.trim(_form.find("[name = 'level']").val());
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
				"data" : "log",
				"render" : function(data, type, full, meta){
					let str = data.beginTime;
					return str;
				}
			},
			{
				"data" : "operator",
				"render" : function(data, type, full, meta){
					let str = data.name;
					return str;
				}
			},
			{
				"data" : "log",
				"render" : function(data, type, full, meta){
					let level = data.level;
					let str = data.level;
					if (level == "error") {
						str = "<span class='red'>"+ data.level +"</span>";
					}
					return str;
				}
			},
			{
				"data" : "log",
				"render" : function(data, type, full, meta){
					let str = data.title;
					return str;
				}
			},
			{
				"data" : "log",
				"render" : function(data, type, full, meta){
					let str = data.requestUri;
					return str;
				}
			},
		]
	});
}

//删除
function deletes(array) {
	$ly.confirm({
		title: "确定删除?",
		okFn: function() {
			$ajax.post({
				url: "/api/log/remove/" + array.join(','),
				data: {},
				success: function(resp) {
					$ly.msg(resp.msg);
					if (resp.success) {
						$dt.reload(table);
					}
				}
			});
		}
	});
}




