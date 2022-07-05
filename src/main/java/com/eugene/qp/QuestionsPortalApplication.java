package com.eugene.qp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.eugene.qp.repository",
        "com.eugene.qp.web.config"})
public class QuestionsPortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuestionsPortalApplication.class, args);
    }
}
