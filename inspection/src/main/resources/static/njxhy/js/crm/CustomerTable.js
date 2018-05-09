var customerTable = null;
$(function() {
	// 条件查询
	$(".customer-condition-btn").on("click", function() {
		$dt.reload(customerTable);
	});
})
let CustomerList = {
	initTable: function () {
		customerTable = $dt.load({
			el : '#select-customer-data-table',
			url : '/api/crm/getList',
		 	data: function(map) {
				let _form = $(".customer-conditions-form");
				map['name'] = $.trim(_form.find("[name = 'name']").val());
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
					"data" : "addr"
				},
				{
					"data" : "mail"
				},
			]
		})
		$('#select-customer').css('display', 'block');
	}
}