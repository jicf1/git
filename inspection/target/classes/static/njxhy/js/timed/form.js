$(function() {
	$loading.load();
	init();
	renderData();
	$loading.close();
})

function init() {
	
	$(".cal").on('click', function() {
		var cron = cal();
		$(".submitCron").val((cron == true || cron == false) ? "" : cron);
	})
	
	// 加载事件列表
	var eventHtml = "<option value='' selected>--请选择--</option>";
	$ajax.get({
		url : '/platform/schedule/getEventList',
		success : function(resp) {
			if (resp.success && resp.datas != null) {
				for (var i = 0; i < resp.datas.length; i++) {
					var data = resp.datas[i];
					eventHtml += '<option value="'+ data['clazz'] +'">'+ data['name'] +'</option>';
				}
			}
		}
	})
	$("[name='event']").append(eventHtml);
	
	// 日期控件
	laydate.render({
		elem: '#destroyTime',
		type: 'datetime'
	})
	
	// 日期控件
	laydate.render({
		elem: '#oncetime',
		type: 'datetime'
	})
	
	// 点击切换执行时间的显示
	$("[name = 'once']").on("click", function() {
		if ($(this).val() === "true") {
			$(".baseform").find("[name = 'oncetime']").parents(".form-group").css("display", "block");
			$(".pltab").css("display", "none");
		} else if ($(this).val() === "false") {
			$(".baseform").find("[name = 'oncetime']").parents(".form-group").css("display", "none");
			$(".pltab").css("display", "inline-block");
		}
		
	})
	
	
	// 获取秒数据
	for (var i = 0; i <= 59; i++) {
		var html = '';
		html += '<label class="checkbox-inline" >';
		var value = i;
		if (value < 10) {
			value = "0" + i;
		}
		html += '	<input name="appoint" type="checkbox" value="' + i + '" ';
		if (i === 0) {
			html += ' checked ';
		}
		html += '> ' + value;
		html += '</label>';
		if (i == 9 || i == 19 || i == 29 || i == 39 || i == 49) {
			html += '<br>';
		}
		$(".secs").append(html);
	}
	
	// 获取分钟数据
	for (var i = 0; i <= 59; i++) {
		var html = '';
		html += '<label class="checkbox-inline" >';
		var value = i;
		if (value < 10) {
			value = "0" + i;
		}
		html += '	<input name="appoint" type="checkbox" value="' + i + '" ';
		if (i === 0) {
//			html += ' checked ';
		}
		html += '> ' + value;
		html += '</label>';
		if (i == 9 || i == 19 || i == 29 || i == 39 || i == 49) {
			html += '<br>';
		}
		$(".mins").append(html);
	}
	
	// 获取小时数据
	for (var i = 0; i <= 23; i++) {
		var html = '';
		html += '<label class="checkbox-inline" >';
		var value = i;
		if (value < 10) {
			value = "0" + i;
		}
		html += '	<input name="appoint" type="checkbox" value="' + i + '"> ' + value;
		html += '</label>';
		if (i == 11) {
			html += '<br>';
		}
		$(".hours").append(html);
	}
	
	// 获取日数据
	for (var i = 1; i <= 31; i++) {
		var html = '';
		html += '<label class="checkbox-inline" >';
		html += '	<input name="appoint" type="checkbox" value="' + i + '"> ' + i;
		html += '</label>';
		if (i == 10 || i == 20 || i == 30) {
			html += '<br>';
		}
		$(".days").append(html);
	}
	
	// 获取月数据
	for (var i = 1; i <= 12; i++) {
		var html = '';
		html += '<label class="checkbox-inline" >';
		html += '	<input name="appoint" type="checkbox" value="' + i + '"> ' + i;
		html += '</label>';
		$(".months").append(html);
	}
	
	// 获取周数据
	for (var i = 1; i <= 7; i++) {
		var value = i;
		if (i === 1) {
			value = "星期一";
		} else if (i === 2) {
			value = "星期二";
		} else if (i === 3) {
			value = "星期三";
		} else if (i === 4) {
			value = "星期四";
		} else if (i === 5) {
			value = "星期五";
		} else if (i === 6) {
			value = "星期六";
		} else if (i === 7) {
			value = "星期日";
		}
		var html = '';
		html += '<label class="checkbox-inline" >';
		html += '	<input name="appoint" type="checkbox" value="' + i + '"> ' + value;
		html += '</label>';
		$(".weeks").append(html);
	}
	
}

