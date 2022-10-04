package controller

import (
	"github.com/gin-gonic/gin"

	"inquiry-chat/internal/core/jwt"
)


func SetRouter(r *gin.Engine) {

	//render HTML or redirect (Authorized request)
	a := r.Group("/", jwt.JwtAuthMiddleware())
	{
		rc := newRootController()
		
		a.GET("/", rc.indexPage)
	}

	//response JSON
	api := r.Group("/api")
	{
		uac := newUserApiController()

		api.POST("/signup", uac.signup)
		api.POST("/login", uac.login)
		api.GET("/logout", uac.logout)


		//response JSON (Authorized request)
		a := api.Group("/", jwt.JwtAuthApiMiddleware())
		{
			a.GET("/profile", uac.getProfile)
			a.PUT("/username", uac.changeUsername)
			a.POST("/username", uac.changeUsername)
			a.PUT("/password", uac.changePassword)
			a.POST("/password", uac.changePassword)
			a.DELETE("/account", uac.deleteUser)
			a.GET("/users", uac.getUsers)
			a.GET("/users/:user_id", uac.getUser)


			mac := newMessageApiController()

        	a.GET("/messages/@:user_id", mac.getMessages)

        	wsc := newWsController()

        	a.GET("/messages/ws", wsc.wsHandshake)
		}
	}

	//r.NoRoute()
}