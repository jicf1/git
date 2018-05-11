package cn.proem.inspection.sys.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import cn.proem.framework.rbac.entity.User;
@Repository
public interface UserMapper {

	public User findUserByName(User user);
}
