package cn.proem.inspection.security;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;

import cn.proem.framework.rbac.entity.User;
import cn.proem.inspection.sys.service.UserService;

/**
 * 用户认证
 * @author jicf
 *
 * @date 2018年5月10日
 */
public class ShiroRealm extends AuthorizingRealm{

	@Autowired
	private UserService userService;
	
	/**
	 * /**
	 * 角色权限和对应权限添加
	 */
	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
		// TODO Auto-generated method stub
		//获取登录名
		String name =(String)principalCollection.getPrimaryPrincipal();
		User user = new User();
		user.setUsername(name);
		user = userService.findUserByName(user);
		AuthorizationInfo authenticationInfo = (AuthorizationInfo) new SimpleAuthenticationInfo();
		return authenticationInfo;
	}

	 /**
	  * 用户认证
	  */
	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
		// TODO Auto-generated method stub
		 if(token.getPrincipal() == null) {
			 return null;
		 }
		 String name = token.getPrincipal().toString();
		 User user = new User();
		 user.setUsername(name);
		 user = userService.findUserByName(user);
		 if(user == null) {
			 return null;
		 }
		 else {
			 SimpleAuthenticationInfo  authenticationInfo = new SimpleAuthenticationInfo(name,user.getPassword(),user.getName());
			 return authenticationInfo;
		 }
	}

}
