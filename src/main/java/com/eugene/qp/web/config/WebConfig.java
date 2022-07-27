package com.eugene.qp.web.config;

import com.eugene.qp.service.dto.converter.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.format.FormatterRegistry;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

import java.util.Properties;

@Configuration
@ComponentScan(value = {"com.eugene.qp.web", "com.eugene.qp.service.impl",
        "com.eugene.qp.service.dto.converter"})
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebConfig extends WebMvcConfigurationSupport {

    @Autowired
    private Environment env;

    private final UserConverter userConverter;
    private final UserDtoConverter userDtoConverter;
    private final QuestionConverter questionConverter;
    private final QuestionDtoConverter questionDtoConverter;
    private final AnswerConverter answerConverter;

    @Autowired
    public WebConfig(UserConverter userConverter,
                     UserDtoConverter userDtoConverter,
                     QuestionConverter questionConverter,
                     QuestionDtoConverter questionDtoConverter,
                     AnswerConverter answerConverter) {
        this.userConverter = userConverter;
        this.userDtoConverter = userDtoConverter;
        this.questionConverter = questionConverter;
        this.questionDtoConverter = questionDtoConverter;
        this.answerConverter = answerConverter;
    }

    @Bean
    public JavaMailSender mailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        mailSender.setHost(env.getProperty("spring.mail.host"));
        mailSender.setPort(Integer.parseInt(env.getProperty("spring.mail.port")));
        mailSender.setUsername(env.getProperty("spring.mail.username"));
        mailSender.setPassword(env.getProperty("spring.mail.password"));

        Properties mailProps = mailSender.getJavaMailProperties();
        mailProps.put("mail.transport.protocol", "smtp");
        mailProps.put("mail.smtp.auth", "true");
        mailProps.put("mail.smtp.starttls.enable", "true");
        mailProps.put("mail.debug", "true");
        return mailSender;
    }


    @Override
    protected void addFormatters(FormatterRegistry registry) {
        registry.addConverter(userConverter);
        registry.addConverter(userDtoConverter);
        registry.addConverter(questionConverter);
        registry.addConverter(questionDtoConverter);
        registry.addConverter(answerConverter);
    }
}
