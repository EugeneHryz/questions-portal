package com.eugene.qp.repository.dao;

import com.eugene.qp.repository.entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends PagingAndSortingRepository<Question, Long> {

    Page<Question> findByFromUser_Id(long userId, Pageable pageable);
}
