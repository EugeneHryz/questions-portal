package com.eugene.qp.web.controller;

import com.eugene.qp.service.AnswerService;
import com.eugene.qp.service.dto.AnswerDto;
import com.eugene.qp.service.exception.AnswerNotFoundException;
import com.eugene.qp.service.exception.QuestionNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.Set;

@RestController
@RequestMapping(value = "/answers")
public class AnswerController {

    private final AnswerService answerService;

    @Autowired
    public AnswerController(AnswerService answerService) {
        this.answerService = answerService;
    }

    @PreAuthorize("@userSecurity.isAllowedToAnswer(authentication, #answerDto.questionId)")
    @PostMapping(consumes = {"application/json"})
    public ResponseEntity<AnswerDto> createAnswer(@RequestBody @Valid AnswerDto answerDto,
                                                  UriComponentsBuilder ucb) throws QuestionNotFoundException {
        AnswerDto createdAnswer = answerService.createAnswer(answerDto);
        URI locationUri = ucb.path("/answers/")
                .path(String.valueOf(createdAnswer.getId()))
                .build()
                .toUri();
        return ResponseEntity.created(locationUri).body(createdAnswer);
    }

    @PreAuthorize("@userSecurity.isAllowedToModifyAnswer(authentication, #id)")
    @PutMapping(value = "/{id}", consumes = {"application/json"})
    public AnswerDto updateAnswer(@PathVariable long id,
                                  @RequestBody @Valid AnswerDto answerDto) throws AnswerNotFoundException {
        answerDto.setId(id);
        return answerService.updateAnswer(answerDto);
    }

    @PreAuthorize("@userSecurity.isAllowedToAccessAnswers(authentication, #questionIds)")
    @GetMapping(produces = {"application/json"})
    public Set<AnswerDto> getAnswersByQuestionIds(@RequestParam(value = "questionIds")
                                                              Long[] questionIds) {
        return answerService.getAnswersByQuestionIds(questionIds);
    }
}
