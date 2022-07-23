package com.eugene.qp.service.impl;

import com.eugene.qp.repository.dao.QuestionRepository;
import com.eugene.qp.repository.dao.UserRepository;
import com.eugene.qp.repository.entity.AnswerOption;
import com.eugene.qp.repository.entity.AnswerType;
import com.eugene.qp.repository.entity.Question;
import com.eugene.qp.repository.entity.User;
import com.eugene.qp.service.QuestionService;
import com.eugene.qp.service.dto.QuestionDto;
import com.eugene.qp.service.exception.QuestionNotFoundException;
import com.eugene.qp.service.exception.UserNotFoundException;
import org.springframework.core.convert.ConversionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    private final ConversionService conversionService;

    public QuestionServiceImpl(QuestionRepository questionRepo,
                               UserRepository userRepository,
                               ConversionService conversionService) {
        questionRepository = questionRepo;
        this.userRepository = userRepository;
        this.conversionService = conversionService;
    }

    @Override
    public List<AnswerType> getAllAnswerTypes() {
        return Arrays.asList(AnswerType.values());
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
    public QuestionDto updateQuestion(QuestionDto question) throws QuestionNotFoundException, UserNotFoundException {
        Optional<Question> oldQuestionOptional = questionRepository.findById(question.getId());
        if (oldQuestionOptional.isEmpty()) {
            throw new QuestionNotFoundException();
        }
        Question oldQuestion = oldQuestionOptional.get();

        if (!oldQuestion.getToUser().getEmail().equals(question.getToUserEmail())) {
            Optional<User> newToUser = userRepository.findByEmail(question.getToUserEmail());
            if (newToUser.isEmpty()) {
                throw new UserNotFoundException();
            }
            oldQuestion.setToUser(newToUser.get());
        }
        oldQuestion.setQuestion(question.getQuestion());
        oldQuestion.setAnswerType(question.getAnswerType());

        Set<AnswerOption> newAnswerOptions = question.getAnswerOptions()
                .stream().map(AnswerOption::new)
                        .collect(Collectors.toSet());
        oldQuestion.setAnswerOptions(newAnswerOptions);

        Question updatedQuestion = questionRepository.save(oldQuestion);
        return conversionService.convert(updatedQuestion, QuestionDto.class);
    }

    @Override
    public Page<QuestionDto> getUserQuestionsPaginated(long userId, int page, int size) {
        Pageable pageRequest = PageRequest.of(page, size);
        Page<Question> questionsPage = questionRepository.findByFromUser_IdOrderById(userId, pageRequest);

        return questionsPage.map(q -> conversionService.convert(q, QuestionDto.class));
    }

    @Override
    public void deleteQuestion(long id) throws QuestionNotFoundException {
        Optional<Question> question = questionRepository.findById(id);
        if (question.isEmpty()) {
            throw new QuestionNotFoundException("Unable to find question with given id=" + id);
        }
        questionRepository.delete(question.get());
    }
}
