package service

import (
    "inquiry-chat/internal/core/logger"
    "inquiry-chat/internal/model/entity"
    "inquiry-chat/internal/model/repository"
    "inquiry-chat/internal/model/query"
)


type MessageService interface {
    RegisterMessage(message string, from, to int) int
    GetTalk(userId1, userId2 int) ([]entity.Message, error)
}


type messageService struct {
    uRep repository.UserRepository
    mRep repository.MessageRepository
    mQue query.MessageQuery
}


func NewMessageService() MessageService {
    uRep := repository.NewUserRepository()
    mRep := repository.NewMessageRepository()
    mQue := query.NewMessageQuery()
    return &messageService{uRep, mRep, mQue}
}


// RegisterMessage() Return value
/*----------------------------------------*/
const REGISTER_MESSAGE_SUCCESS_INT = 0
const REGISTER_MESSAGE_ERROR_INT = 1
/*----------------------------------------*/
func (serv *messageService) RegisterMessage(message string, from, to int) int {
    var m entity.Message
    m.Message = message
    m.SendFrom = from
    m.SendTo = to

    err := serv.mRep.Insert(&m)

    if err != nil {
        logger.LogError(err.Error())
        return REGISTER_MESSAGE_ERROR_INT
    }

    return REGISTER_MESSAGE_SUCCESS_INT
}


func (serv *messageService) GetTalk(userId1, userId2 int) ([]entity.Message, error) {
    messages, err := serv.mQue.SelectMessages(userId1, userId2)

    if err != nil {
        logger.LogError(err.Error())
    }

    return messages, err
}