$(function() {
	loadMenus();
	initMenuEvent();
});

function loadMenus() {
	var username = $.trim($("[name='username']").val());
	$ajax.get({
		url : '/platform/perm/getCurrentUserMenuTree',
		success : function (resp) {
			var _menus = $('.sidebar-menu');
			_menus.children().remove();
			_menus.append('<li class="header">主导航</li>');
			
			
			var datas = resp.datas;
			if (datas != null) {
				for (var idx in datas) {
					var data = datas[idx];	// 第一级
					var children = data.children;
					if (children == null || children.length == 0) {
						// 组装第一级，没有子元素
						var html = '';
						html += '<li>';
						html += '	<a class="menu" href="'+ $root() + data.url +'" target="view_iframe"><i class="fa fa-ravelry"></i> '+ data.name +'</a>';
						html += '</li>';
						_menus.append(html);
						continue;
					}
					// 有子元素
					var html = '';
					html += '<li class="treeview">';
					html += '	<a class="second_menu">';
					html += '		<i class="fa fa-ravelry"></i>';
					html += '		<span> '+ data.name +'</span>';
					html += '		<span class="pull-right-container">';
					html += '			<i class="fa fa-angle-left pull-right"></i>';
					html += '		</span>';
					html += '	</a>';
					html += '	<ul class="treeview-menu">';
					var childHtml = '';
					// 遍历第二级
					for (var cidx in children) {
						var child = children[cidx];	// 第二级
						html += '		<li><a class="menu" href="'+ $root() + child.url +'" target="view_iframe"> '+ child.name +'</a></li>';
						html += childHtml;
					}
					html += '	</ul>';
					html += '</li>';
					_menus.append(html);
				}
			}
			
			// 如果是系统管理员，将系统功能设置给他
			if (username === "admin") {
				var adminHtml = '';
				adminHtml += '<li class="treeview">';
				adminHtml += '	<a class="second_menu">';
				adminHtml += '		<i class="fa fa-ravelry"></i>';
				adminHtml += '		<span> 用户管理</span>';
				adminHtml += '		<span class="pull-right-container">';
				adminHtml += '			<i class="fa fa-angle-left pull-right"></i>';
				adminHtml += '		</span>';
				adminHtml += '	</a>';
				adminHtml += '	<ul class="treeview-menu">';
				adminHtml += '		<li><a class="menu" href="'+ $root() +'/router/utype/index" target="view_iframe"> 用户类型</a></li>';
				adminHtml += '		<li><a class="menu" href="'+ $root() +'/router/ubase/index" target="view_iframe"> 用户维护</a></li>';
				adminHtml += '	</ul>';
				adminHtml += '</li>';
				adminHtml += '<li class="treeview">';
				adminHtml += '	<a class="second_menu">';
				adminHtml += '		<i class="fa fa-ravelry"></i>';
				adminHtml += '		<span> 组织机构管理</span>';
				adminHtml += '		<span class="pull-right-container">';
				adminHtml += '			<i class="fa fa-angle-left pull-right"></i>';
				adminHtml += '		</span>';
				adminHtml += '	</a>';
				adminHtml += '	<ul class="treeview-menu">';
				adminHtml += '		<li><a class="menu" href="'+ $root() +'/router/dtype/index" target="view_iframe"> 类型维护</a></li>';
				adminHtml += '		<li><a class="menu" href="'+ $root() +'/router/dept/index" target="view_iframe"> 组织机构维护</a></li>';
				adminHtml += '		<li><a class="menu" href="'+ $root() +'/router/ud/index" target="view_iframe"> 分配部门</a></li>';
				adminHtml += '	</ul>';
				adminHtml += '</li>';
				adminHtml += '<li class="treeview">';
				adminHtml += '	<a class="second_menu">';
				adminHtml += '		<i class="fa fa-ravelry"></i>';
				adminHtml += '		<span> 职务岗位管理</span>';
				adminHtml += '		<span class="pull-right-container">';
				adminHtml += '			<i class="fa fa-angle-left pull-right"></i>';
				adminHtml += '		</span>';
				adminHtml += '	</a>';
				adminHtml += '	<ul class="treeview-menu">';
				adminHtml += '		<li><a class="menu" href="'+ $root() +'/router/duty/index" target="view_iframe"> 职务维护</a></li>';
				adminHtml += '		<li><a class="menu" href="'+ $root() +'/router/job/index" target="view_iframe"> 岗位维护</a></li>';
				adminHtml += '		<li><a class="menu" href="'+ $root() +'/router/permission/duty/perm" target="view_iframe"> 分配职务</a></li>';
				adminHtml += '	</ul>';
				adminHtml += '</li>';
				adminHtml += '<li class="treeview">';
				adminHtml += '	<a class="second_menu">';
				adminHtml += '		<i class="fa fa-ravelry"></i>';
				adminHtml += '		<span> 数据字典管理</span>';
				adminHtml += '		<span class="pull-right-container">';
				adminHtml += ' 			<i class="fa fa-angle-left pull-right"></i>';
				adminHtml += '		</span>';
				adminHtml += '	</a>';
				adminHtml += '	<ul class="treeview-menu">';
				adminHtml += '		<li><a class="menu" href="'+ $root() +'/router/dictype/index" target="view_iframe"> 类型维护</a></li>';
				adminHtml += '		<li><a class="menu" href="'+ $root() +'/router/dictionary/index" target="view_iframe"> 数据字典维护</a></li>';
				adminHtml += '	</ul>';
				adminHtml += '</li>';
				adminHtml += '<li class="treeview">';
				adminHtml += '	<a class="second_menu">';
				adminHtml += '		<i class="fa fa-ravelry"></i>';
				adminHtml += '		<span> 权限管理</span>';
				adminHtml += '		<span class="pull-right-container">';
				adminHtml += '			<i class="fa fa-angle-left pull-right"></i>';
				adminHtml += '		</span>';
				adminHtml += '	</a>';
				adminHtml += '	<ul class="treeview-menu">';
				adminHtml += '		<li><a class="menu" href="'+ $root() +'/router/privilege/index" target="view_iframe"> 权限维护</a></li>';
				adminHtml += '		<li><a class="menu" href="'+ $root() +'/router/role/index" target="view_iframe"> 角色维护</a></li>';
				adminHtml += '		<li><a class="menu" href="'+ $root() +'/router/permission/role/perm" target="view_iframe"> 分配权限</a></li>';
				adminHtml += '	</ul>';
				adminHtml += '</li>';
//				adminHtml += '<li class="treeview">';
//				adminHtml += '	<a class="second_menu">';
//				adminHtml += '		<i class="fa fa-ravelry"></i>';
//				adminHtml += '		<span> 日志管理</span>';
//				adminHtml += '		<span class="pull-right-container">';
//				adminHtml += '			<i class="fa fa-angle-left pull-right"></i>';
//				adminHtml += '		</span>';
//				adminHtml += '	</a>';
//				adminHtml += '	<ul class="treeview-menu">';
//				adminHtml += '		<li><a class="menu" href="'+ $root() +'/router/log/opindex" target="view_iframe"> 操作日志</a></li>';
//				adminHtml += '		<li><a class="menu" href="'+ $root() +'/router/log/loginindex" target="view_iframe"> 登录日志</a></li>';
//				adminHtml += '	</ul>';
//				adminHtml += '</li>';
				_menus.append(adminHtml);
			}
			
		}
	})
}

