package com.proem.inpection;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import cn.proem.framework.context.ProemFrameworkContextConfiguration;

@SpringBootApplication
public class Inspection1Application extends ProemFrameworkContextConfiguration{

	public static void main(String[] args) {
		SpringApplication.run(Inspection1Application.class, args);
	}
}
