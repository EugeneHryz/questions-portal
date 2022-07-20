package com.eugene.qp.service.dto;

public class AnswerTypeDto extends AbstractDto {

    private String type;

    public AnswerTypeDto() {
    }

    public AnswerTypeDto(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "AnswerTypeDto{" +
                "id=" + id +
                ", type='" + type + '\'' +
                '}';
    }
}
