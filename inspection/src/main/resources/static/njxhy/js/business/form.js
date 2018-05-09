var id = $.trim($("[name='id']").val());
var intype = $.trim($("[name='intype']").val());
var currentFile = [];	// 存储上传的附件的id
$(function() {
	$loading.load();
	getInitialData();
	initial();
	$loading.close();
	initEvent();
});

function initial () {
	//只读，不需要填写
	$("[name=allFee]").attr("readonly", true);
	$("[name=primaryProfit]").attr("readonly", true);
	
	$("form").on("click", ".select-prod-btn", function() {
		let _form = $("form");
		Tools.ly.modal({
			title: "产品列表",
			area: ['90%', '90%'],
			el: $("#select-prod"),
			success: function() {
				Prod.initTree({
					id: 'select-prod-dt-tree'
				});
			},
			yes: function(index) {
				let node = Tools.zt.getSelected('select-prod-dt-tree');
				if (node == null) {
					Tools.ly.alert("请选择产品");
					return;
				}
				
				_form.find("[name = 'goodsId']").val(node.id);
				_form.find("[name = 'goodsName']").val(node.name);
				
				layer.close(index);
			}
		});
	});
	
	$("form").on("click", ".select-salemans-btn", function() {
		let _form = $("form");
		Tools.ly.modal({
			title: "用户列表",
			area: ['90%', '90%'],
			el: $("#select-user"),
			yes: function(index) {
				let userIds = $dt.getSelected('select-user-dt-table');
				if (userIds.length > 1) {
					$ly.alert("只能选择一个用户");
					return false;
				}
				let user = User.getById(userIds[0]);
				_form.find("[name = 'salesmanId']").val(user.id);
				_form.find("[name = 'salesman']").val(user.name);
				
				layer.close(index);
			}
		});
	});
}




function getInitialData () {
	Tools.ajax.get({
		url: Tools.getRootPath() + "/api/business/getInitialData",
		data: {
			id : id
		},
		success: function(resp) {
			if (resp.success) {
				var model = resp.data;
				$("[name=id]").val(model.id);
				if(intype != 'CREATE'){
					$("[name=salesman]").val(model.salesman);
				}
				$("[name=goodsId]").val(model.goodsId);
				$("[name=goodsName]").val(model.goodsName);
				$("[name=salesTime]").val(model.time);
				if(model.time){
					var saletime = new Date(model.time);
					if(saletime.getMonth() > 5){
						$("[name=salesTime_month]").val('12');
					}else{
						$("[name=salesTime_month]").val('06');
					}
					$("[name=salesTime_year]").val(saletime.getFullYear())
				}else{
					var saletime = new Date();
					$("[name=salesTime_month]").val('06');
					$("[name=salesTime_year]").val(saletime.getFullYear())
				}
				$("[name=salesNum]").val(model.salesNum);
				$("[name=profit]").val(model.profit);
				$("[name=tax]").val(model.tax);
				$("[name=agencyFee]").val(model.agencyFee);
				$("[name=declareFee]").val(model.declareFee);
				$("[name=storageFee]").val(model.storageFee);
				$("[name=transportFee]").val(model.transportFee);
				$("[name=busitripFee]").val(model.busitripFee);
				$("[name=entertainFee]").val(model.entertainFee);
				$("[name=interestStock]").val(model.interestStock);
				$("[name=receivables]").val(model.receivables);
				$("[name=acceptanceInterest]").val(model.acceptanceInterest);
				$("[name=otherFee]").val(model.otherFee);
				$("[name=allFee]").val(model.allFee);
				$("[name=primaryProfit]").val(model.primaryProfit);
			} else {
				$ly.alert(resp.msg);
			}
		}
	});
}

