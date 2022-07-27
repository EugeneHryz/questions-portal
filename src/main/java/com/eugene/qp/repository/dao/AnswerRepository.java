package com.eugene.qp.repository.dao;

import com.eugene.qp.repository.entity.Answer;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.Set;

public interface AnswerRepository extends PagingAndSortingRepository<Answer, Long> {

    @Query("select a from Answer a where a.question.id in :questionIds")
    Set<Answer> findAnswersByQuestionIds(@Param("questionIds") Set<Long> questionIds);

    void deleteAnswerByQuestion_Id(long questionId);
}
