package com.eugene.qp.web.security;

import com.eugene.qp.repository.entity.Question;
import com.eugene.qp.service.AnswerService;
import com.eugene.qp.service.QuestionService;
import com.eugene.qp.service.UserService;
import com.eugene.qp.service.dto.AnswerDto;
import com.eugene.qp.service.dto.QuestionDto;
import com.eugene.qp.service.dto.UserDto;
import com.eugene.qp.service.exception.UserNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component("userSecurity")
public class UserResourceSecurity {

    private static final Logger logger = LoggerFactory.getLogger(UserResourceSecurity.class);

    private final UserService userService;
    private final QuestionService questionService;
    private final AnswerService answerService;

    @Autowired
    public UserResourceSecurity(UserService userService,
                                QuestionService questionService,
                                AnswerService answerService) {
        this.userService = userService;
        this.questionService = questionService;
        this.answerService = answerService;
    }

    public boolean isAllowedToAccess(Authentication auth, Long userId) {
        boolean allowed = false;
        try {
            UserDto authenticatedUser = userService.getUserByEmail(auth.getName());
            if (authenticatedUser.getId() == userId) {
                allowed = true;
            }
        } catch (UserNotFoundException e) {
            logger.warn("User was not found", e);
        }
        return allowed;
    }

    public boolean isAllowedToModifyQuestion(Authentication auth, Long questionId) {
        Optional<QuestionDto> question = questionService.findQuestionFromUserById(
                auth.getName(), questionId);

        return question.isPresent();
    }

    public boolean isAllowedToAnswer(Authentication auth, Long questionId) {
        Optional<QuestionDto> question = questionService.findQuestionToUserById(
                auth.getName(), questionId);

        return question.isPresent();
    }

    public boolean isAllowedToModifyAnswer(Authentication auth, Long answerId) {
        Optional<AnswerDto> answer = answerService.findUserAnswerById(auth.getName(), answerId);

        return answer.isPresent();
    }

    public boolean isAllowedToAccessAnswers(Authentication auth, Long[] questionIds) {
        boolean allowed = true;
        for (long id : questionIds) {
            Optional<QuestionDto> toUser = questionService.findQuestionToUserById(auth.getName(), id);
            Optional<QuestionDto> fromUser = questionService.findQuestionFromUserById(auth.getName(), id);

            if (toUser.isEmpty() && fromUser.isEmpty()) {
                allowed = false;
                break;
            }
        }
        return allowed;
    }
}