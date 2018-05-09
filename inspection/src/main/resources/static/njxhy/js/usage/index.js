$(function () {
	initInfo();
})

function initInfo() {
	$loading.load();
	$ajax.get({
		url : '/api/usage/queryAllRep',
		success : function(resp) {
			if (resp.datas != null) {
				var table = $("#reptbody");
				for(var i=0 ; i < resp.datas.length; i++){
					var data = resp.datas[i];
					var tr = '<tr><td>'+data.报告总量+'</td><td>'+data.出差报告+'</td><td>'+data.出差报告占+'</td><td>'+data.总结报告+'</td><td>'+data.总结报告占+'</td><td>'+data.产品报告+'</td><td>'+data.产品报告占+'</td></tr>';
					table.append(tr);
				}
			}
			$loading.close();
		}
	});
	
	$ajax.get({
		url : '/api/usage/queryPerRep',
		success : function(resp) {
			if (resp.datas != null) {
				var table = $("#pertbody");
				for(var i=0 ; i < resp.datas.length; i++){
					var data = resp.datas[i];
					var tr = '<tr><td>'+(i+1)+'</td><td>'+data.报告人+'</td><td>'+data.报告总量+'</td><td>'+data.出差报告+'</td><td>'+data.总结报告+'</td><td>'+data.产品报告+'</td></tr>';
					table.append(tr);
				}
			}
			$loading.close();
		}
	});
}