package com.eugene.qp.service.dto;

import com.eugene.qp.repository.entity.AnswerType;

import java.util.Set;

public class QuestionDto extends AbstractDto {

    private String question;
    private AnswerType answerType;
    private Set<String> answerOptions;

    private String toUserEmail;
    private UserDto fromUser;

    public QuestionDto() {
    }

    public QuestionDto(String question,
                       AnswerType answerType,
                       UserDto fromUser,
                       String toUserEmail,
                       Set<String> answerOptions) {
        this.question = question;
        this.answerType = answerType;
        this.fromUser = fromUser;
        this.toUserEmail = toUserEmail;
        this.answerOptions = answerOptions;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public AnswerType getAnswerType() {
        return answerType;
    }

    public void setAnswerType(AnswerType answerType) {
        this.answerType = answerType;
    }

    public UserDto getFromUser() {
        return fromUser;
    }

    public void setFromUser(UserDto fromUser) {
        this.fromUser = fromUser;
    }

    public String getToUserEmail() {
        return toUserEmail;
    }

    public void setToUserEmail(String toUserEmail) {
        this.toUserEmail = toUserEmail;
    }

    public Set<String> getAnswerOptions() {
        return answerOptions;
    }

    public void setAnswerOptions(Set<String> answerOptions) {
        this.answerOptions = answerOptions;
    }

    @Override
    public String toString() {
        return "QuestionDto{" +
                "id=" + id +
                ", question='" + question + '\'' +
                ", answerType=" + answerType +
                ", answerOptions=" + answerOptions +
                ", toUserEmail='" + toUserEmail + '\'' +
                ", fromUser=" + fromUser +
                '}';
    }
}
