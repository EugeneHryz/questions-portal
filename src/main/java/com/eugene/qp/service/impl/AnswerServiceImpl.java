package com.eugene.qp.service.impl;

import com.eugene.qp.repository.dao.AnswerRepository;
import com.eugene.qp.repository.dao.QuestionRepository;
import com.eugene.qp.repository.entity.Answer;
import com.eugene.qp.repository.entity.Question;
import com.eugene.qp.service.AnswerService;
import com.eugene.qp.service.dto.AnswerDto;
import com.eugene.qp.service.dto.EntityAction;
import com.eugene.qp.service.dto.EntityEvent;
import com.eugene.qp.service.dto.QuestionDto;
import com.eugene.qp.service.exception.AnswerNotFoundException;
import com.eugene.qp.service.exception.QuestionNotFoundException;
import com.eugene.qp.service.exception.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class AnswerServiceImpl implements AnswerService {

    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;

    private final ConversionService conversionService;

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public AnswerServiceImpl(AnswerRepository answerRepository,
                             QuestionRepository questionRepository,
                             ConversionService conversionService,
                             SimpMessagingTemplate messagingTemplate) {
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
        this.conversionService = conversionService;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public AnswerDto createAnswer(AnswerDto answerDto) throws QuestionNotFoundException {
        Optional<Question> question = questionRepository.findById(answerDto.getQuestionId());
        if (question.isEmpty()) {
            throw new QuestionNotFoundException();
        }
        Answer newAnswer = new Answer(answerDto.getAnswer(), question.get());
        Answer createdAnswer = answerRepository.save(newAnswer);

        AnswerDto createdAnswerDto = conversionService.convert(createdAnswer, AnswerDto.class);

        String fromUserEmail = createdAnswer.getQuestion().getFromUser().getEmail();
        EntityEvent event = new EntityEvent(EntityAction.CREATED, createdAnswer.getId(), createdAnswerDto);
        messagingTemplate.convertAndSendToUser(fromUserEmail,
                "/queue/answer-updates",
                event);
        return createdAnswerDto;
    }

    @Override
    public AnswerDto updateAnswer(AnswerDto answerDto) throws AnswerNotFoundException {
        Optional<Answer> existingAnswer = answerRepository.findById(answerDto.getId());
        if (existingAnswer.isEmpty()) {
            throw new AnswerNotFoundException();
        }
        Answer answer = existingAnswer.get();
        answer.setAnswer(answerDto.getAnswer());
        Answer updatedAnswer = answerRepository.save(answer);

        AnswerDto updatedAnswerDto = conversionService.convert(updatedAnswer, AnswerDto.class);

        // notify another user that the answer is updated
        String fromUserEmail = answer.getQuestion().getFromUser().getEmail();
        EntityEvent event = new EntityEvent(EntityAction.UPDATED, updatedAnswer.getId(), updatedAnswerDto);
        messagingTemplate.convertAndSendToUser(fromUserEmail,
                "/queue/answer-updates",
                event);
        return updatedAnswerDto;
    }

    @Override
    public Set<AnswerDto> getAnswersByQuestionIds(Long[] ids) {
        Set<Answer> answers = answerRepository.findAnswersByQuestionIds(Set.of(ids));

        return answers.stream().map(a -> conversionService.convert(a, AnswerDto.class))
                .collect(Collectors.toSet());
    }

    @Override
    public Optional<AnswerDto> findUserAnswerById(String userEmail, long answerId) {
        return answerRepository.findByQuestion_ToUser_EmailAndId(userEmail, answerId)
                .map(a -> conversionService.convert(a, AnswerDto.class));
    }
}
