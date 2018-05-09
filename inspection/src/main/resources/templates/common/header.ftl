<style>
    .proem-headerbar a{text-decoration: none;}
	.proem-headerbar a:hover img{
        opacity:0.5;
        filter:alpha(opacity=50);
    }
</style>
<style>
	a.logout:HOVER{cursor:pointer;}
</style>
<header class="main-header">
	<div class="row" style="background:#fff;border-bottom:2px solid #026DCF;">
        <div class="col-sm-8" style="padding:10px 0px 10px 40px;">
             <table>
                <tbody>
                    <tr>
                    <td><a href="javascript:;" onclick="document.getElementById('view_iframe').src='${ctx.contextPath}/welcome';"><img src="${ctx.contextPath}/img/logo.png" style="height:50px;"></a></td>
                    <!-- <td style="font-size:30px;font-family:SimHei;color:white;text-shadow: gray 0 3px 0;padding-left:20px;">江苏省铁路工程专业职称网上申报系统</td> -->
                    </tr>
                </tbody>
             </table>
        </div>
        <div id="userinfo" class="col-sm-4" style="padding-right:40px;text-align:right;">
                <table class="pull-right proem-headerbar">
                    <tr>
                        <td style="padding-top:20px;">
                            <img style="width:35px;height:35px;" src="${ctx.contextPath}/img/用户.png"/>
                        </td>
                        <td style="padding-left:5px;padding-top:25px;padding-bottom:5px;text-align:left;">
                            <p style="font-size:15px;font-family:SimHei;color:#026DCF;text-shadow: gray 0 1px 0;">您好，${user.name}</p>
                        </td>
                       <td style="padding-top:20px;" width="50px">
                            <a href="#" onclick="document.getElementById('view_iframe').src='${ctx.contextPath}/welcome';" title="首页" href="javascript:;">
                                <img style="width:30px;height:30px;" src="${ctx.contextPath}/img/首页.png"/>
                            </a>
                        </td>
                       <td style="padding-top:20px;" width="50px">
                            <a href="#" onclick="openModifyPassword();" title="修改密码" href="javascript:;">
                                <img style="width:30px;height:30px;" src="${ctx.contextPath}/img/修改密码.png"/>
                            </a>
                        </td>
                        <td style="padding-top:20px;" width="50px">
                            <a  href="javascript:;"  class="logout" title="注销" >
                                <img style="width:30px;height:30px;" src="${ctx.contextPath}/img/注销.png"/>
                            </a>
                        </td>
                    <tr>
                </table>
        </div>
    </div>
</header>
<div id="modify-password" style="padding: 20px; display: none">
	<form class="form-horizontal modify-password-form">
		<input type="hidden" name="username" value="${user.username}">
		<div class="box-body">
			<div class="form-group">
				<label class="col-sm-offset-1 col-sm-2 control-label">新密码<span class="red"> *</span></label>
				<div class="col-sm-7">
					<input type="password" class="form-control" name="newPassword">
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-offset-1 col-sm-2 control-label">确认新密码<span class="red"> *</span></label>
				<div class="col-sm-7">
					<input type="password" class="form-control" name="confirmPassword">
				</div>
			</div>
		</div>
		</div>
	</form>
</div>

<script src="${ctx.contextPath}/js/common/tools/md5.js"></script>
<script src="${ctx.contextPath}/js/common/header.js"></script>