package controller

import (
	"github.com/gin-gonic/gin"
	
	"inquiry-chat/internal/core/jwt"
	"inquiry-chat/internal/shared/constant"
)


type rootController struct {}


func newRootController() *rootController {
	return &rootController{}
}


//GET /
func (ctr *rootController) indexPage(c *gin.Context) {
	username := jwt.GetUserName(c)

	c.HTML(200, "index.html", gin.H{
		"commons": constant.Commons,
		"username": username,
	})
}