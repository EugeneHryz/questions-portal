package com.eugene.qp.repository.entity;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class AnswerOption {

    @Column(nullable = false)
    private String option;

    public AnswerOption() {
    }

    public AnswerOption(String option) {
        this.option = option;
    }

    public String getOption() {
        return option;
    }

    public void setOption(String option) {
        this.option = option;
    }

    @Override
    public String toString() {
        return "AnswerOption{" +
                "option='" + option + '\'' +
                '}';
    }
}
