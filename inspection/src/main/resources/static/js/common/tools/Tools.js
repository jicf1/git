'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * 工具
 */
var Tools = {
	/**
  * 工程路径
  */
	getRootPath: function getRootPath() {
		var currentPath = window.document.location.href;
		var pathName = window.document.location.pathname;
		var pos = currentPath.indexOf(pathName);
		var localhostPaht = currentPath.substring(0, pos);
		var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
		return localhostPaht + projectName;
	},
	/**
  * Ajax
  */
	ajax: {
		post: function post(settings) {
			$.ajax({
				type: 'POST',
				url: settings.url,
				data: settings.data,
				dataType: "json",
				async: false,
				success: function success(data, textStatus) {
					if (settings.success) {
						settings.success(data);
					}
				},
				error: function error(XMLHttpRequest, textStatus, errorThrown) {
					if (settings.error) {
						settings.error(XMLHttpRequest, textStatus, errorThrown);
					} else {
						Tools.ly.alert("请求失败");
					}
				},
				complete: function complete(XMLHttpRequest, textStatus) {}
			});
		},
		get: function get(settings) {
			$.ajax({
				type: 'GET',
				url: settings.url,
				data: settings.data,
				dataType: "json",
				async: false,
				success: function success(data, textStatus) {
					if (settings.success) {
						settings.success(data);
					}
				},
				error: function error(XMLHttpRequest, textStatus, errorThrown) {
					if (settings.error) {
						settings.error(XMLHttpRequest, textStatus, errorThrown);
					} else {
						Tools.ly.alert("请求失败");
					}
				},
				complete: function complete(XMLHttpRequest, textStatus) {}
			});
		},
		json: function json(settings) {
			$.ajax({
				type: 'POST',
				url: settings.url,
				data: JSON.stringify(settings.data),
				dataType: "json",
				contentType: "application/json",
				async: false,
				success: function success(data, textStatus) {
					if (settings.success) {
						settings.success(data);
					}
				},
				error: function error(XMLHttpRequest, textStatus, errorThrown) {
					if (settings.error) {
						settings.error(XMLHttpRequest, textStatus, errorThrown);
					} else {
						Tools.ly.alert("请求失败");
					}
				},
				complete: function complete(XMLHttpRequest, textStatus) {}
			});
		}
	},
	upload: function upload(el, _success, _error) {
		var formData = new FormData();
		var files = $(el)[0].files;
		if (files != null && files.length > 0) {
			for (var i = 0; i < files.length; i++) {
				formData.append('attachment[]', files[i]);
			}
		}
		$.ajax({
			type: 'POST',
			url: Tools.getRootPath() + "/platform/atta/upload",
			data: formData,
			dataType: "json",
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			success: function success(data, textStatus) {
				if (_success) {
					_success(data);
				}
			},
			error: function error(XMLHttpRequest, textStatus, errorThrown) {
				if (_error) {
					_error(XMLHttpRequest, textStatus, errorThrown);
				} else {
					//					Tools.ly.alert("请求失败");
				}
			},
			complete: function complete(XMLHttpRequest, textStatus) {}
		});
	},
	date: {
		/**
   * 格式化日期
   */
		fmtDate: function fmtDate(date, fmt) {
			date = date == undefined ? new Date() : date;
			date = typeof date == 'number' ? new Date(date) : date;
			fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
			var obj = {
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

			var _loop = function _loop(i) {
				fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
					var val = obj[i] + '';
					if (i == 'w') return (m.length > 2 ? '星期' : '周') + week[val];
					for (var j = 0, len = val.length; j < m.length - len; j++) {
						val = '0' + val;
					}return m.length == 1 ? val : val.substring(val.length - m.length);
				});
			};

			for (var i in obj) {
				_loop(i);
			}
			return fmt;
		}
	},
	check: {
		/**
   * 校验正整数
   */
		isPositive: function isPositive(value) {
			var re = /^[0-9]+$/;
			return re.test(value);
		},
		/**
   * 值为空
   */
		isNull: function isNull(value) {
			return Tools.op.isEmpty(value);
		},
		/**
   * 值不为空o
   */
		isNotNull: function isNotNull(value) {
			return !Tools.check.isNull(value);
		},
		/**
   * 邮箱格式
   */
		isEmail: function isEmail(value) {
			return true;
		},
		/**
   * 手机号码格式
   */
		isPhone: function isPhone(value) {
			return true;
		}
	},
	/**
  * 操作
  */
	op: {
		/**
   * 判断不为空
   */
		isNotEmpty: function isNotEmpty(value) {
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
		isEmpty: function isEmpty(value) {
			return !Tools.op.isNotEmpty(value);
		},
		/**
   * 判断是否为数组
   */
		isArray: function isArray(object) {
			return object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && typeof object.length === 'number' && typeof object.splice === 'function' &&
			// 判断length属性是否是可枚举的 对于数组 将得到false
			!object.propertyIsEnumerable('length');
		},
		/**
   * 转为布尔类型
   */
		parseBool: function parseBool(value) {
			var b = null;
			if (value == "true" || value == true) {
				b = true;
			} else if (value == "false" || value == false) {
				b = false;
			}
			return b;
		}
	},
	/**
  * select2选中值方法
  */
	select2: function select2(_ctrl, value) {
		var $ctrl = $(_ctrl);
		$ctrl.children("option").prop("selected", false);
		$ctrl.children("option[value='" + value + "']").prop("selected", true);
		var text = $ctrl.children("option[value='" + value + "']").text();
		var $sel2 = $ctrl.next(".select2").find(".select2-selection__rendered");
		$sel2.attr("title", text);
		$sel2.text(text);
	},
	/**
  * ztree相关操作
  */
	zt: {
		/**
   * 获取选中tree节点
   */
		getSelected: function getSelected(treeId) {
			var node = null;
			var treeObj = $.fn.zTree.getZTreeObj(treeId);
			if (treeObj != null) {
				var nodes = treeObj.getSelectedNodes();
				if (nodes != null && nodes.length > 0) {
					node = nodes[0];
				}
			}
			return node;
		},
		/**
   * 获取选中tree节点
   */
		getChecked: function getChecked(treeId) {
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
	},
	/**
  * datatables相关操作
  */
	dt: {
		init: function init() {
			$("table.table thead tr, table.table tfoot tr").addClass("active");

			$("table.table").on("click", "tr", function () {
				var _dom = $(this).children("td").find("input[type='checkbox']");
				if (_dom.is(':checked')) {
					_dom.iCheck('uncheck');
				} else {
					_dom.iCheck('check');
				}
			});
		},
		/**
   * 加载表格数据
   */
		load: function load(options, isInit) {
			/*
    * el: url: columns: []
    */
			var defaults = {
				data: function data(map) {}
			};
			if (options.data) defaults.data = options.data;

			var table = $(options.el).DataTable({
				"processing": true,
				"searching": false,
				"destroy": true,
				"ordering": false,
				"autoWidth": false,
				"serverSide": true,
				"language": {
					"url": Tools.getRootPath() + "/conf/Chinese1.lang"
				},
				"ajax": {
					url: options.url,
					type: "GET",
					data: defaults.data
				},
				"columns": options.columns
			});
			Tools.dt.init();
			return table;
		},
		reload: function reload(tableObj) {
			tableObj.ajax.reload();
			Tools.dt.init();
		},
		/**
   * 获取选中行
   */
		getSelected: function getSelected(tableId) {
			var array = [];
			$("#" + tableId).find("tbody>tr").each(function (idx, ele) {
				var value = $(this).find("td:eq(0)").find("input[type='checkbox']:checked").val();
				if (Tools.op.isNotEmpty(value)) {
					array.push(value);
				}
			});
			return array;
		}
	},
	/**
  * layer相关操作
  */
	ly: {
		close: function close(index) {
			layer.close(index);
		},
		load: function load(options) {
			var data = {
				type: 1,
				shade: [1, '#FFFFFF'],
				parent: false
			};
			if (options != null && options != undefined) {
				if (options.type) data.type = options.type;
				if (options.shade) data.shade = options.shade;
				if (options.parent) data.parent = options.parent;
			}
			var index = null;
			if (data.parent) {
				index = parent.layer.load(data.type, { shade: data.shade });
			} else {
				index = layer.load(data.type, { shade: data.shade });
			}
			return index;
		},
		alert: function alert(content) {
			parent.layer.alert(content, { skin: 'layui-layer-lan', closeBtn: 0, anim: 0 });
		},
		modal: function modal(options) {
			var index = null;
			var data = {
				type: 1,
				shade: 0.2,
				title: "",
				area: ['100%', '100%'],
				maxmin: true,
				resize: true,
				el: null,
				cancel: function cancel(index, layero) {}, // 闭按钮触发的回调
				success: function success(layero, index) {}, // 弹出后的成功回调方法
				end: function end() {
					//					layer.closeAll();
				}, // 销毁
				yes: function yes(index, layero) {
					layer.close(index); //如果设定了yes回调，需进行手工关闭
					layer.closeAll();
				},
				btn: ['确定', '取消']
			};

			if (options != null && options != undefined) {
				if (options.type) data.type = options.type;
				if (options.shade) data.shade = options.shade;
				if (options.title) data.title = options.title;
				if (options.area) data.area = options.area;
				if (options.maxmin != null) data.maxmin = Tools.op.parseBool(options.maxmin);
				if (data.type == 1) {
					if (options.el) data.el = $(options.el);
				} else {
					if (options.el) data.el = options.el;
				}
				if (options.cancel) data.cancel = options.cancel;
				if (data.type == 1) {
					if (options.success) data.success = options.success;
				} else {
					data.success = function (layero, index) {
						if (options.success) {
							var iframe = $(window[layero.find('iframe')[0]['name']].document);
							options.success(index, iframe);
						}
					};
				}
				if (options.end) data.end = options.end;
				if (data.type == 1) {
					if (options.yes) data.yes = options.yes;
				} else {
					data.yes = function (index, layero) {
						var result = false;
						if (options.yes) {
							var iframe = $(window[layero.find('iframe')[0]['name']].document);
							result = options.yes(index, iframe);
						}
						if (result) layer.close(index);
					};
				}
				if (data.type == 1 || options.btn) {
					if (options.btn) data.btn = options.btn;
				} else {
					data.btn = null;
				}

				index = layer.open({
					type: data.type,
					shade: data.shade,
					title: data.title,
					area: data.area,
					maxmin: data.maxmin, // 开启最大化最小化按钮O
					content: data.el, // 捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
					cancel: data.cancel,
					success: data.success,
					end: data.end,
					yes: data.yes,
					btn: data.btn
				});
			}

			return index;
		},
		msg: function msg(content) {
			parent.layer.msg(content, { time: 2000 });
		},
		confirm: function confirm(options) {
			parent.layer.confirm(options.title, {
				btn: ['确定', '取消'], // 按钮
				skin: 'layui-layer-lan'
			}, function () {
				if (options.okFn) {
					options.okFn();
				}
			}, function () {
				if (options.cancleFn) {
					options.cancleFn();
				}
			});
		}
	}
};