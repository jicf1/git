function $root() {
	var currentPath = window.document.location.href;
	var pathName = window.document.location.pathname;
	var pos = currentPath.indexOf(pathName);
	var localhostPaht = currentPath.substring(0, pos);
	var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
	return (localhostPaht + projectName);	
}

var $date = {
		/**
		 * 格式化日期
		 */
		fmtDate: function(date, fmt) {
			date == null ? new Date() : date;
			fmt == null ? 'yyyy-MM-dd HH:mm:ss' : fmt;
		    var obj =
		    {
		        'y': date.getFullYear(), // 年份，注意必须用getFullYear
		        'M': date.getMonth() + 1, // 月份，注意是从0-11
		        'd': date.getDate(), // 日期
		        'q': Math.floor((date.getMonth() + 3) / 3), // 季度
		        'w': date.getDay(), // 星期，注意是0-6
		        'H': date.getHours(), // 24小时制
		        'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
		        'm': date.getMinutes(), // 分钟
		        's': date.getSeconds(), // 秒
		        'S': date.getMilliseconds() // 毫秒
		    };
		    var week = ['天', '一', '二', '三', '四', '五', '六'];
		    for(var i in obj)
		    {
		        fmt = fmt.replace(new RegExp(i+'+', 'g'), function(m)
		        {
		            var val = obj[i] + '';
		            if(i == 'w') return (m.length > 2 ? '星期' : '周') + week[val];
		            for(var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val;
		            return m.length == 1 ? val : val.substring(val.length - m.length);
		        });
		    }
		    return fmt;
		},
	}

var $select2 = {
	selected : function() {
		var $ctrl = $(_ctrl);
		$ctrl.children("option").prop("selected", false);
		$ctrl.children("option[value='"+ value +"']").prop("selected", true);
		var text = $ctrl.children("option[value='" + value + "']").text();
		var $sel2 = $ctrl.next(".select2").find(".select2-selection__rendered");
		$sel2.attr("title", text);
		$sel2.text(text);
	}
}

var $op = {
		/**
		 * 判断不为空
		 */
		isNotEmpty: function(value) {
			// 数组
			if (Tools.op.isArray(value) && (value == null || value == undefined || value == 'undefined' || value.length == 0)) {
				return false;
			} 
			// 字符串
			else {
				if (value == null || value == 'null' || value == undefined || value == 'undefined' || value == '' || value.trim().length == 0) {
					return false;
				}
			}
			return true;
		},
		/**
		 * 判断不为空
		 */
		isEmpty: function(value) {
			return !Tools.op.isNotEmpty(value);
		},
		/**
		 * 判断是否为数组
		 */
		isArray: function(object) {
			return Object.prototype.toString.call(object)=='[object Array]';
		},
		/**
		 * 转为布尔类型
		 */
		parseBool: function(value) {
			var b = null;
			if (value == "true" || value == true) {
				b = true;
			} else if (value == "false" || value == false) {
				b = false;
			}
			return b;
		}
}

var $loading = {
    load: function(content){
    	content = (content == null || content == undefined || content == "undefined" )  ? "数据加载中..." : content;
    	var html = '';
    	html += '<style>';
    	html += '	.mloading.mloading-mask{background: rgba(255, 255, 255, 0);}';
    	html += '</style>';
    	html += '<div class="loading-box" style="width: 360px; margin: 20% auto; text-align: center;">';
    	html += '	<span style="font-size: 28px; padding: 10px;">';
    	html += '	<i class="fa fa-spin fa-spinner"></i> <i>'+ content +'</i>';
    	html += '	</span>';
    	html += '</div>';
    	$('body').mLoading({
    		    html: true,//设置加载内容是否是html格式，默认值是false
    		    content: html,
    	});
    },
    close: function(delay) {
    	delay == null ? true : delay;
    	var time = 100;
    	if (delay) {
    		time = 500;
    	}
    	setTimeout(function() {
    		$('body').mLoading('hide');
    	},time);
    }
}

var $ajax = {
		post: function(settings) {
			$.ajax({
				type: 'POST',
				url: $root() + settings.url,
				data: settings.data == null ? {} : settings.data,
				dataType: "json",
				async: settings.async == null ? false : settings.async,
				beforeSend: function(XMLHttpRequest) {
					if (settings.before) {
						settings.before(XMLHttpRequest);
					}
				},
				success: function(data, textStatus) {
					if(settings.success) {
						settings.success(data);
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					if(settings.error) {
						settings.error(XMLHttpRequest, textStatus, errorThrown);
					}
				},
				compvare: function(XMLHttpRequest, textStatus) {
					if (settings.compvare) {
						settings.compvare(XMLHttpRequest, textStatus);
					}
				}
			});
		},		
		put: function(settings) {
			$.ajax({
				type: 'PUT',
				url: $root() + settings.url,
				data: settings.data == null ? {} : settings.data,
				dataType: "json",
				async: settings.async == null ? false : settings.async,
				beforeSend: function(XMLHttpRequest) {
					if (settings.before) {
						settings.before(XMLHttpRequest);
					}
				},
				success: function(data, textStatus) {
					if(settings.success) {
						settings.success(data);
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					if(settings.error) {
						settings.error(XMLHttpRequest, textStatus, errorThrown);
					}
				},
				compvare: function(XMLHttpRequest, textStatus) {
					if (settings.compvare) {
						settings.compvare(XMLHttpRequest, textStatus);
					}
				}
			});
		},	
		get: function(settings) {
			$.ajax({
				type: 'GET',
				url: $root() + settings.url,
				data: settings.data == null ? {} : settings.data,
				dataType: "json",
				async: settings.async == null ? false : settings.async,
				beforeSend: function(XMLHttpRequest) {
					if (settings.before) {
						settings.before(XMLHttpRequest);
					}
				},
				success: function(data, textStatus) {
					if(settings.success) {
						settings.success(data);
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					if(settings.error) {
						settings.error(XMLHttpRequest, textStatus, errorThrown);
					}
				},
				compvare: function(XMLHttpRequest, textStatus) {
					if (settings.compvare) {
						settings.compvare(XMLHttpRequest, textStatus);
					}
				}
			});
		},
		json: function(settings) {
			$.ajax({
				type: 'POST',
				url: $root() + settings.url,
				data: settings.data == null ? {} : JSON.stringify(settings.data),
				dataType: "json",
				contentType: "application/json",
				async: settings.async == null ? false : settings.async,
				beforeSend: function(XMLHttpRequest) {
					if (settings.before) {
						settings.before(XMLHttpRequest);
					}
				},
				success: function(data, textStatus) {
					if(settings.success) {
						settings.success(data);
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					if(settings.error) {
						settings.error(XMLHttpRequest, textStatus, errorThrown);
					}
				},
				compvare: function(XMLHttpRequest, textStatus) {
					if (settings.compvare) {
						settings.compvare(XMLHttpRequest, textStatus);
					}
				}
			});
		},
}

var $ly = {
		load: function() {
			return layer.load(1, {
				shade: [0.1,'#fff'] //0.1透明度的白色背景
			});
		},
		close: function(index) {
			layer.close(index);
		},
		alert: function(content) {
			parent.layer.alert(content, {skin: 'layui-layer-lan',closeBtn: 0,anim: 0});
		},
		open: function(settings) {
			var index = null;
			var defaults = {
				type: 2,
				shade: 0.2,
				title: settings.title ? settings.title : "",
				area: settings.area ? settings.area: ['100%', '100%'],
				maxmin: true,
				resize: true,
				url: $root() + settings.url,
				cancel: function(index, layero) {},	// 闭按钮触发的回调
				success: function(layero, index) {},	// 弹出后的成功回调方法
				end: function(){
					// layer.closeAll();
				},
				yes: function(index, layero){},
				btn: ['确定', '取消'],
			};

			defaults.success = function(layero, index) {
				if (settings.before) {
					var iframe = $(window[layero.find('iframe')[0]['name']].document);
					settings.before(index, iframe);
				}
			}
			
			defaults.yes = function(index, layero) {
				var result = true;
				if (settings.confirm) {
					var iframe = $(window[layero.find('iframe')[0]['name']].document);
					result = settings.confirm(index, iframe);
				}
				if (result) layer.close(index);
			}
			
			index = layer.open({
				  type: defaults.type,
				  shade: defaults.shade,
				  title: defaults.title,
				  area: defaults.area,
				  maxmin: defaults.maxmin, // 开启最大化最小化按钮O
				  content: defaults.url, // 捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
				  cancel: defaults.cancel,
				  success: defaults.success,
				  end: defaults.end,
				  yes: defaults.yes,
				  btn: defaults.btn
			});
			
			return index;
		},
		msg: function(content) {
			parent.layer.msg(content,{time: 2000});
		},
		confirm: function(settings) {
			parent.layer.confirm(settings.title, {
				  btn: ['确定','取消'], // 按钮
				  skin: 'layui-layer-lan'
				}, function(){
					if (settings.okFn) {
						settings.okFn(); 
					}
				}, function(){
					if (settings.cancleFn) {
						settings.cancleFn();
					}
				}
			);
		},
}

var $dt = {
	/**
	 * 加载表格数据
	 */
	load: function(settings) {
		var defaults = {
			data: function(map) {}
		}
		
		var table = $(settings.el).DataTable({
			"processing": true,
			"searching" : false,
			"destroy": true,
			"ordering": false,
			"autoWidth": false,
			"serverSide" : true,
			"language" : {
				"url" : $root() + "/conf/Chinese1.lang"
			},
			"ajax" : {
				url : $root() + settings.url,
				type : "GET",
				data: settings.data ? settings.data : defaults.data
			},
			"columns" : settings.columns,
			"fnInitComplete": settings.fnInitComplete
		});
		return table;
	},
	reload: function(tableObj) {
		tableObj.ajax.reload();
	},
	/**
	 * 获取选中行
	 */
	getSelected: function(tableId) {
		var array = [];
		$("#" + tableId).find("tbody>tr").each(function(idx, ele) {
			var value = $(this).find("td:eq(0)").find("input[type='checkbox']:checked").val();
			if(Tools.op.isNotEmpty(value)) {
				array.push(value);
			}
		});
		return array;
	},
}

var $zt = {
	getSelected: function(treeId) {
		var node = null;
		var treeObj = $.fn.zTree.getZTreeObj(treeId);
		var nodes = treeObj.getSelectedNodes();
		if (nodes != null && nodes.length > 0) {
			node = nodes[0];
		}
		return node;
	},
	getChecked: function(treeId) {
		var nodes = null;
		var treeObj = $.fn.zTree.getZTreeObj(treeId);
		if (treeObj != null) {
			var nodeArray = treeObj.getCheckedNodes(true);
			if (nodeArray != null && nodeArray.length > 0) {
				nodes = nodeArray;
			}
		}
		return nodes;
	}
}

var $check = {
		/**
		 * 校验正整数
		 */
		isPositive: function (value) {
			var re = /^[0-9]+$/ ;
		    return re.test(value);
		},
		/**
		 * 值为空
		 */
		isNull: function(value) {
			return Tools.op.isEmpty(value);
		},
		/**
		 * 值不为空
		 */
		isNotNull: function(value) {
			return !Tools.check.isNull(value);
		},
		/**
		 * 邮箱格式
		 */
		isEmail: function(value) {
			return true;
		},
		/**
		 * 手机号码格式
		 */
		isPhone: function(value) {
			return true;
		},
}

var $file = {
	upload : function(el, catalog, success, error) {
		var idStr = '';
		if (typeof catalog == 'function') {
			error = success;
			success = catalog;
			catalog = "";
		}
		var formData = new FormData();
		var files = $(el)[0].files;
		if (files != null && files.length > 0) {
			for (var i = 0; i < files.length; i++) {
				formData.append('attachment[]', files[i]);
			}
		}
		$.ajax({
			type: 'POST',
			url : $root() + "/platform/atta/upload?catalog=" + catalog,
			data: formData,
			dataType: "json",
			async : false,
			cache: false,
			contentType: false,
			processData: false,
			success: function(data, textStatus){
				if(success) {
					success(data);
				}
				if (data.success) {
					idStr = $file.join(data.datas);
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				if(error) {
					error(XMLHttpRequest, textStatus, errorThrown);
				}
			},
			compvare : function (XMLHttpRequest, textStatus) {
				
			}
		});
		return idStr;
	},
	join: function(datas) {
		var str = '';
		if (datas != null && datas.length > 0) {
			for (var i = 0; i < datas.length; i++) {
				str += datas[i].id + ',';
			}
			return str.substring(0, str.lastIndexOf(','));
		}
		return str;
	},
	get: function(ids) {
		var attas = null;
		var str = '';
		if(Object.prototype.toString.call(ids)=='[object Array]') {
			// 是数组
			str = ids.join(',');
		} else {
			str = ids;
		}
		if ($op.isEmpty(str)) return null;
		$ajax.get({
			url: '/platform/atta/' + str,
			data: {},
			success: function(resp) {
				if (resp.success) {
					if (resp.datas != null) {
						attas = resp.datas;
					}
				} else {
					$ly.alert('查询附件失败');
				}
			}
		});
		return attas;
	},
	show: function(settings) {
		if (settings.el == null || settings.datas == null) return null;
		var defaults = {
			el: settings.el,
			datas: settings.datas,
			scope: null,
			style: 'width: 50%;',
		}
		var _list = null;
		if (settings.scope == null) {
			_list = $("[data-file-list='"+ defaults.el +"']");
		} else {
			_list = settings.scope.find("[data-file-list='"+ defaults.el +"']");
		}
		if (settings.style != null) {
			defaults.style = settings.style;
		}
		var datas = defaults.datas;
		for (var i = 0; i < datas.length; i++) {
			var data = datas[i];
			var src = $root() + data.path;
			var html = '';
			html += '<div style="margin-bottom: 2px; position: relative;" data-file-item="'+ defaults.el +'" data-file-id="'+ data.id +'">';
			html += '	<img src="'+ src +'" alt="'+ data.name +'" style="'+ defaults.style +'"></img>';
			html += '</div>';
			_list.append(html);
		}
	},
} 


// 日期格式化
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


