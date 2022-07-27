package com.eugene.qp.service.dto;

import org.springframework.lang.Nullable;

public class EntityEvent {

    private EntityAction action;
    private long id;
    private AbstractDto content;

    public EntityEvent() {
    }

    public EntityEvent(EntityAction action,
                       long id, @Nullable AbstractDto content) {
        this.action = action;
        this.id = id;
        this.content = content;
    }

    public EntityAction getAction() {
        return action;
    }

    public long getId() {
        return id;
    }

    public AbstractDto getContent() {
        return content;
    }

    @Override
    public String toString() {
        return "EntityEvent{" +
                "performedAction=" + action +
                ", id=" + id +
                ", content=" + content +
                '}';
    }
}
