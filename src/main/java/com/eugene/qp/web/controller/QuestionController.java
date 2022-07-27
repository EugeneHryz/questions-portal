package com.eugene.qp.web.controller;

import com.eugene.qp.repository.entity.AnswerType;
import com.eugene.qp.service.QuestionService;
import com.eugene.qp.service.dto.QuestionDto;
import com.eugene.qp.service.dto.validation.QuestionDtoValidator;
import com.eugene.qp.service.exception.QuestionNotFoundException;
import com.eugene.qp.service.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import javax.validation.Valid;
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

    @InitBinder(value = "questionDto")
    protected void initBinder(WebDataBinder binder) {
        binder.addValidators(new QuestionDtoValidator());
    }

    @GetMapping(value = "/answer-types", produces = {"application/json"})
    public List<AnswerType> getAllAnswerTypes() {
        return questionService.getAllAnswerTypes();
    }

    @GetMapping(value = "/from-user", produces = {"application/json"})
    public Page<QuestionDto> getQuestionsFromUser(@RequestParam(value = "userId") long userId,
                                                  @RequestParam(value = "page", defaultValue = "0") int page,
                                                  @RequestParam(value = "size", defaultValue = "4") int size) {
        return questionService.getQuestionsFromUserPaginated(userId, page, size);
    }

    @GetMapping(value = "/to-user", produces = {"application/json"})
    public Page<QuestionDto> getQuestionsToUser(@RequestParam(value = "userId") long userId,
                                                @RequestParam(value = "page", defaultValue = "0") int page,
                                                @RequestParam(value = "size", defaultValue = "4") int size) {
        return questionService.getQuestionsToUserPaginated(userId, page, size);
    }

    @PostMapping(consumes = {"application/json"})
    public ResponseEntity<QuestionDto> createQuestion(@RequestBody @Valid QuestionDto questionDto,
                                                      UriComponentsBuilder ucb) throws UserNotFoundException {
        QuestionDto createdQuestion = questionService.createQuestion(questionDto);
        URI locationUri = ucb.path("/questions/")
                .path(String.valueOf(createdQuestion.getId()))
                .build()
                .toUri();
        return ResponseEntity.created(locationUri).body(createdQuestion);
    }

    @PutMapping(value = "/{id}", consumes = {"application/json"})
    public QuestionDto updateQuestion(@PathVariable long id,
                                                      @RequestBody @Valid QuestionDto questionDto)
            throws UserNotFoundException, QuestionNotFoundException {
        questionDto.setId(id);
        QuestionDto updatedQuestion = questionService.updateQuestion(questionDto);

        return updatedQuestion;
    }

    @DeleteMapping(value = "/{id}")
    public void deleteQuestion(@PathVariable long id) throws QuestionNotFoundException {
        questionService.deleteQuestion(id);
    }

}
