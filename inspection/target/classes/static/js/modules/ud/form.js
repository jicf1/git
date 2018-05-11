$(function() {
	
	initBtns();
	
});

function initBtns () {
	// 加入
	$('a.in-btn').on('click', function() {
		int();
	});
	// 移除
	$('a.out-btn').on('click', function() {
		out();
	});
}

function int() {
	$("#inTable").find("tbody>tr").each(function(idx, ele) {
		let _this = $(this);
		let value = _this.find("td:eq(0)").find("input[type='checkbox']:checked").val();
		if(Tools.op.isNotEmpty(value)) {
			let data = {};
			data.username = value;
			data.name = _this.attr('data-name');
			data.sort =  _this.attr('data-sort');
			let html = '';
			html += '<tr data-id="'+ data.username +'" data-name="'+ data.name +'" data-sort="'+ data.sort +'">';
			html += '	<td><input type="checkbox" class="minimal" value="'+ data.username +'"></td>';
			html += '	<td>'+ data.sort +'</td>';
			html += '	<td>'+ data.name +'</td>';
			html += '</tr>';
			$("#outTable tbody").append(html);
			_this.remove();
			$('input[type=checkbox][value='+ value +'].minimal').iCheck({
				checkboxClass: 'icheckbox_minimal-orange',
			});
		}
	});
}

function out() {
	$("#outTable").find("tbody>tr").each(function(idx, ele) {
		let _this = $(this);
		let value = _this.find("td:eq(0)").find("input[type='checkbox']:checked").val();
		if(Tools.op.isNotEmpty(value)) {
			let data = {};
			data.username = value;
			data.name = _this.attr('data-name');
			data.sort =  _this.attr('data-sort');
			let html = '';
			html += '<tr data-id="'+ data.username +'" data-name="'+ data.name +'" data-sort="'+ data.sort +'">';
			html += '	<td><input type="checkbox" class="minimal" value="'+ data.username +'"></td>';
			html += '	<td>'+ data.sort +'</td>';
			html += '	<td>'+ data.name +'</td>';
			html += '</tr>';
			$("#inTable tbody").append(html);
			_this.remove();
			$('input[type=checkbox][value='+ value +'].minimal').iCheck({
				checkboxClass: 'icheckbox_minimal-orange',
			});
		}
	});
}