//初始化左侧菜单点击事件
function initMenuEvent() {
	
	$(".menu").on("click",function() {
		$("a.menu").parent("li").removeClass("active");
		$(this).parent("li").addClass("active");
	});
}


/*
 * <li class="treeview">
				<a class="second_menu">
		    		<i class="fa fa-ravelry"></i>
		    		<span> 用户管理</span>
		    		<span class="pull-right-container">
		    			<i class="fa fa-angle-left pull-right"></i>
		    		</span>
		    	</a>
		    	<ul class="treeview-menu">
		    		<li><a class="menu" href="${ctx.contextPath}/router/utype/index" target="view_iframe"> 用户类型</a></li>
		    		<li><a class="menu" href="${ctx.contextPath}/router/ubase/index" target="view_iframe"> 用户维护</a></li>
		   		</ul>
			</li>
			<li class="treeview">
				<a class="second_menu">
		    		<i class="fa fa-ravelry"></i>
		    		<span> 组织机构管理</span>
		    		<span class="pull-right-container">
		    			<i class="fa fa-angle-left pull-right"></i>
		    		</span>
		    	</a>
		    	<ul class="treeview-menu">
		    		<li><a class="menu" href="${ctx.contextPath}/router/dtype/index" target="view_iframe"> 类型维护</a></li>
		    		<li><a class="menu" href="${ctx.contextPath}/router/dept/index" target="view_iframe"> 组织机构维护</a></li>
		   			<li><a class="menu" href="${ctx.contextPath}/router/ud/index" target="view_iframe"> 分配部门</a></li>
		   		</ul>
			</li>
			<li class="treeview">
				<a class="second_menu">
		    		<i class="fa fa-ravelry"></i>
		    		<span> 职务岗位管理</span>
		    		<span class="pull-right-container">
		    			<i class="fa fa-angle-left pull-right"></i>
		    		</span>
		    	</a>
		    	<ul class="treeview-menu">
		    		<li><a class="menu" href="${ctx.contextPath}/router/duty/index" target="view_iframe"> 职务维护</a></li>
		    		<li><a class="menu" href="${ctx.contextPath}/router/job/index" target="view_iframe"> 岗位维护</a></li>
		   			<li><a class="menu" href="${ctx.contextPath}/router/permission/duty/perm" target="view_iframe"> 分配职务</a></li>
		   		</ul>
			</li>
			<li class="treeview">
				<a class="second_menu">
		    		<i class="fa fa-ravelry"></i>
		    		<span> 数据字典管理</span>
		    		<span class="pull-right-container">
		    			<i class="fa fa-angle-left pull-right"></i>
		    		</span>
		    	</a>
		    	<ul class="treeview-menu">
		    		<li><a class="menu" href="${ctx.contextPath}/router/dictype/index" target="view_iframe"> 类型维护</a></li>
		    		<li><a class="menu" href="${ctx.contextPath}/router/dictionary/index" target="view_iframe"> 数据字典维护</a></li>
		   		</ul>
			</li>
			<li class="treeview">
				<a class="second_menu">
		    		<i class="fa fa-ravelry"></i>
		    		<span> 权限管理</span>
		    		<span class="pull-right-container">
		    			<i class="fa fa-angle-left pull-right"></i>
		    		</span>
		    	</a>
		    	<ul class="treeview-menu">
		    		<li><a class="menu" href="${ctx.contextPath}/router/privilege/index" target="view_iframe"> 权限维护</a></li>
		    		<li><a class="menu" href="${ctx.contextPath}/router/role/index" target="view_iframe"> 角色维护</a></li>
		    		<li><a class="menu" href="${ctx.contextPath}/router/permission/role/perm" target="view_iframe"> 分配权限</a></li>
		   		</ul>
			</li>
			<li class="treeview">
				<a class="second_menu">
		    		<i class="fa fa-ravelry"></i>
		    		<span> 日志管理</span>
		    		<span class="pull-right-container">
		    			<i class="fa fa-angle-left pull-right"></i>
		    		</span>
		    	</a>
		    	<ul class="treeview-menu">
		    		<li><a class="menu" href="${ctx.contextPath}/router/log/opindex" target="view_iframe"> 操作日志</a></li>
		    		<li><a class="menu" href="${ctx.contextPath}/router/log/loginindex" target="view_iframe"> 登录日志</a></li>
		   		</ul>
			</li>
 */
