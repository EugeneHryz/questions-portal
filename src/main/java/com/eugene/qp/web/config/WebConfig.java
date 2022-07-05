package com.eugene.qp.web.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

@Configuration
@ComponentScan(value = {"com.eugene.qp.web", "com.eugene.qp.service.impl"})
public class WebConfig extends WebMvcConfigurationSupport {
}
