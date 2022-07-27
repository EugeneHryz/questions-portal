package com.eugene.qp.repository.dao;

import com.eugene.qp.repository.entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuestionRepository extends PagingAndSortingRepository<Question, Long> {

    Page<Question> findByFromUser_IdOrderById(long userId, Pageable pageable);

    Page<Question> findByToUser_IdOrderById(long userId, Pageable pageable);

    Optional<Question> findByFromUser_EmailAndId(String fromUser, long questionId);

    Optional<Question> findByToUser_EmailAndId(String toUser, long questionId);
}
