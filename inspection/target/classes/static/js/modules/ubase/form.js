$(function() {
	
	initUserType();
	
});

function initUserType(){
	let userTypeList = UserType.getList();
	if (userTypeList != null) {
		let html = '<option value="">默认</option>';
		for (let i in userTypeList) {
			let userType = userTypeList[i];
			html += '<option value="'+ userType.id +'"> '+ userType.name +'</option>';
		}
		$("[name = 'type']").append(html);
	}
	
	$('input[type="checkbox"].minimal, input[type="radio"].minimal').iCheck({
		checkboxClass: 'icheckbox_minimal-orange',
		radioClass: 'iradio_minimal-orange'
	});
	$(".checkbox-inline, .radio-inline").css("padding-left", "0");
}