function renderData() {
	var id = $.trim($(".baseform").find("[name='id']").val());
	if (id == null || id == undefined || id === "") {
		return;
	}
	$ajax.get({
		url : '/platform/schedule/getById/' + id,
		success : function(resp) {
			if (resp.success) {
				var schedule = resp.data;
				$(".baseform").find("[name='name']").val(schedule.name);
				$(".baseform").find("[name='enable'][value='"+ schedule.enable +"']").prop("checked", true);
				if (Number(schedule.destroyTime) > 0) {
					var dtime = new Date(Number(schedule.destroyTime)).format("yyyy-MM-dd hh:mm:ss");
					$(".baseform").find("[name='destroyTime']").val(dtime);
				}
				
				$(".baseform").find("[name='type']").val(schedule.type);
				$(".baseform").find("[name='event'] option[value='"+ schedule.event +"']").prop("selected", true);
				$(".baseform").find("[name='description']").val(schedule.description);
				$(".baseform").find("[name='once'][value='"+ schedule.once +"']").prop("checked", true);
				if (schedule.once == true) {
					var cron = schedule.cron;
					var crons = cron.split(" ");
					var d = "yyyy-MM-dd hh:mm:ss";
					d = d.replace("ss", crons[0]);
					d = d.replace("mm", crons[1]);
					d = d = d.replace("hh", crons[2]);
					d = d.replace("dd", crons[3]);
					d = d.replace("MM", crons[4]);
					d = d.replace("yyyy", "2018");
					var oncetime = new Date(d).format("yyyy-MM-dd hh:mm:ss");
					
					$(".baseform").find("[name='oncetime']").val(oncetime);
					$(".baseform").find("[name='oncetime']").parents(".form-group").css("display", "block");
					$(".pltab").css("display", "none");
				} else {
					$(".pltab").css("display", "inline-block");
					// 规则转换
					var cron = schedule.cron;
					var crons = cron.split(" ");
					
					// 秒
					var sec = crons[0];
					$("#sec [name='appoint']").prop("checked", false);
					if (sec == "*") {
						$("#sec").find("[name='sec'][value='*']").prop("checked", true);
					} else if (sec.indexOf("-") != -1) {
						$("#sec").find("[name='sec'][value='period']").prop("checked", true);
						var secs = sec.split("-");
						var beginPeriod = secs[0];
						var endPeriod = secs[1];
						$("#sec").find("[name='beginPeriod']").val(beginPeriod);
						$("#sec").find("[name='endPeriod']").val(endPeriod);
					} else if (sec.indexOf("/") != -1) {
						$("#sec").find("[name='sec'][value='interval']").prop("checked", true);
						var secs = sec.split("/");
						var beginInterval = secs[0];
						var interval = secs[1];
						$("#sec").find("[name='beginInterval']").val(beginInterval);
						$("#sec").find("[name='interval']").val(interval);
 					} else if (sec.indexOf(",") != -1) {
						$("#sec").find("[name='sec'][value='appoint']").prop("checked", true);
						var secs = sec.split(",");
						$("#sec [name='appoint']").each(function() {
							var crtValue = $(this).val();
							var _this = $(this);
							for (var i = 0; i < secs.length; i++) {
								if (crtValue == secs[i]) {
									_this.prop("checked", true);
								}
							}
						})
 					} else {
 						$("#sec").find("[name='sec'][value='appoint']").prop("checked", true);
						var secs = sec.split(",");
						$("#sec [name='appoint']").each(function() {
							var crtValue = $(this).val();
							var _this = $(this);
							for (var i = 0; i < secs.length; i++) {
								if (crtValue == secs[i]) {
									_this.prop("checked", true);
								}
							}
						})
 					}
					
					// 分钟
					var min = crons[1];
					$("#min [name='appoint']").prop("checked", false);
					if (min == "*") {
						$("#min").find("[name='min'][value='*']").prop("checked", true);
					} else if (min.indexOf("-") != -1) {
						$("#min").find("[name='min'][value='period']").prop("checked", true);
						var mins = min.split("-");
						var beginPeriod = mins[0];
						var endPeriod = mins[1];
						$("#min").find("[name='beginPeriod']").val(beginPeriod);
						$("#min").find("[name='endPeriod']").val(endPeriod);
					} else if (min.indexOf("/") != -1) {
						$("#min").find("[name='min'][value='interval']").prop("checked", true);
						var mins = min.split("/");
						var beginInterval = mins[0];
						var interval = mins[1];
						$("#min").find("[name='beginInterval']").val(beginInterval);
						$("#min").find("[name='interval']").val(interval);
 					} else if (min.indexOf(",") != -1) {
						$("#min").find("[name='min'][value='appoint']").prop("checked", true);
						var mins = min.split(",");
						$("#min [name='appoint']").each(function() {
							var crtValue = $(this).val();
							var _this = $(this);
							for (var i = 0; i < mins.length; i++) {
								if (crtValue == mins[i]) {
									_this.prop("checked", true);
								}
							}
						})
 					} else {
 						$("#min").find("[name='min'][value='appoint']").prop("checked", true);
						var mins = min.split(",");
						$("#min [name='appoint']").each(function() {
							var crtValue = $(this).val();
							var _this = $(this);
							for (var i = 0; i < mins.length; i++) {
								if (crtValue == mins[i]) {
									_this.prop("checked", true);
								}
							}
						})
 					}
					
					// 小时
					var hour = crons[2];
					$("#hour [name='appoint']").prop("checked", false);
					if (hour == "*") {
						$("#hour").find("[name='hour'][value='*']").prop("checked", true);
					} else if (hour.indexOf("-") != -1) {
						$("#hour").find("[name='hour'][value='period']").prop("checked", true);
						var hours = hour.split("-");
						var beginPeriod = hours[0];
						var endPeriod = hours[1];
						$("#hour").find("[name='beginPeriod']").val(beginPeriod);
						$("#hour").find("[name='endPeriod']").val(endPeriod);
					} else if (hour.indexOf("/") != -1) {
						$("#hour").find("[name='hour'][value='interval']").prop("checked", true);
						var hours = hour.split("/");
						var beginInterval = hours[0];
						var interval = hours[1];
						$("#hour").find("[name='beginInterval']").val(beginInterval);
						$("#hour").find("[name='interval']").val(interval);
 					} else if (hour.indexOf(",") != -1) {
						$("#hour").find("[name='hour'][value='appoint']").prop("checked", true);
						var hours = hour.split(",");
						$("#hour [name='appoint']").each(function() {
							var crtValue = $(this).val();
							var _this = $(this);
							for (var i = 0; i < hours.length; i++) {
								if (crtValue == hours[i]) {
									_this.prop("checked", true);
								}
							}
						})
 					} else {
 						$("#hour").find("[name='hour'][value='appoint']").prop("checked", true);
						var hours = hour.split(",");
						$("#hour [name='appoint']").each(function() {
							var crtValue = $(this).val();
							var _this = $(this);
							for (var i = 0; i < hours.length; i++) {
								if (crtValue == hours[i]) {
									_this.prop("checked", true);
								}
							}
						})
 					}
					
					// 日
					var day = crons[3];
					$("#day [name='appoint']").prop("checked", false);
					if (day == "*") {
						$("#day").find("[name='day'][value='*']").prop("checked", true);
					} else if (day.indexOf("-") != -1) {
						$("#day").find("[name='day'][value='period']").prop("checked", true);
						var days = day.split("-");
						var beginPeriod = days[0];
						var endPeriod = days[1];
						$("#day").find("[name='beginPeriod']").val(beginPeriod);
						$("#day").find("[name='endPeriod']").val(endPeriod);
					} else if (day.indexOf("/") != -1) {
						$("#day").find("[name='day'][value='interval']").prop("checked", true);
						var days = day.split("/");
						var beginInterval = days[0];
						var interval = days[1];
						$("#day").find("[name='beginInterval']").val(beginInterval);
						$("#day").find("[name='interval']").val(interval);
 					} else if (day.indexOf("L") != -1) {
						$("#day").find("[name='day'][value='L']").prop("checked", true);
 					} else if (day.indexOf("?") != -1) {
						$("#day").find("[name='day'][value='?']").prop("checked", true);
 					} else if (day.indexOf(",") != -1) {
						$("#day").find("[name='day'][value='appoint']").prop("checked", true);
						var days = day.split(",");
						$("#day [name='appoint']").each(function() {
							var crtValue = $(this).val();
							var _this = $(this);
							for (var i = 0; i < days.length; i++) {
								if (crtValue == days[i]) {
									_this.prop("checked", true);
								}
							}
						})
 					} else {
						$("#day").find("[name='day'][value='appoint']").prop("checked", true);
						var days = day.split(",");
						$("#day [name='appoint']").each(function() {
							var crtValue = $(this).val();
							var _this = $(this);
							for (var i = 0; i < days.length; i++) {
								if (crtValue == days[i]) {
									_this.prop("checked", true);
								}
							}
						})
 					}
					
					// 月
					var month = crons[4];
					$("#month [name='appoint']").prop("checked", false);
					if (month == "*") {
						$("#month").find("[name='month'][value='*']").prop("checked", true);
					} else if (month.indexOf("-") != -1) {
						$("#month").find("[name='month'][value='period']").prop("checked", true);
						var months = month.split("-");
						var beginPeriod = months[0];
						var endPeriod = months[1];
						$("#month").find("[name='beginPeriod']").val(beginPeriod);
						$("#month").find("[name='endPeriod']").val(endPeriod);
					} else if (month.indexOf("/") != -1) {
						$("#month").find("[name='month'][value='interval']").prop("checked", true);
						var months = month.split("/");
						var beginInterval = months[0];
						var interval = months[1];
						$("#month").find("[name='beginInterval']").val(beginInterval);
						$("#month").find("[name='interval']").val(interval);
					} else if (month.indexOf("?") != -1) {
						$("#month").find("[name='month'][value='?']").prop("checked", true);
					} else if (month.indexOf(",") != -1) {
						$("#month").find("[name='month'][value='appoint']").prop("checked", true);
						var months = month.split(",");
						$("#month [name='appoint']").each(function() {
							var crtValue = $(this).val();
							var _this = $(this);
							for (var i = 0; i < months.length; i++) {
								if (crtValue == months[i]) {
									_this.prop("checked", true);
								}
							}
						})
					} else {
						$("#month").find("[name='month'][value='appoint']").prop("checked", true);
						var months = month.split(",");
						$("#month [name='appoint']").each(function() {
							var crtValue = $(this).val();
							var _this = $(this);
							for (var i = 0; i < months.length; i++) {
								if (crtValue == months[i]) {
									_this.prop("checked", true);
								}
							}
						})
					}
					
					// 星期
					var week = crons[5];
					$("#week [name='appoint']").prop("checked", false);
					if (week == "*") {
						$("#week").find("[name='week'][value='*']").prop("checked", true);
					} else if (week.indexOf("-") != -1) {
						$("#week").find("[name='week'][value='period']").prop("checked", true);
						var weeks = week.split("-");
						var beginPeriod = weeks[0];
						var endPeriod = weeks[1];
						$("#week").find("[name='beginPeriod']").val(beginPeriod);
						$("#week").find("[name='endPeriod']").val(endPeriod);
					} else if (week.indexOf("/") != -1) {
						$("#week").find("[name='week'][value='interval']").prop("checked", true);
						var weeks = week.split("/");
						var beginInterval = weeks[0];
						var interval = weeks[1];
						$("#week").find("[name='beginInterval']").val(beginInterval);
						$("#week").find("[name='interval']").val(interval);
					}  else if (week.indexOf("?") != -1) {
						$("#week").find("[name='week'][value='?']").prop("checked", true);
					} else if (week.indexOf("L") != -1) {
						$("#week").find("[name='week'][value='lastL']").prop("checked", true);
						$("#week").find("[name='lastL']").val(week.replace("L", ""));
					} else if (week.indexOf(",") != -1) {
						$("#week").find("[name='week'][value='appoint']").prop("checked", true);
						var weeks = week.split(",");
						$("#week [name='appoint']").each(function() {
							var crtValue = $(this).val();
							var _this = $(this);
							for (var i = 0; i < weeks.length; i++) {
								if (crtValue == weeks[i]) {
									_this.prop("checked", true);
								}
							}
						})
					} else {
						$("#week").find("[name='week'][value='appoint']").prop("checked", true);
						var weeks = week.split(",");
						$("#week [name='appoint']").each(function() {
							var crtValue = $(this).val();
							var _this = $(this);
							for (var i = 0; i < weeks.length; i++) {
								if (crtValue == weeks[i]) {
									_this.prop("checked", true);
								}
							}
						})
					}
					
				}
				
				$(".submitCron").val(schedule.cron);
			}
		}
	})
}


