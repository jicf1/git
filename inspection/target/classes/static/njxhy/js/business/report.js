//产品树节点ID
var pnode = null;
//产品树节点名称
var pname = null;
$(function() {
	$loading.load("loading");
	var date = new Date();
	initChart_line1("container_line1",date.getFullYear());
	initChart_pie("container_pie",date.getFullYear());
	//初始化产品树
	Prod.initTree({
		id: 'select-prod-dt-tree'
	});
	initChart_bar1("container_bar1",date.getFullYear(),date.getFullYear() - 1,pnode,pname);
	$loading.close();
	initBtn();
});
/**
 * 初始化按钮事件
 * @returns
 */
function initBtn() {
	//刷新按钮
	$(".update-btn").on("click",function() {
		$loading.load();
		//清空年份选择框以及树
		$(".form_datetime").val("");
		Prod.initTree({
			id: 'select-prod-dt-tree'
		});
		var date = new Date();
		initChart_line1("container_line1",date.getFullYear());
		initChart_pie("container_pie",date.getFullYear());
		initChart_bar1("container_bar1",date.getFullYear(),date.getFullYear() - 1,pnode,pname);
		$loading.close();
	});
	//日期控件初始化
	$(".line_pick").datetimepicker({
		format: 'yyyy',
		language: 'zh-CN',
		startView: 4,
	　　　minView: 4,
	}).on('changeDate', function(ev){
	    $('.line_pick').datetimepicker('hide');
	    initChart_line1("container_line1",$(".line_pick").val().split("-")[0]);
	});
	$(".pie_pick").datetimepicker({
		format: 'yyyy',
		language: 'zh-CN',
		startView: 4,
	　　　minView: 4,
	}).on('changeDate', function(ev){
	    $('.pie_pick').datetimepicker('hide');
	    initChart_pie("container_pie",$(".pie_pick").val().split("-")[0]);
	});
	$(".bar_pick").datetimepicker({
		format: 'yyyy',
		language: 'zh-CN',
		startView: 4,
	　　　minView: 4,
	}).on('changeDate', function(ev){
	    $('.bar_pick').datetimepicker('hide');
	    var year = $(".bar_pick").val().split("-")[0];
	    let node = Tools.zt.getSelected('select-prod-dt-tree');
	    if(node == null || node == "") {
	    	initChart_bar1("container_bar1",year,parseInt(year) - 1,pnode,pname);
	    }else {
	    	initChart_bar1("container_bar1",year,parseInt(year) - 1,node.id,node.name);
	    }
	});
}
/**
 * 柱状图
 * @param selector
 * @returns
 */
function initChart_bar1(selector,year,contrast,goodsId,goodsName) {
	var dom = document.getElementById(selector);
	var myChart = echarts.init(dom);
	var app = {};
	var posList = [];
	
	var data = bar(year,contrast,goodsId);
	console.log(data);

	app.configParameters = {
	    rotate: {
	        min: -90,
	        max: 90
	    },
	    align: {
	        options: {
	            left: 'left',
	            center: 'center',
	            right: 'right'
	        }
	    },
	    verticalAlign: {
	        options: {
	            top: 'top',
	            middle: 'middle',
	            bottom: 'bottom'
	        }
	    },
	    position: {
	        options: echarts.util.reduce(posList, function (map, pos) {
	            map[pos] = pos;
	            return map;
	        }, {})
	    },
	    distance: {
	        min: 0,
	        max: 100
	    }
	};

	app.config = {
	    rotate: 90,
	    align: 'left',
	    verticalAlign: 'middle',
	    position: 'insideBottom',
	    distance: 15
	};

	option = {
		title : {
	        text: year + "年与" + contrast + '年' + goodsName + '初级利润同期对比',
	        x:'center'
	    },
		color: ['#003366', '#e5323e'],
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'shadow'
	        }
	    },
	    xAxis: [
	        {
	            type: 'category',
	            axisTick: {show: false},
	            data: data.time
	        }
	    ],
	    yAxis: [
	        {
	            type: 'value'
	        }
	    ],
	    series:data.data
	};
	
	if (option && typeof option === "object") {
	    myChart.setOption(option, true);
	}
}
function bar(year,contrast,goodsId) {
	var result = {};
	Tools.ajax.get({
		url: Tools.getRootPath() + "/api/business/bar",
		data: {year:year,contrast:contrast,goodsId:goodsId},
		success: function(resp) {
			if(resp.success) {
				resp = resp.data;
				if(resp.legend != null && resp.legend.length > 0) {
					var arr = [];
					for(var i = 0;i<resp.legend.length;i++) {
						var obj = {"name":resp.legend[i],"type":"bar","data":resp.data[i]}
						arr.push(obj);
					}
					result = {
						"time":resp.time,
						"data":arr
					};
				}
			}
		}
	});
	return result;
}
/**
 * 饼图
 * @param selector
 * @param data
 * @param title
 * @param flag
 * @returns
 */
