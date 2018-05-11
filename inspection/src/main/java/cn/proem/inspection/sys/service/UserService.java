package cn.proem.inspection.sys.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import cn.proem.framework.rbac.entity.User;
import cn.proem.inspection.sys.mapper.UserMapper;

@Service
public class UserService {
	@Autowired
	private UserMapper userDao;
	
	public User findUserByName(User user) {
		return userDao.findUserByName(user);
	}
	
}
