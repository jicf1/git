package com.proem.inpection.sys.web;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import cn.proem.framework.context.web.context.GeneralController;

/**
 * 主页面
 * 
 * @author jicf
 */
@Controller
public class LoginController extends GeneralController {

	/**
	 * 登录页面
	 * 
	 * @return
	 * @author jicf
	 */
	@RequestMapping({ "", "/" })
	public ModelAndView login() {
		return new ModelAndView("/login");
	}
}
