package com.eugene.qp.web.controller;

import com.eugene.qp.service.QuestionService;
import com.eugene.qp.service.dto.AnswerTypeDto;
import com.eugene.qp.service.dto.QuestionDto;
import com.eugene.qp.service.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(value = "/questions")
public class QuestionController {

    private final QuestionService questionService;

    @Autowired
    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping(value = "/answer-types", produces = {"application/json"})
    public List<AnswerTypeDto> getAllAnswerTypes() {
        return questionService.getAllAnswerTypes();
    }

    @GetMapping(produces = {"application/json"})
    public Page<QuestionDto> getUserQuestions(@RequestParam(value = "userId") long userId,
                                              @RequestParam(value = "page", defaultValue = "0") int page,
                                              @RequestParam(value = "size", defaultValue = "4") int size) {
        return questionService.getUserQuestionsPaginated(userId, page, size);
    }

    @PostMapping(consumes = {"application/json"})
    public ResponseEntity<QuestionDto> createQuestion(@RequestBody QuestionDto question,
                                                      UriComponentsBuilder ucb) throws UserNotFoundException {
        QuestionDto createdQuestion = questionService.createQuestion(question);
        URI locationUri = ucb.path("/questions/")
                .path(String.valueOf(createdQuestion.getId()))
                .build()
                .toUri();
        return ResponseEntity.created(locationUri).body(createdQuestion);
    }
}
