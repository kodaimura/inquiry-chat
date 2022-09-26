package service

import (
    "inquiry-chat/internal/core/logger"
    "inquiry-chat/internal/model/entity"
    "inquiry-chat/internal/model/repository"
    "inquiry-chat/internal/model/query"
)


type MessageService interface {
    RegisterMessage(message string, from, to int) int
    GetMessagesWithAdmin(userId int) ([]entity.Message, error)
    GetMessagesWithAdminByName(username string) ([]entity.Message, error)
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


func (serv *messageService) GetMessagesWithAdmin(userId int) ([]entity.Message, error) {
    messages, err := serv.mQue.SelectMessagesWithAdmin(userId)

    if err != nil {
        logger.LogError(err.Error())
    }

    return messages, err
}


func (serv *messageService) GetMessagesWithAdminByName(username string) ([]entity.Message, error) {
    var messages []entity.Message

    user, err := serv.uRep.SelectByName(username)
    if err != nil {
        logger.LogError(err.Error())
        return messages, err
    }

    messages, err = serv.mQue.SelectMessagesWithAdmin(user.UserId)
    if err != nil {
        logger.LogError(err.Error())
    }

    return messages, err
}