package controller

import (
    "time"
    "strconv"
    "encoding/json"
    "net/http"

    "github.com/gin-gonic/gin"
    "github.com/gorilla/websocket"
    
    "inquiry-chat/internal/core/logger"
    "inquiry-chat/internal/core/jwt"
    "inquiry-chat/internal/service"
    "inquiry-chat/internal/model/entity"
)


type wsController struct {
    mServ service.MessageService
}


func newWsController() *wsController {
    mServ := service.NewMessageService()
    return &wsController{mServ}
}


type Socket struct {
    UserId int
    ToId int
    Conn *websocket.Conn
}


var sockets []Socket


var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,

    //開発時のみ
    CheckOrigin: func(r *http.Request) bool {
        return true
    },
}


//GET /api/messages/@:user_id/ws
func (ctr *wsController) wsHandshake(c *gin.Context) {
    w := c.Writer
    r := c.Request

    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        logger.LogError(err.Error())
        return
    }
    defer conn.Close()

    to, err := strconv.Atoi(c.Param("user_id"))
    if err != nil {
        logger.LogError(err.Error())
        return
    }

    var s Socket
    s.UserId = jwt.GetUserId(c)
    s.ToId = to
    s.Conn = conn

    sockets = append(sockets, s)

    ctr.wsListener(s)
}


func (ctr *wsController) wsListener(s Socket) {
    for {
        _, _message, err := s.Conn.ReadMessage()
        message := string(_message)

        if err != nil {
            ctr.removeSocket(s.Conn)
            logger.LogError(err.Error())
            return
        }

        result := ctr.mServ.RegisterMessage(message, s.UserId, s.ToId)
        if result != service.REGISTER_MESSAGE_SUCCESS_INT {
            ctr.removeSocket(s.Conn)
            return
        }

        var m entity.Message
        m.Message = message
        m.SendFrom = s.UserId
        m.SendTo = s.ToId
        m.CreateAt = time.Now().Format("2006-01-02 15:04:05")
        msg, _ := json.Marshal(m)

        for _, soc := range sockets {
            if (soc.UserId == s.UserId && soc.ToId == s.ToId) || 
            (soc.ToId == s.UserId && soc.UserId == s.ToId) {
                ctr.sendMessage(msg, s.Conn)
            }
        }
    }
}


func (ctr *wsController) sendMessage(msg []byte, conn *websocket.Conn) {
    err := conn.WriteMessage(websocket.TextMessage, msg)
    if err != nil {
        ctr.removeSocket(conn)
        logger.LogError(err.Error())
        return
    }
}


func (ctr *wsController) removeSocket(conn *websocket.Conn) {
    for i, s := range sockets {
        if s.Conn == conn {
            sockets = sockets[:i+copy(sockets[i:], sockets[i+1:])]
        }
    }
}