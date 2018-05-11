//初始化变量  
var max=8;
var page=0;  
$(function () {
	//返回按钮
	$('#back').click(function(){
		window.history.back();
	});
	
    //切换tab标签  
    $(".weui-navbar__item").click(function () {  
        $(".weui-loadmore").html('<i class="weui-loading"></i> <span class="weui-loadmore__tips">正在加载</span>')  
        $(".infinite").infinite()   
        var findbox=$($(this).attr("href")).find(".content-padded");  
        findbox.empty();
        page = 0;
        ajaxdata(page,findbox,"refresh");  
    })  
    //第一次进入页面加载  
    ajaxdata(page,$("#tab1").find(".content-padded"));
    //下拉刷新
    $(".refresh").pullToRefresh().on("pull-to-refresh", function () {
		var self = this;  
	    if(self.loading) return;  
	    self.loading = true;  
	    setTimeout(function() {  
	       page = 0;  
	       ajaxdata(page,$(self).find(".content-padded"),"refresh");
	       self.loading = false;  
	    }, 1000);   //模拟延迟  
    });
    //滚动加载更多  
    $(".infinite").infinite().on("infinite", function() {  
        var self = this;  
        if(self.loading) return;  
        self.loading = true;  
        setTimeout(function() {  
            page=page+max;  
            ajaxdata(page,$(self).find(".content-padded"),"loadmore");  
            self.loading = false;  
        }, 1000);   //模拟延迟  
    });  
    
    //搜索框
    $('[name="searchInput"]').bind('search', function () {
    	var word = $('[name="searchInput"]').val();
    	window.location.href = encodeURI(Tools.getRootPath() + "/mobile/all_search?word=" + word); 
	});
})  
//ajax加载数据 p为page ele为元素  
function ajaxdata(p,ele,flag) {  
    //判断不同的tab标签  
    if(ele.parent().attr("id")=="tab1"){
    	$.ajax({  
            type:'get',  
            url:Tools.getRootPath() + "/api/receive/getTodoList?mobile=true&modelName=BUSITRIP",  
            data:
            {
    			start:page,
    			length:max
            },  
            cache:false,   
            success:function(resp){  
            	if(resp.data.length == 0 || resp.data.length < max){  
                    //没有数据时  
                    $(".infinite").destroyInfinite();
                    $(".weui-loadmore").html('<div class="weui-loadmore weui-loadmore_line"> <span class="weui-loadmore__tips">暂无新数据</span> </div>')  
      			}  
      			var html = '';
      			if(flag == 'refresh'){
      				ele.html('');
      				$(".refresh").pullToRefreshDone();
      				$(".infinite").infinite();
      				if(resp.data.length == 0 || resp.data.length < max){  
                        //没有数据时  
                        $(".infinite").destroyInfinite();
                        $(".weui-loadmore").html('<div class="weui-loadmore weui-loadmore_line"> <span class="weui-loadmore__tips">暂无新数据</span> </div>');  
          			}else{
          				$(".weui-loadmore").html('<div class="weui-loadmore">  <i class="weui-loading"></i>  <span class="weui-loadmore__tips">正在加载</span></div> ');
          			}
      			}
                for(var i=0;i<resp.data.length;i++){
                	html += '<div class="cell" onclick="toBtripDetail(' + resp.data[i].map.id + ')">';
	               	html += '	<div class="item"><svg class="ico icon small_ico" aria-hidden="true"><use xlink:href="#icon-contact-sign-date"></use></svg><div class="major"><span class="title">填写时间：</span><span class="content">'+ resp.data[i].map.fillDate +'</span></div></div>';
	   				html += '	<div class="item"><svg class="ico icon small_ico" aria-hidden="true"><use xlink:href="#icon-contact-customer"></use></svg><div class="major"><span class="title">出差人员：</span><span class="content">'+ resp.data[i].map.tripUserName +'</span></div></div>';
	   				html += '	<div class="item"><svg class="ico icon small_ico" aria-hidden="true"><use xlink:href="#icon-schedule-location"></use></svg><div class="major"><span class="title">出差地点：</span><span class="content">'+ resp.data[i].map.tripAddr +'</span></div></div>';
	   				html += '	<div class="item"><svg class="ico icon small_ico" aria-hidden="true"><use xlink:href="#icon-schedule-all-day"></use></svg><div class="major"><span class="title">出差时间：</span><span class="content">'+ resp.data[i].map.tripDate +'</span></div></div>';
	   				html += '</div>';
   	            }  
                ele.append(html);
            }  
        });  
    }else if(ele.parent().attr("id")=="tab2"){ 
    	$.ajax({  
            type:'get',  
            url:Tools.getRootPath() + "/api/receive/getTodoList?mobile=true&modelName=SUMUP",  
            data:{
    			start:page,
    			length:max
            },  
            cache:false,   
            success:function(resp){  
            	if(resp.data.length == 0 || resp.data.length < max){  
                    //没有数据时  
                    $(".infinite").destroyInfinite();
                    $(".weui-loadmore").html('<div class="weui-loadmore weui-loadmore_line"> <span class="weui-loadmore__tips">暂无新数据</span> </div>')  
      			}  
      			var html = '';
      			if(flag == 'refresh'){
      				ele.html('');
      				$(".refresh").pullToRefreshDone();
      				$(".infinite").infinite();
      				if(resp.data.length == 0 || resp.data.length < max){  
                        //没有数据时  
                        $(".infinite").destroyInfinite();
                        $(".weui-loadmore").html('<div class="weui-loadmore weui-loadmore_line"> <span class="weui-loadmore__tips">暂无新数据</span> </div>');  
          			}else{
          				$(".weui-loadmore").html('<div class="weui-loadmore">  <i class="weui-loading"></i>  <span class="weui-loadmore__tips">正在加载</span></div> ');
          			}
      			}
                for(var i=0;i<resp.data.length;i++){  
                	html += '<div class="cell" onclick="toSummaryDetail(' + resp.data[i].map.id + ')">';
                	html += '	<div class="item"><svg class="ico icon small_ico" aria-hidden="true"><use xlink:href="#icon-contact-sign-date"></use></svg><div class="major"><span class="title">填写时间：</span><span class="content">'+ resp.data[i].map.fillDate +'</span></div></div>';
    				html += '	<div class="item"><svg class="ico icon small_ico" aria-hidden="true"><use xlink:href="#icon-project-performance-date"></use><div class="major"></svg><span class="title">总结周期：</span><span class="content">'+ resp.data[i].map.type +'</span></div></div>';
    				html += '</div>';
   	            }  
                ele.append(html);
            }  
        });  
    }else if(ele.parent().attr("id")=="tab3"){  
    	$.ajax({  
            type:'get',  
            url:Tools.getRootPath() + "/api/receive/getTodoList?mobile=true&modelName=PROD",  
            data:{
    			start:page,
    			length:max
            },  
            cache:false,   
            success:function(resp){  
            	if(resp.data.length == 0 || resp.data.length < max){  
                    //没有数据时  
                    $(".infinite").destroyInfinite();
                    $(".weui-loadmore").html('<div class="weui-loadmore weui-loadmore_line"> <span class="weui-loadmore__tips">暂无新数据</span> </div>');  
      			}  
      			var html = '';
      			if(flag == 'refresh'){
      				ele.html('');
      				$(".refresh").pullToRefreshDone();
      				$(".infinite").infinite();
      				if(resp.data.length == 0 || resp.data.length < max){  
                        //没有数据时  
                        $(".infinite").destroyInfinite();
                        $(".weui-loadmore").html('<div class="weui-loadmore weui-loadmore_line"> <span class="weui-loadmore__tips">暂无新数据</span> </div>');  
          			}else{
          				$(".weui-loadmore").html('<div class="weui-loadmore">  <i class="weui-loading"></i>  <span class="weui-loadmore__tips">正在加载</span></div> ');
          			}
      			}  
                for(var i=0;i<resp.data.length;i++){
                	html += '<div class="cell" onclick="toProdDetail(' + resp.data[i].map.id + ')">';
                	html += '	<div class="item"><svg class="ico icon small_ico" aria-hidden="true"><use xlink:href="#icon-contact-sign-date"></use></svg><div class="major"><span class="title">填写时间：</span><span class="content">'+ resp.data[i].map.fillDate +'</span></div></div>';
    				html += '	<div class="item"><svg class="ico icon small_ico" aria-hidden="true"><use xlink:href="#icon-contract-name"></use></svg><div class="major"><span class="title">产品名称：</span><span class="content">'+ resp.data[i].map.prodName +'</span></div></div>';
    				if(resp.data[i].map.cnName == null){
    					html += '	<div class="item"><svg class="ico icon small_ico" aria-hidden="true"><use xlink:href="#icon-chinese"></use></svg><div class="major"><span class="title">中文别名：</span><span class="content">无</span></div></div>';
    				}else{
    					html += '	<div class="item"><svg class="ico icon small_ico" aria-hidden="true"><use xlink:href="#icon-chinese"></use></svg><div class="major"><span class="title">中文别名：</span><span class="content">'+ resp.data[i].map.cnName +'</span></div></div>';
    				}
    				if(resp.data[i].map.enName == null){
    					html += '	<div class="item"><svg class="ico icon small_ico" aria-hidden="true"><use xlink:href="#icon-english"></use></svg><div class="major"><span class="title">英文别名：</span><span class="content">无</span></div></div>';
    				}else{
    					html += '	<div class="item"><svg class="ico icon small_ico" aria-hidden="true"><use xlink:href="#icon-english"></use></svg><div class="major"><span class="title">英文别名：</span><span class="content">'+ resp.data[i].map.enName +'</span></div></div>';
    				}
    				if(resp.data[i].map.chemName == null){
    					html += '	<div class="item"><svg class="ico icon small_ico" aria-hidden="true"><use xlink:href="#icon-chemistry"></use></svg><div class="major"><span class="title">化学名称：</span><span class="content">无</span></div></div>';
    				}else{
    					html += '	<div class="item"><svg class="ico icon small_ico" aria-hidden="true"><use xlink:href="#icon-chemistry"></use></svg><div class="major"><span class="title">化学名称：</span><span class="content">'+ resp.data[i].map.chemName +'</span></div></div>';
    				}
    				if(resp.data[i].map.cas == null){
    					html += '	<div class="item"><svg class="ico icon small_ico" aria-hidden="true"><use xlink:href="#icon-certificate-number"></use></svg><div class="major"><span class="title">CAS  号：</span><span class="content">无</span></div></div>';
    				}else{
    					html += '	<div class="item"><svg class="ico icon small_ico" aria-hidden="true"><use xlink:href="#icon-certificate-number"></use></svg><div class="major"><span class="title">CAS  号：</span><span class="content">'+ resp.data[i].map.cas +'</span></div></div>';
    				}
    				html += '</div>';
   	            }  
                ele.append(html);
            }  
        });  
    }    
}

/*
 * 跳转出差详情
 */
function toBtripDetail(id){
	window.location.href = Tools.getRootPath() + "/mobile/btrip_detail?id=" + id;
}

/*
 * 跳转总结详情
 */
function toSummaryDetail(id){
	window.location.href = Tools.getRootPath() + "/mobile/summary_detail?id=" + id;
}

/*
 * 跳转产品详情
 */
function toProdDetail(id){
	window.location.href = Tools.getRootPath() + "/mobile/product_detail?id=" + id;
}