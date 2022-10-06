package jwt

import (
	"log"
	"github.com/gin-gonic/gin"
)

/*
JwtPayload拡張
*/

type CustomClaims struct {
	UserId int
	UserName string
	Nickname string
	IsAdmin bool
}


func GetUserId (c *gin.Context) int {
	pl := c.Keys[CONTEXT_KEY_PAYLOAD]
	if pl == nil {
		log.Panic("Error: GetUserId")
		return -1
	} else {
		return pl.(JwtPayload).UserId
	}	
}

func GetUserName (c *gin.Context) string {
	pl := c.Keys[CONTEXT_KEY_PAYLOAD]
	if pl == nil {
		log.Panic("Error: GetUserName")
		return ""
	} else {
		return pl.(JwtPayload).UserName
	}
}

func GetNickname (c *gin.Context) string {
	pl := c.Keys[CONTEXT_KEY_PAYLOAD]
	if pl == nil {
		log.Panic("Error: GetNickname")
		return ""
	} else {
		return pl.(JwtPayload).Nickname
	}
}

func GetIsAdmin (c *gin.Context) bool {
	pl := c.Keys[CONTEXT_KEY_PAYLOAD]
	if pl == nil {
		log.Panic("Error: GetUserIsAdimin")
		return false
	} else {
		return pl.(JwtPayload).IsAdmin
	}
}