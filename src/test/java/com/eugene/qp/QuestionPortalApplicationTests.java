package com.eugene.qp;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class QuestionPortalApplicationTests {

    private static final String CONTAINS_DIGIT_REGEX = "^.*[0-9].*$";

    @Test
    void contextLoads() {
    }

    @Test
    public void test() {
        String password = "1234567890";
        boolean matches = password.matches(CONTAINS_DIGIT_REGEX);
        Assertions.assertTrue(matches);
    }

}
