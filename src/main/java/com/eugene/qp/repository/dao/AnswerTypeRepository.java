package com.eugene.qp.repository.dao;

import com.eugene.qp.repository.entity.AnswerType;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnswerTypeRepository extends CrudRepository<AnswerType, Long> {

}
