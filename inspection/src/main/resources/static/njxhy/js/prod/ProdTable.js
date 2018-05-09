var prodTable = null
$(function () {
	// 条件查询
	$(".prod-condition-btn").on("click", function() {
		$dt.reload(prodTable);
	});
})
let ProdList = {
	initTable: function () {
		prodTable = $dt.load({
			el : '#select-prod-data-table',
			url : '/api/prod/store/getProdList',
			data: function(map) {
				let _form = $(".prod-conditions-form");
				map['name'] = $.trim(_form.find("[name = 'name']").val());
				map['chemName'] = $.trim(_form.find("[name = 'chemName']").val());
				map['enName'] = $.trim(_form.find("[name = 'enName']").val());
				map['cnName'] = $.trim(_form.find("[name = 'cnName']").val());
				map['cas'] = $.trim(_form.find("[name = 'cas']").val());
			},
			columns : [
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
					"data" : "chemName"
				},
				{
					"data" : "enName"
				},
				{
					"data" : "cnName"
				},
				{
					"data" : "cas"
				},
			]
		})
		$('#select-customer').css('display', 'block');
	}
}