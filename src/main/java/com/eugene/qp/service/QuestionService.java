package com.eugene.qp.service;

import com.eugene.qp.repository.entity.AnswerType;
import com.eugene.qp.service.dto.QuestionDto;
import com.eugene.qp.service.exception.QuestionNotFoundException;
import com.eugene.qp.service.exception.UserNotFoundException;
import org.springframework.data.domain.Page;

import java.util.List;

public interface QuestionService {

    List<AnswerType> getAllAnswerTypes();

    QuestionDto createQuestion(QuestionDto question) throws UserNotFoundException;

    QuestionDto updateQuestion(QuestionDto question) throws QuestionNotFoundException, UserNotFoundException;

    Page<QuestionDto> getQuestionsFromUserPaginated(long fromUserId, int page, int size);

    Page<QuestionDto> getQuestionsToUserPaginated(long toUserId, int page, int size);

    void deleteQuestion(long id) throws QuestionNotFoundException;
}
