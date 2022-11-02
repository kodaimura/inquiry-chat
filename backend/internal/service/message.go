package service

import (
	"backend/internal/core/logger"
	"backend/internal/model/entity"
	"backend/internal/model/repository"
	"backend/internal/model/query"
)


type MessageService interface {
	RegisterMessage(message string, from, to int) int
	GetTalk(userId1, userId2 int) ([]entity.Message, error)
	ReadMessages(from, to int) int
	GetNewMessagesCount(from, to int) (int, error)
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


// ReadMessages() Return value
/*----------------------------------------*/
const READ_MESSAGES_SUCCESS_INT = 0
const READ_MESSAGES_ERROR_INT = 1
/*----------------------------------------*/
func (serv *messageService) ReadMessages(from, to int) int {
	err := serv.mRep.UpdateRead(from, to)

	if err != nil {
		logger.LogError(err.Error())
		return READ_MESSAGES_ERROR_INT
	}

	return READ_MESSAGES_SUCCESS_INT
}


func (serv *messageService) GetNewMessagesCount(from, to int) (int, error) {
	count, err := serv.mQue.SelectNewMessagesCount(from, to)

	if err != nil {
		logger.LogError(err.Error())
	}

	return count, err
}