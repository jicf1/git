<!DOCTYPE html>
<html lang="en">
<head>
    <#include "/common/meta.ftl">
    <#include "/common/title.ftl">
    <#include "/common/resources.ftl">
    <script src="${ctx.contextPath}/js/common/tools/md5.js"></script>
    <style>
        .login-logo * {font-size: 30px !important;}
        form .form-group {
            margin-bottom: 10px;
        }
        .copyright{text-align: center; padding: 14px 0 0 0;color: #000;}
        a:hover{
            text-decoration:underline; 
        }
    </style>
    <script>
        document.onkeydown = function(event){
            if(event.keyCode==13){
                   document.getElementById('login_btn').click();
            }
        }
    </script>
</head>
<body class="hold-transition login-page login-bg"  style="background: #fff;">
    <div class="container-fluid">
    <div class="row" style="background:#fff;">
        <div class="col-sm-12" style="padding:10px 0px 10px 40px;">
             <table>
                <tbody>
                <tr>
                    <td style="font-size:20px;font-family:SimHei;color:white;text-shadow: gray 0 3px 0;padding-left:20px;"><img src="${ctx.contextPath}/img/logo.png" style="height:70px;"></td>
                </tr>
             </tbody></table>
        </div>
    </div>

    <div class="row" style="background:url('${ctx.contextPath}/img/login_background.jpg') fixed center center no-repeat;background-size: cover;">
        <div class="col-sm-12">
            <div id="login" class="login-box" style="margin-top:80px;margin-bottom:80px;">
                <div class="login-box-body"  style="border:2px solid #037dc6;">
                    <div class="login-logo" style="border-bottom:1px solid #037dc6;margin-bottom:0px;">
                        <label style="font-size: 24px!important;font-family:SimHei;">登录</label>
                    </div>
                    <form action="${ctx.contextPath}/login" method="post">
                        <span class="help-block" style="color:#dd4b39;text-align:center;height:10px;"><small v-show="isShow"><i class="fa fa-times-circle-o"></i>用户名或密码错误</small></span>
                        <div class="form-group has-feedback"  v-bind:class="{'has-error': errors.has('loginname')}">
                                <input type="text" v-validate="'required'" id='loginname' name='loginname' class="form-control" v-model="username" placeholder="用户名">
                                <span class="fa fa-user form-control-feedback"></span>
                                <span style="height:10px;"  class="help-block"><small v-show="errors.has('loginname')"><i class="fa fa-times-circle-o"></i> 用户名不能为空</small></span>
                        </div>
                        
                        <div class="form-group has-feedback" v-bind:class="{'has-error': errors.has('loginpwd')}">
                                <input type="password" v-validate="'required'" id='loginpwd' v-model="password" name='loginpwd' class="form-control" placeholder="密码">
                                <span class="fa fa-lock form-control-feedback"></span>
                                <span style="height:10px;" class="help-block"><small v-show="errors.has('loginpwd')" ><i class="fa fa-times-circle-o"></i> 请输入密码</small></span>
                            
                        </div>
                        <div class="row" style="margin-top:10px;">
                            <div class="col-xs-12">
                                <input type="submit" class="btn btn-primary btn-block btn-flat btn-login" value="登录"/>
                            </div>
                        </div>
                        <!-- <div class="row" style="margin-top:10px;">
                            <div class="col-xs-6 pull-right" style="text-align:right;padding-right:25px;">
                                <a href="${ctx.contextPath}/application/forgot">忘记密码</a>
                            </div>
                        </div>-->
                    </form>
                </div>
            </div><!-- .login-box -->
        </div><!-- .col -->
    </div><!-- .row -->
    
    <div class="row">
        <div class="col-sm-12">
            <table style="width:100%;">
                <tr>
                    <td style="padding:20px 20px 20px 20px;">
                        <p>建议您使用IE10+、FireFox、Google Chrome，分辨率1280*800及以上浏览本网站，获得更好用户体验。</p>
                        <p>版权所有 © 2015-2018  南京新化原化学有限公司|南京化工原料总公司<p>
                        <p><p>
                    </td>
                    <td style="padding:20px 20px 20px 20px;" >
                        <!-- <img style="height:50px;" src="${ctx.contextPath}/img/weixin.jpg" /> -->
                        <a href="${ctx.contextPath}/update" target="_blank"><b>更新日志</b></a>
                    </td>
                <tr>
            </table>
        </div>
    </div><!-- .row -->
    </div>
</body>

<script>
    $(function(){  
        
    })
</script>
</html>