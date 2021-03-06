package com.eugene.qp.repository.entity;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
public class AnswerType extends AbstractEntity {

    @Column(nullable = false, unique = true)
    private String type;

    public AnswerType() {
    }

    public AnswerType(String type) {
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
        return "AnswerType{" +
                "id=" + id +
                ", type='" + type + '\'' +
                '}';
    }
}
