<!DOCTYPE html>
<html lang="en">
<head>
	<#include "/common/meta.ftl">
	<#include "/common/title.ftl">
	<#include "/common/resources.ftl">
</head>
<body class="hold-transition skin-blue-light">
	<section class="content">
      	<div class="error-page">
        	<div class="error-content" style="margin-left: 80px;">
          		<h3><i class="fa fa-warning text-yellow"></i> 消息提示</h3>
          		<p>
            	页面访问发生错误 ，您可以选择<a href="javascript:;" onclick="window.history.go(-1);"> 返回上一页</a>，也可以<a href="${ctx.contextPath}/dashboard/index" target="iframe"> 回到首页</a>.
          		</p>
        	</div>
      	</div>
    </section>
</body>
</html>