function initChart_pie(selector,year) {
	var dom = document.getElementById(selector);
	var myChart = echarts.init(dom);
	var data = pie(year);
	console.log(data);
	myChart.on('click', function (params) {
		
	});
	option = {
//		title : {
//	        text: '各产品占比',
//	        x:'center'
//	    },
		tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        type: 'scroll',
	        orient: 'vertical',
	        right: 10,
	        top: 20,
	        bottom: 20,
	        data: data.legend
	    },
	    series : [
	        {
	            name: '产品',
	            type: 'pie',
	            radius : '55%',
	            center: ['40%', '50%'],
	            data: data.data,
	            itemStyle: {
	                emphasis: {
	                    shadowBlur: 10,
	                    shadowOffsetX: 0,
	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                }
	            }
	        }
	    ]
	};
	if (option && typeof option === "object") {
	    myChart.setOption(option, true);
	}
	
}
function pie(year) {
	var result = {};
	Tools.ajax.get({
		url: Tools.getRootPath() + "/api/business/pie",
		data: {year:year},
		success: function(resp) {
			if(resp.success) {
				result = resp.data;
			}
		}
	});
	return result;
}
/**
 * 折线图
 * @param selector
 * @returns
 */
function initChart_line1(selector,year) {
	var dom = document.getElementById(selector);
	var myChart = echarts.init(dom);
	var app = {};
	var data = trend(year,"");
	myChart.on('click', function (params) {

	});
	option = {
//		title : {
//	        text: '经营数据趋势',
//	        x:'center'
//	    },
		tooltip: {
	        trigger: 'axis'
	    },
	    legend: {
	    	data:data.legend,
	        x:"right"
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: data.time
	    },
	    yAxis: {
	        type: 'value'
	    },
	    series:data.data
	};
	if (option && typeof option === "object") {
	    myChart.setOption(option, true);
	}
}
/**
 * 折线图数据
 * @returns
 */
function trend(year,goodsId) {
	var result = {};
	Tools.ajax.get({
		url: Tools.getRootPath() + "/api/business/trend",
		data: {year:year,goodsId:goodsId},
		success: function(resp) {
			if(resp.success) {
				resp = resp.data;
				if(resp.legend != null && resp.legend.length > 0) {
					var arr = [];
					for(var i = 0;i<resp.legend.length;i++) {
						var obj = {"name":resp.legend[i],"type":"line","data":resp.data[i]}
						arr.push(obj);
					}
					result = {
						"legend":resp.legend,
						"time":resp.time,
						"data":arr
					};
				}
			}
		}
	});
	return result;
}
let Prod = {
	/**
	 * 初始化数据树
	 * settings: {
	 * 	id
	 * 	callback: {
	 * 		click
	 * 	}
	 * 	expand
	 * }
	 */
	initTree: function(settings) {
		// setting
		let setting = {    
			data: {
				simpleData:{
					enable: true,
	            	idKey: "id",
	              	pIdKey: "pid",
	              	rootPId: 0
				}
			},
			view: {
				showIcon: false
	    	},
	    	callback: {
	    		onClick: zTreeOnClick
	     	}
		};
		
		// 获取nodes
		let zNodes = [];
		$ajax.get({
			url: "/api/prod/store/getTree",
			data: {},
			success: function(resp) {
				if (resp.success) {
					zNodes = resp.datas;
					pnode = zNodes[0].id;
					pname = zNodes[0].name;
			  	} else {
			  		$ly.alert(resp.msg);
			  	}
			}
		});
		
		// 点击事件
		function zTreeOnClick(event, treeId, treeNode) {
			console.log(treeNode.id);
			var year = $(".bar_pick").val();
			if(year == null || year == "") {
				var date = new Date();
				year = date.getFullYear();
			}else {
				year = year.split("-")[0];
			}
		    initChart_bar1("container_bar1",year,parseInt(year) - 1,treeNode.id,treeNode.name);
		};
		
		$.fn.zTree.init($("#" + settings.id), setting, zNodes);
		var treeObj = $.fn.zTree.getZTreeObj(settings.id); 
		if (!settings.expand) {
			treeObj.expandAll(true); 
		}
		
	},
	/**
	 * 根据主键查询对象
	 */
	getById: function(id) {
		let model = null;
		$ajax.get({
			url: "/api/prod/store/getById/" + id,
			data: {},
			success: function(resp) {
				if (resp.success) {
					model = resp.data;
				} else {
					$ly.alert(resp.msg);
				}
			}
		});
		return model;
	}
}