function initEvent () {
	//日期控件
	$(".form_datetime").datetimepicker({
		format: 'yyyy',
		language: 'zh-CN',
		startView: 4,
	　　　minView: 4,
	});
	// 保存
	$(".save").on("click", function() {
		// 表单信息
		var _form = $("form");
		
		var salesman = $.trim(_form.find("[name=salesman]").val());
		var goodsId = $.trim(_form.find("[name=goodsId]").val());
		var goodsName = $.trim(_form.find("[name=goodsName]").val());
		
		var year = $.trim(_form.find("[name=salesTime_year]").val());
		var month = $.trim(_form.find("[name=salesTime_month]").val());
		
		// var time = $.trim(_form.find("[name=salesTime]").val());
		var time = year + "-" + month + "-01";
		var salesNum = $.trim(_form.find("[name=salesNum]").val());
		var profit = $.trim(_form.find("[name=profit]").val());
		var tax = $.trim(_form.find("[name=tax]").val());
		var agencyFee = $.trim(_form.find("[name=agencyFee]").val());
		var declareFee = $.trim(_form.find("[name=declareFee]").val());
		var storageFee = $.trim(_form.find("[name=storageFee]").val());
		var transportFee = $.trim(_form.find("[name=transportFee]").val());
		var busitripFee = $.trim(_form.find("[name=busitripFee]").val());
		var entertainFee = $.trim(_form.find("[name=entertainFee]").val());
		var interestStock = $.trim(_form.find("[name=interestStock]").val());
		var receivables = $.trim(_form.find("[name=receivables]").val());
		var acceptanceInterest = $.trim(_form.find("[name=acceptanceInterest]").val());
		var otherFee = $.trim(_form.find("[name=otherFee]").val());
		var allFee = $.trim(_form.find("[name=allFee]").val());
		var primaryProfit = $.trim(_form.find("[name=primaryProfit]").val());
		var arr = time.split("-");
		$ajax.json({
			url: "/api/business/save",
			data: {
				id: Number(id),
				salesman: salesman,
				goodsId:goodsId,
				goodsName: goodsName,
				time:time,
				year:arr[0],
				month:arr[1],
				date:arr[2],
				salesNum: salesNum,
				profit: profit,
				tax: tax,
				agencyFee: agencyFee,
				declareFee: declareFee,
				storageFee: storageFee,
				transportFee: transportFee, 
				busitripFee: busitripFee, 
				entertainFee: entertainFee,
				interestStock: interestStock,
				receivables: receivables,
				acceptanceInterest: acceptanceInterest,
				otherFee: otherFee,
				allFee: allFee,
				primaryProfit: primaryProfit
			},
			success: function(resp) {
				if (resp.success) {
					$ly.msg(resp.msg);
					window.location.href=Tools.getRootPath() + "/router/business/list"
				} else {
					$ly.alert(resp.msg);
				}
			}
		});
	});
	// 标记为已阅
	$(".receive").on("click", function() {
		Tools.ajax.post({
			url: Tools.getRootPath() + "/api/receive/received/" + id,
			data: {},
			success: function(resp) {
				if (resp.success) {
					$ly.msg(resp.msg);
					window.location.href=Tools.getRootPath() + "/router/receive/todo"
				} else {
					$ly.alert(resp.msg);
				}
			}
		});
	});
}

function buildFileHtml(currentFile) {
	$(".form-file-list").parents(".form-group").remove();
	var html = '';
	if (currentFile.length > 0) {
		html += '<div class="form-group">';
		html += '	<label class="col-sm-3 control-label"></label>';
		html += '	<div class="col-sm-6 form-file-list">';
		html += '		<table class="table table-bordered table-condensed">';
		for (var i = 0; i < currentFile.length; i++) {
			html += '			<tr>';
			html += '				<td style="width: 90%; border-right: none;">'+ currentFile[i].name +'</td>';
			html += '				<td style="width: 10%; text-align: center;">';
			html += '					<a href="javascrip:;" class="downFile" title="下载"><i class="fa fa-download"></i></a>';
			html += '					<a href="javascrip:;" class="removeFile" title="移除"><i class="fa fa-trash"></i></a>';
			html += '				</td>';
			html += '			</tr>';
		}
		html += '		</table>';
		html += '	</div>';
		html += '</div>';
	}
	return html;
}

function back () {
	window.history.go(-1);
}

function setAllFee(){
	var _form = $("form");
	var allFee;
	var primaryProfit;
	var tax = parseFloat($.trim(_form.find("[name=tax]").val()));
	var agencyFee = parseFloat($.trim(_form.find("[name=agencyFee]").val()));
	var declareFee = parseFloat($.trim(_form.find("[name=declareFee]").val()));
	var storageFee = parseFloat($.trim(_form.find("[name=storageFee]").val()));
	var transportFee = parseFloat($.trim(_form.find("[name=transportFee]").val()));
	var busitripFee = parseFloat($.trim(_form.find("[name=busitripFee]").val()));
	var entertainFee = parseFloat($.trim(_form.find("[name=entertainFee]").val()));
	var interestStock = parseFloat($.trim(_form.find("[name=interestStock]").val()));
	
	var acceptanceInterest = parseFloat($.trim(_form.find("[name=acceptanceInterest]").val()));
	var otherFee = parseFloat($.trim(_form.find("[name=otherFee]").val()));
	var receivables = parseFloat($.trim(_form.find("[name=receivables]").val()));
	allFee = agencyFee + declareFee + storageFee + transportFee + busitripFee + entertainFee + otherFee
	+ interestStock + acceptanceInterest + tax + receivables;
	$("[name=allFee]").val(allFee);var profit = parseFloat($.trim(_form.find("[name=profit]").val()));
	primaryProfit = profit - allFee;
	$("[name=primaryProfit]").val(primaryProfit);
}
