package cn.proem.inspection.sys.web;


import java.util.Map;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import cn.proem.framework.context.utils.tool.MD5Util;
import cn.proem.framework.context.web.context.GeneralController;
import cn.proem.framework.rbac.entity.User;
import cn.proem.inspection.sys.service.UserService;

/**
 * 主页面
 * 
 * @author jicf
 */
@Controller
public class LoginController extends GeneralController {
	
	@Autowired
	private UserService userService;

	/**
	 * 登录页面
	 * 
	 * @return
	 * @author jicf
	 */
	@RequestMapping({ "", "/" })
	public ModelAndView inspection() {
		return new ModelAndView("login");
	}
	
	@RequestMapping(value="/login", method=RequestMethod.GET)
	public ModelAndView login() {
		return new ModelAndView("login");
	}
	
	@RequestMapping(value="/login", method=RequestMethod.POST)
	public String login(String loginname,String loginpwd,Model model) {
		//添加用户认证信息
		Subject subject = SecurityUtils.getSubject();
		UsernamePasswordToken token = new UsernamePasswordToken(loginname, MD5Util.getStringMD5(loginpwd));
		//进行验证
		subject.login(token);
		User user = new User();
		user.setUsername(loginname);
		user = userService.findUserByName(user);
		model.addAttribute("user", user);
		return "index";
	}
	
	@RequestMapping(value="/getUser")
	public @ResponseBody User getUser(){
		User user = new User();
		user.setUsername("admin");
		user = userService.findUserByName(user);
		return user;
	}
}
