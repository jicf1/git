let selectUserTable = null;
$(function () {
	$("#select-user .condition-btn").on("click", function() {
		$dt.reload(selectUserTable);
	})
})

let UserList = {
	initTable: function () {
		selectUserTable = $dt.load({
			el: $("#select-user-dt-table"),
			url: "/api/user/getTableDatas",
			data: function(map){
				let _form = $("#select-user .conditions-form");
				map['name'] = $.trim(_form.find("[name = 'name']").val());
				map['sort'] = $.trim(_form.find("[name = 'sort']").val());
			},
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
			]
		})
	}
}