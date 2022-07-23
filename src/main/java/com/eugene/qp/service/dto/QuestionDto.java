package com.eugene.qp.service.dto;

import com.eugene.qp.repository.entity.AnswerType;

import java.util.Set;

public class QuestionDto extends AbstractDto {

    private String question;
    private AnswerType answerType;
    private long fromUserId;
    private String toUserEmail;
    private Set<String> answerOptions;

    public QuestionDto() {
    }

    public QuestionDto(String question,
                       AnswerType answerType,
                       long fromUserId,
                       String toUserEmail,
                       Set<String> answerOptions) {
        this.question = question;
        this.answerType = answerType;
        this.fromUserId = fromUserId;
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

    public long getFromUserId() {
        return fromUserId;
    }

    public void setFromUserId(long fromUserId) {
        this.fromUserId = fromUserId;
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
                ", fromUserId=" + fromUserId +
                ", toUserEmail='" + toUserEmail + '\'' +
                ", answerOptions=" + answerOptions +
                '}';
    }
}
