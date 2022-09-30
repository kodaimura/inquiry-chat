package controller

import (
    "strconv"

    "github.com/gin-gonic/gin"
    //"github.com/gorilla/websocket"
    
    "inquiry-chat/internal/core/jwt"
    "inquiry-chat/internal/service"
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