// 计算cron表达式
function cal() {
	var cron = "";
	var once = $("[name='once']:checked").val();
	// 自定义
	if (once === "false") {
		// 表达式格式
		var cron = "sec min hour day month week";
		
		var _sec = $("#sec").find("form");
		var _min = $("#min").find("form");
		var _hour = $("#hour").find("form");
		var _day = $("#day").find("form");
		var _month = $("#month").find("form");
		var _week = $("#week").find("form");
		
		// 初始化数据
		var sec = _sec.find("[name='sec']:checked").val();
		var min = _min.find("[name='min']:checked").val();
		var hour = _hour.find("[name='hour']:checked").val();
		var day = _day.find("[name='day']:checked").val();
		var month = _month.find("[name='month']:checked").val();
		var week = _week.find("[name='week']:checked").val();
		
		// 逻辑运算
		//---- 秒 ----//
		switch(sec) {
		case "period":
			// 周期
			var beginPeriod = $.trim(_sec.find("[name='beginPeriod']").val());
			var endPeriod = $.trim(_sec.find("[name='endPeriod']").val());
			if (!isNumber(beginPeriod) || !isNumber(endPeriod)) {
				$ly.alert("周期秒数必须大于等于0");
				return false;
			}
			sec = beginPeriod + "-" + endPeriod;
			break;
		case "interval":
			// 间隔
			var beginInterval = $.trim(_sec.find("[name='beginInterval']").val());
			var interval = $.trim(_sec.find("[name='interval']").val());
			if (!isNumber(beginInterval) || !isNumber(interval)) {
				$ly.alert("间隔秒数必须大于等于0");
				return false;
			}
			sec = beginInterval + "/" + interval;
			break;
		case "appoint":
			// 指定
			var arr = [];
			_sec.find("[name='appoint']").each(function() {
				if ($(this).is(':checked')) {
					arr.push($(this).val());
				}
			});
			if (arr.length === 0) {
				$ly.alert("请指定秒数！");
				return false;
			}
			sec = arr.join(",");
			break;
		default:
			
		}
		//---- 分钟 ----//
		switch(min) {
		case "period":
			// 周期
			var beginPeriod = $.trim(_min.find("[name='beginPeriod']").val());
			var endPeriod = $.trim(_min.find("[name='endPeriod']").val());
			if (!isNumber(beginPeriod) || !isNumber(endPeriod)) {
				$ly.alert("周期分钟必须大于等于0");
				return false;
			}
			min = beginPeriod + "-" + endPeriod;
			 break;
		case "interval":
			// 间隔
			var beginInterval = $.trim(_min.find("[name='beginInterval']").val());
			var interval = $.trim(_min.find("[name='interval']").val());
			if (!isNumber(beginInterval) || !isNumber(interval)) {
				$ly.alert("间隔分钟必须大于等于0");
				return false;
			}
			min = beginInterval + "/" + interval;
			break;
		case "appoint":
			// 指定
			var arr = [];
			_min.find("[name='appoint']").each(function() {
				if ($(this).is(':checked')) {
					arr.push($(this).val());
				}
			});
			if (arr.length === 0) {
				$ly.alert("请指定分钟！");
				return false;
			}
			min = arr.join(",");
			break;
		default:
			
		}
		//---- 小时 ----//
		switch(hour) {
		case "period":
			// 周期
			var beginPeriod = $.trim(_hour.find("[name='beginPeriod']").val());
			var endPeriod = $.trim(_hour.find("[name='endPeriod']").val());
			if (!isNumber(beginPeriod) || !isNumber(endPeriod)) {
				$ly.alert("周期小时必须大于等于0");
				return false;
			}
			hour = beginPeriod + "-" + endPeriod;
			break;
		case "interval":
			// 间隔
			var beginInterval = $.trim(_hour.find("[name='beginInterval']").val());
			var interval = $.trim(_hour.find("[name='interval']").val());
			if (!isNumber(beginInterval) || !isNumber(interval)) {
				$ly.alert("间隔小时必须大于等于0");
				return false;
			}
			hour = beginInterval + "/" + interval;
			break;
		case "appoint":
			// 指定
			var arr = [];
			_hour.find("[name='appoint']").each(function() {
				if ($(this).is(':checked')) {
					arr.push($(this).val());
				}
			});
			if (arr.length === 0) {
				$ly.alert("请指定小时！");
				return false;
			}
			hour = arr.join(",");
			break;
		case "appoint":
			// 指定
			var arr = [];
			_hour.find("[name='appoint']").each(function() {
				if ($(this).is(':checked')) {
					arr.push($(this).val());
				}
			});
			if (arr.length === 0) {
				$ly.alert("请指定小时！");
				return false;
			}
			hour = arr.join(",");
			break;
		default:
			
		}
		//---- 日 ----//
		switch(day) {
		case "period":
			// 周期
			var beginPeriod = $.trim(_day.find("[name='beginPeriod']").val());
			var endPeriod = $.trim(_day.find("[name='endPeriod']").val());
			if (!isNumber(beginPeriod) || !isNumber(endPeriod)) {
				$ly.alert("周期日必须大于等于0");
				return false;
			}
			day = beginPeriod + "-" + endPeriod;
			break;
		case "interval":
			// 间隔
			var beginInterval = $.trim(_day.find("[name='beginInterval']").val());
			var interval = $.trim(_day.find("[name='interval']").val());
			if (!isNumber(beginInterval) || !isNumber(interval)) {
				$ly.alert("间隔日必须大于等于0");
				return false;
			}
			day = beginInterval + "/" + interval;
			break;
		case "appoint":
			// 指定
			var arr = [];
			_day.find("[name='appoint']").each(function() {
				if ($(this).is(':checked')) {
					arr.push($(this).val());
				}
			});
			if (arr.length === 0) {
				$ly.alert("请指定日！");
				return false;
			}
			day = arr.join(",");
			break;
		default:
			
		}
		//---- 月 ----//
		switch(month) {
		case "period":
			// 周期
			var beginPeriod = $.trim(_month.find("[name='beginPeriod']").val());
			var endPeriod = $.trim(_month.find("[name='endPeriod']").val());
			if (!isNumber(beginPeriod) || !isNumber(endPeriod)) {
				$ly.alert("周期月必须大于等于1");
				return false;
			}
			month = beginPeriod + "-" + endPeriod;
			break;
		case "interval":
			// 间隔
			var beginInterval = $.trim(_month.find("[name='beginInterval']").val());
			var interval = $.trim(_month.find("[name='interval']").val());
			if (!isNumber(beginInterval) || !isNumber(interval)) {
				$ly.alert("间隔月必须大于等于1");
				return false;
			}
			month = beginInterval + "/" + interval;
			break;
		case "appoint":
			// 指定
			var arr = [];
			_month.find("[name='appoint']").each(function() {
				if ($(this).is(':checked')) {
					arr.push($(this).val());
				}
			});
			if (arr.length === 0) {
				$ly.alert("请指定月！");
				return false;
			}
			month = arr.join(",");
			break;
		default:
			
		}
		//---- 周 ----//
		switch(week) {
		case "period":
			// 周期
			var beginPeriod = $.trim(_week.find("[name='beginPeriod']").val());
			var endPeriod = $.trim(_week.find("[name='endPeriod']").val());
			if (!isNumber(beginPeriod) || !isNumber(endPeriod)) {
				$ly.alert("周期星期必须大于等于1");
				return false;
			}
			week = beginPeriod + "-" + endPeriod;
			break;
		case "appoint":
			// 指定
			var arr = [];
			_week.find("[name='appoint']").each(function() {
				if ($(this).is(':checked')) {
					arr.push($(this).val());
				}
			});
			if (arr.length === 0) {
				$ly.alert("请指定星期！");
				return false;
			}
			week = arr.join(",");
			break;
		case "lastL":
			// 本月最后一个星期几
			var lastL = $.trim(_week.find("[name='lastL']").val());
			if (!isNumber(lastL)) {
				$ly.alert("星期必须大于等于1");
				return false;
			}
			week = lastL + "L" ;
			break;
		default:
			
		}
		
		// 规则变更
		if (week !== "?") {
			day = "?";
		}
		
		// 替换
		cron = cron.replace("sec", sec)
			.replace("min", min)
			.replace("hour", hour)
			.replace("day", day)
			.replace("month", month)
			.replace("week", week);
	} 
	// 只执行一次
	else {
		var oncetime = $.trim($(".baseform").find("[name='oncetime']").val());
		if (oncetime === "") {
			$ly.alert("请指定执行时间！");
			return false;
		}
		var fmt = "s m h d M ?";
		var time = (new Date(oncetime)).getTime();
		cron = new Date(time).format(fmt);
	}
	return cron;
}

