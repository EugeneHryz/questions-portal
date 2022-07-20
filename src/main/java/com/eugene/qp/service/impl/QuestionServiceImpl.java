package com.eugene.qp.service.impl;

import com.eugene.qp.repository.dao.AnswerTypeRepository;
import com.eugene.qp.repository.dao.QuestionRepository;
import com.eugene.qp.repository.dao.UserRepository;
import com.eugene.qp.repository.entity.Question;
import com.eugene.qp.repository.entity.User;
import com.eugene.qp.service.QuestionService;
import com.eugene.qp.service.dto.AnswerTypeDto;
import com.eugene.qp.service.dto.QuestionDto;
import com.eugene.qp.service.exception.UserNotFoundException;
import org.springframework.core.convert.ConversionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class QuestionServiceImpl implements QuestionService {

    private final AnswerTypeRepository answerTypeRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    private final ConversionService conversionService;

    public QuestionServiceImpl(AnswerTypeRepository answerTypeRepo,
                               QuestionRepository questionRepo,
                               UserRepository userRepository,
                               ConversionService conversionService) {
        answerTypeRepository = answerTypeRepo;
        questionRepository = questionRepo;
        this.userRepository = userRepository;
        this.conversionService = conversionService;
    }

    @Override
    public List<AnswerTypeDto> getAllAnswerTypes() {
        List<AnswerTypeDto> answerTypes = new ArrayList<>();
        answerTypeRepository.findAll().forEach(t -> {
            AnswerTypeDto dto = new AnswerTypeDto(t.getType());
            dto.setId(t.getId());

            answerTypes.add(dto);
        });
        return answerTypes;
    }

    @Override
    public QuestionDto createQuestion(QuestionDto question) throws UserNotFoundException {
        Optional<User> fromUser = userRepository.findById(question.getFromUserId());
        Optional<User> toUser = userRepository.findByEmail(question.getToUserEmail());
        if (fromUser.isEmpty() || toUser.isEmpty()) {
            throw new UserNotFoundException();
        }
        Question questionToCreate = conversionService.convert(question, Question.class);
        questionToCreate.setFromUser(fromUser.get());
        questionToCreate.setToUser(toUser.get());

        Question createdQuestion = questionRepository.save(questionToCreate);
        return conversionService.convert(createdQuestion, QuestionDto.class);
    }

    @Override
    public Page<QuestionDto> getUserQuestionsPaginated(long userId, int page, int size) {
        Pageable pageRequest = PageRequest.of(page, size);
        Page<Question> questionsPage = questionRepository.findByFromUser_Id(userId, pageRequest);

        return questionsPage.map(q -> conversionService.convert(q, QuestionDto.class));
    }
}
