var contactTable = null;
$(function() {
	// 条件查询
	$(".contact-condition-btn").on("click", function() {
		$dt.reload(contactTable);
	});
})
let ContactList = {
	initTable: function (customerId) {
		contactTable = $dt.load({
			el : '#select-contact-data-table',
			url : '/api/crm/getContactListByCustomerId/' + customerId,
		 	data: function(map) {
				let _form = $(".contact-conditions-form");
				map['name'] = $.trim(_form.find("[name = 'name']").val());
				map['job'] = $.trim(_form.find("[name = 'job']").val());
				map['phone'] = $.trim(_form.find("[name = 'phone']").val());
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
					"data" : "job"
				},
				{
					"data" : "phone"
				},
			]
		})
		$('#select-contact').css('display', 'block');
	}
}