// 保存定时任务
function save() {
	var id = $.trim($(".baseform").find("[name='id']").val());
	var name = $.trim($(".baseform").find("[name='name']").val());
	if (name === "") {
		$ly.alert("任务名称不能为空！");
		return;
	}
	var description = $.trim($(".baseform").find("[name='description']").val());
	
	var enable = $.trim($(".baseform").find("[name='enable']:checked").val());
	var type = $.trim($(".baseform").find("[name='type']").val());
	var event = $.trim($(".baseform").find("[name='event'] option:selected").val());
	if (event === "") {
		$ly.alert("请选择事件！");
		return;
	}
	
	var once = $.trim($(".baseform").find("[name='once']:checked").val());
	
	if (once === "true") {
		var oncetime = $.trim($(".baseform").find("[name='oncetime']").val());
		if (oncetime === "") {
			$ly.alert("请指定执行时间！");
			return;
		}
	}
	
	var destroyTime = "";
	var destroyTimeStr = $.trim($(".baseform").find("[name='destroyTime']").val());
	if (destroyTimeStr !== "") {
		destroyTime = new Date(destroyTimeStr).getTime();
	}
	
	var cron = cal();
	
	if (cron != true && cron != false) {
		$ajax.json({
			url : "/platform/schedule/add",
			data : {
				schedule : {
					id : id.length > 0 ? id : null,
					name : name,
					description : description,
					cron : cron,
					enable : enable,
					type : type,
					event : event,
					once : once,
					destroyTime : destroyTime
				}
			},
			async : true,
			success : function(resp) {
				if (resp.success) {
					$ly.msg("提交成功！");
					back();
				} else {
					$ly.alert("提交失败！" + resp.errmsg);
				}
			}
		})	
	}
	
}

function isNumber(value) {
	var re = /^[0-9]+$/ ;
    return re.test(value)
}

function back() {
	window.history.go(-1);
}

Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,                 //月份 
       "d+" : this.getDate(),                    //日 
       "h+" : this.getHours(),                   //小时 
       "m+" : this.getMinutes(),                 //分 
       "s+" : this.getSeconds(),                 //秒 
       "q+" : Math.floor((this.getMonth()+3)/3), //季度 
       "S"  : this.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
}


