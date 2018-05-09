//出差ID
var bId = ''
$(function() {
	//返回按钮
	$('#back').click(function(){
		window.history.back();
	});
	var str = window.location.search;
	if(str != "" && str != undefined) {
		bId = str.split("=")[1];
	}
	//获取出差详情
	getTripData();
	
	//已阅按钮
	$('#remark').click(function(){
		$.confirm("确认标记为已阅吗？", function() {
			  //点击确认后的回调函数
			Tools.ajax.post({
				url:Tools.getRootPath() + "/api/receive/received/" + bId + "?mobile=true",
				data:{
				},
				success:function(result) {
					layer.alert("标记成功!");
					window.history.back();
				},
				error:function() {
					
				}
			});
	    }, function() {
			  //点击取消后的回调函数
	    });
	});
});

/*
 * 获取出差信息
 */
function getTripData() {
	Tools.ajax.get({
		url:Tools.getRootPath() + "/api/busitrip/getInitialData?mobile=true",
		data:{
			id : bId
		},
		success:function(result) {
			if(result.success) {
				var data = result.data;
				$('#userName').html(data.userName);
				$('#createTime').html(data.createTime);
				$('#tripUserName').html(data.tripUserName);
				$('#tripAddr').html(data.tripAddr);
				$('#tripDate').html(data.tripDate);
				$('#customerName').html(data.customerName);
				$('#callonUserName').html(data.callonUserName);
				$('#callonDate').html(data.callonDate);
				$('#customerDesc').html(data.customerDesc);
				$('#callonDesc').html(data.callonDesc);
				if(data.files != null && data.files.length > 0){
					var attach = '';
					for(var i = 0;i < data.files.length;i++){
						attach += '<div class="weui-cell" onclick="download(\'' + data.files[i].id + '\')">';
						attach += '		<svg class="ico icon small_ico" aria-hidden="true">';
						attach += '			<use xlink:href="#icon-reimbursement-attachment"></use>';
						attach += '		</svg>';
						attach += '		<div class="weui-cell__ft" style="color:#7AA8F2">' + data.files[i].fullName + '</div>';
						attach += '</div>';
					}
				}
				$('#attachment').html(attach);
			}
		},
		error:function() {
			
		}
	});
}

/*
 * 在线预览附件
 */
function download(id){
	Tools.ajax.get({
		url:Tools.getRootPath() + "/api/doc/doc/sys_cc/find?id="+ id,
		data:{},
		success:function(response) {
		   	 if(response.errcode == 0){
		   		 if(response.obj.doc && response.obj.doc.path){
		   			 window.open(Tools.getRootPath() + '/plugins/pdfJs/generic/web/viewer.html?file=' + Tools.getRootPath() + '/document/pdfJs/doc/' + response.obj.doc.id);			    			 
		   		 }else if(response.obj.attachs.length > 0){
		   			 window.open(Tools.getRootPath() + "/document/preview?id=" + response.obj.attachs[0].id);
		   		 }else{
		   			 layer.alert("不存在可预览文件");
		   		 }
		   	 }else{
		   		 layer.alert("未生成对应报告");
		   	 }
		},
		error:function() {
			layer.alert("未找到对应文档记录");
		}
	});
}