var table = null;
$(function() {
	initBtns();
})

function initBtns() {
	// 条件查询
	$(".condition-btn").on("click", function() {
		$dt.reload(table);
	});
	
	// 创建任务
	$(".create-btn").on("click", function() {
		window.location.href = $root() + "/router/timed/form";
	})
	
	initTable();
}

function initTable () {
	table = $dt.load({
		el: $("#dtTable"),
		url: "/platform/schedule/getList",
		data: function(map) {
			map['name'] = $.trim($(".conditions-form").find("[name='name']").val());
		},
		columns: [
			{
				"data" : "name",
				"render" : function(data, type, full, meta){
					var str = '<a class="dt-link" title="'+ full.cron +'" target="view_iframe" href="'+ $root() +'/router/timed/form?id='+ full.id +'">'+ data +'</a>';
					return str;
				}
			},
			{
				"data" : "description"
			},
			{
				"data" : "createTime"
			},
			{
				"data" : "lasttime",
				"render" : function(data, type, full, meta){
					var str = "";
					if (Number(data) > 0) {
						str = new Date(data).format("yyyy-MM-dd hh:mm:ss");
					}
					return str
				}
			},
			{
				"data" : "status",
				"render" : function(data, type, full, meta){
					var str = "";
					if (data === "0") {
						str = "运行中";
					} else if (data === "1") {
						str = "已禁用";
					} else if (data === "2") {
						str = "已暂停";
					}
					return str;
				}
			},
			{
				"data" : "id",
				"render" : function(data, type, full, meta){
					var str = "";
					if (full.status === "1" || full.status === "2") {
						str += "<a title='立即开启任务，等待任务执行' class='dt-link' style='margin-right: 10px;' onclick='enable(\""+ data +"\")'>启用</a>";
					} 
					if (full.status === "0") {
						str += "<a title='禁用任务，等待被启用执行' class='dt-link' style='margin-right: 10px;' onclick='unable(\""+ data +"\")'>禁用</a>";
						str += "<a title='暂停任务，等待下次系统启动或启用任务' class='dt-link' style='margin-right: 10px;' onclick='stop(\""+ data +"\")'>暂停</a>";
					}
					if (full.status === "2") {
						str += "<a title='禁用任务，等待被启用执行' class='dt-link' style='margin-right: 10px;' onclick='unable(\""+ data +"\")'>禁用</a>";
					}
					str += "<a title='删除任务' class='dt-link' onclick='del(\""+ data +"\")'>删除</a>";
					return str;
				}
			},
		]
	})
}

/**
 * 启用
 * @param id
 * @returns
 */
function enable(id) {
	$ly.confirm({
		title : "确定启用？",
		okFn : function() {
			$ajax.post({
				url : '/platform/schedule/enable/' + id,
				success : function(resp) {
					if (resp.success) {
						$ly.msg("已启用");
						$dt.reload(table);
					} else {
						$ly.alert("启用失败");
					}
				}
			})
		}
	})
}

/**
 * 禁用
 * @param id
 * @returns
 */
function unable(id) {
	$ly.confirm({
		title : "确定禁用？",
		okFn : function() {
			$ajax.post({
				url : '/platform/schedule/unable/' + id,
				success : function(resp) {
					if (resp.success) {
						$ly.msg("已禁用");
						$dt.reload(table);
					} else {
						$ly.alert("禁用失败");
					}
				}
			})
		}
	})
}

/**
 * 停止
 * @param id
 * @returns
 */
function stop(id) {
	$ly.confirm({
		title : "确定停止？",
		okFn : function() {
			$ajax.post({
				url : '/platform/schedule/stop/' + id,
				success : function(resp) {
					if (resp.success) {
						$ly.msg("已暂停");
						$dt.reload(table);
					} else {
						$ly.alert("暂停失败");
					}
				}
			})
		}
	})
}

/**
 * 删除
 * @param id
 * @returns
 */
function del(id) {
	$ly.confirm({
		title : "确定删除？",
		okFn : function() {
			$ajax.post({
				url : '/platform/schedule/delete/' + id,
				success : function(resp) {
					if (resp.success) {
						$ly.msg("已删除");
						$dt.reload(table);
					} else {
						$ly.alert("删除失败");
					}
				}
			})
		}
	})
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

