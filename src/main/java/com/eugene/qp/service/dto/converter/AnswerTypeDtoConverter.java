package com.eugene.qp.service.dto.converter;

import com.eugene.qp.repository.entity.AnswerType;
import com.eugene.qp.service.dto.AnswerTypeDto;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.stereotype.Service;

import java.lang.reflect.InvocationTargetException;

public class AnswerTypeDtoConverter extends AbstractTwoWayConverter<AnswerType, AnswerTypeDto> {

    @Override
    protected AnswerTypeDto convertTo(AnswerType source) {
        AnswerTypeDto answerTypeDto = new AnswerTypeDto();
        try {
            BeanUtils.copyProperties(answerTypeDto, source);
        } catch (IllegalAccessException | InvocationTargetException e) {
            throw new RuntimeException("Unable to convert from AnswerType to AnswerTypeDto");
        }
        return answerTypeDto;
    }

    @Override
    protected AnswerType convertBack(AnswerTypeDto source) {
        AnswerType answerType = new AnswerType();
        try {
            BeanUtils.copyProperties(answerType, source);
        } catch (IllegalAccessException | InvocationTargetException e) {
            throw new RuntimeException("Unable to convert from AnswerTypeDto to AnswerType");
        }
        return answerType;
    }
}
