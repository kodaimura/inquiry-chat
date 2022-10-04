package controller

import (
    "time"
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
    Conn *websocket.Conn
}

type Msg struct {
    To int `json: to`
    Message string `json: message`
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


//GET /api/messages/ws
func (ctr *wsController) wsHandshake(c *gin.Context) {
    w := c.Writer
    r := c.Request

    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        logger.LogError(err.Error())
        return
    }
    defer conn.Close()

    var s Socket
    s.UserId = jwt.GetUserId(c)
    s.Conn = conn

    sockets = append(sockets, s)

    ctr.wsListener(s)
}


func (ctr *wsController) wsListener(soc Socket) {
    for {
        _, jsonStr, err := soc.Conn.ReadMessage()
        if err != nil {
            ctr.removeSocket(soc.Conn)
            logger.LogError(err.Error())
            return
        }

        var msg Msg
        err = json.Unmarshal([]byte(jsonStr), &msg);
        if err != nil {
            ctr.removeSocket(soc.Conn)
            logger.LogError(err.Error())
            return
        }

        result := ctr.mServ.RegisterMessage(msg.Message, soc.UserId, msg.To)
        if result != service.REGISTER_MESSAGE_SUCCESS_INT {
            ctr.removeSocket(soc.Conn)
            return
        }

        var m entity.Message
        m.Message = msg.Message
        m.SendFrom = soc.UserId
        m.CreateAt = time.Now().Format("2006-01-02 15:04:05")
        

        for _, s := range sockets {
            if s.UserId == soc.UserId || s.UserId == msg.To {
                ctr.sendMessage(m, soc.Conn)
            }
        }
    }
}


func (ctr *wsController) sendMessage(message entity.Message, conn *websocket.Conn) {
    msg, _ := json.Marshal(message)
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