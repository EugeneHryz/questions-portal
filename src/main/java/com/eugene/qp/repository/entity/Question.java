package com.eugene.qp.repository.entity;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
public class Question extends AbstractEntity {

    @Column(nullable = false)
    private String question;

    @Column(nullable = false, name = "answer_type")
    @Enumerated(value = EnumType.STRING)
    private AnswerType answerType;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "from_user")
    private User fromUser;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "to_user")
    private User toUser;

    @ElementCollection
    @CollectionTable(name = "answer_options")
    private final Set<AnswerOption> answerOptions = new HashSet<>();

    public Question() {
    }

    public Question(String question, AnswerType answerType, User fromUser, User toUser) {
        this.question = question;
        this.answerType = answerType;
        this.fromUser = fromUser;
        this.toUser = toUser;
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

    public User getFromUser() {
        return fromUser;
    }

    public void setFromUser(User fromUser) {
        this.fromUser = fromUser;
    }

    public User getToUser() {
        return toUser;
    }

    public void setToUser(User toUser) {
        this.toUser = toUser;
    }

    public Set<AnswerOption> getAnswerOptions() {
        return answerOptions;
    }

    @Override
    public String toString() {
        return "Question{" +
                "id=" + id +
                ", question='" + question + '\'' +
                ", answerType=" + answerType +
                ", fromUser=" + fromUser.id +
                ", toUser=" + toUser.id +
                ", answerOptions=" + answerOptions +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Question q = (Question) o;
        return id == q.id
                && Objects.equals(question, q.question)
                && answerType == q.answerType
                && Objects.equals(fromUser, q.fromUser)
                && Objects.equals(toUser, q.toUser)
                && answerOptions.equals(q.answerOptions);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, question, answerType, fromUser, toUser, answerOptions);
    }
}
