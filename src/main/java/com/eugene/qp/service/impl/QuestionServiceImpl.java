package com.eugene.qp.service.impl;

import com.eugene.qp.repository.dao.AnswerRepository;
import com.eugene.qp.repository.dao.QuestionRepository;
import com.eugene.qp.repository.dao.UserRepository;
import com.eugene.qp.repository.entity.AnswerOption;
import com.eugene.qp.repository.entity.AnswerType;
import com.eugene.qp.repository.entity.Question;
import com.eugene.qp.repository.entity.User;
import com.eugene.qp.service.QuestionService;
import com.eugene.qp.service.dto.EntityAction;
import com.eugene.qp.service.dto.EntityEvent;
import com.eugene.qp.service.dto.QuestionDto;
import com.eugene.qp.service.exception.QuestionNotFoundException;
import com.eugene.qp.service.exception.UserNotFoundException;
import org.springframework.core.convert.ConversionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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
    private final AnswerRepository answerRepository;

    private final ConversionService conversionService;

    private final SimpMessagingTemplate messagingTemplate;

    public QuestionServiceImpl(QuestionRepository questionRepo,
                               UserRepository userRepository,
                               AnswerRepository answerRepository,
                               ConversionService conversionService,
                               SimpMessagingTemplate messagingTemplate) {
        questionRepository = questionRepo;
        this.userRepository = userRepository;
        this.answerRepository = answerRepository;
        this.conversionService = conversionService;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public List<AnswerType> getAllAnswerTypes() {
        return Arrays.asList(AnswerType.values());
    }

    @Override
    public QuestionDto createQuestion(QuestionDto question) throws UserNotFoundException {
        Optional<User> fromUser = userRepository.findById(question.getFromUser().getId());
        Optional<User> toUser = userRepository.findByEmail(question.getToUserEmail());
        if (fromUser.isEmpty() || toUser.isEmpty()) {
            throw new UserNotFoundException();
        }
        Question questionToCreate = conversionService.convert(question, Question.class);
        questionToCreate.setFromUser(fromUser.get());
        questionToCreate.setToUser(toUser.get());

        Question createdQuestion = questionRepository.save(questionToCreate);
        QuestionDto createdDto = conversionService.convert(createdQuestion, QuestionDto.class);

        String toUserEmail = createdDto.getToUserEmail();
        EntityEvent event = new EntityEvent(EntityAction.CREATED, createdQuestion.getId(), createdDto);
        messagingTemplate.convertAndSendToUser(toUserEmail,
                "/queue/question-updates",
                event);
        return createdDto;
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

        answerRepository.deleteAnswerByQuestion_Id(oldQuestion.getId());
        Question updatedQuestion = questionRepository.save(oldQuestion);
        QuestionDto updatedQuestionDto = conversionService.convert(updatedQuestion, QuestionDto.class);

        String toUserEmail = updatedQuestion.getToUser().getEmail();
        EntityEvent event = new EntityEvent(EntityAction.UPDATED, updatedQuestion.getId(), updatedQuestionDto);
        messagingTemplate.convertAndSendToUser(toUserEmail,
                "/queue/question-updates",
                event);
        return updatedQuestionDto;
    }

    @Override
    public Page<QuestionDto> getQuestionsFromUserPaginated(long fromUserId, int page, int size) {
        Pageable pageRequest = PageRequest.of(page, size);
        Page<Question> questionsPage = questionRepository.findByFromUser_IdOrderById(fromUserId, pageRequest);

        return questionsPage.map(q -> conversionService.convert(q, QuestionDto.class));
    }

    @Override
    public Page<QuestionDto> getQuestionsToUserPaginated(long toUserId, int page, int size) {
        Pageable pageRequest = PageRequest.of(page, size);
        Page<Question> questionsPage = questionRepository.findByToUser_IdOrderById(toUserId, pageRequest);

        return questionsPage.map(q -> conversionService.convert(q, QuestionDto.class));
    }

    @Override
    public void deleteQuestion(long id) throws QuestionNotFoundException {
        Optional<Question> question = questionRepository.findById(id);
        if (question.isEmpty()) {
            throw new QuestionNotFoundException("Unable to find question with given id=" + id);
        }
        Question q = question.get();
        String toUserEmail = q.getToUser().getEmail();

        answerRepository.deleteAnswerByQuestion_Id(q.getId());
        questionRepository.delete(q);

        EntityEvent event = new EntityEvent(EntityAction.DELETED, id, null);
        messagingTemplate.convertAndSendToUser(toUserEmail,
                "/queue/question-updates",
                event);
    }
}
