package com.eugene.qp.repository.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
public class Answer extends AbstractEntity {

    @Column(nullable = false)
    private String answer;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private Question question;

    public Answer() {
    }

    public Answer(String answer, Question question) {
        this.answer = answer;
        this.question = question;
    }

    @Override
    public String toString() {
        return "Answer{" +
                "id=" + id +
                ", answer='" + answer + '\'' +
                ", question=" + question +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Answer a = (Answer) o;
        return id == a.id
                && Objects.equals(answer, a.answer)
                && Objects.equals(question, a.question);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, answer, question);
    }
}
