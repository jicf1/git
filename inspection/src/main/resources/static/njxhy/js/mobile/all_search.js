$(function () { 
	//返回按钮
	$('#back').click(function(){
		window.history.back();
	});
	var str = window.location.search;
	if(str != "" && str != undefined) {
		var type = new Array("0","1","2");
		var word = decodeURI(str.split("=")[1]);
		search(type,word);
	}
    //搜索框
    $('[name="searchInput"]').bind('search', function () {
    	var type = new Array("0","1","2");
    	var word = $('[name="searchInput"]').val();
    	search(type,word);
	});
})  

/*
 * 搜索
 */
function search(type,word){
	$.ajax({  
        type:'get',  
        url:Tools.getRootPath() + "/api/elastic/document/doc/query?mobile=true",  
        data:
        {
        	word:word,
        	types:type
        },  
        success:function(resp){  
        	if(resp.hits.hits.length == 0){  
                //没有数据时 
                layer.alert("暂无匹配数据");
  			} 
        	$('#doc').html('');
  			var html = '';
            for(var i=0;i<resp.hits.hits.length;i++){
            	html += '<div class="doc">'
            	html += '	<div onclick="preview(\''+ resp.hits.hits[i]._source.id +'\')"><svg class="ico icon small_ico" aria-hidden="true"><use xlink:href="#icon-contract-name"></use></svg><div class="major">文件名称：<span style="color:#7AA8F2">'+ resp.hits.hits[i]._source.filename +'</span></div></div>';
            	html += '	<div><svg class="ico icon small_ico" aria-hidden="true"><use xlink:href="#icon-contact-customer"></use></svg><div class="major">创建人员：<span style="color:gray">'+ resp.hits.hits[i]._source.owner +'</span></div></div>';
            	if(resp.hits.hits[i]._source.content != null && resp.hits.hits[i]._source.content != ''){
            		html += '<div><svg class="ico icon small_ico" aria-hidden="true"><use xlink:href="#icon-contact-sign-date"></use></svg><div class="major">创建时间：<span style="color:gray">'+ resp.hits.hits[i]._source.content.split(',')[3].split('=')[1] +'</span></div></div>';
            	}else{
            		html += '<div><svg class="ico icon small_ico" aria-hidden="true"><use xlink:href="#icon-contact-sign-date"></use></svg><div class="major">创建时间：<span style="color:gray">无</span></div></div>';
            	}
            	html += '</div>';
            }  
            $('#doc').append(html);
        }  
    });  
}

/*
 * 预览
 */
function preview(id){
	$.ajax({  
        type:'get',  
        url:Tools.getRootPath() + "/api/doc/doc/find?id=" + id +"&mobile=true",  
        data:{},  
        success:function(response){  
        	var doc = response.obj.doc;
		 	var temp = response;
		 	if(doc){
		 		$.ajax({  
		 	        type:'get',  
		 	        url:Tools.getRootPath() + "/api/resource/has?id=" + id + "&mobile=true",  
		 	        data:{},  
		 	        success:function(response){  
		 			 	if(response.errcode == 0){
		 			 		if(doc.type){
		 			 			if(doc.path){
			 			 			window.open(Tools.getRootPath() + '/plugins/pdfJs/generic/web/viewer.html?file=' + Tools.getRootPath() + '/document/pdfJs/doc/' + response.id);
		 			 			}else if(temp.obj.attachs.length > 0){
					    			window.open(Tools.getRootPath() + "/document/preview?id=" + temp.obj.attachs[0].id);
					    		}else{
					    			layer.alert("未找到对应文档");
					    		 }
		 			 		}else{
		 			 			window.location.href = Tools.getRootPath() + "/document/editor?id=" + response.id;
		 			 		}
		 			 	}else{
		 			 		layer.alert("对不起，您没有访问权限");
		 			 	}
		 	        }  
		 	    });
		 	}else{
		 		layer.alert("未找到文件");
		 	}
        }  
    });
}
