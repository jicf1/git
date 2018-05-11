package cn.proem.inspection.security;

import java.util.HashMap;
import java.util.Map;

import org.apache.shiro.mgt.DefaultSecurityManager;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 过滤配置
 * @author jicf
 *
 * @date 2018年5月10日
 */
@Configuration
public class ShiroConfiguration {

	/**
	 * 将自己的验证方式加入到容器中
	 * @author jicf
	 */
	@Bean
	public ShiroRealm shiroRealm(){
		ShiroRealm shiroRealm = new ShiroRealm();
		return shiroRealm;
	}
	
	/**
	 * 权限管理
	 * @author jicf
	 */
	@Bean
	public SecurityManager securityManager() {
		DefaultSecurityManager securityManager = new DefaultWebSecurityManager();
		securityManager.setRealm(shiroRealm());
		return securityManager;
	}
	
	
	/**
	 * Filter工厂，设置对应的过滤条件和跳转条件
	 * @author jicf
	 */
	@Bean
	public ShiroFilterFactoryBean shiroFilterFactoryBean(SecurityManager securityManager) {
		ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
		shiroFilterFactoryBean.setSecurityManager(securityManager);
	    Map<String,String> map = new HashMap<String,String>();
		//登出
		map.put("/logout","logout");
		//对所有用户认证
		map.put("cn.proem.**/login","authc");
		//登录
		shiroFilterFactoryBean.setLoginUrl("/login");
		//首页
		shiroFilterFactoryBean.setSuccessUrl("/index");
		//错误页面，认证不通过跳转
		shiroFilterFactoryBean.setUnauthorizedUrl("/error");
		shiroFilterFactoryBean.setFilterChainDefinitionMap(map);
		return shiroFilterFactoryBean;
	}
	
	/**
	 * 开启注释
	 * @author jicf
	 */
	@Bean
	public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor(SecurityManager securityManager) {
		AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor = new AuthorizationAttributeSourceAdvisor();
		authorizationAttributeSourceAdvisor.setSecurityManager(securityManager);
		return authorizationAttributeSourceAdvisor;
	}
}
