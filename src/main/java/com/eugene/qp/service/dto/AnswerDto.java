package com.eugene.qp.service.dto;

import javax.validation.constraints.NotBlank;

public class AnswerDto extends AbstractDto {

    @NotBlank
    private String answer;

    private long questionId;

    public AnswerDto() {
    }

    public AnswerDto(String answer, long questionId) {
        this.answer = answer;
        this.questionId = questionId;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(long questionId) {
        this.questionId = questionId;
    }

    @Override
    public String toString() {
        return "AnswerDto{" +
                "id=" + id +
                ", answer='" + answer + '\'' +
                ", questionId=" + questionId +
                '}';
    }
}
