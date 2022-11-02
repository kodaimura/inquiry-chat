package controller

import (
	"strconv"

	"github.com/gin-gonic/gin"
	
	"backend/internal/core/jwt"
	"backend/internal/service"
)


type messageApiController struct {
	mServ service.MessageService
}


func newMessageApiController() *messageApiController {
	mServ := service.NewMessageService()
	return &messageApiController{mServ}
}


//GET /api/messages/@:user_id
func (ctr *messageApiController) getMessages(c *gin.Context) {
	userId, _ := strconv.Atoi(c.Param("user_id"))
	messages, _ := ctr.mServ.GetTalk(userId, jwt.GetUserId(c))

	c.JSON(200, messages)
}


//PUT /api/messages/@:user_id/read
func (ctr *messageApiController) readMessages(c *gin.Context) {
	userId, _ := strconv.Atoi(c.Param("user_id"))
	ctr.mServ.ReadMessages(userId, jwt.GetUserId(c))

	c.JSON(200, gin.H{})
}


//GET /api/messages/@:user_id/news/count
func (ctr *messageApiController) getNewMessagesCount(c *gin.Context) {
	userId, _ := strconv.Atoi(c.Param("user_id"))
	count, _ := ctr.mServ.GetNewMessagesCount(userId, jwt.GetUserId(c))

	c.JSON(200, gin.H{"count" : count})
}