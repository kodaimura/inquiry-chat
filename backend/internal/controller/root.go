package controller

import (
	"github.com/gin-gonic/gin"
	
	"backend/internal/core/jwt"
	"backend/internal/shared/constant"
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